/// <reference types="@cloudflare/workers-types" />

import type { ForgeAdapter, NormalizedForgeEvent } from "./types.js";

const encoder = new TextEncoder();

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

async function hmacSha256Verify(secret: string, signature: string | null, rawBody: string): Promise<boolean> {
  if (!signature) return false;
  const match = /^sha256=([0-9a-f]+)$/i.exec(signature.trim());
  if (!match) return false;
  const sigBytes = hexToBytes(match[1] as string);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret) as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return await crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes as unknown as BufferSource,
    encoder.encode(rawBody) as unknown as BufferSource,
  );
}

export const ForgejoAdapter: ForgeAdapter = {
  provider: "forgejo",

  async verifyWebhookSignature(secret, headers, rawBody) {
    // Forgejo and Gitea use the same sha256 HMAC scheme as GitHub
    const sig =
      headers.get("x-forgejo-signature") ||
      headers.get("x-gitea-signature") ||
      headers.get("x-hub-signature-256");
    return hmacSha256Verify(secret, sig, rawBody);
  },

  parseEvent(headers, payload): NormalizedForgeEvent {
    const obj = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
    const repository = obj.repository as { full_name?: string } | undefined;
    const sender = obj.sender as { login?: string } | undefined;
    return {
      event:
        headers.get("x-forgejo-event") || headers.get("x-gitea-event") || "unknown",
      delivery_id:
        headers.get("x-forgejo-delivery") ||
        headers.get("x-gitea-delivery") ||
        crypto.randomUUID(),
      hook_id: null,
      repository_full_name:
        typeof repository?.full_name === "string" ? repository.full_name : null,
      sender_login: typeof sender?.login === "string" ? sender.login : null,
      installation_id: null,
    };
  },

  buildBacklinkUrl(repo, generationId) {
    // For Codeberg (hosted Forgejo), use codeberg.org; for arbitrary instances the
    // caller must prefix with the instance base URL from the ForgeLink record.
    return `https://codeberg.org/${repo}#glhub-${generationId}`;
  },
};
