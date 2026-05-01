import type { ForgeProvider } from "../core/forge-link.js";
import type { ForgeAdapter } from "./types.js";
import { GitHubAdapter } from "./github.js";
import { GitLabAdapter } from "./gitlab.js";
import { ForgejoAdapter } from "./forgejo.js";

const registry: Partial<Record<ForgeProvider, ForgeAdapter>> = {
  github: GitHubAdapter,
  gitlab: GitLabAdapter,
  forgejo: ForgejoAdapter,
  codeberg: ForgejoAdapter, // Codeberg is a hosted Forgejo instance
};

export function getAdapter(provider: ForgeProvider): ForgeAdapter | null {
  return registry[provider] ?? null;
}

export { GitHubAdapter, GitLabAdapter, ForgejoAdapter };
export type { ForgeAdapter, NormalizedForgeEvent } from "./types.js";
