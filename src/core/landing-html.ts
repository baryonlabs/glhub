export type Lang = "en" | "ko" | "ja" | "zh";

type Strings = {
  htmlLang: string;
  title: string;
  description: string;
  navSource: string;
  navDemo: string;
  navSignIn: string;
  heroTitle: string;
  heroTagline: string;
  lede: string;
  ctaSignIn: string;
  ctaDemo: string;
  ctaSource: string;
  panel1Title: string;
  panel1Body: string;
  panel2Title: string;
  panel2Body: string;
  panel3Title: string;
  panel3Body: string;
  panel3LinkText: string;
  footer: string;
};

const STRINGS: Record<Lang, Strings> = {
  en: {
    htmlLang: "en",
    title: "glhub — Generation Lineage Hub",
    description: "A portable thinking space for evolution review through AI agent generations and evolution documents.",
    navSource: "Source",
    navDemo: "Demo",
    navSignIn: "Sign in",
    heroTitle: "Generation Lineage Hub",
    heroTagline: "A portable thinking space for evolution review.",
    lede:
      "If GitHub is a thinking space for code review through commits and pull requests, <strong>glhub</strong> is a thinking space for evolution review through generations and evolution documents. AI agent work needs more than a final patch, score, or chat transcript — it needs a durable record of what changed, what improved, what regressed, and which lessons should carry forward.",
    ctaSignIn: "Sign in with GitHub",
    ctaDemo: "View demo",
    ctaSource: "Source on GitHub",
    panel1Title: "Push from the CLI",
    panel1Body: "Capture lineage locally with <code>glctl</code>, then push a snapshot to your own profile here.",
    panel2Title: "Forge-neutral by design",
    panel2Body:
      "Attach a project to any forge — GitHub, GitLab, Codeberg, Forgejo, or self-hosted Gitea — and a backlink badge appears next to the lineage. The provider is auto-inferred from the URL.",
    panel3Title: "Open source, open core",
    panel3Body:
      "Lineage primitives — record, push, view, forge connectors — are Apache-2.0 in the public repo. Multi-user RBAC, SSO, audit-grade compliance, and on-prem ops are part of the commercial tier. See the {LINK}.",
    panel3LinkText: "tier matrix",
    footer:
      "glhub serves <a href=\"https://github.com/baryonlabs/glhub\" target=\"_blank\" rel=\"noopener\">Nautilus</a> directly. Hosted on Cloudflare Workers + R2 at <code>glhub.baryon.ai</code>.",
  },
  ko: {
    htmlLang: "ko",
    title: "glhub — Generation Lineage Hub",
    description: "AI 에이전트의 generation과 evolution document로 진화를 리뷰하는 휴대 가능한 생각 공간.",
    navSource: "소스",
    navDemo: "데모",
    navSignIn: "로그인",
    heroTitle: "Generation Lineage Hub",
    heroTagline: "에볼루션 리뷰를 위한 휴대 가능한 생각 공간.",
    lede:
      "GitHub이 commit과 pull request로 코드를 리뷰하는 생각 공간이라면, <strong>glhub</strong>는 generation과 evolution document로 진화를 리뷰하는 생각 공간이에요. AI 에이전트 작업에는 최종 patch나 score, chat transcript만으로는 부족합니다 — 무엇이 바뀌었는지, 무엇이 개선됐는지, 무엇이 퇴보했는지, 어떤 lesson을 다음 세대로 가져갈지 영속 기록이 필요해요.",
    ctaSignIn: "GitHub으로 로그인",
    ctaDemo: "데모 보기",
    ctaSource: "GitHub 소스",
    panel1Title: "CLI에서 push",
    panel1Body: "<code>glctl</code>로 로컬에서 lineage를 기록한 뒤, 여기 본인 프로필로 snapshot을 push 하세요.",
    panel2Title: "Forge 중립 설계",
    panel2Body:
      "GitHub, GitLab, Codeberg, Forgejo, self-hosted Gitea — 어느 forge든 프로젝트에 연결하면 lineage 옆에 backlink 배지가 표시돼요. provider는 URL에서 자동 추론됩니다.",
    panel3Title: "오픈 소스 + 오픈 코어",
    panel3Body:
      "Lineage 프리미티브 — record, push, view, forge connector — 는 공개 repo에서 Apache-2.0 입니다. Multi-user RBAC, SSO, 감사 등급 컴플라이언스, on-prem 운영은 상용 티어에 포함됩니다. {LINK}를 참고하세요.",
    panel3LinkText: "티어 매트릭스",
    footer:
      "glhub은 <a href=\"https://github.com/baryonlabs/glhub\" target=\"_blank\" rel=\"noopener\">Nautilus</a>에 직접 서빙합니다. <code>glhub.baryon.ai</code>의 Cloudflare Workers + R2에서 호스팅돼요.",
  },
  ja: {
    htmlLang: "ja",
    title: "glhub — Generation Lineage Hub",
    description: "AI エージェントの generation と evolution document で進化をレビューする、移植可能な思考空間。",
    navSource: "ソース",
    navDemo: "デモ",
    navSignIn: "サインイン",
    heroTitle: "Generation Lineage Hub",
    heroTagline: "進化レビューのための移植可能な思考空間。",
    lede:
      "GitHub が commit と pull request でコードをレビューする思考空間なら、<strong>glhub</strong> は generation と evolution document で進化をレビューする思考空間です。AI エージェントの作業には最終的な patch、score、チャット履歴だけでは足りません — 何が変わったか、何が改善されたか、何が後退したか、どの lesson を次世代に渡すべきかという永続的な記録が必要です。",
    ctaSignIn: "GitHub でサインイン",
    ctaDemo: "デモを見る",
    ctaSource: "GitHub のソース",
    panel1Title: "CLI から push",
    panel1Body: "<code>glctl</code> でローカルに lineage を記録し、ここのご自分のプロフィールにスナップショットを push します。",
    panel2Title: "Forge 中立な設計",
    panel2Body:
      "GitHub、GitLab、Codeberg、Forgejo、セルフホストの Gitea — どの forge でもプロジェクトを接続すると、lineage の横に backlink バッジが表示されます。プロバイダは URL から自動推論されます。",
    panel3Title: "オープンソース、オープンコア",
    panel3Body:
      "Lineage プリミティブ — record、push、view、forge connector — は公開リポジトリで Apache-2.0 です。マルチユーザー RBAC、SSO、監査グレードのコンプライアンス、オンプレ運用は商用ティアに含まれます。{LINK}をご覧ください。",
    panel3LinkText: "ティアマトリクス",
    footer:
      "glhub は <a href=\"https://github.com/baryonlabs/glhub\" target=\"_blank\" rel=\"noopener\">Nautilus</a> に直接サーブします。<code>glhub.baryon.ai</code> の Cloudflare Workers + R2 でホストされています。",
  },
  zh: {
    htmlLang: "zh-CN",
    title: "glhub — Generation Lineage Hub",
    description: "通过 AI 代理的 generation 和 evolution document 进行演化审查的可移植思考空间。",
    navSource: "源码",
    navDemo: "演示",
    navSignIn: "登录",
    heroTitle: "Generation Lineage Hub",
    heroTagline: "用于演化审查的可移植思考空间。",
    lede:
      "如果 GitHub 是通过 commit 和 pull request 进行代码审查的思考空间，那么 <strong>glhub</strong> 就是通过 generation 和 evolution document 进行演化审查的思考空间。AI 代理工作需要的不仅是最终补丁、分数或聊天记录 — 它需要持久记录什么变了、什么改进了、什么倒退了，以及哪些经验应该传承下去。",
    ctaSignIn: "使用 GitHub 登录",
    ctaDemo: "查看演示",
    ctaSource: "GitHub 源码",
    panel1Title: "通过 CLI 推送",
    panel1Body: "使用 <code>glctl</code> 在本地记录 lineage，然后将快照推送到这里你的个人资料。",
    panel2Title: "Forge 中立设计",
    panel2Body:
      "将项目连接到任何 forge — GitHub、GitLab、Codeberg、Forgejo 或自托管 Gitea — lineage 旁边会显示 backlink 徽章。提供商根据 URL 自动推断。",
    panel3Title: "开源 + 开放核心",
    panel3Body:
      "Lineage 基本原语 — record、push、view、forge connector — 在公共仓库中遵循 Apache-2.0。多用户 RBAC、SSO、审计级合规和本地部署运维属于商业层级。参见{LINK}。",
    panel3LinkText: "层级矩阵",
    footer:
      "glhub 直接为 <a href=\"https://github.com/baryonlabs/glhub\" target=\"_blank\" rel=\"noopener\">Nautilus</a> 提供服务。在 <code>glhub.baryon.ai</code> 的 Cloudflare Workers + R2 上托管。",
  },
};

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
};

export function detectLang(query: string | null, acceptLanguage: string | null): Lang {
  if (query) {
    const q = query.toLowerCase();
    if (q.startsWith("en")) return "en";
    if (q.startsWith("ko")) return "ko";
    if (q.startsWith("ja")) return "ja";
    if (q.startsWith("zh")) return "zh";
  }
  if (acceptLanguage) {
    const tags = acceptLanguage.split(",").map((t) => t.split(";")[0]?.trim().toLowerCase() || "");
    for (const tag of tags) {
      if (tag.startsWith("ko")) return "ko";
      if (tag.startsWith("ja")) return "ja";
      if (tag.startsWith("zh")) return "zh";
      if (tag.startsWith("en")) return "en";
    }
  }
  return "en";
}

export function landingHtml(lang: Lang = "en"): string {
  const s = STRINGS[lang];
  const tierLink =
    "<a href=\"https://github.com/baryonlabs/glhub#whats-oss-whats-enterprise\" target=\"_blank\" rel=\"noopener\">" +
    s.panel3LinkText +
    "</a>";
  const panel3Body = s.panel3Body.replace("{LINK}", tierLink);
  const langLinks = (Object.keys(LANG_LABELS) as Lang[])
    .map((code) => {
      const cls = code === lang ? "lang-pill active" : "lang-pill";
      return `<a class="${cls}" href="/?lang=${code}">${LANG_LABELS[code]}</a>`;
    })
    .join("");
  return `<!doctype html>
<html lang="${s.htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${s.title}</title>
  <meta name="description" content="${s.description}" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f6f7f9; color: #171a1f; line-height: 1.55; }
    header { padding: 16px 24px; border-bottom: 1px solid #d9dee7; background: #fff; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    header .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; }
    header .mark { width: 30px; height: 30px; border-radius: 7px; display: grid; place-items: center; background: #12251f; color: #b9f6da; font-size: 12px; font-weight: 700; }
    header .nav a { color: #375dfb; text-decoration: none; font-size: 14px; margin-left: 16px; }
    .langbar { display: flex; gap: 4px; padding: 8px 24px; background: #fff; border-bottom: 1px solid #e6e9ee; flex-wrap: wrap; }
    .lang-pill { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: #68707d; text-decoration: none; border: 1px solid transparent; }
    .lang-pill:hover { background: #eef1f6; }
    .lang-pill.active { background: #12251f; color: #fff; }
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
      <a href="https://github.com/baryonlabs/glhub" target="_blank" rel="noopener">${s.navSource}</a>
      <a href="/hongsw/demo">${s.navDemo}</a>
      <a href="/auth/github/login">${s.navSignIn}</a>
    </div>
  </header>
  <nav class="langbar">${langLinks}</nav>
  <main>
    <h1>
      ${s.heroTitle}
      <span class="tag">${s.heroTagline}</span>
    </h1>
    <p class="lede">${s.lede}</p>
    <div class="cta">
      <a class="btn primary" href="/auth/github/login">${s.ctaSignIn}</a>
      <a class="btn" href="/hongsw/demo">${s.ctaDemo}</a>
      <a class="btn" href="https://github.com/baryonlabs/glhub" target="_blank" rel="noopener">${s.ctaSource}</a>
    </div>

    <div class="panel">
      <h2>${s.panel1Title}</h2>
      <p>${s.panel1Body}</p>
      <pre># 1. install (requires Rust toolchain — https://rustup.rs)
cargo install --git https://github.com/baryonlabs/glctl

# 2. authenticate
glctl login

# 3. push your first lineage snapshot
glctl push --remote https://glhub.baryon.ai</pre>
    </div>

    <div class="panel">
      <h2>${s.panel2Title}</h2>
      <p>${s.panel2Body}</p>
    </div>

    <div class="panel">
      <h2>${s.panel3Title}</h2>
      <p>${panel3Body}</p>
    </div>
  </main>
  <footer>${s.footer}</footer>
</body>
</html>`;
}
