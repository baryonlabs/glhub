export type GitHubUser = {
  id: number;
  login: string;
  name?: string | null;
  avatar_url?: string;
};

export function authorizeUrl(clientId: string, state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "read:user",
    allow_signup: "true",
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCode(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "glhub-worker",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub token exchange failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    throw new Error(`GitHub token exchange returned no access_token${data.error ? `: ${data.error}` : ""}`);
  }
  return data.access_token;
}

export async function fetchUser(accessToken: string): Promise<GitHubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/vnd.github+json",
      "user-agent": "glhub-worker",
    },
  });
  if (!res.ok) throw new Error(`GitHub /user failed: ${res.status}`);
  return (await res.json()) as GitHubUser;
}
