export function landingHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>glhub — Generation Lineage Hub</title>
  <meta name="description" content="A portable thinking space for evolution review through AI agent generations and evolution documents." />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f6f7f9; color: #171a1f; line-height: 1.55; }
    header { padding: 16px 24px; border-bottom: 1px solid #d9dee7; background: #fff; display: flex; align-items: center; justify-content: space-between; }
    header .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; }
    header .mark { width: 30px; height: 30px; border-radius: 7px; display: grid; place-items: center; background: #12251f; color: #b9f6da; font-size: 12px; font-weight: 700; }
    header .nav a { color: #375dfb; text-decoration: none; font-size: 14px; margin-left: 16px; }
    main { max-width: 760px; margin: 48px auto 64px; padding: 0 20px; }
    h1 { font-size: 32px; line-height: 1.2; margin: 0 0 12px; }
    h1 .tag { color: #68707d; font-weight: 600; font-size: 18px; display: block; margin-top: 6px; }
    p.lede { font-size: 17px; color: #2a3140; margin: 0 0 24px; }
    .cta { display: flex; flex-wrap: wrap; gap: 10px; margin: 28px 0 36px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 15px; border: 1px solid #b9c2d0; background: #fff; color: #171a1f; }
    .btn.primary { background: #12251f; color: #fff; border-color: #12251f; }
    .btn.primary:hover { background: #1c3a30; }
    .btn:hover { background: #f1f4f8; }
    .panel { background: #fff; border: 1px solid #d9dee7; border-radius: 10px; padding: 22px 24px; margin-bottom: 16px; }
    .panel h2 { margin: 0 0 8px; font-size: 16px; }
    .panel p { margin: 0; color: #2a3140; font-size: 15px; }
    .panel + .panel { margin-top: 12px; }
    code { background: #eef1f6; padding: 1px 6px; border-radius: 4px; font-size: 13px; }
    pre { background: #0e1116; color: #d9dee7; padding: 14px; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5; margin: 12px 0 0; }
    footer { color: #68707d; font-size: 13px; padding: 24px 20px 48px; max-width: 760px; margin: 0 auto; border-top: 1px solid #e6e9ee; }
    footer a { color: #375dfb; text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="mark">gl</div>
      <span>glhub</span>
    </div>
    <div class="nav">
      <a href="https://github.com/baryonlabs/glhub" target="_blank" rel="noopener">Source</a>
      <a href="/hongsw/demo">Demo</a>
      <a href="/auth/github/login">Sign in</a>
    </div>
  </header>
  <main>
    <h1>
      Generation Lineage Hub
      <span class="tag">A portable thinking space for evolution review.</span>
    </h1>
    <p class="lede">
      If GitHub is a thinking space for code review through commits and pull
      requests, <strong>glhub</strong> is a thinking space for evolution
      review through generations and evolution documents. AI agent work needs
      more than a final patch, score, or chat transcript — it needs a durable
      record of what changed, what improved, what regressed, and which
      lessons should carry forward.
    </p>
    <div class="cta">
      <a class="btn primary" href="/auth/github/login">Sign in with GitHub</a>
      <a class="btn" href="/hongsw/demo">View demo</a>
      <a class="btn" href="https://github.com/baryonlabs/glhub" target="_blank" rel="noopener">Source on GitHub</a>
    </div>

    <div class="panel">
      <h2>Push from the CLI</h2>
      <p>Capture lineage locally with <code>glctl</code>, then push a snapshot to your own profile here.</p>
      <pre>glctl login
glctl push --remote https://glhub.baryon.ai</pre>
    </div>

    <div class="panel">
      <h2>Forge-neutral by design</h2>
      <p>Attach a project to any forge — GitHub, GitLab, Codeberg, Forgejo, or self-hosted Gitea — and a backlink badge appears next to the lineage. The provider is auto-inferred from the URL.</p>
    </div>

    <div class="panel">
      <h2>Open source, open core</h2>
      <p>Lineage primitives — record, push, view, forge connectors — are Apache-2.0 in the public repo. Multi-user RBAC, SSO, audit-grade compliance, and on-prem ops are part of the commercial tier. See the <a href="https://github.com/baryonlabs/glhub#whats-oss-whats-enterprise" target="_blank" rel="noopener">tier matrix</a>.</p>
    </div>
  </main>
  <footer>
    glhub serves <a href="https://github.com/baryonlabs/glhub" target="_blank" rel="noopener">Nautilus</a> directly. Hosted on Cloudflare Workers + R2 at <code>glhub.baryon.ai</code>.
  </footer>
</body>
</html>`;
}
