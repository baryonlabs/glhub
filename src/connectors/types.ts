import type { ForgeProvider } from "../core/forge-link.js";

export type NormalizedForgeEvent = {
  event: string;
  delivery_id: string;
  hook_id: string | null;
  repository_full_name: string | null;
  sender_login: string | null;
  installation_id: number | null;
};

export interface ForgeAdapter {
  readonly provider: ForgeProvider;
  verifyWebhookSignature(secret: string, headers: Headers, rawBody: string): Promise<boolean>;
  parseEvent(headers: Headers, payload: unknown): NormalizedForgeEvent;
  buildBacklinkUrl(repo: string, generationId: string): string;
}
