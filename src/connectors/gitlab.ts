import type { ForgeAdapter, NormalizedForgeEvent } from "./types.js";

export const GitLabAdapter: ForgeAdapter = {
  provider: "gitlab",

  async verifyWebhookSignature(secret, headers, _rawBody) {
    const token = headers.get("x-gitlab-token");
    if (!token) return false;
    return token === secret;
  },

  parseEvent(headers, payload): NormalizedForgeEvent {
    const obj = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
    const project = obj.project as { path_with_namespace?: string } | undefined;
    const user = obj.user as { username?: string } | undefined;
    return {
      event: headers.get("x-gitlab-event") || "unknown",
      delivery_id: headers.get("x-gitlab-event-uuid") || crypto.randomUUID(),
      hook_id: null,
      repository_full_name:
        typeof project?.path_with_namespace === "string" ? project.path_with_namespace : null,
      sender_login: typeof user?.username === "string" ? user.username : null,
      installation_id: null,
    };
  },

  buildBacklinkUrl(repo, generationId) {
    return `https://gitlab.com/${repo}#glhub-${generationId}`;
  },
};
