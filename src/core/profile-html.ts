function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type OwnerProjectEntry = {
  project_id: string;
  claimed_at: string;
  forge_link?: { provider: string; repo: string; url: string } | null;
};

export function profileHtml(opts: {
  owner: string;
  projects: OwnerProjectEntry[];
  viewerLogin: string | null;
}): string {
  const { owner, projects, viewerLogin } = opts;
  const isOwner = viewerLogin === owner;
  const projectList = projects.length
    ? projects
        .map((p) => {
          const forge = p.forge_link
            ? ` <a class="badge" href="${escape(p.forge_link.url)}" target="_blank" rel="noopener">${escape(p.forge_link.provider)} · ${escape(p.forge_link.repo)}</a>`
            : "";
          return `
        <li>
          <a href="/${escape(owner)}/${escape(p.project_id)}">${escape(p.project_id)}</a>${forge}
          <span class="muted"> · claimed ${escape(p.claimed_at.slice(0, 10))}</span>
        </li>`;
        })
        .join("")
    : `<li class="muted">아직 push된 프로젝트가 없습니다.${isOwner ? " <a href=\"/settings\">토큰을 발급</a>한 뒤 첫 push를 보내보세요." : ""}</li>`;

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escape(owner)} — glhub</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #f6f7f9; color: #171a1f; }
    header { padding: 16px 24px; border-bottom: 1px solid #d9dee7; background: #fff; display: flex; align-items: center; justify-content: space-between; }
    header .brand a { color: inherit; text-decoration: none; font-weight: 700; }
    header .who { color: #68707d; font-size: 14px; }
    header .who a { color: #375dfb; }
    main { max-width: 720px; margin: 24px auto; padding: 0 16px; display: grid; gap: 16px; }
    .panel { background: #fff; border: 1px solid #d9dee7; border-radius: 8px; padding: 16px; }
    .panel h1 { margin: 0 0 4px; font-size: 20px; }
    .panel h2 { margin: 12px 0 8px; font-size: 15px; color: #68707d; font-weight: 600; }
    ul { padding-left: 18px; margin: 0; line-height: 1.8; }
    .muted { color: #68707d; font-size: 13px; }
    a { color: #375dfb; }
    .badge { display: inline-block; padding: 1px 8px; margin-left: 6px; border-radius: 12px; background: #eef4ff; color: #1849a9; font-size: 11px; font-weight: 700; text-decoration: none; vertical-align: middle; }
    .badge:hover { background: #dde7ff; }
  </style>
</head>
<body>
  <header>
    <div class="brand"><a href="/">glhub</a></div>
    <div class="who">${
      viewerLogin
        ? `${escape(viewerLogin)} · <a href="/settings">settings</a>`
        : '<a href="/auth/github/login">Sign in</a>'
    }</div>
  </header>
  <main>
    <section class="panel">
      <h1>${escape(owner)}</h1>
      <p class="muted">glhub 프로필 — ${projects.length}개 프로젝트</p>
      <h2>Projects</h2>
      <ul>${projectList}</ul>
    </section>
  </main>
</body>
</html>`;
}
