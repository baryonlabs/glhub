import type { GenerationRecord, JsonValue, LineageResult, PushPayload } from "./types.js";

export function pushId(companyId: string, pushedAt: string): string {
  const safeTime = pushedAt.replace(/[^0-9A-Za-z_-]/g, "-");
  return `${companyId}-${safeTime}`;
}

export function generationsFromPush(payload: PushPayload): GenerationRecord[] {
  return Array.isArray(payload.generations)
    ? payload.generations.filter((item): item is GenerationRecord => {
        return Boolean(item && typeof item === "object" && !Array.isArray(item) && typeof (item as GenerationRecord).id === "string");
      })
    : [];
}

export function lineageFromPush(payload: PushPayload): LineageResult {
  const generations = generationsFromPush(payload);
  return {
    nodes: generations.map((generation) => ({
      id: generation.id,
      parent_id: generation.parent_id ?? null,
      soul: generation.soul || "",
      score: typeof generation.metrics?.score === "number" ? generation.metrics.score : 0,
      success: typeof generation.metrics?.success === "boolean" ? generation.metrics.success : false,
      created_at: generation.created_at || "",
      tags: generation.tags || [],
    })),
    edges: Array.isArray(payload.relations)
      ? payload.relations.filter((item): item is LineageResult["edges"][number] => {
          if (!item || typeof item !== "object" || Array.isArray(item)) return false;
          const rec = item as Record<string, unknown>;
          return (
            typeof rec.from === "string" &&
            typeof rec.to === "string" &&
            typeof rec.relation_type === "string" &&
            typeof rec.created_at === "string"
          );
        })
      : [],
  };
}

export function showFromPush(payload: PushPayload, id: string): GenerationRecord | null {
  return generationsFromPush(payload).find((generation) => generation.id === id) || null;
}

export function evolutionDocumentFromPush(payload: PushPayload, id: string): JsonValue | null {
  const lineage = lineageFromPush(payload);
  const generations = generationsFromPush(payload);
  const current = generations.find((generation) => generation.id === id);
  if (!current) return null;
  const parentId = typeof current.parent_id === "string" ? current.parent_id : null;
  const parent = parentId ? generations.find((generation) => generation.id === parentId) || null : null;
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
    },
    next: children.map((child) => ({
      id: child.id,
      soul: child.soul || "",
      score: child.score ?? null,
      success: child.success ?? null,
    })),
  };
}
