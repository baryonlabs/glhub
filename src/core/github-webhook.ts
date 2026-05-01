/// <reference types="@cloudflare/workers-types" />

const encoder = new TextEncoder();

function asBuf(data: Uint8Array): BufferSource {
  return data as unknown as BufferSource;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
}

export async function verifyGithubSignature(
  secret: string,
  signatureHeader: string | null,
  rawBody: string,
): Promise<boolean> {
  if (!signatureHeader) return false;
  const match = /^sha256=([0-9a-f]+)$/i.exec(signatureHeader.trim());
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
    asBuf(sigBytes),
    asBuf(encoder.encode(rawBody)),
  );
}

export type WebhookMetadata = {
  schema_version: "glhub-webhook/v1";
  event: string;
  delivery_id: string;
  received_at: string;
  hook_id: string | null;
  installation_id: number | null;
  repository_full_name: string | null;
  sender_login: string | null;
};

export function extractMetadata(
  event: string,
  deliveryId: string,
  hookId: string | null,
  payload: unknown,
): WebhookMetadata {
  const obj = (payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {});
  const installation = obj.installation as { id?: number } | undefined;
  const repository = obj.repository as { full_name?: string } | undefined;
  const sender = obj.sender as { login?: string } | undefined;
  return {
    schema_version: "glhub-webhook/v1",
    event,
    delivery_id: deliveryId,
    received_at: new Date().toISOString(),
    hook_id: hookId,
    installation_id: typeof installation?.id === "number" ? installation.id : null,
    repository_full_name: typeof repository?.full_name === "string" ? repository.full_name : null,
    sender_login: typeof sender?.login === "string" ? sender.login : null,
  };
}

export function safeKeySegment(value: string | null, fallback: string): string {
  if (!value) return fallback;
  return value.replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 96) || fallback;
}
