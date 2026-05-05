import {
  COMPANY_ID_RE,
  GENERATION_ID_RE,
  type GenerationRecord,
  type PushPayload,
} from "./types.js";

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

const ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;
const SCHEMA_VERSION_SUPPORTED = "glhub-push/v1";

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function isIso8601(value: unknown): value is string {
  return typeof value === "string" && ISO_8601_RE.test(value);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === "object" && !Array.isArray(v));
}

export function validateGenerationRecord(g: unknown, path: string): string[] {
  const errors: string[] = [];
  if (!isPlainObject(g)) {
    errors.push(`${path}: must be an object`);
    return errors;
  }
  const rec = g;

  if (typeof rec.id !== "string") {
    errors.push(`${path}.id: required string matching gen-YYYYMMDD-NNN`);
  } else if (!GENERATION_ID_RE.test(rec.id)) {
    errors.push(`${path}.id: "${rec.id}" must match gen-YYYYMMDD-NNN`);
  }

  if (rec.parent_id !== undefined && rec.parent_id !== null) {
    if (typeof rec.parent_id !== "string" || !GENERATION_ID_RE.test(rec.parent_id)) {
      errors.push(`${path}.parent_id: must be null or match gen-YYYYMMDD-NNN`);
    }
  }

  if (rec.created_at !== undefined && rec.created_at !== null && !isIso8601(rec.created_at)) {
    errors.push(`${path}.created_at: must be ISO 8601 if present`);
  }

  if (rec.branch !== undefined && rec.branch !== null && typeof rec.branch !== "string") {
    errors.push(`${path}.branch: must be string or null`);
  }

  if (!isPlainObject(rec.metrics)) {
    errors.push(`${path}.metrics: required object with score`);
  } else {
    const m = rec.metrics;
    if (!isFiniteNumber(m.score)) {
      errors.push(`${path}.metrics.score: required finite number in (0, 1]`);
    } else if (m.score <= 0) {
      errors.push(
        `${path}.metrics.score: must be > 0 (received ${m.score}). 0 indicates no actual evaluation — set success:false instead, or see docs/SCORING.md.`,
      );
    } else if (m.score > 1) {
      errors.push(`${path}.metrics.score: must be ≤ 1 (received ${m.score})`);
    }
    if (m.success !== undefined && m.success !== null && typeof m.success !== "boolean") {
      errors.push(`${path}.metrics.success: must be boolean if present`);
    }
    if (
      m.execution_time_s !== undefined &&
      m.execution_time_s !== null &&
      !isFiniteNumber(m.execution_time_s)
    ) {
      errors.push(`${path}.metrics.execution_time_s: must be finite number or null if present`);
    }
  }

  if (rec.tags !== undefined && rec.tags !== null) {
    if (!Array.isArray(rec.tags)) {
      errors.push(`${path}.tags: must be array if present`);
    } else {
      for (let i = 0; i < rec.tags.length; i++) {
        if (typeof rec.tags[i] !== "string") {
          errors.push(`${path}.tags[${i}]: must be string`);
        }
      }
    }
  }

  return errors;
}

export function validatePushPayload(payload: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isPlainObject(payload)) {
    return { ok: false, errors: ["payload: must be a JSON object"] };
  }
  const p = payload;

  if (
    p.schema_version !== undefined &&
    p.schema_version !== null &&
    p.schema_version !== SCHEMA_VERSION_SUPPORTED
  ) {
    errors.push(
      `schema_version: unsupported value "${String(p.schema_version)}" — only "${SCHEMA_VERSION_SUPPORTED}" is accepted`,
    );
  }

  if (typeof p.company_id !== "string") {
    errors.push(`company_id: required string matching [A-Za-z0-9_-]+`);
  } else if (!COMPANY_ID_RE.test(p.company_id)) {
    errors.push(`company_id: "${p.company_id}" must match [A-Za-z0-9_-]+`);
  }

  if (p.pushed_at !== undefined && p.pushed_at !== null && !isIso8601(p.pushed_at)) {
    errors.push(`pushed_at: must be ISO 8601 if present`);
  }

  const ids = new Set<string>();
  if (!Array.isArray(p.generations)) {
    errors.push(`generations: required array (may be empty)`);
  } else {
    for (let i = 0; i < p.generations.length; i++) {
      const gErrors = validateGenerationRecord(p.generations[i], `generations[${i}]`);
      errors.push(...gErrors);
      const g = p.generations[i] as { id?: unknown };
      if (typeof g?.id === "string" && GENERATION_ID_RE.test(g.id)) {
        if (ids.has(g.id)) {
          errors.push(`generations[${i}].id: duplicate "${g.id}"`);
        }
        ids.add(g.id);
      }
    }
  }

  if (!Array.isArray(p.relations)) {
    errors.push(`relations: required array (may be empty)`);
  } else {
    for (let i = 0; i < p.relations.length; i++) {
      const r = p.relations[i];
      if (!isPlainObject(r)) {
        errors.push(`relations[${i}]: must be object`);
        continue;
      }
      const rel = r;
      if (typeof rel.from !== "string" || !GENERATION_ID_RE.test(rel.from)) {
        errors.push(`relations[${i}].from: must match gen-YYYYMMDD-NNN`);
      }
      if (typeof rel.to !== "string" || !GENERATION_ID_RE.test(rel.to)) {
        errors.push(`relations[${i}].to: must match gen-YYYYMMDD-NNN`);
      }
      if (typeof rel.relation_type !== "string" || rel.relation_type.length === 0) {
        errors.push(`relations[${i}].relation_type: required non-empty string`);
      }
      if (rel.created_at !== undefined && rel.created_at !== null && !isIso8601(rel.created_at)) {
        errors.push(`relations[${i}].created_at: must be ISO 8601 if present`);
      }
      // cross-reference: from/to should resolve to known ids in this push
      if (typeof rel.from === "string" && !ids.has(rel.from)) {
        errors.push(`relations[${i}].from: "${rel.from}" not present in generations[]`);
      }
      if (typeof rel.to === "string" && !ids.has(rel.to)) {
        errors.push(`relations[${i}].to: "${rel.to}" not present in generations[]`);
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export function _unused_marker(_: PushPayload | GenerationRecord): void {
  // re-export reference; pure type usage so tsc doesn't tree-shake away the imports
  void _;
}
