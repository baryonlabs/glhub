import { spawn } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  COMPANY_ID_RE,
  GENERATION_ID_RE,
  type GenerationRecord,
  type JsonValue,
  type LineageResult,
  type PushPayload,
} from "./core/types.js";
import {
  evolutionDocumentFromPush,
  generationsFromPush,
  lineageFromPush,
  normalizePushPayload,
  pushId,
  showFromPush,
} from "./core/push-fallback.js";
import { indexHtml } from "./core/viewer.js";
import { validatePushPayload } from "./core/validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const host = process.env.GLHUB_HOST || "127.0.0.1";
const port = Number(process.env.GLHUB_PORT || 3201);
const dataDir = process.env.GLCTL_DATA_DIR || path.join(repoRoot, "data/glctl");
const glhubDataDir = process.env.GLHUB_DATA_DIR || path.join(repoRoot, "data/glhub");
const glctlPath =
  process.env.GLCTL_PATH ||
  (existsSync(path.join(repoRoot, "glctl/target/release/glctl"))
    ? path.join(repoRoot, "glctl/target/release/glctl")
    : "glctl");

const r2Bucket = process.env.GLHUB_R2_BUCKET || process.env.R2_BUCKET || "";
const r2Endpoint = process.env.GLHUB_R2_ENDPOINT || process.env.R2_ENDPOINT || "";
const r2AccessKeyId = process.env.GLHUB_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "";
const r2SecretAccessKey =
  process.env.GLHUB_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "";
const r2Prefix = (process.env.GLHUB_R2_PREFIX || "glhub").replace(/^\/+|\/+$/g, "");
const r2Enabled = Boolean(r2Bucket && r2Endpoint && r2AccessKeyId && r2SecretAccessKey);
const r2Client = r2Enabled
  ? new S3Client({
      region: "auto",
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    })
  : null;

function runGlctl<T>(companyId: string, args: string[]): Promise<T> {
  if (!COMPANY_ID_RE.test(companyId)) {
    return Promise.reject(Object.assign(new Error("Invalid company id"), { statusCode: 400 }));
  }

  return new Promise<T>((resolve, reject) => {
    const child = spawn(glctlPath, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        GLCTL_DATA_DIR: dataDir,
        GLCTL_COMPANY_ID: companyId,
      },
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(Object.assign(new Error("glctl timed out"), { statusCode: 504 }));
    }, 10_000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      const statusCode = err.code === "ENOENT" || err.code === "EACCES" ? 503 : 500;
      reject(Object.assign(new Error(`glctl unavailable: ${err.message}`), { statusCode }));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout) as T);
        } catch (err) {
          reject(
            Object.assign(new Error(`Invalid glctl JSON: ${(err as Error).message}`), {
              statusCode: 502,
            }),
          );
        }
        return;
      }
      if (code === 1) {
        reject(Object.assign(new Error(stderr.trim() || "not found"), { statusCode: 404 }));
        return;
      }
      reject(Object.assign(new Error(stderr.trim() || `glctl exited ${code}`), { statusCode: 502 }));
    });
  });
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  let raw = "";
  for await (const chunk of req) raw += chunk.toString();
  if (!raw.trim()) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

async function storePush(payload: PushPayload): Promise<{ driver: string; key: string; latest_key: string; idempotent: boolean }> {
  const companyId = typeof payload.company_id === "string" ? payload.company_id : "";
  if (!COMPANY_ID_RE.test(companyId)) {
    throw Object.assign(new Error("Invalid company_id in push payload"), { statusCode: 400 });
  }
  const pushedAt = typeof payload.pushed_at === "string" ? payload.pushed_at : new Date().toISOString();
  const id =
    typeof payload.push_id === "string" && payload.push_id.trim()
      ? payload.push_id.replace(/[^0-9A-Za-z_-]/g, "-")
      : pushId(companyId, pushedAt);

  if (r2Client) {
    const key = `${r2Prefix}/pushes/${companyId}/${id}.json`;
    const latestKey = `${r2Prefix}/pushes/${companyId}/latest.json`;
    try {
      await r2Client.send(new HeadObjectCommand({ Bucket: r2Bucket, Key: key }));
      return { driver: "r2", key, latest_key: latestKey, idempotent: true };
    } catch {
      // object does not exist — proceed to write
    }
    const body = JSON.stringify({ ...payload, pushed_at: pushedAt }, null, 2);
    await r2Client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: body,
        ContentType: "application/json; charset=utf-8",
      }),
    );
    await r2Client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: latestKey,
        Body: body,
        ContentType: "application/json; charset=utf-8",
      }),
    );
    return { driver: "r2", key, latest_key: latestKey, idempotent: false };
  }

  const localRoot = path.join(glhubDataDir, "pushes", companyId);
  await mkdir(localRoot, { recursive: true });
  const localPath = path.join(localRoot, `${id}.json`);
  const latestPath = path.join(localRoot, "latest.json");
  if (existsSync(localPath)) {
    return { driver: "local", key: localPath, latest_key: latestPath, idempotent: true };
  }
  const body = JSON.stringify({ ...payload, pushed_at: pushedAt }, null, 2);
  await writeFile(localPath, body, "utf-8");
  await writeFile(latestPath, body, "utf-8");
  return { driver: "local", key: localPath, latest_key: latestPath, idempotent: false };
}

async function streamToString(body: unknown): Promise<string> {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (body instanceof Uint8Array) return Buffer.from(body).toString("utf-8");
  const maybeStream = body as AsyncIterable<Uint8Array | Buffer | string>;
  if (typeof maybeStream[Symbol.asyncIterator] !== "function") return String(body);
  const chunks: Buffer[] = [];
  for await (const chunk of maybeStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function readLatestPush(companyId: string): Promise<PushPayload | null> {
  if (!COMPANY_ID_RE.test(companyId)) {
    throw Object.assign(new Error("Invalid company id"), { statusCode: 400 });
  }
  if (r2Client) {
    const key = `${r2Prefix}/pushes/${companyId}/latest.json`;
    try {
      const result = await r2Client.send(new GetObjectCommand({ Bucket: r2Bucket, Key: key }));
      const body = await streamToString(result.Body);
      return normalizePushPayload(JSON.parse(body) as PushPayload);
    } catch (err) {
      const name = err && typeof err === "object" && "name" in err ? String((err as { name: unknown }).name) : "";
      if (name === "NoSuchKey" || name === "NotFound") return null;
      throw err;
    }
  }
  const latestPath = path.join(glhubDataDir, "pushes", companyId, "latest.json");
  try {
    return normalizePushPayload(JSON.parse(await readFile(latestPath, "utf-8")) as PushPayload);
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
    if (code === "ENOENT" || code === "ENOTDIR") return null;
    throw err;
  }
}

function json(res: ServerResponse, value: JsonValue, statusCode = 200): void {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(value));
}

function html(res: ServerResponse, value: string): void {
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(value);
}

function text(res: ServerResponse, value: string, statusCode = 200): void {
  res.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(value);
}

function errorJson(res: ServerResponse, err: unknown): void {
  const statusCode =
    typeof err === "object" && err !== null && "statusCode" in err
      ? Number((err as { statusCode: unknown }).statusCode)
      : 500;
  json(
    res,
    {
      error: err instanceof Error ? err.message : "Unknown error",
    },
    Number.isFinite(statusCode) ? statusCode : 500,
  );
}

async function companies(): Promise<string[]> {
  const found = new Set<string>();
  const root = path.join(dataDir, "companies");
  try {
    const entries = await readdir(root, { withFileTypes: true });
    entries
      .filter((entry) => entry.isDirectory() && COMPANY_ID_RE.test(entry.name))
      .forEach((entry) => found.add(entry.name));
  } catch {
    // Ignore missing local glctl storage; pushed snapshots may still exist.
  }
  try {
    const pushedRoot = path.join(glhubDataDir, "pushes");
    const entries = await readdir(pushedRoot, { withFileTypes: true });
    entries
      .filter((entry) => entry.isDirectory() && COMPANY_ID_RE.test(entry.name))
      .forEach((entry) => found.add(entry.name));
  } catch {
    // R2-only deployments can still open a company id manually.
  }
  return [...found].sort();
}

async function seedDemo(companyId: string): Promise<{ ids: string[] }> {
  await runGlctl(companyId, ["init", "--json"]);
  const first = await runGlctlString(companyId, [
    "new",
    "--soul",
    "Seed an autonomous agent company",
    "--score",
    "0.62",
    "--tag",
    "seed",
    "--tag",
    "glhub-demo",
  ]);
  const firstId = first.trim();
  const second = await runGlctlString(companyId, [
    "new",
    "--parent",
    firstId,
    "--soul",
    "Improve lineage visibility for judges",
    "--gains",
    "Added repository summary",
    "--gains",
    "Added generation detail view",
    "--score",
    "0.81",
    "--tag",
    "demo",
    "--tag",
    "glhub",
  ]);
  const secondId = second.trim();
  return { ids: [firstId, secondId] };
}

async function evolutionDocument(companyId: string, id: string): Promise<JsonValue> {
  const current = await runGlctl<GenerationRecord>(companyId, ["show", id, "--json"]);
  const lineage = await runGlctl<LineageResult>(companyId, ["lineage", "--json"]);
  const parentId = typeof current.parent_id === "string" ? current.parent_id : null;
  const parent = parentId
    ? await runGlctl<GenerationRecord>(companyId, ["show", parentId, "--json"]).catch(() => null)
    : null;
  const children = lineage.nodes.filter((node) => node.parent_id === id);
  const currentScore =
    typeof current.metrics?.score === "number" && Number.isFinite(current.metrics.score)
      ? current.metrics.score
      : null;
  const parentScore =
    parent && typeof parent.metrics?.score === "number" && Number.isFinite(parent.metrics.score)
      ? parent.metrics.score
      : null;
  const scoreDelta =
    currentScore !== null && parentScore !== null ? Number((currentScore - parentScore).toFixed(6)) : null;

  return {
    id: current.id,
    title: current.soul || current.id,
    before: parent
      ? {
          id: parent.id,
          soul: parent.soul || "",
          score: parentScore,
          success: parent.metrics?.success ?? null,
          tags: parent.tags || [],
          branch: parent.branch ?? null,
        }
      : null,
    transition: {
      relation: parent ? "evolved_from" : "seed",
      score_delta: scoreDelta,
      gains: current.gains || [],
      losses: current.losses || [],
      note: current.philosophical_note || "",
      retrospective: {
        do_not: current.retrospective?.do_not || [],
        do: current.retrospective?.do || [],
        skills: current.retrospective?.skills || [],
        bugs_fixed: current.retrospective?.bugs_fixed || [],
        cases: (current.retrospective?.cases || []).map((item) => ({
          name: item.name || "",
          impact: item.impact || "",
        })),
      },
      config_patches:
        Array.isArray(current.config_patches) && current.config_patches.length > 0
          ? current.config_patches
          : current.config_patch
            ? [current.config_patch]
            : [],
    },
    after: {
      id: current.id,
      soul: current.soul || "",
      score: currentScore,
      success: current.metrics?.success ?? null,
      tags: current.tags || [],
      created_at: current.created_at || null,
      branch: current.branch ?? null,
    },
    next: children.map((child) => ({
      id: child.id,
      soul: child.soul || "",
      score: child.score ?? null,
      success: child.success ?? null,
    })),
  };
}

async function pushedFallback(companyId: string): Promise<PushPayload> {
  const latest = await readLatestPush(companyId);
  if (!latest) throw Object.assign(new Error("no pushed snapshot found"), { statusCode: 404 });
  return latest;
}

function runGlctlString(companyId: string, args: string[]): Promise<string> {
  if (!COMPANY_ID_RE.test(companyId)) {
    return Promise.reject(Object.assign(new Error("Invalid company id"), { statusCode: 400 }));
  }

  return new Promise<string>((resolve, reject) => {
    const child = spawn(glctlPath, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        GLCTL_DATA_DIR: dataDir,
        GLCTL_COMPANY_ID: companyId,
      },
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(Object.assign(new Error("glctl timed out"), { statusCode: 504 }));
    }, 10_000);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err: NodeJS.ErrnoException) => {
      clearTimeout(timer);
      const statusCode = err.code === "ENOENT" || err.code === "EACCES" ? 503 : 500;
      reject(Object.assign(new Error(`glctl unavailable: ${err.message}`), { statusCode }));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout);
      else reject(Object.assign(new Error(stderr.trim() || `glctl exited ${code}`), { statusCode: 502 }));
    });
  });
}

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || "/", `http://${host}:${port}`);
  if (req.method === "GET" && url.pathname === "/") {
    html(res, indexHtml());
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/health") {
    json(res, {
      ok: true,
      service: "glhub",
      glctl_path: glctlPath,
      data_dir: dataDir,
      push_storage: r2Enabled ? "r2" : "local",
      push_prefix: r2Enabled ? r2Prefix : glhubDataDir,
    });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/push") {
    const payload = (await readBody(req)) as PushPayload;
    const validation = validatePushPayload(payload);
    if (!validation.ok) {
      json(
        res,
        {
          error: "payload validation failed",
          schema_version: "glhub-push/v1",
          errors: validation.errors,
          docs: "https://github.com/baryonlabs/glhub/blob/main/docs/SPEC.md#22-pushpayload",
        },
        422,
      );
      return;
    }
    const generations = Array.isArray(payload.generations) ? payload.generations.length : 0;
    const relations = Array.isArray(payload.relations) ? payload.relations.length : 0;
    const stored = await storePush(payload);
    json(
      res,
      {
        ok: true,
        company_id: payload.company_id || null,
        generations,
        relations,
        storage: stored,
      },
      stored.idempotent ? 200 : 201,
    );
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/companies") {
    json(res, { companies: await companies() });
    return;
  }

  const pushMatch = /^\/api\/pushes\/([^/]+)\/latest$/.exec(url.pathname);
  if (req.method === "GET" && pushMatch) {
    const companyId = decodeURIComponent(pushMatch[1] || "");
    const latest = await readLatestPush(companyId);
    if (!latest) {
      json(res, { error: "no pushed snapshot found", company_id: companyId }, 404);
      return;
    }
    json(res, latest as JsonValue);
    return;
  }

  const match = /^\/api\/repos\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/.exec(url.pathname);
  if (match) {
    const companyId = decodeURIComponent(match[1] || "");
    const action = match[2] || "status";
    const id = match[3] ? decodeURIComponent(match[3]) : null;

    if (req.method === "POST" && action === "seed-demo") {
      json(res, await seedDemo(companyId), 201);
      return;
    }
    if (req.method === "POST" && action === "generations") {
      const body = await readBody(req);
      const soul = typeof body.soul === "string" ? body.soul.trim() : "";
      if (!soul) {
        json(res, { error: "soul is required" }, 400);
        return;
      }
      const args = ["new", "--soul", soul];
      if (typeof body.parent_id === "string" && body.parent_id) args.push("--parent", body.parent_id);
      if (typeof body.score === "number") args.push("--score", String(body.score));
      if (Array.isArray(body.tags)) {
        for (const tag of body.tags) if (typeof tag === "string") args.push("--tag", tag);
      }
      const generationId = (await runGlctlString(companyId, args)).trim();
      json(res, { id: generationId }, 201);
      return;
    }
    if (req.method === "POST" && action === "comment" && id && GENERATION_ID_RE.test(id)) {
      const body = await readBody(req);
      const text = typeof body.text === "string" ? body.text.trim() : "";
      const kind = body.kind === "edit" ? "edit" : "comment";
      if (!text) {
        json(res, { error: "text is required" }, 400);
        return;
      }
      const args = [
        "new",
        "--parent",
        id,
        "--soul",
        kind === "edit" ? `Amend evolution document for ${id}` : `Comment on ${id}`,
        "--note",
        text,
        "--score",
        "0.0",
        "--tag",
        kind,
        "--tag",
        "glhub-note",
      ];
      if (kind === "edit") {
        args.push("--do", text);
      }
      const generationId = (await runGlctlString(companyId, args)).trim();
      json(res, { id: generationId }, 201);
      return;
    }
    if (req.method !== "GET") {
      json(res, { error: "method not allowed" }, 405);
      return;
    }
    if (action === "status") {
      try {
        json(res, await runGlctl(companyId, ["status", "--json"]));
      } catch {
        const snapshot = await pushedFallback(companyId);
        json(res, (snapshot.status || { company_id: companyId }) as JsonValue);
      }
      return;
    }
    if (action === "list") {
      try {
        json(res, await runGlctl(companyId, ["list", "--json"]));
      } catch {
        json(res, lineageFromPush(await pushedFallback(companyId)).nodes as JsonValue);
      }
      return;
    }
    if (action === "lineage") {
      try {
        json(res, await runGlctl(companyId, ["lineage", "--json"]));
      } catch {
        json(res, lineageFromPush(await pushedFallback(companyId)) as unknown as JsonValue);
      }
      return;
    }
    if (action === "fsck") {
      json(res, await runGlctl(companyId, ["fsck", "--json"]));
      return;
    }
    if (action === "show" && id && GENERATION_ID_RE.test(id)) {
      try {
        json(res, await runGlctl(companyId, ["show", id, "--json"]));
      } catch {
        const generation = showFromPush(await pushedFallback(companyId), id);
        if (!generation) {
          json(res, { error: "generation not found" }, 404);
          return;
        }
        json(res, generation as unknown as JsonValue);
      }
      return;
    }
    if (action === "evolution" && id && GENERATION_ID_RE.test(id)) {
      try {
        json(res, await evolutionDocument(companyId, id));
      } catch {
        const document = evolutionDocumentFromPush(await pushedFallback(companyId), id);
        if (!document) {
          json(res, { error: "generation not found" }, 404);
          return;
        }
        json(res, document);
      }
      return;
    }
  }

  text(res, "not found", 404);
}

const server = createServer((req, res) => {
  route(req, res).catch((err) => errorJson(res, err));
});

server.listen(port, host, () => {
  console.log(`glhub listening on http://${host}:${port}`);
  console.log(`glctl: ${glctlPath}`);
  console.log(`data: ${dataDir}`);
});
