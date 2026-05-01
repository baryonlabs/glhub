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

export const GitHubAdapter: ForgeAdapter = {
  provider: "github",

  async verifyWebhookSignature(secret, headers, rawBody) {
    return hmacSha256Verify(secret, headers.get("x-hub-signature-256"), rawBody);
  },

  parseEvent(headers, payload): NormalizedForgeEvent {
    const obj = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
    const installation = obj.installation as { id?: number } | undefined;
    const repository = obj.repository as { full_name?: string } | undefined;
    const sender = obj.sender as { login?: string } | undefined;
    return {
      event: headers.get("x-github-event") || "unknown",
      delivery_id: headers.get("x-github-delivery") || crypto.randomUUID(),
      hook_id: headers.get("x-github-hook-id"),
      repository_full_name: typeof repository?.full_name === "string" ? repository.full_name : null,
      sender_login: typeof sender?.login === "string" ? sender.login : null,
      installation_id: typeof installation?.id === "number" ? installation.id : null,
    };
  },

  buildBacklinkUrl(repo, generationId) {
    return `https://github.com/${repo}#glhub-${generationId}`;
  },
};
