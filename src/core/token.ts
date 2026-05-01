/// <reference types="@cloudflare/workers-types" />

const encoder = new TextEncoder();

const TOKEN_PREFIX = "glhub_pat_";

export type TokenRecord = {
  user_id: string;
  login: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
};

export function generateToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i] as number);
  const random = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${TOKEN_PREFIX}${random}`;
}

export function isTokenFormat(value: string): boolean {
  return value.startsWith(TOKEN_PREFIX) && value.length >= TOKEN_PREFIX.length + 16;
}

export async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  const arr = new Uint8Array(buf);
  let hex = "";
  for (let i = 0; i < arr.length; i++) hex += (arr[i] as number).toString(16).padStart(2, "0");
  return hex;
}

export async function lookupToken(
  kv: KVNamespace,
  token: string,
): Promise<TokenRecord | null> {
  if (!isTokenFormat(token)) return null;
  const hash = await hashToken(token);
  const raw = await kv.get(`token:${hash}`);
  if (!raw) return null;
  return JSON.parse(raw) as TokenRecord;
}

export async function storeToken(
  kv: KVNamespace,
  token: string,
  record: TokenRecord,
): Promise<string> {
  const hash = await hashToken(token);
  await kv.put(`token:${hash}`, JSON.stringify(record));
  return hash;
}

export async function touchToken(
  kv: KVNamespace,
  hash: string,
  record: TokenRecord,
): Promise<void> {
  const updated = { ...record, last_used_at: new Date().toISOString() };
  await kv.put(`token:${hash}`, JSON.stringify(updated));
}
