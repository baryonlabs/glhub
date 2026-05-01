export function indexHtml(): string {
  return `<!doctype html>
  <html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>glhub</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f9;
      --panel: #ffffff;
      --ink: #171a1f;
      --muted: #68707d;
      --line: #d9dee7;
      --accent: #1f7a5b;
      --accent-2: #375dfb;
      --doc-left: #375dfb;
      --doc-left-bg: #f2f5ff;
      --doc-left-soft: #e6ebff;
      --doc-right: #1f7a5b;
      --doc-right-bg: #edfdf6;
      --doc-right-soft: #d9f8ea;
      --bad: #b42318;
      --good: #067647;
      --warn: #b54708;
      --shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
    }
    header {
      min-height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      padding: 0 24px;
      border-bottom: 1px solid var(--line);
      background: #fff;
    }
    .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; }
    .mark {
      width: 34px; height: 34px; border-radius: 8px;
      display: grid; place-items: center;
      background: #12251f; color: #b9f6da; font-size: 13px;
    }
    .shell { min-height: calc(100vh - 64px); }
    main { padding: 22px; display: grid; gap: 16px; align-content: start; }
    label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
    input, select {
      width: 100%;
      height: 36px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 0 10px;
      background: #fff;
      color: var(--ink);
    }
    button {
      height: 36px;
      border: 1px solid #b9c2d0;
      background: #fff;
      color: var(--ink);
      border-radius: 6px;
      padding: 0 12px;
      cursor: pointer;
      font-weight: 600;
    }
    button.primary { background: #12251f; color: #fff; border-color: #12251f; }
    button:disabled { opacity: .5; cursor: not-allowed; }
    .stack { display: grid; gap: 12px; }
    .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }
    .panel h2 {
      margin: 0;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line);
      font-size: 15px;
    }
    .panel-body { padding: 16px; }
    .evo-doc { display: grid; gap: 14px; }
    .evo-title { font-size: 19px; font-weight: 780; line-height: 1.25; }
    .evo-flow {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 42px minmax(0, 1fr);
      gap: 12px;
      align-items: stretch;
    }
    .evo-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfe;
      padding: 12px;
      min-height: 116px;
    }
    .compare-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px;
      align-items: start;
    }
    .compare-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfe;
      overflow: hidden;
    }
    .compare-card header {
      height: auto;
      min-height: 46px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      display: block;
      background: #fff;
    }
    .compare-card .body { padding: 12px; display: grid; gap: 10px; }
    .compare-prop {
      display: grid;
      grid-template-columns: 96px minmax(0, 1fr);
      gap: 8px;
      font-size: 13px;
    }
    .compare-prop .key { color: var(--muted); font-size: 12px; }
    .compare-prop .value { overflow-wrap: anywhere; }
    .compare-list { margin: 0; padding-left: 18px; }
    .compare-list li { margin: 3px 0; }
    .compare-full {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 14px;
      align-items: start;
    }
    .compare-doc {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      min-height: 620px;
      overflow: hidden;
      position: relative;
    }
    .compare-doc.left { border-color: #b8c6ff; box-shadow: inset 4px 0 0 var(--doc-left); }
    .compare-doc.right { border-color: #a9e8ce; box-shadow: inset 4px 0 0 var(--doc-right); }
    .compare-doc-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      background: #fbfcfe;
    }
    .compare-doc.left .compare-doc-header { background: linear-gradient(90deg, var(--doc-left-bg), #fff); }
    .compare-doc.right .compare-doc-header { background: linear-gradient(90deg, var(--doc-right-bg), #fff); }
    .compare-doc-body {
      padding: 14px;
      display: grid;
      gap: 12px;
    }
    .diff-added { color: var(--good); }
    .diff-removed { color: var(--bad); text-decoration: line-through; text-decoration-thickness: 1px; }
    .doc-chip {
      display: inline-flex;
      align-items: center;
      height: 22px;
      border-radius: 999px;
      padding: 0 8px;
      font-size: 11px;
      font-weight: 700;
    }
    .doc-chip.left { color: var(--doc-left); background: var(--doc-left-soft); }
    .doc-chip.right { color: var(--doc-right); background: var(--doc-right-soft); }
    .score-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 4px 9px;
      background: #eef4ff;
      color: #1849a9;
      font-weight: 800;
    }
    .right .score-pill { background: #e7f8ef; color: #066b47; }
    .compose {
      display: grid;
      gap: 10px;
    }
    .compose textarea {
      width: 100%;
      min-height: 110px;
      resize: vertical;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      font: inherit;
      line-height: 1.45;
    }
    .segmented {
      display: inline-flex;
      border: 1px solid var(--line);
      border-radius: 7px;
      overflow: hidden;
      width: max-content;
    }
    .segmented button {
      border: 0;
      border-radius: 0;
      border-right: 1px solid var(--line);
    }
    .segmented button:last-child { border-right: 0; }
    .segmented button.active { background: #12251f; color: #fff; }
    .evo-label { font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 750; letter-spacing: .04em; }
    .evo-score { font-size: 24px; font-weight: 800; margin-top: 6px; }
    .evo-arrow { display: grid; place-items: center; color: var(--accent); font-size: 26px; font-weight: 800; }
    .evo-section {
      border-top: 1px solid var(--line);
      padding-top: 12px;
      display: grid;
      gap: 8px;
    }
    .evo-list { margin: 0; padding-left: 18px; color: #344054; }
    .evo-list li { margin: 4px 0; }
    .retro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .retro-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fff;
    }
    .delta-up { color: var(--good); }
    .delta-down { color: var(--bad); }
    .delta-flat { color: var(--muted); }
    .metrics { display: grid; grid-template-columns: repeat(5, minmax(120px, 1fr)); gap: 10px; }
    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fbfcfe;
      border-top: 3px solid #c8d1df;
    }
    .metric:nth-child(1) { border-top-color: var(--doc-left); }
    .metric:nth-child(2) { border-top-color: var(--doc-right); }
    .metric:nth-child(3) { border-top-color: #7a5af8; }
    .metric:nth-child(4) { border-top-color: var(--warn); }
    .metric:nth-child(5) { border-top-color: var(--bad); }
    .metric .value { font-size: 24px; font-weight: 750; }
    .metric .name { color: var(--muted); font-size: 12px; margin-top: 2px; }
    .grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 16px; align-items: start; }
    .lower-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .7fr); gap: 16px; align-items: start; }
    .evolution-panel { min-height: 640px; }
    .evolution-panel .panel-body { padding: 18px; }
    .list { display: grid; gap: 8px; max-height: 680px; overflow: auto; }
    .item {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      background: #fff;
      cursor: pointer;
    }
    .item:hover { border-color: #9aa8bd; }
    .item.selected { border-color: var(--accent-2); background: #f2f5ff; }
    .item-title { font-weight: 700; font-size: 13px; }
    .item-meta { color: var(--muted); font-size: 12px; margin-top: 5px; }
    .tag {
      display: inline-flex; align-items: center; height: 20px;
      border: 1px solid var(--line); border-radius: 999px;
      padding: 0 7px; font-size: 11px; color: #3d4654; background: #fff;
    }
    pre {
      margin: 0;
      overflow: auto;
      max-height: 460px;
      background: #101418;
      color: #e7edf4;
      border-radius: 8px;
      padding: 14px;
      font-size: 12px;
      line-height: 1.5;
    }
    .graph {
      width: 100%;
      min-height: 220px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfe;
      overflow: hidden;
    }
    .status-ok { color: var(--good); font-weight: 700; }
    .status-bad { color: var(--bad); font-weight: 700; }
    .muted { color: var(--muted); }
    .error { color: var(--bad); font-size: 13px; }
    @media (max-width: 900px) {
      .metrics, .grid, .lower-grid { grid-template-columns: 1fr; }
      .compare-grid, .compare-full { grid-template-columns: 1fr; }
      .retro-grid { grid-template-columns: 1fr; }
      .evo-flow { grid-template-columns: 1fr; }
      .evo-arrow { transform: rotate(90deg); }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand"><div class="mark">gl</div><div>glhub</div><span class="muted" data-i18n="tagline">Generation lineage repository</span></div>
    <div class="row">
      <label for="company" data-i18n="companyRepo" style="margin:0">Company repository</label>
      <select id="company" style="width:220px"></select>
      <input id="manualCompany" value="demo_company" style="width:180px" />
      <button id="openCompany">Open</button>
      <select id="language" style="width:112px" aria-label="Language">
        <option value="en">English</option>
        <option value="ko">한국어</option>
      </select>
      <button id="refresh" data-i18n="refresh">Refresh</button>
      <button class="primary" id="seed" data-i18n="seedDemo">Seed demo</button>
    </div>
  </header>
  <div class="shell">
    <main>
      <div id="error" class="error"></div>
      <section class="metrics" id="metrics"></section>
      <section class="panel">
        <h2 data-i18n="lineage">Lineage</h2>
        <div class="panel-body"><div class="graph" id="graph"></div></div>
      </section>
      <section class="panel">
        <h2 data-i18n="compareView">Compare View</h2>
        <div class="panel-body"><div id="compareView" class="compare-grid"></div></div>
      </section>
      <section class="panel">
        <h2 data-i18n="composeTitle">Write Comment / Edit</h2>
        <div class="panel-body">
          <div class="compose">
            <div class="row">
              <div class="segmented">
                <button id="composeComment" class="active" data-mode="comment" data-i18n="commentMode">Comment</button>
                <button id="composeEdit" data-mode="edit" data-i18n="editMode">Edit proposal</button>
              </div>
              <span class="muted" id="composeTarget">-</span>
            </div>
            <textarea id="composeText"></textarea>
            <div class="row">
              <button class="primary" id="submitNote" data-i18n="submitNote">Save to gl</button>
              <span class="muted" id="composeHint" data-i18n="composeHint">Saved as a child generation so the original document stays auditable.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
  <script>
    const dictionary = {
      en: {
        tagline: "Generation lineage repository",
        refresh: "Refresh",
        seedDemo: "Seed demo",
        companyRepo: "Company repository",
        openCompanyId: "Open company id",
        open: "Open",
        runtime: "Runtime",
        service: "Service",
        data: "Data",
        lineage: "Lineage",
        generations: "Generations",
        evolutionDocument: "Evolution Document",
        rawGeneration: "Raw Generation",
        integrity: "Integrity",
        noGenerations: "No generations yet.",
        before: "Before",
        after: "After",
        seed: "Seed",
        noParent: "No parent generation.",
        why: "Why This Evolution Happened",
        noNote: "No note recorded.",
        retroRules: "Retrospective Rules",
        doNot: "Do Not",
        do: "Do",
        skills: "Skills Created / Strengthened",
        bugsFixed: "Bugs Fixed",
        cases: "Cases That Changed The Decision",
        gains: "Gains",
        losses: "Losses / Tradeoffs",
        configChanges: "Configuration Changes",
        enablesNext: "What This Enables Next",
        compareView: "Evolution Document 1 | Evolution Document 2",
        leftGeneration: "Evolution document 1",
        rightGeneration: "Evolution document 2",
        makeLeft: "Set left",
        makeRight: "Set right",
        parent: "Parent",
        soul: "Soul",
        tags: "Tags",
        retrospective: "Retrospective",
        onlyLeft: "Only left",
        onlyRight: "Only right",
        composeTitle: "Write Comment / Edit",
        commentMode: "Comment",
        editMode: "Edit proposal",
        submitNote: "Save to gl",
        composeHint: "Saved as a child generation so the original document stays auditable.",
        commentPlaceholder: "Write a comment about the selected evolution document.",
        editPlaceholder: "Write what should be amended. It will be recorded as an edit proposal child generation.",
        saved: "Saved",
        noneRecorded: "None recorded.",
        noInfluenceCases: "No influence cases recorded.",
        noConfigPatches: "No config patches.",
        noChildren: "No child generations yet.",
        score: "score",
        success: "success",
        branch: "Branch"
      },
      ko: {
        tagline: "진화 계보 저장소",
        refresh: "새로고침",
        seedDemo: "데모 생성",
        companyRepo: "회사 저장소",
        openCompanyId: "회사 ID 열기",
        open: "열기",
        runtime: "실행 정보",
        service: "서비스",
        data: "데이터",
        lineage: "계보",
        generations: "세대",
        evolutionDocument: "진화 문서",
        rawGeneration: "원본 Generation",
        integrity: "무결성",
        noGenerations: "아직 generation이 없습니다.",
        before: "이전",
        after: "이후",
        seed: "시드",
        noParent: "부모 generation이 없습니다.",
        why: "왜 이 진화가 일어났는가",
        noNote: "기록된 메모가 없습니다.",
        retroRules: "회고 규칙",
        doNot: "하지 말 것",
        do: "할 것",
        skills: "만든/강화한 스킬",
        bugsFixed: "잡은 버그",
        cases: "판단을 바꾼 사례",
        gains: "얻은 것",
        losses: "잃은 것 / 트레이드오프",
        configChanges: "설정 변경",
        enablesNext: "다음에 가능해진 것",
        compareView: "진화문서 1 | 진화문서 2",
        leftGeneration: "진화문서 1",
        rightGeneration: "진화문서 2",
        makeLeft: "왼쪽 지정",
        makeRight: "오른쪽 지정",
        parent: "부모",
        soul: "목표",
        tags: "태그",
        retrospective: "회고",
        onlyLeft: "왼쪽에만 있음",
        onlyRight: "오른쪽에만 있음",
        composeTitle: "코멘트 / 수정 작성",
        commentMode: "코멘트",
        editMode: "수정 제안",
        submitNote: "gl에 저장",
        composeHint: "원본 문서는 감사 가능하게 유지하고, child generation으로 저장합니다.",
        commentPlaceholder: "선택한 진화문서에 대한 코멘트를 작성하세요.",
        editPlaceholder: "수정할 내용을 작성하세요. 수정 제안 child generation으로 기록됩니다.",
        saved: "저장됨",
        noneRecorded: "기록 없음.",
        noInfluenceCases: "기록된 영향 사례가 없습니다.",
        noConfigPatches: "설정 패치가 없습니다.",
        noChildren: "아직 자식 generation이 없습니다.",
        score: "점수",
        success: "성공",
        branch: "브랜치"
      }
    };
    const state = {
      company: "demo_company",
      selected: null,
      compareLeft: null,
      compareRight: null,
      list: [],
      lineage: null,
      lang: localStorage.getItem("glhub.lang") || "en",
      composeMode: "comment"
    };
    const contentDictionary = {
      "Seed an autonomous agent company": {
        ko: "자율 에이전트 회사를 시드로 만든다",
        en: "Seed an autonomous agent company"
      },
      "Improve lineage visibility for judges": {
        ko: "심사위원이 계보를 한눈에 보게 만든다",
        en: "Improve lineage visibility for judges"
      },
      "Added repository summary": {
        ko: "저장소 요약을 추가함",
        en: "Added repository summary"
      },
      "Added generation detail view": {
        ko: "generation 상세 보기를 추가함",
        en: "Added generation detail view"
      },
      "Capture retrospective as first-class evolution memory": {
        ko: "회고를 1급 진화 기억으로 기록한다",
        en: "Capture retrospective as first-class evolution memory"
      },
      "Evolution document now shows rules, skills, bugs, and cases": {
        ko: "진화 문서가 규칙, 스킬, 버그, 사례를 보여주게 됨",
        en: "Evolution document now shows rules, skills, bugs, and cases"
      },
      "glctl stores retrospective in generation YAML": {
        ko: "glctl이 generation YAML에 회고를 저장함",
        en: "glctl stores retrospective in generation YAML"
      },
      "Raw score alone is no longer enough context": {
        ko: "점수만으로는 더 이상 충분한 맥락이 아님",
        en: "Raw score alone is no longer enough context"
      },
      "A generation is only useful if the next agent can see what changed the team's judgment.": {
        ko: "다음 에이전트가 팀의 판단을 바꾼 이유를 볼 수 있어야 generation이 쓸모 있다.",
        en: "A generation is only useful if the next agent can see what changed the team's judgment."
      },
      "Treat gains/losses as a complete retrospective": {
        ko: "gains/losses만으로 회고가 완성됐다고 보지 말 것",
        en: "Treat gains/losses as a complete retrospective"
      },
      "Hide lessons only in chat history": {
        ko: "교훈을 채팅 기록 안에만 숨기지 말 것",
        en: "Hide lessons only in chat history"
      },
      "Record what not to repeat and what to do next in the generation itself": {
        ko: "반복하지 말 것과 다음에 할 일을 generation 자체에 기록할 것",
        en: "Record what not to repeat and what to do next in the generation itself"
      },
      "Show before/transition/after context before raw JSON": {
        ko: "원본 JSON보다 이전/전환/이후 맥락을 먼저 보여줄 것",
        en: "Show before/transition/after context before raw JSON"
      },
      "glhub evolution document": {
        ko: "glhub 진화 문서",
        en: "glhub evolution document"
      },
      "glctl retrospective schema": {
        ko: "glctl 회고 스키마",
        en: "glctl retrospective schema"
      },
      "Retrospective context was missing from generation records": {
        ko: "generation 기록에 회고 맥락이 빠져 있었음",
        en: "Retrospective context was missing from generation records"
      },
      "Shortify prompts": {
        ko: "Shortify 프롬프트",
        en: "Shortify prompts"
      },
      "Showed that durable output comes from caller pointers, schemas, numeric constraints, and fallbacks.": {
        ko: "지속 가능한 산출물은 호출자 포인터, 스키마, 수치 제약, fallback에서 나온다는 점을 보여줌.",
        en: "Showed that durable output comes from caller pointers, schemas, numeric constraints, and fallbacks."
      },
      "Hackathon 4 levers": {
        ko: "해커톤 4가지 레버",
        en: "Hackathon 4 levers"
      },
      "Moved glhub from a data browser toward a 5-second visual explanation of evolution.": {
        ko: "glhub를 데이터 브라우저에서 5초 안에 이해되는 진화 설명 화면으로 이동시킴.",
        en: "Moved glhub from a data browser toward a 5-second visual explanation of evolution."
      }
    };
    const $ = (id) => document.getElementById(id);
    const t = (key) => (dictionary[state.lang] && dictionary[state.lang][key]) || dictionary.en[key] || key;
    const tc = (value) => {
      const raw = String(value ?? "");
      const entry = contentDictionary[raw];
      return entry ? (entry[state.lang] || entry.en || raw) : raw;
    };
    const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    function applyLanguage() {
      document.documentElement.lang = state.lang;
      $("language").value = state.lang;
      for (const el of document.querySelectorAll("[data-i18n]")) {
        el.textContent = t(el.getAttribute("data-i18n"));
      }
      $("openCompany").textContent = t("open");
      $("composeText").placeholder =
        state.composeMode === "edit" ? t("editPlaceholder") : t("commentPlaceholder");
    }
    function renderComposeState() {
      $("composeComment").classList.toggle("active", state.composeMode === "comment");
      $("composeEdit").classList.toggle("active", state.composeMode === "edit");
      $("composeText").placeholder =
        state.composeMode === "edit" ? t("editPlaceholder") : t("commentPlaceholder");
      $("composeTarget").textContent = state.selected ? "-> " + state.selected : "-";
    }
    function setError(message) { $("error").textContent = message || ""; }
    async function api(path, options) {
      const response = await fetch(path, options);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || response.statusText);
      return data;
    }
    async function loadHealth() {
      await api("/api/health");
    }
    async function loadCompanies() {
      const data = await api("/api/companies");
      const companies = data.companies.length ? data.companies : [state.company];
      $("company").innerHTML = companies.map((id) => '<option value="' + id + '">' + id + '</option>').join("");
      if (!companies.includes(state.company)) state.company = companies[0];
      $("company").value = state.company;
    }
    function metric(name, value) {
      return '<div class="metric"><div class="value">' + value + '</div><div class="name">' + name + '</div></div>';
    }
    function renderStatus(status) {
      $("metrics").innerHTML = [
        metric("Generations", status.generation_count ?? 0),
        metric("Relations", status.relation_count ?? 0),
        metric("Seeds", status.seed_count ?? 0),
        metric("Heads", status.head_count ?? 0),
        metric("Dangling", status.dangling_parent_count ?? 0)
      ].join("");
    }
    function renderList(items) {
      state.list = items;
    }
    function renderGraph(lineage) {
      const nodes = lineage.nodes || [];
      const edges = lineage.edges || [];
      const width = Math.max(720, nodes.length * 190 + 60);
      const height = 220;
      const positions = new Map(nodes.map((node, index) => [node.id, { x: 70 + index * 180, y: 95 }]));
      const edgeSvg = edges.map((edge) => {
        const a = positions.get(edge.from);
        const b = positions.get(edge.to);
        if (!a || !b) return "";
        return '<line x1="' + (a.x + 55) + '" y1="' + a.y + '" x2="' + (b.x - 55) + '" y2="' + b.y + '" stroke="#7a8699" stroke-width="2" marker-end="url(#arrow)" />';
      }).join("");
      const nodeSvg = nodes.map((node) => {
        const p = positions.get(node.id);
        const fill = node.success ? "#ecfdf3" : "#fff1f0";
        const stroke = node.id === state.selected ? "#375dfb" : "#cbd5e1";
        return '<g role="button" data-id="' + node.id + '">' +
          '<rect x="' + (p.x - 58) + '" y="' + (p.y - 34) + '" width="116" height="68" rx="8" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2" />' +
          '<text x="' + p.x + '" y="' + (p.y - 10) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#171a1f">' + node.id.slice(4) + '</text>' +
          '<text x="' + p.x + '" y="' + (p.y + 10) + '" text-anchor="middle" font-size="11" fill="#475467">' + t("score") + ' ' + Number(node.score).toFixed(2) + '</text>' +
          '</g>';
      }).join("");
      $("graph").innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7a8699"/></marker></defs>' +
        edgeSvg + nodeSvg + '</svg>';
      for (const el of $("graph").querySelectorAll("g[data-id]")) {
        el.addEventListener("click", () => selectGeneration(el.getAttribute("data-id")));
      }
    }
    function renderEvolution(doc) {
      const before = doc.before;
      const after = doc.after || {};
      const transition = doc.transition || {};
      const delta = transition.score_delta;
      const retro = transition.retrospective || {};
      const deltaClass = delta > 0 ? "delta-up" : delta < 0 ? "delta-down" : "delta-flat";
      const deltaText = delta === null || delta === undefined ? "n/a" : (delta > 0 ? "+" : "") + Number(delta).toFixed(3);
      const list = (items) => (items && items.length)
        ? '<ul class="evo-list">' + items.map((item) => '<li>' + esc(tc(item)) + '</li>').join("") + '</ul>'
        : '<div class="muted">' + t("noneRecorded") + '</div>';
      const patchList = (transition.config_patches || []).length
        ? '<ul class="evo-list">' + transition.config_patches.map((patch) => {
            if (!patch || typeof patch !== "object") return '<li>' + esc(JSON.stringify(patch)) + '</li>';
            return '<li><strong>' + esc(patch.key) + '</strong>: ' + esc(patch.from) + ' -> ' + esc(patch.to) + '<br><span class="muted">' + esc(tc(patch.reason)) + '</span></li>';
          }).join("") + '</ul>'
        : '<div class="muted">' + t("noConfigPatches") + '</div>';
      const nextList = (doc.next || []).length
        ? '<ul class="evo-list">' + doc.next.map((child) => '<li><strong>' + esc(child.id) + '</strong> ' + esc(tc(child.soul)) + ' <span class="muted">' + t("score") + ' ' + esc(child.score) + '</span></li>').join("") + '</ul>'
        : '<div class="muted">' + t("noChildren") + '</div>';
      const cases = (retro.cases || []).length
        ? '<ul class="evo-list">' + retro.cases.map((item) => '<li><strong>' + esc(tc(item.name)) + '</strong><br><span class="muted">' + esc(tc(item.impact)) + '</span></li>').join("") + '</ul>'
        : '<div class="muted">' + t("noInfluenceCases") + '</div>';
      $("evolutionDoc").innerHTML =
        '<div class="evo-title">' + esc(tc(doc.title || doc.id)) + '</div>' +
        '<div class="evo-flow">' +
          '<div class="evo-card"><div class="evo-label">' + t("before") + '</div>' +
            (before ? '<div><strong>' + esc(before.id) + '</strong></div><div>' + esc(tc(before.soul)) + '</div><div class="evo-score">' + esc(before.score) + '</div>' + (before.branch ? '<div class="muted" style="font-size:12px">' + esc(before.branch) + '</div>' : '') : '<div class="evo-score">' + t("seed") + '</div><div class="muted">' + t("noParent") + '</div>') +
          '</div>' +
          '<div class="evo-arrow">-></div>' +
          '<div class="evo-card"><div class="evo-label">' + t("after") + '</div><div><strong>' + esc(after.id) + '</strong></div><div>' + esc(tc(after.soul)) + '</div><div class="evo-score">' + esc(after.score) + ' <span class="' + deltaClass + '" style="font-size:14px">' + deltaText + '</span></div>' + (after.branch ? '<div class="muted" style="font-size:12px">' + esc(after.branch) + '</div>' : '') + '</div>' +
        '</div>' +
        '<div class="evo-section"><div class="evo-label">' + t("why") + '</div><div>' + esc(transition.note ? tc(transition.note) : t("noNote")) + '</div></div>' +
        '<div class="evo-section"><div class="evo-label">' + t("retroRules") + '</div><div class="retro-grid">' +
          '<div class="retro-card"><div class="evo-label">' + t("doNot") + '</div>' + list(retro.do_not || []) + '</div>' +
          '<div class="retro-card"><div class="evo-label">' + t("do") + '</div>' + list(retro.do || []) + '</div>' +
        '</div></div>' +
        '<div class="evo-section"><div class="retro-grid">' +
          '<div class="retro-card"><div class="evo-label">' + t("skills") + '</div>' + list(retro.skills || []) + '</div>' +
          '<div class="retro-card"><div class="evo-label">' + t("bugsFixed") + '</div>' + list(retro.bugs_fixed || []) + '</div>' +
        '</div></div>' +
        '<div class="evo-section"><div class="evo-label">' + t("cases") + '</div>' + cases + '</div>' +
        '<div class="evo-section"><div class="evo-label">' + t("gains") + '</div>' + list(transition.gains || []) + '</div>' +
        '<div class="evo-section"><div class="evo-label">' + t("losses") + '</div>' + list(transition.losses || []) + '</div>' +
        '<div class="evo-section"><div class="evo-label">' + t("configChanges") + '</div>' + patchList + '</div>' +
        '<div class="evo-section"><div class="evo-label">' + t("enablesNext") + '</div>' + nextList + '</div>';
    }
    function listDiff(leftItems, rightItems) {
      const left = new Set((leftItems || []).map(String));
      const right = new Set((rightItems || []).map(String));
      const removed = [...left].filter((item) => !right.has(item));
      const added = [...right].filter((item) => !left.has(item));
      return { removed, added };
    }
    function renderCompareList(title, items, cls) {
      return '<div><div class="evo-label">' + title + '</div>' +
        ((items || []).length
          ? '<ul class="compare-list">' + items.map((item) => '<li class="' + cls + '">' + esc(tc(item)) + '</li>').join("") + '</ul>'
          : '<div class="muted">' + t("noneRecorded") + '</div>') +
        '</div>';
    }
    function miniList(items) {
      return (items || []).length
        ? '<ul class="evo-list">' + items.map((item) => '<li>' + esc(tc(item)) + '</li>').join("") + '</ul>'
        : '<div class="muted">' + t("noneRecorded") + '</div>';
    }
    function renderCompareDoc(label, doc, side) {
      if (!doc) {
        return '<div class="compare-doc ' + side + '"><div class="compare-doc-header"><span class="doc-chip ' + side + '">' + label + '</span></div><div class="compare-doc-body"><div class="muted">' + t("noGenerations") + '</div></div></div>';
      }
      const transition = doc.transition || {};
      const retro = transition.retrospective || {};
      const after = doc.after || {};
      const before = doc.before;
      const delta = transition.score_delta;
      const deltaClass = delta > 0 ? "delta-up" : delta < 0 ? "delta-down" : "delta-flat";
      const deltaText = delta === null || delta === undefined ? "n/a" : (delta > 0 ? "+" : "") + Number(delta).toFixed(3);
      const tags = (after.tags || []).map((tag) => '<span class="tag">' + esc(tc(tag)) + '</span>').join(" ");
      const cases = (retro.cases || []).length
        ? '<ul class="evo-list">' + retro.cases.map((item) => '<li><strong>' + esc(tc(item.name)) + '</strong><br><span class="muted">' + esc(tc(item.impact)) + '</span></li>').join("") + '</ul>'
        : '<div class="muted">' + t("noInfluenceCases") + '</div>';
      return '<article class="compare-doc ' + side + '">' +
        '<div class="compare-doc-header"><span class="doc-chip ' + side + '">' + label + '</span><div class="evo-title" style="margin-top:8px">' + esc(tc(doc.title || doc.id)) + '</div><div class="muted">' + esc(doc.id) + '</div></div>' +
        '<div class="compare-doc-body">' +
          '<div class="compare-prop"><div class="key">' + t("before") + '</div><div class="value">' + (before ? esc(before.id) + '<br>' + esc(tc(before.soul)) + (before.branch ? '<br><span class="muted" style="font-size:11px">' + esc(before.branch) + '</span>' : '') : t("seed")) + '</div></div>' +
          '<div class="compare-prop"><div class="key">' + t("after") + '</div><div class="value"><strong>' + esc(after.id) + '</strong><br>' + esc(tc(after.soul)) + (after.branch ? '<br><span class="muted" style="font-size:11px">' + esc(after.branch) + '</span>' : '') + '</div></div>' +
          '<div class="compare-prop"><div class="key">' + t("score") + '</div><div class="value"><span class="score-pill">' + esc(after.score) + ' <span class="' + deltaClass + '">' + deltaText + '</span></span></div></div>' +
          '<div class="compare-prop"><div class="key">' + t("tags") + '</div><div class="value row">' + tags + '</div></div>' +
          (after.branch ? '<div class="compare-prop"><div class="key">' + t("branch") + '</div><div class="value">' + esc(after.branch) + '</div></div>' : '') +
          '<div class="evo-section"><div class="evo-label">' + t("why") + '</div><div>' + esc(transition.note ? tc(transition.note) : t("noNote")) + '</div></div>' +
          '<div class="evo-section"><div class="evo-label">' + t("doNot") + '</div>' + miniList(retro.do_not || []) + '</div>' +
          '<div class="evo-section"><div class="evo-label">' + t("do") + '</div>' + miniList(retro.do || []) + '</div>' +
          '<div class="evo-section"><div class="evo-label">' + t("skills") + '</div>' + miniList(retro.skills || []) + '</div>' +
          '<div class="evo-section"><div class="evo-label">' + t("bugsFixed") + '</div>' + miniList(retro.bugs_fixed || []) + '</div>' +
          '<div class="evo-section"><div class="evo-label">' + t("cases") + '</div>' + cases + '</div>' +
          '<div class="evo-section"><div class="evo-label">' + t("gains") + '</div>' + miniList(transition.gains || []) + '</div>' +
          '<div class="evo-section"><div class="evo-label">' + t("losses") + '</div>' + miniList(transition.losses || []) + '</div>' +
        '</div>' +
      '</article>';
    }
    async function renderCompare() {
      const [leftDoc, rightDoc] = await Promise.all([
        state.compareLeft ? api("/api/repos/" + encodeURIComponent(state.company) + "/evolution/" + encodeURIComponent(state.compareLeft)).catch(() => null) : Promise.resolve(null),
        state.compareRight ? api("/api/repos/" + encodeURIComponent(state.company) + "/evolution/" + encodeURIComponent(state.compareRight)).catch(() => null) : Promise.resolve(null)
      ]);
      $("compareView").innerHTML =
        '<div class="compare-full">' +
          renderCompareDoc(t("leftGeneration"), leftDoc, "left") +
          renderCompareDoc(t("rightGeneration"), rightDoc, "right") +
        '</div>';
    }
    async function selectGeneration(id) {
      if (!id) return;
      state.selected = id;
      const selected = state.list.find((item) => item.id === id);
      if (selected) {
        state.compareRight = selected.id;
        state.compareLeft = selected.parent_id || state.compareLeft || selected.id;
      }
      renderList(state.list);
      if (state.lineage) renderGraph(state.lineage);
      await renderCompare();
      renderComposeState();
    }
    async function refresh() {
      setError("");
      try {
        await loadHealth();
        await loadCompanies();
        const base = "/api/repos/" + encodeURIComponent(state.company);
        const [status, list, lineage] = await Promise.all([
          api(base + "/status").catch(() => ({ generation_count: 0, relation_count: 0, seed_count: 0, head_count: 0, dangling_parent_count: 0 })),
          api(base + "/list").catch(() => []),
          api(base + "/lineage").catch(() => ({ nodes: [], edges: [] }))
        ]);
        state.lineage = lineage;
        renderStatus(status);
        renderList(list);
        renderGraph(lineage);
        if (!state.compareRight && list.length) {
          state.compareRight = list[0].id;
          state.compareLeft = list[0].parent_id || list[Math.min(1, list.length - 1)]?.id || list[0].id;
        }
        await renderCompare();
        if (list.length && !state.selected) await selectGeneration(list[0].id);
      } catch (err) {
        setError(err.message);
      }
    }
    $("company").addEventListener("change", () => { state.company = $("company").value; state.selected = null; refresh(); });
    $("language").addEventListener("change", () => {
      state.lang = $("language").value;
      localStorage.setItem("glhub.lang", state.lang);
      applyLanguage();
      renderComposeState();
      renderList(state.list);
      if (state.lineage) renderGraph(state.lineage);
      if (state.selected) selectGeneration(state.selected);
    });
    $("openCompany").addEventListener("click", () => { state.company = $("manualCompany").value.trim() || "demo_company"; state.selected = null; refresh(); });
    $("refresh").addEventListener("click", refresh);
    $("composeComment").addEventListener("click", () => {
      state.composeMode = "comment";
      renderComposeState();
    });
    $("composeEdit").addEventListener("click", () => {
      state.composeMode = "edit";
      renderComposeState();
    });
    $("submitNote").addEventListener("click", async () => {
      setError("");
      if (!state.selected) {
        setError("Select a generation first.");
        return;
      }
      const text = $("composeText").value.trim();
      if (!text) return;
      try {
        const result = await api(
          "/api/repos/" + encodeURIComponent(state.company) + "/comment/" + encodeURIComponent(state.selected),
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ kind: state.composeMode, text })
          }
        );
        $("composeText").value = "";
        state.selected = result.id;
        state.compareRight = result.id;
        await refresh();
        await selectGeneration(result.id);
      } catch (err) {
        setError(err.message);
      }
    });
    $("seed").addEventListener("click", async () => {
      setError("");
      try {
        await api("/api/repos/" + encodeURIComponent(state.company) + "/seed-demo", { method: "POST" });
        state.selected = null;
        await refresh();
      } catch (err) { setError(err.message); }
    });
    applyLanguage();
    renderComposeState();
    refresh();
  </script>
</body>
</html>`;
}
