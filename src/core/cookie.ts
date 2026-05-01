/// <reference types="@cloudflare/workers-types" />

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i] as number);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array {
  const pad = value.length % 4;
  const padded = value + "=".repeat(pad === 0 ? 0 : 4 - pad);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret) as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function asBuf(data: Uint8Array): BufferSource {
  return data as unknown as BufferSource;
}

export async function signPayload<T>(secret: string, payload: T): Promise<string> {
  const json = JSON.stringify(payload);
  const body = base64urlEncode(encoder.encode(json));
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, asBuf(encoder.encode(body)));
  return `${body}.${base64urlEncode(sig)}`;
}

export async function verifyPayload<T>(secret: string, token: string): Promise<T | null> {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const key = await importKey(secret);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    asBuf(base64urlDecode(sig)),
    asBuf(encoder.encode(body)),
  );
  if (!ok) return null;
  try {
    return JSON.parse(decoder.decode(base64urlDecode(body))) as T;
  } catch {
    return null;
  }
}

export type SessionClaims = { uid: string; login: string; exp: number };
export type OAuthStateClaims = { state: string; exp: number; return_to?: string };

export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(/;\s*/)) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

export type CookieOptions = {
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  path?: string;
};

export function serializeCookie(name: string, value: string, opts: CookieOptions = {}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${opts.path || "/"}`);
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.httpOnly !== false) parts.push("HttpOnly");
  if (opts.secure !== false) parts.push("Secure");
  parts.push(`SameSite=${opts.sameSite || "Lax"}`);
  return parts.join("; ");
}

export function clearCookie(name: string): string {
  return serializeCookie(name, "", { maxAge: 0 });
}

export function randomState(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return base64urlEncode(arr);
}
