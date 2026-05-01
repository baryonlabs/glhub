/// <reference types="@cloudflare/workers-types" />

import {
  COMPANY_ID_RE,
  GENERATION_ID_RE,
  type JsonValue,
  type PushPayload,
} from "./core/types.js";
import {
  evolutionDocumentFromPush,
  lineageFromPush,
  pushId,
  showFromPush,
} from "./core/push-fallback.js";
import { indexHtml } from "./core/viewer.js";
import {
  clearCookie,
  parseCookies,
  randomState,
  serializeCookie,
  signPayload,
  verifyPayload,
  type OAuthStateClaims,
  type SessionClaims,
} from "./core/cookie.js";
import {
  generateToken,
  hashToken,
  isTokenFormat,
  lookupToken,
  storeToken,
  touchToken,
  type TokenRecord,
} from "./core/token.js";
import { authorizeUrl, exchangeCode, fetchUser } from "./core/github-oauth.js";
import { settingsHtml } from "./core/settings-html.js";
import {
  extractMetadata,
  safeKeySegment,
  verifyGithubSignature,
} from "./core/github-webhook.js";
import { profileHtml, type OwnerProjectEntry } from "./core/profile-html.js";
import { inferProvider, type ForgeLink } from "./core/forge-link.js";
import { detectLang, landingHtml } from "./core/landing-html.js";

export interface Env {
  GLHUB_R2: R2Bucket;
  GLHUB_KV: KVNamespace;
  GLHUB_R2_PREFIX?: string;
  GLHUB_INSTANCE_ID?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  GITHUB_WEBHOOK_SECRET?: string;
}

class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const noStore = { "cache-control": "no-store" } as const;
const SESSION_COOKIE = "glhub_session";
const OAUTH_STATE_COOKIE = "glhub_oauth_state";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const OAUTH_STATE_TTL_SECONDS = 60 * 10; // 10 minutes

function jsonResponse(body: JsonValue | unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...noStore,
      ...extraHeaders,
    },
  });
}

function htmlResponse(body: string, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      ...noStore,
      ...extraHeaders,
    },
  });
}

function textResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", ...noStore },
  });
}

function redirectResponse(location: string, extraHeaders: Record<string, string> = {}): Response {
  return new Response(null, {
    status: 302,
    headers: { location, ...noStore, ...extraHeaders },
  });
}

function prefixOf(env: Env): string {
  return (env.GLHUB_R2_PREFIX || "glhub").replace(/^\/+|\/+$/g, "");
}

async function r2GetText(env: Env, key: string): Promise<string | null> {
  const obj = await env.GLHUB_R2.get(key);
  if (!obj) return null;
  return await obj.text();
}

async function r2PutJson(env: Env, key: string, body: string): Promise<void> {
  await env.GLHUB_R2.put(key, body, {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  });
}

async function readLatestPush(env: Env, companyId: string): Promise<PushPayload | null> {
  if (!COMPANY_ID_RE.test(companyId)) {
    throw new HttpError("Invalid company id", 400);
  }
  const key = `${prefixOf(env)}/pushes/${companyId}/latest.json`;
  const body = await r2GetText(env, key);
  if (!body) return null;
  return JSON.parse(body) as PushPayload;
}

async function pushedFallback(env: Env, companyId: string): Promise<PushPayload> {
  const latest = await readLatestPush(env, companyId);
  if (!latest) throw new HttpError("no pushed snapshot found", 404);
  return latest;
}

type OwnerRecord = {
  schema_version: string;
  company_id: string;
  owner_id: string;
  owner_login: string;
  claimed_at: string;
};

async function readOwner(env: Env, companyId: string): Promise<OwnerRecord | null> {
  const key = `${prefixOf(env)}/owners/${companyId}.json`;
  const body = await r2GetText(env, key);
  if (!body) return null;
  return JSON.parse(body) as OwnerRecord;
}

async function claimOwner(
  env: Env,
  companyId: string,
  ownerId: string,
  ownerLogin: string,
): Promise<OwnerRecord> {
  const record: OwnerRecord = {
    schema_version: "glhub-owner/v1",
    company_id: companyId,
    owner_id: ownerId,
    owner_login: ownerLogin,
    claimed_at: new Date().toISOString(),
  };
  const key = `${prefixOf(env)}/owners/${companyId}.json`;
  await r2PutJson(env, key, JSON.stringify(record, null, 2));
  return record;
}

async function storePush(
  env: Env,
  payload: PushPayload,
): Promise<{ driver: string; key: string; latest_key: string }> {
  const companyId = typeof payload.company_id === "string" ? payload.company_id : "";
  if (!COMPANY_ID_RE.test(companyId)) {
    throw new HttpError("Invalid company_id in push payload", 400);
  }
  const pushedAt =
    typeof payload.pushed_at === "string" ? payload.pushed_at : new Date().toISOString();
  const id = pushId(companyId, pushedAt);
  const body = JSON.stringify({ ...payload, pushed_at: pushedAt }, null, 2);
  const prefix = prefixOf(env);
  const key = `${prefix}/pushes/${companyId}/${id}.json`;
  const latestKey = `${prefix}/pushes/${companyId}/latest.json`;
  await r2PutJson(env, key, body);
  await r2PutJson(env, latestKey, body);
  return { driver: "r2-binding", key, latest_key: latestKey };
}

async function listCompanies(env: Env): Promise<string[]> {
  const prefix = prefixOf(env);
  const root = `${prefix}/pushes/`;
  const found = new Set<string>();
  let cursor: string | undefined;
  do {
    const result: R2Objects = await env.GLHUB_R2.list({
      prefix: root,
      delimiter: "/",
      cursor,
    });
    for (const p of result.delimitedPrefixes || []) {
      const stripped = p.replace(root, "").replace(/\/$/, "");
      if (COMPANY_ID_RE.test(stripped)) found.add(stripped);
    }
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);
  return [...found].sort();
}

async function listProjectsForOwner(
  env: Env,
  ownerLogin: string,
): Promise<OwnerProjectEntry[]> {
  const prefix = prefixOf(env);
  const root = `${prefix}/owners/`;
  const projects: OwnerProjectEntry[] = [];
  let cursor: string | undefined;
  do {
    const result: R2Objects = await env.GLHUB_R2.list({ prefix: root, cursor });
    for (const obj of result.objects) {
      const body = await r2GetText(env, obj.key);
      if (!body) continue;
      try {
        const owner = JSON.parse(body) as OwnerRecord;
        if (owner.owner_login === ownerLogin) {
          projects.push({ project_id: owner.company_id, claimed_at: owner.claimed_at });
        }
      } catch {
        /* skip malformed */
      }
    }
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);
  return projects.sort((a, b) => a.project_id.localeCompare(b.project_id));
}

const RESERVED_FIRST_SEGMENTS = new Set([
  "api",
  "auth",
  "webhooks",
  "settings",
  "favicon.ico",
  "robots.txt",
]);

const OWNER_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38}[A-Za-z0-9])?$/;

function injectViewerBootstrap(html: string, owner: string, projectId: string): string {
  const data = JSON.stringify({ owner, project: projectId });
  const idLit = JSON.stringify(projectId);
  const bootstrap = `\n<script>(function(){
  window.__GLHUB_BOOTSTRAP__ = ${data};
  function tryBoot(){
    var sel = document.getElementById('company');
    if (!sel) { setTimeout(tryBoot, 50); return; }
    var found = false;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === ${idLit}) { sel.value = ${idLit}; found = true; break; }
    }
    if (!found) {
      var opt = document.createElement('option');
      opt.value = ${idLit};
      opt.textContent = ${idLit};
      sel.appendChild(opt);
      sel.value = ${idLit};
    }
    sel.dispatchEvent(new Event('change'));
  }
  function loadForgeBadge(){
    fetch('/api/repos/' + encodeURIComponent(${idLit}) + '/forge-link', {cache:'no-store'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(link){
        if (!link || link.error) return;
        var brand = document.querySelector('.brand');
        if (!brand) return;
        var badge = document.createElement('a');
        badge.href = link.url;
        badge.target = '_blank';
        badge.rel = 'noopener';
        badge.style.cssText = 'margin-left:12px;padding:3px 10px;border-radius:12px;background:#eef4ff;color:#1849a9;font-size:11px;font-weight:700;text-decoration:none;';
        badge.textContent = link.provider + ' · ' + link.repo;
        brand.appendChild(badge);
      })
      .catch(function(){});
  }
  function init(){ tryBoot(); loadForgeBadge(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();</script>\n`;
  return html.replace("</body>", `${bootstrap}</body>`);
}

async function readSession(env: Env, request: Request): Promise<SessionClaims | null> {
  if (!env.SESSION_SECRET) return null;
  const cookies = parseCookies(request.headers.get("cookie"));
  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;
  const claims = await verifyPayload<SessionClaims>(env.SESSION_SECRET, raw);
  if (!claims) return null;
  if (claims.exp < Math.floor(Date.now() / 1000)) return null;
  return claims;
}

function requireConfig(env: Env): void {
  if (!env.GITHUB_CLIENT_ID) {
    throw new HttpError("GITHUB_CLIENT_ID is not configured", 503);
  }
  if (!env.GITHUB_CLIENT_SECRET) {
    throw new HttpError("GITHUB_CLIENT_SECRET is not configured", 503);
  }
  if (!env.SESSION_SECRET) {
    throw new HttpError("SESSION_SECRET is not configured", 503);
  }
}

function callbackUrl(env: Env, request: Request): string {
  const instance = env.GLHUB_INSTANCE_ID;
  if (instance) return `https://${instance}/auth/github/callback`;
  const here = new URL(request.url);
  return `${here.origin}/auth/github/callback`;
}

function isLoopbackRedirect(uri: string): boolean {
  try {
    const u = new URL(uri);
    if (u.protocol !== "http:") return false;
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]";
  } catch {
    return false;
  }
}

function isInternalReturnTo(uri: string): boolean {
  return uri.startsWith("/") && !uri.startsWith("//");
}

async function readForgeLink(env: Env, companyId: string): Promise<ForgeLink | null> {
  const key = `${prefixOf(env)}/links/${companyId}.json`;
  const body = await r2GetText(env, key);
  if (!body) return null;
  return JSON.parse(body) as ForgeLink;
}

async function writeForgeLink(env: Env, link: ForgeLink): Promise<void> {
  const key = `${prefixOf(env)}/links/${link.company_id}.json`;
  await r2PutJson(env, key, JSON.stringify(link, null, 2));
}

const HOSTED_MUTATION_LIMITED_BODY = {
  error:
    "this hosted endpoint accepts only push (POST /api/push) with Bearer token. Comment / seed-demo / new generation require self-host or future authenticated channel.",
};

async function authMiddlewareForPush(
  env: Env,
  request: Request,
): Promise<TokenRecord & { _hash: string }> {
  const auth = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(\S+)$/i.exec(auth);
  if (!match) {
    throw new HttpError("missing Authorization: Bearer <token>", 401);
  }
  const token = match[1] as string;
  if (!isTokenFormat(token)) {
    throw new HttpError("invalid token format", 401);
  }
  const record = await lookupToken(env.GLHUB_KV, token);
  if (!record) {
    throw new HttpError("token not recognized", 401);
  }
  return { ...record, _hash: await hashToken(token) };
}

async function authenticatedUser(
  env: Env,
  request: Request,
): Promise<{ user_id: string; login: string } | null> {
  const auth = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(\S+)$/i.exec(auth);
  if (match) {
    const token = match[1] as string;
    if (isTokenFormat(token)) {
      const record = await lookupToken(env.GLHUB_KV, token);
      if (record) return { user_id: record.user_id, login: record.login };
    }
  }
  const session = await readSession(env, request);
  if (session) return { user_id: session.uid, login: session.login };
  return null;
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/") {
    const session = await readSession(env, request);
    if (!session) {
      const lang = detectLang(
        url.searchParams.get("lang"),
        request.headers.get("accept-language"),
      );
      return htmlResponse(landingHtml(lang));
    }
    return redirectResponse(`/${encodeURIComponent(session.login)}`);
  }

  if (method === "GET" && pathname === "/api/health") {
    return jsonResponse({
      ok: true,
      service: "glhub",
      mode: "hosted-push-only",
      instance_id: env.GLHUB_INSTANCE_ID || null,
      push_storage: "r2-binding",
      push_prefix: prefixOf(env),
      auth: env.GITHUB_CLIENT_ID ? "github-oauth" : "disabled",
      webhook: env.GITHUB_WEBHOOK_SECRET ? "github" : "disabled",
      glctl_path: null,
      data_dir: null,
    });
  }

  // ---- GitHub webhook receiver ----
  if (method === "POST" && pathname === "/webhooks/github") {
    if (!env.GITHUB_WEBHOOK_SECRET) {
      return jsonResponse({ error: "webhook secret not configured" }, 503);
    }
    const rawBody = await request.text();
    const sig = request.headers.get("x-hub-signature-256");
    const ok = await verifyGithubSignature(env.GITHUB_WEBHOOK_SECRET, sig, rawBody);
    if (!ok) {
      return jsonResponse({ error: "signature verification failed" }, 401);
    }
    const event = request.headers.get("x-github-event") || "unknown";
    const deliveryId = request.headers.get("x-github-delivery") || crypto.randomUUID();
    const hookId = request.headers.get("x-github-hook-id");
    let payload: unknown = null;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = { _parse_error: "non-json body" };
    }
    const metadata = extractMetadata(event, deliveryId, hookId, payload);
    const eventSegment = safeKeySegment(event, "unknown");
    const deliverySegment = safeKeySegment(deliveryId, "no-delivery");
    const key = `${prefixOf(env)}/webhooks/${eventSegment}/${deliverySegment}.json`;
    const record = { ...metadata, payload };
    await r2PutJson(env, key, JSON.stringify(record, null, 2));
    return jsonResponse(
      {
        ok: true,
        event,
        delivery_id: deliveryId,
        repository: metadata.repository_full_name,
        sender: metadata.sender_login,
        stored_key: key,
      },
      202,
    );
  }

  // ---- OAuth flow ----
  if (method === "GET" && pathname === "/auth/github/login") {
    requireConfig(env);
    const state = randomState(16);
    const returnToRaw = url.searchParams.get("return_to") || "";
    const returnTo = isInternalReturnTo(returnToRaw) ? returnToRaw : undefined;
    const stateClaims: OAuthStateClaims = {
      state,
      exp: Math.floor(Date.now() / 1000) + OAUTH_STATE_TTL_SECONDS,
      ...(returnTo ? { return_to: returnTo } : {}),
    };
    const stateCookie = serializeCookie(
      OAUTH_STATE_COOKIE,
      await signPayload(env.SESSION_SECRET!, stateClaims),
      { maxAge: OAUTH_STATE_TTL_SECONDS, sameSite: "Lax" },
    );
    return redirectResponse(
      authorizeUrl(env.GITHUB_CLIENT_ID!, state, callbackUrl(env, request)),
      { "set-cookie": stateCookie },
    );
  }

  if (method === "GET" && pathname === "/auth/github/callback") {
    requireConfig(env);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state) {
      return textResponse("missing code or state", 400);
    }
    const cookies = parseCookies(request.headers.get("cookie"));
    const stateRaw = cookies[OAUTH_STATE_COOKIE];
    const stateClaims = stateRaw
      ? await verifyPayload<OAuthStateClaims>(env.SESSION_SECRET!, stateRaw)
      : null;
    if (!stateClaims || stateClaims.state !== state) {
      return textResponse("invalid OAuth state", 400);
    }
    const accessToken = await exchangeCode(
      env.GITHUB_CLIENT_ID!,
      env.GITHUB_CLIENT_SECRET!,
      code,
      callbackUrl(env, request),
    );
    const user = await fetchUser(accessToken);
    const sessionClaims: SessionClaims = {
      uid: String(user.id),
      login: user.login,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const sessionCookie = serializeCookie(
      SESSION_COOKIE,
      await signPayload(env.SESSION_SECRET!, sessionClaims),
      { maxAge: SESSION_TTL_SECONDS, sameSite: "Lax" },
    );
    const stateClear = clearCookie(OAUTH_STATE_COOKIE);
    const target =
      stateClaims.return_to && isInternalReturnTo(stateClaims.return_to)
        ? stateClaims.return_to
        : `/${encodeURIComponent(user.login)}`;
    const headers = new Headers();
    headers.append("location", target);
    headers.append("set-cookie", sessionCookie);
    headers.append("set-cookie", stateClear);
    headers.append("cache-control", "no-store");
    return new Response(null, { status: 302, headers });
  }

  // ---- glctl loopback login (CLI device flow) ----
  if (method === "GET" && pathname === "/login/cli") {
    const redirectUri = url.searchParams.get("redirect_uri") || "";
    const cliState = url.searchParams.get("state") || "";
    if (!isLoopbackRedirect(redirectUri)) {
      return textResponse("invalid redirect_uri (loopback only: http://localhost:PORT/...)", 400);
    }
    if (!cliState || cliState.length < 8) {
      return textResponse("missing or too-short state", 400);
    }
    const session = await readSession(env, request);
    if (!session) {
      const returnTo = `/login/cli?redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(cliState)}`;
      return redirectResponse(`/auth/github/login?return_to=${encodeURIComponent(returnTo)}`);
    }
    const token = generateToken();
    const record: TokenRecord = {
      user_id: session.uid,
      login: session.login,
      name: `glctl login (${new Date().toISOString().slice(0, 10)})`,
      created_at: new Date().toISOString(),
      last_used_at: null,
    };
    await storeToken(env.GLHUB_KV, token, record);
    const target = new URL(redirectUri);
    target.searchParams.set("token", token);
    target.searchParams.set("state", cliState);
    return redirectResponse(target.toString());
  }

  if (method === "POST" && pathname === "/auth/logout") {
    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
        "set-cookie": clearCookie(SESSION_COOKIE),
        ...noStore,
      },
    });
  }

  if (method === "GET" && pathname === "/api/me") {
    const session = await readSession(env, request);
    if (!session) return jsonResponse({ login: null, uid: null }, 200);
    return jsonResponse({ login: session.login, uid: session.uid });
  }

  // ---- Settings page ----
  if (method === "GET" && pathname === "/settings") {
    const session = await readSession(env, request);
    return htmlResponse(settingsHtml({ login: session?.login || null }));
  }

  // ---- Token creation (form POST or JSON) ----
  if (method === "POST" && pathname === "/api/tokens") {
    const session = await readSession(env, request);
    if (!session) {
      throw new HttpError("login required", 401);
    }
    const contentType = request.headers.get("content-type") || "";
    let name = "unnamed";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { name?: string };
      if (typeof body.name === "string" && body.name.trim()) name = body.name.trim().slice(0, 64);
    } else {
      const form = await request.formData();
      const formName = form.get("name");
      if (typeof formName === "string" && formName.trim()) name = formName.trim().slice(0, 64);
    }
    const token = generateToken();
    const record: TokenRecord = {
      user_id: session.uid,
      login: session.login,
      name,
      created_at: new Date().toISOString(),
      last_used_at: null,
    };
    await storeToken(env.GLHUB_KV, token, record);

    if (contentType.includes("application/json")) {
      return jsonResponse({ token, name, created_at: record.created_at }, 201);
    }
    return htmlResponse(
      settingsHtml({ login: session.login, newToken: token, newTokenName: name }),
      201,
    );
  }

  // ---- Push (Bearer auth + ownership) ----
  if (method === "POST" && pathname === "/api/push") {
    const auth = await authMiddlewareForPush(env, request);
    let payload: PushPayload;
    try {
      payload = (await request.json()) as PushPayload;
    } catch {
      return jsonResponse({ error: "invalid JSON body" }, 400);
    }
    const companyId = typeof payload.company_id === "string" ? payload.company_id : "";
    if (!COMPANY_ID_RE.test(companyId)) {
      return jsonResponse({ error: "Invalid company_id" }, 400);
    }
    const existing = await readOwner(env, companyId);
    if (existing && existing.owner_id !== auth.user_id) {
      return jsonResponse(
        {
          error: `company_id "${companyId}" is owned by another user`,
          owner_login: existing.owner_login,
        },
        403,
      );
    }
    if (!existing) {
      await claimOwner(env, companyId, auth.user_id, auth.login);
    }
    const generations = Array.isArray(payload.generations) ? payload.generations.length : 0;
    const relations = Array.isArray(payload.relations) ? payload.relations.length : 0;
    const stored = await storePush(env, payload);
    await touchToken(env.GLHUB_KV, auth._hash, auth);
    return jsonResponse(
      {
        ok: true,
        company_id: companyId,
        generations,
        relations,
        owner_login: auth.login,
        storage: stored,
      },
      201,
    );
  }

  if (method === "GET" && pathname === "/api/companies") {
    return jsonResponse({ companies: await listCompanies(env) });
  }

  const pushMatch = /^\/api\/pushes\/([^/]+)\/latest$/.exec(pathname);
  if (method === "GET" && pushMatch) {
    const companyId = decodeURIComponent(pushMatch[1] || "");
    const latest = await readLatestPush(env, companyId);
    if (!latest) {
      return jsonResponse({ error: "no pushed snapshot found", company_id: companyId }, 404);
    }
    return jsonResponse(latest as JsonValue);
  }

  const repoMatch = /^\/api\/repos\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/.exec(pathname);
  if (repoMatch) {
    const companyId = decodeURIComponent(repoMatch[1] || "");
    const action = repoMatch[2] || "status";
    const id = repoMatch[3] ? decodeURIComponent(repoMatch[3]) : null;

    if (
      method === "POST" &&
      (action === "seed-demo" ||
        action === "generations" ||
        (action === "comment" && id))
    ) {
      return jsonResponse(HOSTED_MUTATION_LIMITED_BODY, 501);
    }

    // Forge link (GET public, POST owner-only)
    if (action === "forge-link" && method === "GET") {
      const link = await readForgeLink(env, companyId);
      if (!link) {
        return jsonResponse({ error: "no forge link set", company_id: companyId }, 404);
      }
      return jsonResponse(link as unknown as JsonValue);
    }
    if (action === "forge-link" && method === "POST") {
      const me = await authenticatedUser(env, request);
      if (!me) throw new HttpError("authentication required (Bearer or session)", 401);
      const owner = await readOwner(env, companyId);
      if (!owner) {
        throw new HttpError("project has no owner yet — push first to claim ownership", 409);
      }
      if (owner.owner_id !== me.user_id) {
        throw new HttpError(`only the owner (${owner.owner_login}) can set the forge link`, 403);
      }
      let body: { url?: string; provider?: string; repo?: string };
      try {
        body = (await request.json()) as { url?: string; provider?: string; repo?: string };
      } catch {
        return jsonResponse({ error: "invalid JSON body" }, 400);
      }
      const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
      if (!rawUrl) {
        return jsonResponse({ error: "url is required (e.g. https://github.com/owner/repo)" }, 400);
      }
      let inferred;
      try {
        inferred = inferProvider(rawUrl);
      } catch (err) {
        return jsonResponse({ error: (err as Error).message }, 400);
      }
      const link: ForgeLink = {
        schema_version: "glhub-forge-link/v1",
        company_id: companyId,
        provider: inferred.provider,
        repo: inferred.repo,
        url: inferred.url,
        set_by_user_id: me.user_id,
        set_by_login: me.login,
        set_at: new Date().toISOString(),
      };
      await writeForgeLink(env, link);
      return jsonResponse(link as unknown as JsonValue, 201);
    }

    if (method !== "GET") {
      return jsonResponse({ error: "method not allowed" }, 405);
    }

    if (action === "status") {
      const snapshot = await pushedFallback(env, companyId);
      return jsonResponse((snapshot.status || { company_id: companyId }) as JsonValue);
    }
    if (action === "list") {
      return jsonResponse(lineageFromPush(await pushedFallback(env, companyId)).nodes as JsonValue);
    }
    if (action === "lineage") {
      return jsonResponse(lineageFromPush(await pushedFallback(env, companyId)) as unknown as JsonValue);
    }
    if (action === "fsck") {
      return jsonResponse(HOSTED_MUTATION_LIMITED_BODY, 501);
    }
    if (action === "show" && id && GENERATION_ID_RE.test(id)) {
      const generation = showFromPush(await pushedFallback(env, companyId), id);
      if (!generation) {
        return jsonResponse({ error: "generation not found" }, 404);
      }
      return jsonResponse(generation as unknown as JsonValue);
    }
    if (action === "evolution" && id && GENERATION_ID_RE.test(id)) {
      const document = evolutionDocumentFromPush(await pushedFallback(env, companyId), id);
      if (!document) {
        return jsonResponse({ error: "generation not found" }, 404);
      }
      return jsonResponse(document);
    }
  }

  // ---- /{owner}[/{project_id}] ----
  // Match only after all reserved paths above. GET-only.
  if (method === "GET") {
    const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");
    const first = segments[0] ?? "";
    if (first && !RESERVED_FIRST_SEGMENTS.has(first) && OWNER_RE.test(first)) {
      const session = await readSession(env, request);
      if (segments.length === 1) {
        const projects = await listProjectsForOwner(env, first);
        const enriched = await Promise.all(
          projects.map(async (p) => {
            const link = await readForgeLink(env, p.project_id);
            return {
              ...p,
              forge_link: link
                ? { provider: link.provider, repo: link.repo, url: link.url }
                : null,
            };
          }),
        );
        return htmlResponse(
          profileHtml({ owner: first, projects: enriched, viewerLogin: session?.login || null }),
        );
      }
      if (segments.length === 2) {
        const projectId = decodeURIComponent(segments[1] ?? "");
        if (!COMPANY_ID_RE.test(projectId)) {
          return textResponse("invalid project id", 400);
        }
        const owner = await readOwner(env, projectId);
        if (!owner) {
          return textResponse(`project not found: ${first}/${projectId}`, 404);
        }
        if (owner.owner_login !== first) {
          return redirectResponse(
            `/${encodeURIComponent(owner.owner_login)}/${encodeURIComponent(projectId)}`,
          );
        }
        return htmlResponse(injectViewerBootstrap(indexHtml(), first, projectId));
      }
    }
  }

  return textResponse("not found", 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await route(request, env);
    } catch (err) {
      const status = err instanceof HttpError ? err.statusCode : 500;
      const message = err instanceof Error ? err.message : "Unknown error";
      return jsonResponse({ error: message }, status);
    }
  },
} satisfies ExportedHandler<Env>;
