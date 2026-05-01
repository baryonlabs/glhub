function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function settingsHtml(opts: {
  login: string | null;
  newToken?: string | null;
  newTokenName?: string | null;
}): string {
  const { login, newToken, newTokenName } = opts;
  const loggedIn = Boolean(login);
  const tokenBlock = newToken
    ? `
      <section class="panel">
        <h2>새 토큰 발급됨${newTokenName ? ` — ${escape(newTokenName)}` : ""}</h2>
        <p class="muted">이 값은 지금 한 번만 표시됩니다. 안전한 곳에 저장하세요.</p>
        <pre class="token">${escape(newToken)}</pre>
        <p class="muted">사용 예 (curl):</p>
        <pre class="cmd">curl -X POST https://glhub.baryon.ai/api/push \\
  -H "Authorization: Bearer ${escape(newToken)}" \\
  -H "Content-Type: application/json" \\
  -d @snapshot.json</pre>
      </section>`
    : "";

  const main = loggedIn
    ? `
      <section class="panel">
        <h2>Personal Access Token 발급</h2>
        <form method="POST" action="/api/tokens" class="stack">
          <label>이름 (메모용)
            <input type="text" name="name" placeholder="예: laptop-glctl" maxlength="64" required />
          </label>
          <button class="primary" type="submit">새 토큰 발급</button>
        </form>
        <p class="muted">발급된 토큰은 <code>Authorization: Bearer …</code> 헤더로 <code>POST /api/push</code>에 사용합니다. 첫 push 시점에 해당 <code>company_id</code>의 owner로 등록되며, 이후 다른 토큰은 같은 <code>company_id</code>에 push 불가합니다.</p>
        <form method="POST" action="/auth/logout"><button type="submit">로그아웃</button></form>
      </section>`
    : `
      <section class="panel">
        <h2>로그인 필요</h2>
        <p>Personal Access Token 발급 및 push에는 GitHub 로그인이 필요합니다.</p>
        <p><a class="btn primary" href="/auth/github/login">Sign in with GitHub</a></p>
      </section>`;

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>glhub — Settings</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #f6f7f9; color: #171a1f; }
    header { padding: 16px 24px; border-bottom: 1px solid #d9dee7; background: #fff; display: flex; align-items: center; justify-content: space-between; }
    header .brand { font-weight: 700; }
    header .who { color: #68707d; font-size: 14px; }
    main { max-width: 720px; margin: 24px auto; padding: 0 16px; display: grid; gap: 16px; }
    .panel { background: #fff; border: 1px solid #d9dee7; border-radius: 8px; padding: 16px; }
    .panel h2 { margin: 0 0 12px; font-size: 16px; }
    .stack { display: grid; gap: 12px; }
    label { display: block; font-size: 13px; color: #68707d; }
    input { width: 100%; height: 36px; padding: 0 10px; border: 1px solid #d9dee7; border-radius: 6px; margin-top: 6px; box-sizing: border-box; }
    button, .btn { display: inline-block; height: 36px; line-height: 36px; padding: 0 14px; border-radius: 6px; border: 1px solid #b9c2d0; background: #fff; color: #171a1f; cursor: pointer; font-weight: 600; text-decoration: none; }
    .primary { background: #12251f; color: #fff; border-color: #12251f; }
    .muted { color: #68707d; font-size: 13px; }
    pre.token, pre.cmd { background: #0e1116; color: #d9dee7; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 13px; }
    a { color: #375dfb; }
  </style>
</head>
<body>
  <header>
    <div class="brand"><a href="/" style="text-decoration:none;color:inherit;">glhub</a> / settings</div>
    <div class="who">${loggedIn ? `${escape(login!)}` : "not signed in"}</div>
  </header>
  <main>
    ${tokenBlock}
    ${main}
  </main>
</body>
</html>`;
}
