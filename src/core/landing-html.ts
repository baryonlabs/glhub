export type Lang = "en" | "ko" | "ja" | "zh";

type Step = { title: string; body: string; code: string };
type Tier = { name: string; tag: string; items: string[] };

type Strings = {
  htmlLang: string;
  title: string;
  description: string;

  navFeatures: string;
  navHow: string;
  navForges: string;
  navOpenCore: string;
  navSource: string;
  navDemo: string;
  navSignIn: string;

  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroCtaTertiary: string;

  trustGitHubLike: string;
  trustForgeNeutral: string;
  trustOpenSource: string;

  whyTitle: string;
  whyLede: string;

  featuresTitle: string;
  feat1Title: string;
  feat1Body: string;
  feat2Title: string;
  feat2Body: string;
  feat3Title: string;
  feat3Body: string;
  feat4Title: string;
  feat4Body: string;
  feat5Title: string;
  feat5Body: string;
  feat6Title: string;
  feat6Body: string;

  howTitle: string;
  howSubtitle: string;
  step1: Step;
  step2: Step;
  step3: Step;

  forgesTitle: string;
  forgesBody: string;

  openCoreTitle: string;
  openCoreSubtitle: string;
  tierOSS: Tier;
  tierCloud: Tier;
  tierEnterprise: Tier;

  bottomCtaTitle: string;
  bottomCtaBody: string;
  bottomCtaPrimary: string;
  bottomCtaSecondary: string;

  footerProduct: string;
  footerProductLinks: { label: string; href: string }[];
  footerCommunity: string;
  footerCommunityLinks: { label: string; href: string }[];
  footerLegal: string;
  footerLegalLinks: { label: string; href: string }[];
  footerTagline: string;
};

const REPO = "https://github.com/baryonlabs/glhub";

const STRINGS: Record<Lang, Strings> = {
  en: {
    htmlLang: "en",
    title: "glhub — Generation Lineage Hub for AI agent work",
    description: "A portable thinking space for evolution review through AI agent generations and evolution documents.",
    navFeatures: "Features",
    navHow: "How it works",
    navForges: "Forges",
    navOpenCore: "Open core",
    navSource: "Source",
    navDemo: "Demo",
    navSignIn: "Sign in",
    heroEyebrow: "Open source · Forge-neutral · Apache-2.0",
    heroTitle: "Generation Lineage Hub",
    heroSubtitle:
      "If GitHub is a thinking space for code review through commits and pull requests, <strong>glhub</strong> is a thinking space for evolution review through generations and evolution documents. Capture what AI agents change, why, and what carries forward.",
    heroCtaPrimary: "Sign in with GitHub",
    heroCtaSecondary: "Live demo",
    heroCtaTertiary: "Source on GitHub",
    trustGitHubLike: "GitHub-shaped UX for evolution review",
    trustForgeNeutral: "Works with GitHub, GitLab, Codeberg, Forgejo, Gitea",
    trustOpenSource: "Apache-2.0 lineage primitives, open core",
    whyTitle: "Why glhub exists",
    whyLede:
      "AI agent work needs more than a final patch, score, or chat transcript. It needs a durable record of what changed, what improved, what regressed, and which lessons should carry forward. <strong>glhub</strong> stores that lineage portably so it survives a forge migration, a chat session timeout, or a vendor change.",
    featuresTitle: "What you get",
    feat1Title: "Evolution documents",
    feat1Body:
      "Every generation gets a before / transition / after / next document with score deltas, gains, losses, retrospective rules, and bug fixes — not raw JSON.",
    feat2Title: "Forge-neutral by design",
    feat2Body:
      "Attach any GitHub, GitLab, Codeberg, Forgejo, or self-hosted Gitea URL. Provider auto-inferred. The lineage stays portable when forges change.",
    feat3Title: "glctl: Git-like CLI",
    feat3Body:
      "Local YAML-on-disk store, init / new / show / lineage / push commands. <code>glctl login</code> uses GitHub OAuth via loopback flow.",
    feat4Title: "Comments are generations",
    feat4Body:
      "Comments and edits are saved as child generations, never overwriting evolution memory. The audit trail is the product.",
    feat5Title: "Branches for thought experiments",
    feat5Body:
      "<code>branch?: string</code> on every record. Use git worktrees to run parallel agent experiments and compare lineages side-by-side.",
    feat6Title: "Open core, honest matrix",
    feat6Body:
      "Lineage primitives are Apache-2.0 in the public repo. Multi-user RBAC, SSO, audit-grade compliance live in Cloud / Enterprise — clearly separated, no source-available trickery.",
    howTitle: "How it works",
    howSubtitle: "Three steps from local capture to shared lineage.",
    step1: {
      title: "1. Install glctl",
      body: "Install the Rust CLI from source (cargo) or download a release binary.",
      code: "# Requires Rust toolchain — https://rustup.rs\ncargo install --git https://github.com/baryonlabs/glctl",
    },
    step2: {
      title: "2. Authenticate",
      body: "Browser-based GitHub OAuth via loopback. Token saved to ~/.glctl/config — no manual paste.",
      code: "glctl login\n# → Opens browser, GitHub authorizes, token returns to localhost\n# → Token saved to ~/.glctl/config",
    },
    step3: {
      title: "3. Push lineage",
      body: "From any company-scoped lineage repo, push the snapshot to the hosted instance or your self-host.",
      code: "GLCTL_COMPANY_ID=demo \\\nGLCTL_DATA_DIR=$HOME/.glctl/data \\\nglctl push --remote https://glhub.baryon.ai",
    },
    forgesTitle: "Connect any forge",
    forgesBody:
      "First-class adapters for GitHub, GitLab, Codeberg, Forgejo, and self-hosted Gitea. Provider is auto-inferred from any repo URL — no configuration. Webhooks land at <code>/webhooks/{provider}</code> with HMAC verification.",
    openCoreTitle: "Open core, honest about boundaries",
    openCoreSubtitle:
      "Lineage primitives are Apache-2.0. Multi-user, audit-grade, and on-prem features are commercial. Sentry-style separation, not GitLab-style ee/ subdirectory.",
    tierOSS: {
      name: "OSS",
      tag: "Apache-2.0",
      items: [
        "glctl record + push",
        "Self-hosted viewer",
        "Forge connectors (basic)",
        "GitHub OAuth login (preview)",
        "Personal Access Token push",
        "company_id ownership (single owner)",
      ],
    },
    tierCloud: {
      name: "Cloud",
      tag: "Paid hosted",
      items: [
        "Everything in OSS",
        "Multi-user RBAC",
        "SSO (SAML / SCIM / OIDC)",
        "Hosted ops (backup, scaling, SLA)",
        "Multi-tenancy + geo-replication",
        "Org dashboards",
      ],
    },
    tierEnterprise: {
      name: "Enterprise",
      tag: "On-prem + paid",
      items: [
        "Everything in Cloud",
        "Immutable audit log (1y+)",
        "Signed audit pack (cryptographic)",
        "Policy DSL + enforcement gate",
        "Compliance (SOC2 / EU AI Act / NIST AI RMF / HIPAA / ISO 42001)",
        "Air-gapped on-prem package",
      ],
    },
    bottomCtaTitle: "Try the live demo",
    bottomCtaBody:
      "10 generations, all fields populated. See how glhub presents AI evolution as a readable document instead of raw payloads.",
    bottomCtaPrimary: "Open the demo",
    bottomCtaSecondary: "Read the docs",
    footerProduct: "Product",
    footerProductLinks: [
      { label: "Hosted demo", href: "/hongsw/demo" },
      { label: "Profile sample", href: "/hongsw" },
      { label: "Settings", href: "/settings" },
      { label: "API health", href: "/api/health" },
    ],
    footerCommunity: "Community",
    footerCommunityLinks: [
      { label: "Source on GitHub", href: REPO },
      { label: "glctl CLI", href: "https://github.com/baryonlabs/glctl" },
      { label: "Issues", href: REPO + "/issues" },
      { label: "Pull requests", href: REPO + "/pulls" },
    ],
    footerLegal: "Resources",
    footerLegalLinks: [
      { label: "PRD", href: REPO + "/blob/main/docs/PRD.md" },
      { label: "SPEC", href: REPO + "/blob/main/docs/SPEC.md" },
      { label: "License (Apache-2.0)", href: REPO + "/blob/main/LICENSE" },
      { label: "Security", href: REPO + "/blob/main/SECURITY.md" },
    ],
    footerTagline: "glhub serves Nautilus directly. Hosted on Cloudflare Workers + R2.",
  },
  ko: {
    htmlLang: "ko",
    title: "glhub — AI 에이전트의 세대 계보 허브",
    description: "AI 에이전트의 generation과 evolution document로 진화를 리뷰하는 휴대 가능한 생각 공간.",
    navFeatures: "기능",
    navHow: "사용 방법",
    navForges: "포지 연동",
    navOpenCore: "오픈 코어",
    navSource: "소스",
    navDemo: "데모",
    navSignIn: "로그인",
    heroEyebrow: "오픈소스 · 포지 중립 · Apache-2.0",
    heroTitle: "Generation Lineage Hub",
    heroSubtitle:
      "GitHub이 commit과 pull request로 코드 리뷰를 하는 생각 공간이라면, <strong>glhub</strong>는 generation과 evolution document로 진화를 리뷰하는 생각 공간입니다. AI 에이전트가 무엇을 바꿨는지, 왜 바꿨는지, 어떤 교훈이 다음으로 이어지는지를 담아냅니다.",
    heroCtaPrimary: "GitHub으로 로그인",
    heroCtaSecondary: "라이브 데모",
    heroCtaTertiary: "GitHub 소스",
    trustGitHubLike: "GitHub식 진화 리뷰 UX",
    trustForgeNeutral: "GitHub · GitLab · Codeberg · Forgejo · Gitea 모두 지원",
    trustOpenSource: "Apache-2.0 lineage 프리미티브, 오픈 코어",
    whyTitle: "glhub이 왜 필요한가",
    whyLede:
      "AI 에이전트 작업에는 최종 patch, score, chat transcript만으로는 부족합니다. 무엇이 바뀌었고, 무엇이 개선됐고, 무엇이 퇴보했고, 어떤 교훈을 다음 세대로 가져갈지를 영속적으로 기록해야 합니다. <strong>glhub</strong>은 그 lineage를 portable하게 보관해 forge 이전, chat 세션 만료, 벤더 교체에도 살아남도록 합니다.",
    featuresTitle: "무엇을 얻나요",
    feat1Title: "Evolution document",
    feat1Body:
      "모든 generation에 before / transition / after / next 문서를 만들어 score delta, 얻은 것, 잃은 것, 회고 규칙, 잡은 버그까지 보여줍니다. raw JSON이 아닙니다.",
    feat2Title: "포지 중립 설계",
    feat2Body:
      "GitHub · GitLab · Codeberg · Forgejo · self-hosted Gitea — 어느 forge URL이든 붙이면 provider가 자동 추론됩니다. forge가 바뀌어도 lineage는 그대로 따라갑니다.",
    feat3Title: "glctl: Git식 CLI",
    feat3Body:
      "로컬 YAML-on-disk 저장소, init / new / show / lineage / push 명령. <code>glctl login</code>은 GitHub OAuth + loopback 흐름을 사용합니다.",
    feat4Title: "코멘트도 generation",
    feat4Body:
      "코멘트와 수정 제안은 자식 generation으로 저장되어 evolution memory를 절대 덮어쓰지 않습니다. 감사 가능한 흔적 자체가 제품입니다.",
    feat5Title: "사고 실험을 위한 branch",
    feat5Body:
      "모든 record에 <code>branch?: string</code> 필드. git worktree로 평행 에이전트 실험을 돌리고 lineage를 나란히 비교하세요.",
    feat6Title: "정직한 오픈 코어",
    feat6Body:
      "lineage 프리미티브는 공개 repo에서 Apache-2.0. Multi-user RBAC · SSO · 감사 컴플라이언스는 Cloud / Enterprise — 명확히 분리되어 있고 source-available 꼼수 없음.",
    howTitle: "사용 방법",
    howSubtitle: "로컬 기록부터 공유 lineage까지 세 단계.",
    step1: {
      title: "1. glctl 설치",
      body: "Rust toolchain으로 소스에서 설치하거나 릴리스 바이너리를 다운로드하세요.",
      code: "# Rust toolchain 필요 — https://rustup.rs\ncargo install --git https://github.com/baryonlabs/glctl",
    },
    step2: {
      title: "2. 인증",
      body: "브라우저 GitHub OAuth + loopback. 토큰은 ~/.glctl/config에 저장 — 수동 복사 붙여넣기 없음.",
      code: "glctl login\n# → 브라우저 열림 · GitHub 승인 · localhost로 토큰 복귀\n# → ~/.glctl/config에 저장",
    },
    step3: {
      title: "3. lineage push",
      body: "어떤 회사 단위 lineage repo에서든 hosted 또는 self-host로 snapshot을 push.",
      code: "GLCTL_COMPANY_ID=demo \\\nGLCTL_DATA_DIR=$HOME/.glctl/data \\\nglctl push --remote https://glhub.baryon.ai",
    },
    forgesTitle: "어떤 forge든 연결",
    forgesBody:
      "GitHub · GitLab · Codeberg · Forgejo · self-hosted Gitea를 1급 어댑터로 지원합니다. 어떤 repo URL이든 provider가 자동 추론되어 별도 설정이 필요 없습니다. webhook은 <code>/webhooks/{provider}</code>로 들어와 HMAC 검증을 거칩니다.",
    openCoreTitle: "정직한 오픈 코어 경계",
    openCoreSubtitle:
      "lineage 프리미티브는 Apache-2.0. Multi-user · 감사 등급 · on-prem 기능은 상용. GitLab의 ee/ 하위 트릭 대신 Sentry식 분리.",
    tierOSS: {
      name: "OSS",
      tag: "Apache-2.0",
      items: [
        "glctl 기록 + push",
        "셀프 호스팅 viewer",
        "Forge connector (basic)",
        "GitHub OAuth 로그인 (preview)",
        "Personal Access Token push",
        "company_id ownership (단일 소유)",
      ],
    },
    tierCloud: {
      name: "Cloud",
      tag: "유료 호스팅",
      items: [
        "OSS 항목 모두 포함",
        "Multi-user RBAC",
        "SSO (SAML / SCIM / OIDC)",
        "호스팅 운영 (백업 · 스케일 · SLA)",
        "멀티테넌시 + 지역 복제",
        "조직 대시보드",
      ],
    },
    tierEnterprise: {
      name: "Enterprise",
      tag: "On-prem + 유료",
      items: [
        "Cloud 항목 모두 포함",
        "Immutable audit log (1년 이상)",
        "Signed audit pack (암호학적)",
        "Policy DSL + 강제 게이트",
        "컴플라이언스 (SOC2 · EU AI Act · NIST AI RMF · HIPAA · ISO 42001)",
        "에어갭 on-prem 패키지",
      ],
    },
    bottomCtaTitle: "라이브 데모 열기",
    bottomCtaBody:
      "모든 필드가 채워진 10세대 demo. raw payload 대신 읽을 수 있는 문서로 AI 진화가 어떻게 보이는지 확인하세요.",
    bottomCtaPrimary: "데모 열기",
    bottomCtaSecondary: "문서 읽기",
    footerProduct: "제품",
    footerProductLinks: [
      { label: "호스티드 데모", href: "/hongsw/demo" },
      { label: "프로필 샘플", href: "/hongsw" },
      { label: "설정", href: "/settings" },
      { label: "API health", href: "/api/health" },
    ],
    footerCommunity: "커뮤니티",
    footerCommunityLinks: [
      { label: "GitHub 소스", href: REPO },
      { label: "glctl CLI", href: "https://github.com/baryonlabs/glctl" },
      { label: "이슈", href: REPO + "/issues" },
      { label: "Pull request", href: REPO + "/pulls" },
    ],
    footerLegal: "리소스",
    footerLegalLinks: [
      { label: "PRD", href: REPO + "/blob/main/docs/PRD.md" },
      { label: "SPEC", href: REPO + "/blob/main/docs/SPEC.md" },
      { label: "라이선스 (Apache-2.0)", href: REPO + "/blob/main/LICENSE" },
      { label: "보안", href: REPO + "/blob/main/SECURITY.md" },
    ],
    footerTagline: "glhub은 Nautilus에 직접 서빙합니다. Cloudflare Workers + R2 호스팅.",
  },
  ja: {
    htmlLang: "ja",
    title: "glhub — AI エージェント作業の世代系譜ハブ",
    description: "AI エージェントの generation と evolution document で進化をレビューする、移植可能な思考空間。",
    navFeatures: "機能",
    navHow: "使い方",
    navForges: "Forge 連携",
    navOpenCore: "オープンコア",
    navSource: "ソース",
    navDemo: "デモ",
    navSignIn: "サインイン",
    heroEyebrow: "オープンソース · Forge 中立 · Apache-2.0",
    heroTitle: "Generation Lineage Hub",
    heroSubtitle:
      "GitHub が commit と pull request でコードレビューをする思考空間なら、<strong>glhub</strong> は generation と evolution document で進化をレビューする思考空間です。AI エージェントが何を変え、なぜ変え、どの教訓が次へ受け継がれるかを残します。",
    heroCtaPrimary: "GitHub でサインイン",
    heroCtaSecondary: "ライブデモ",
    heroCtaTertiary: "GitHub のソース",
    trustGitHubLike: "GitHub 風の進化レビュー UX",
    trustForgeNeutral: "GitHub · GitLab · Codeberg · Forgejo · Gitea すべて対応",
    trustOpenSource: "Apache-2.0 lineage プリミティブ、オープンコア",
    whyTitle: "なぜ glhub が必要か",
    whyLede:
      "AI エージェント作業には最終的な patch、score、チャット履歴だけでは足りません。何が変わり、何が改善され、何が後退し、どの教訓を次世代へ渡すかを永続的に記録する必要があります。<strong>glhub</strong> はその lineage を移植可能な形で保管し、forge 移行、セッションのタイムアウト、ベンダー変更にも生き残ります。",
    featuresTitle: "得られるもの",
    feat1Title: "Evolution document",
    feat1Body:
      "すべての generation に before / transition / after / next のドキュメントを作り、score の差分、得たもの、失ったもの、retrospective ルール、修正したバグまで表示します。生の JSON ではありません。",
    feat2Title: "Forge 中立な設計",
    feat2Body:
      "GitHub · GitLab · Codeberg · Forgejo · セルフホストの Gitea — どの forge URL でも provider が自動推論されます。forge が変わっても lineage はそのままついていきます。",
    feat3Title: "glctl: Git ライク CLI",
    feat3Body:
      "ローカル YAML-on-disk ストア、init / new / show / lineage / push コマンド。<code>glctl login</code> は GitHub OAuth + loopback フローを使います。",
    feat4Title: "コメントも generation",
    feat4Body:
      "コメントと修正提案は子 generation として保存され、evolution memory を上書きしません。監査可能な軌跡そのものが製品です。",
    feat5Title: "思考実験のための branch",
    feat5Body:
      "全レコードに <code>branch?: string</code> フィールド。git worktree で並列のエージェント実験を走らせ、lineage を並べて比較できます。",
    feat6Title: "正直なオープンコア",
    feat6Body:
      "lineage プリミティブは公開リポジトリで Apache-2.0。マルチユーザー RBAC · SSO · 監査グレードのコンプライアンスは Cloud / Enterprise — 明確に分離、source-available の小細工なし。",
    howTitle: "使い方",
    howSubtitle: "ローカル記録から共有 lineage まで 3 ステップ。",
    step1: {
      title: "1. glctl をインストール",
      body: "Rust toolchain でソースからインストール、もしくはリリースバイナリをダウンロード。",
      code: "# Rust toolchain が必要 — https://rustup.rs\ncargo install --git https://github.com/baryonlabs/glctl",
    },
    step2: {
      title: "2. 認証",
      body: "ブラウザの GitHub OAuth + loopback。トークンは ~/.glctl/config に保存 — 手動コピペなし。",
      code: "glctl login\n# → ブラウザが開く · GitHub が承認 · localhost にトークン返却\n# → ~/.glctl/config に保存",
    },
    step3: {
      title: "3. lineage を push",
      body: "任意の company-scoped lineage リポから hosted または self-host にスナップショットを push。",
      code: "GLCTL_COMPANY_ID=demo \\\nGLCTL_DATA_DIR=$HOME/.glctl/data \\\nglctl push --remote https://glhub.baryon.ai",
    },
    forgesTitle: "どの forge にも接続",
    forgesBody:
      "GitHub · GitLab · Codeberg · Forgejo · セルフホスト Gitea を一級アダプタとして提供。どの repo URL でも provider が自動推論され、設定不要です。webhook は <code>/webhooks/{provider}</code> に届き HMAC 検証されます。",
    openCoreTitle: "境界を正直に引いたオープンコア",
    openCoreSubtitle:
      "lineage プリミティブは Apache-2.0。マルチユーザー · 監査グレード · on-prem 機能は商用。GitLab の ee/ 配下トリックではなく Sentry 風の分離。",
    tierOSS: {
      name: "OSS",
      tag: "Apache-2.0",
      items: [
        "glctl 記録 + push",
        "セルフホスト viewer",
        "Forge connector (basic)",
        "GitHub OAuth ログイン (preview)",
        "Personal Access Token push",
        "company_id ownership (単一所有)",
      ],
    },
    tierCloud: {
      name: "Cloud",
      tag: "有料ホスティング",
      items: [
        "OSS 項目をすべて含む",
        "マルチユーザー RBAC",
        "SSO (SAML / SCIM / OIDC)",
        "ホスト運用 (バックアップ · スケール · SLA)",
        "マルチテナント + 地域レプリケーション",
        "組織ダッシュボード",
      ],
    },
    tierEnterprise: {
      name: "Enterprise",
      tag: "On-prem + 有料",
      items: [
        "Cloud 項目をすべて含む",
        "Immutable audit log (1 年以上)",
        "Signed audit pack (暗号学的)",
        "Policy DSL + 強制ゲート",
        "コンプライアンス (SOC2 · EU AI Act · NIST AI RMF · HIPAA · ISO 42001)",
        "エアギャップ on-prem パッケージ",
      ],
    },
    bottomCtaTitle: "ライブデモを開く",
    bottomCtaBody:
      "全フィールドが埋まった 10 世代 demo。生 payload ではなく、読めるドキュメントとして AI 進化がどう見えるかを確認できます。",
    bottomCtaPrimary: "デモを開く",
    bottomCtaSecondary: "ドキュメントを読む",
    footerProduct: "プロダクト",
    footerProductLinks: [
      { label: "ホスト型デモ", href: "/hongsw/demo" },
      { label: "プロフィール例", href: "/hongsw" },
      { label: "設定", href: "/settings" },
      { label: "API health", href: "/api/health" },
    ],
    footerCommunity: "コミュニティ",
    footerCommunityLinks: [
      { label: "GitHub のソース", href: REPO },
      { label: "glctl CLI", href: "https://github.com/baryonlabs/glctl" },
      { label: "Issues", href: REPO + "/issues" },
      { label: "Pull request", href: REPO + "/pulls" },
    ],
    footerLegal: "リソース",
    footerLegalLinks: [
      { label: "PRD", href: REPO + "/blob/main/docs/PRD.md" },
      { label: "SPEC", href: REPO + "/blob/main/docs/SPEC.md" },
      { label: "ライセンス (Apache-2.0)", href: REPO + "/blob/main/LICENSE" },
      { label: "セキュリティ", href: REPO + "/blob/main/SECURITY.md" },
    ],
    footerTagline: "glhub は Nautilus に直接サーブします。Cloudflare Workers + R2 でホストされています。",
  },
  zh: {
    htmlLang: "zh-CN",
    title: "glhub — AI 代理工作的世代谱系中心",
    description: "通过 AI 代理的 generation 和 evolution document 进行演化审查的可移植思考空间。",
    navFeatures: "功能",
    navHow: "使用方法",
    navForges: "Forge 集成",
    navOpenCore: "开放核心",
    navSource: "源码",
    navDemo: "演示",
    navSignIn: "登录",
    heroEyebrow: "开源 · Forge 中立 · Apache-2.0",
    heroTitle: "Generation Lineage Hub",
    heroSubtitle:
      "如果 GitHub 是通过 commit 和 pull request 进行代码审查的思考空间，那么 <strong>glhub</strong> 就是通过 generation 和 evolution document 进行演化审查的思考空间。捕获 AI 代理改了什么、为什么改、哪些经验需要传承下去。",
    heroCtaPrimary: "使用 GitHub 登录",
    heroCtaSecondary: "实时演示",
    heroCtaTertiary: "GitHub 源码",
    trustGitHubLike: "GitHub 风格的演化审查 UX",
    trustForgeNeutral: "支持 GitHub · GitLab · Codeberg · Forgejo · Gitea",
    trustOpenSource: "Apache-2.0 lineage 原语，开放核心",
    whyTitle: "glhub 为什么必要",
    whyLede:
      "AI 代理工作不能只靠最终补丁、分数或聊天记录。需要持久记录什么变了、什么改进了、什么倒退了，以及哪些经验应该传承下去。<strong>glhub</strong> 把这种 lineage 以可移植的方式存储，让它能在 forge 迁移、聊天会话超时、供应商更换中存活。",
    featuresTitle: "你能得到什么",
    feat1Title: "Evolution document",
    feat1Body:
      "为每个 generation 生成 before / transition / after / next 文档，显示 score 差异、收益、损失、retrospective 规则和修复的 bug — 不是裸 JSON。",
    feat2Title: "Forge 中立设计",
    feat2Body:
      "GitHub · GitLab · Codeberg · Forgejo · 自托管 Gitea — 任何 forge URL 都会自动推断 provider。即使 forge 变更，lineage 也跟着走。",
    feat3Title: "glctl: 类 Git CLI",
    feat3Body:
      "本地 YAML-on-disk 存储，init / new / show / lineage / push 命令。<code>glctl login</code> 使用 GitHub OAuth + loopback 流程。",
    feat4Title: "评论即 generation",
    feat4Body:
      "评论和修改建议保存为子 generation，绝不覆盖 evolution memory。可审计的轨迹本身就是产品。",
    feat5Title: "用于思想实验的 branch",
    feat5Body:
      "每条记录都有 <code>branch?: string</code> 字段。用 git worktree 跑并行代理实验，把 lineage 并排比较。",
    feat6Title: "诚实的开放核心",
    feat6Body:
      "lineage 原语在公共仓库中遵循 Apache-2.0。Multi-user RBAC · SSO · 审计级合规属于 Cloud / Enterprise — 明确分离，没有 source-available 的小把戏。",
    howTitle: "使用方法",
    howSubtitle: "从本地记录到共享 lineage 共三步。",
    step1: {
      title: "1. 安装 glctl",
      body: "用 Rust toolchain 从源码安装，或下载发行版二进制。",
      code: "# 需要 Rust toolchain — https://rustup.rs\ncargo install --git https://github.com/baryonlabs/glctl",
    },
    step2: {
      title: "2. 认证",
      body: "浏览器 GitHub OAuth + loopback。Token 保存到 ~/.glctl/config — 无需手动粘贴。",
      code: "glctl login\n# → 浏览器打开 · GitHub 授权 · token 返回 localhost\n# → 保存到 ~/.glctl/config",
    },
    step3: {
      title: "3. 推送 lineage",
      body: "从任何 company-scoped lineage 仓库，把快照推送到托管实例或自托管。",
      code: "GLCTL_COMPANY_ID=demo \\\nGLCTL_DATA_DIR=$HOME/.glctl/data \\\nglctl push --remote https://glhub.baryon.ai",
    },
    forgesTitle: "连接任何 forge",
    forgesBody:
      "GitHub · GitLab · Codeberg · Forgejo · 自托管 Gitea 都是一级适配器。任何 repo URL 都会自动推断 provider，无需配置。Webhook 进入 <code>/webhooks/{provider}</code> 并经过 HMAC 验证。",
    openCoreTitle: "诚实划清边界的开放核心",
    openCoreSubtitle:
      "lineage 原语为 Apache-2.0。Multi-user · 审计级 · on-prem 功能为商业版。Sentry 风格的分离，而非 GitLab ee/ 子目录的伎俩。",
    tierOSS: {
      name: "OSS",
      tag: "Apache-2.0",
      items: [
        "glctl 记录 + push",
        "自托管 viewer",
        "Forge 连接器 (基础版)",
        "GitHub OAuth 登录 (preview)",
        "Personal Access Token push",
        "company_id ownership (单一所有者)",
      ],
    },
    tierCloud: {
      name: "Cloud",
      tag: "付费托管",
      items: [
        "包含所有 OSS 项",
        "Multi-user RBAC",
        "SSO (SAML / SCIM / OIDC)",
        "托管运维 (备份 · 扩展 · SLA)",
        "多租户 + 地理复制",
        "组织看板",
      ],
    },
    tierEnterprise: {
      name: "Enterprise",
      tag: "On-prem + 付费",
      items: [
        "包含所有 Cloud 项",
        "Immutable audit log (1 年以上)",
        "Signed audit pack (密码学)",
        "Policy DSL + 强制门控",
        "合规 (SOC2 · EU AI Act · NIST AI RMF · HIPAA · ISO 42001)",
        "气隙 on-prem 包",
      ],
    },
    bottomCtaTitle: "打开实时演示",
    bottomCtaBody:
      "所有字段都填满的 10 世代 demo。看 glhub 如何把 AI 演化呈现为可读文档而不是裸 payload。",
    bottomCtaPrimary: "打开演示",
    bottomCtaSecondary: "阅读文档",
    footerProduct: "产品",
    footerProductLinks: [
      { label: "托管演示", href: "/hongsw/demo" },
      { label: "示例资料", href: "/hongsw" },
      { label: "设置", href: "/settings" },
      { label: "API health", href: "/api/health" },
    ],
    footerCommunity: "社区",
    footerCommunityLinks: [
      { label: "GitHub 源码", href: REPO },
      { label: "glctl CLI", href: "https://github.com/baryonlabs/glctl" },
      { label: "Issues", href: REPO + "/issues" },
      { label: "Pull request", href: REPO + "/pulls" },
    ],
    footerLegal: "资源",
    footerLegalLinks: [
      { label: "PRD", href: REPO + "/blob/main/docs/PRD.md" },
      { label: "SPEC", href: REPO + "/blob/main/docs/SPEC.md" },
      { label: "许可证 (Apache-2.0)", href: REPO + "/blob/main/LICENSE" },
      { label: "安全", href: REPO + "/blob/main/SECURITY.md" },
    ],
    footerTagline: "glhub 直接为 Nautilus 提供服务。在 Cloudflare Workers + R2 上托管。",
  },
};

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
  zh: "中文",
};

const FORGE_BADGES = ["GitHub", "GitLab", "Codeberg", "Forgejo", "Gitea", "Bitbucket"];

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

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function landingHtml(lang: Lang = "en"): string {
  const s = STRINGS[lang];

  const langLinks = (Object.keys(LANG_LABELS) as Lang[])
    .map((code) => {
      const cls = code === lang ? "lang-pill active" : "lang-pill";
      return `<a class="${cls}" href="/?lang=${code}">${LANG_LABELS[code]}</a>`;
    })
    .join("");

  const forgeBadges = FORGE_BADGES.map((name) => `<span class="forge-badge">${name}</span>`).join("");

  const renderStep = (step: Step, n: number) => `
    <div class="step">
      <div class="step-num">${n}</div>
      <div class="step-body">
        <h3>${step.title.replace(/^\d+\.\s*/, "")}</h3>
        <p>${step.body}</p>
        <pre><code>${escapeHtml(step.code)}</code></pre>
      </div>
    </div>`;

  const renderTier = (tier: Tier, accent: "oss" | "cloud" | "enterprise") => `
    <div class="tier tier-${accent}">
      <div class="tier-head">
        <div class="tier-name">${tier.name}</div>
        <div class="tier-tag">${tier.tag}</div>
      </div>
      <ul>
        ${tier.items.map((it) => `<li>${it}</li>`).join("")}
      </ul>
    </div>`;

  const renderFooterCol = (title: string, links: { label: string; href: string }[]) => `
    <div class="footer-col">
      <div class="footer-head">${title}</div>
      <ul>${links.map((l) => `<li><a href="${l.href}"${l.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${l.label}</a></li>`).join("")}</ul>
    </div>`;

  return `<!doctype html>
<html lang="${s.htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${s.title}</title>
  <meta name="description" content="${s.description}" />
  <meta property="og:title" content="${s.title}" />
  <meta property="og:description" content="${s.description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://glhub.baryon.ai/" />
  <style>
    * { box-sizing: border-box; }
    :root {
      --bg: #f6f7f9;
      --panel: #ffffff;
      --ink: #0f172a;
      --ink-soft: #2a3140;
      --muted: #64748b;
      --line: #e2e8f0;
      --line-strong: #cbd5e1;
      --accent: #12251f;
      --accent-2: #375dfb;
      --good: #067647;
      --warn: #b54708;
      --code-bg: #0e1116;
      --code-ink: #d9dee7;
    }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent-2); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ---- header ---- */
    header.site {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: saturate(140%) blur(8px);
      background: rgba(255, 255, 255, 0.85);
      border-bottom: 1px solid var(--line);
    }
    .site-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      color: var(--ink);
      font-size: 16px;
    }
    .brand .mark {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      display: grid;
      place-items: center;
      background: var(--accent);
      color: #b9f6da;
      font-size: 11px;
      font-weight: 700;
    }
    nav.primary {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 18px;
      margin-left: 18px;
    }
    nav.primary a {
      color: var(--ink-soft);
      font-size: 14px;
      font-weight: 500;
    }
    nav.primary a:hover { color: var(--accent-2); text-decoration: none; }
    .header-right { display: flex; align-items: center; gap: 8px; }
    .header-right .btn { font-size: 13px; height: 32px; padding: 0 12px; }
    @media (max-width: 820px) {
      nav.primary { display: none; }
    }

    .langbar {
      display: flex;
      gap: 4px;
      padding: 6px 24px;
      background: rgba(255,255,255,0.7);
      border-bottom: 1px solid var(--line);
      max-width: 1100px;
      margin: 0 auto;
      flex-wrap: wrap;
    }
    .lang-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      border: 1px solid transparent;
    }
    .lang-pill:hover { background: #eef1f6; text-decoration: none; }
    .lang-pill.active { background: var(--accent); color: #fff; }

    /* ---- generic blocks ---- */
    section { max-width: 1100px; margin: 0 auto; padding: 64px 24px; }
    section.tight { padding: 36px 24px; }
    h1 { font-size: 56px; line-height: 1.05; margin: 0 0 16px; letter-spacing: -0.02em; font-weight: 800; }
    h2 { font-size: 30px; margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.01em; font-weight: 700; }
    h3 { font-size: 18px; margin: 0 0 8px; font-weight: 700; }
    p { margin: 0 0 12px; color: var(--ink-soft); font-size: 16px; }
    .lede { font-size: 18px; max-width: 720px; }
    .eyebrow {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: #eef4ff;
      color: #1849a9;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin-bottom: 18px;
    }

    /* ---- hero ---- */
    .hero {
      padding-top: 72px;
      padding-bottom: 48px;
      background: radial-gradient(circle at 20% 0%, #eaf3ff 0%, transparent 55%),
                  radial-gradient(circle at 80% 0%, #e8fff3 0%, transparent 50%);
    }
    .hero h1 { max-width: 880px; }
    .hero p.lede { max-width: 720px; margin-bottom: 28px; }
    .cta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 44px;
      padding: 0 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      border: 1px solid var(--line-strong);
      background: #fff;
      color: var(--ink);
      transition: all 120ms ease;
    }
    .btn:hover { background: #f1f4f8; text-decoration: none; transform: translateY(-1px); }
    .btn.primary {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }
    .btn.primary:hover { background: #1c3a30; }
    .btn.ghost { background: transparent; }

    .trust-strip {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      color: var(--muted);
      font-size: 13px;
      padding-top: 16px;
      border-top: 1px solid var(--line);
    }
    .trust-strip span { display: inline-flex; align-items: center; gap: 6px; }
    .trust-strip span::before {
      content: "✓";
      color: var(--good);
      font-weight: 700;
    }

    .hero-shot {
      margin-top: 36px;
      border: 1px solid var(--line);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 24px 48px -24px rgba(15, 23, 42, 0.18);
      background: #fff;
    }
    .hero-shot img { display: block; width: 100%; height: auto; }

    /* ---- features ---- */
    .features { background: #fff; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
      margin-top: 24px;
    }
    @media (max-width: 820px) { .features-grid { grid-template-columns: 1fr; } }
    .feat-card {
      padding: 22px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fbfcfe;
      transition: transform 120ms ease, box-shadow 120ms ease;
    }
    .feat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 32px -24px rgba(15, 23, 42, 0.18);
    }
    .feat-card h3 { color: var(--ink); }
    .feat-card p { color: var(--ink-soft); margin: 0; font-size: 14px; line-height: 1.55; }
    .feat-card code {
      font-size: 12px;
      background: #eef1f6;
      padding: 1px 6px;
      border-radius: 4px;
    }

    /* ---- how it works ---- */
    .how { background: var(--bg); }
    .steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
      margin-top: 28px;
    }
    @media (max-width: 820px) { .steps { grid-template-columns: 1fr; } }
    .step {
      display: grid;
      grid-template-columns: 36px 1fr;
      gap: 12px;
      padding: 22px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 12px;
    }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: var(--accent);
      color: #b9f6da;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 14px;
    }
    .step h3 { margin-bottom: 4px; }
    .step p { font-size: 14px; margin-bottom: 12px; }
    .step pre {
      background: var(--code-bg);
      color: var(--code-ink);
      border-radius: 8px;
      padding: 12px 14px;
      overflow-x: auto;
      font-size: 12.5px;
      line-height: 1.6;
      margin: 0;
    }
    .step code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

    /* ---- forges ---- */
    .forges-band {
      background: #fff;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .forge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }
    .forge-badge {
      padding: 8px 14px;
      border-radius: 999px;
      background: #f1f4f8;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-soft);
      border: 1px solid var(--line);
    }

    /* ---- open core ---- */
    .open-core { background: var(--bg); }
    .tiers {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 28px;
    }
    @media (max-width: 820px) { .tiers { grid-template-columns: 1fr; } }
    .tier {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .tier-oss { border-top: 4px solid var(--good); }
    .tier-cloud { border-top: 4px solid var(--accent-2); }
    .tier-enterprise { border-top: 4px solid var(--warn); }
    .tier-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
    .tier-name { font-size: 20px; font-weight: 800; color: var(--ink); }
    .tier-tag { font-size: 12px; color: var(--muted); font-weight: 600; }
    .tier ul { margin: 0; padding-left: 18px; line-height: 1.85; font-size: 14px; color: var(--ink-soft); }

    /* ---- bottom cta ---- */
    .bottom-cta {
      background: var(--accent);
      color: #fff;
      text-align: center;
    }
    .bottom-cta h2, .bottom-cta p { color: #fff; }
    .bottom-cta .btn { color: var(--ink); }
    .bottom-cta .btn.primary { background: #fff; color: var(--accent); border-color: #fff; }
    .bottom-cta .btn.primary:hover { background: #f1f4f8; }
    .bottom-cta .btn.ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.4); }
    .bottom-cta .btn.ghost:hover { background: rgba(255,255,255,0.08); }
    .bottom-cta .cta-row { justify-content: center; margin-top: 24px; }
    .bottom-cta p { max-width: 640px; margin-left: auto; margin-right: auto; }

    /* ---- footer ---- */
    footer.site {
      background: #0f172a;
      color: #cbd5e1;
      padding: 48px 24px 32px;
    }
    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.4fr repeat(3, 1fr);
      gap: 32px;
    }
    @media (max-width: 820px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
    .footer-brand { display: flex; flex-direction: column; gap: 12px; }
    .footer-brand .brand { color: #fff; }
    .footer-tagline { color: #94a3b8; font-size: 13px; line-height: 1.55; }
    .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
    .footer-col a { color: #cbd5e1; font-size: 14px; }
    .footer-col a:hover { color: #fff; }
    .footer-head { font-weight: 700; color: #fff; margin-bottom: 10px; font-size: 14px; }
    .footer-bottom {
      max-width: 1100px;
      margin: 32px auto 0;
      padding-top: 20px;
      border-top: 1px solid #1e293b;
      color: #64748b;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .feat-card, .btn { transition: none; }
    }
  </style>
</head>
<body>
  <header class="site">
    <div class="site-inner">
      <a class="brand" href="/">
        <span class="mark">gl</span>
        <span>glhub</span>
      </a>
      <nav class="primary">
        <a href="#features">${s.navFeatures}</a>
        <a href="#how">${s.navHow}</a>
        <a href="#forges">${s.navForges}</a>
        <a href="#open-core">${s.navOpenCore}</a>
        <a href="${REPO}" target="_blank" rel="noopener">${s.navSource}</a>
        <a href="/hongsw/demo">${s.navDemo}</a>
      </nav>
      <div class="header-right">
        <a class="btn primary" href="/auth/github/login">${s.navSignIn}</a>
      </div>
    </div>
    <div class="langbar">${langLinks}</div>
  </header>

  <section class="hero">
    <div class="eyebrow">${s.heroEyebrow}</div>
    <h1>${s.heroTitle}</h1>
    <p class="lede">${s.heroSubtitle}</p>
    <div class="cta-row">
      <a class="btn primary" href="/auth/github/login">${s.heroCtaPrimary}</a>
      <a class="btn" href="/hongsw/demo">${s.heroCtaSecondary}</a>
      <a class="btn ghost" href="${REPO}" target="_blank" rel="noopener">${s.heroCtaTertiary}</a>
    </div>
    <div class="trust-strip">
      <span>${s.trustGitHubLike}</span>
      <span>${s.trustForgeNeutral}</span>
      <span>${s.trustOpenSource}</span>
    </div>
    <a class="hero-shot" href="/hongsw/demo">
      <img src="https://raw.githubusercontent.com/baryonlabs/glhub/main/assets/screenshots/viewer-demo.png" alt="${s.heroTitle}" loading="lazy" />
    </a>
  </section>

  <section class="features" id="features">
    <h2>${s.featuresTitle}</h2>
    <div class="features-grid">
      <div class="feat-card"><h3>${s.feat1Title}</h3><p>${s.feat1Body}</p></div>
      <div class="feat-card"><h3>${s.feat2Title}</h3><p>${s.feat2Body}</p></div>
      <div class="feat-card"><h3>${s.feat3Title}</h3><p>${s.feat3Body}</p></div>
      <div class="feat-card"><h3>${s.feat4Title}</h3><p>${s.feat4Body}</p></div>
      <div class="feat-card"><h3>${s.feat5Title}</h3><p>${s.feat5Body}</p></div>
      <div class="feat-card"><h3>${s.feat6Title}</h3><p>${s.feat6Body}</p></div>
    </div>
  </section>

  <section class="how" id="how">
    <h2>${s.howTitle}</h2>
    <p class="lede">${s.howSubtitle}</p>
    <div class="steps">
      ${renderStep(s.step1, 1)}
      ${renderStep(s.step2, 2)}
      ${renderStep(s.step3, 3)}
    </div>
  </section>

  <section class="forges-band tight" id="forges">
    <h2>${s.forgesTitle}</h2>
    <p class="lede">${s.forgesBody}</p>
    <div class="forge-list">${forgeBadges}</div>
  </section>

  <section class="open-core" id="open-core">
    <h2>${s.openCoreTitle}</h2>
    <p class="lede">${s.openCoreSubtitle}</p>
    <div class="tiers">
      ${renderTier(s.tierOSS, "oss")}
      ${renderTier(s.tierCloud, "cloud")}
      ${renderTier(s.tierEnterprise, "enterprise")}
    </div>
  </section>

  <section class="bottom-cta">
    <h2>${s.bottomCtaTitle}</h2>
    <p>${s.bottomCtaBody}</p>
    <div class="cta-row">
      <a class="btn primary" href="/hongsw/demo">${s.bottomCtaPrimary}</a>
      <a class="btn ghost" href="${REPO}/blob/main/README.md" target="_blank" rel="noopener">${s.bottomCtaSecondary}</a>
    </div>
  </section>

  <footer class="site">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="brand">
          <span class="mark">gl</span>
          <span>glhub</span>
        </div>
        <div class="footer-tagline">${s.footerTagline}</div>
      </div>
      ${renderFooterCol(s.footerProduct, s.footerProductLinks)}
      ${renderFooterCol(s.footerCommunity, s.footerCommunityLinks)}
      ${renderFooterCol(s.footerLegal, s.footerLegalLinks)}
    </div>
    <div class="footer-bottom">
      <span>© 2026 baryonlabs · Apache-2.0</span>
      <span>v0.1 preview · glhub.baryon.ai</span>
    </div>
  </footer>
</body>
</html>`;
}
