export type ForgeProvider =
  | "github"
  | "gitlab"
  | "codeberg"
  | "forgejo"
  | "bitbucket"
  | "custom";

export type ForgeLink = {
  schema_version: "glhub-forge-link/v1";
  company_id: string;
  provider: ForgeProvider;
  repo: string;
  url: string;
  set_by_user_id: string;
  set_by_login: string;
  set_at: string;
};

export function inferProvider(rawUrl: string): { provider: ForgeProvider; repo: string; url: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("invalid forge URL");
  }
  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.replace(/^\/+|\/+$/g, "").replace(/\.git$/, "");
  let provider: ForgeProvider = "custom";
  if (host === "github.com" || host.endsWith(".github.com")) provider = "github";
  else if (host === "gitlab.com" || host.endsWith(".gitlab.com") || host.includes("gitlab")) provider = "gitlab";
  else if (host === "codeberg.org") provider = "codeberg";
  else if (host.includes("forgejo") || host.includes("gitea")) provider = "forgejo";
  else if (host === "bitbucket.org" || host.endsWith(".bitbucket.org")) provider = "bitbucket";
  const segments = path.split("/").filter(Boolean);
  const repo = segments.length >= 2 ? `${segments[0]}/${segments[1]}` : path;
  const canonical = `${parsed.protocol}//${parsed.host}/${repo}`;
  return { provider, repo, url: canonical };
}
