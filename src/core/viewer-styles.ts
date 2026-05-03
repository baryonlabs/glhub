export const viewerStyles = `
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
      position: relative;
      width: 100%;
      min-height: 200px;
      max-height: 420px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfcfe;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-gutter: stable;
    }
    .lineage-empty {
      padding: 24px;
      text-align: center;
      font-size: 13px;
    }
    .lineage-list {
      list-style: none;
      margin: 0;
      padding: 6px 0;
      display: flex;
      flex-direction: column;
    }
    .lineage-row {
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr);
      gap: 12px;
      padding: 10px 16px;
      cursor: pointer;
      outline: none;
      transition: background 120ms ease;
    }
    .lineage-row:hover { background: rgba(55, 93, 251, 0.045); }
    .lineage-row:focus-visible {
      background: rgba(55, 93, 251, 0.06);
      box-shadow: inset 3px 0 0 var(--accent-2);
    }
    .lineage-row.is-selected {
      background: rgba(55, 93, 251, 0.06);
      box-shadow: inset 3px 0 0 var(--accent-2);
    }
    .lineage-rail {
      position: relative;
      display: grid;
      place-items: center;
      align-self: stretch;
    }
    .lineage-rail::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 2px;
      background: var(--line);
      transform: translateX(-50%);
    }
    .lineage-rail.first::before { top: 50%; }
    .lineage-rail.last::before { bottom: 50%; }
    .lineage-marker {
      position: relative;
      z-index: 1;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: #fff;
      border: 2px solid #cbd5e1;
      display: grid;
      place-items: center;
      transition: border-color 120ms ease, box-shadow 120ms ease;
    }
    .lineage-row.is-selected .lineage-marker {
      border-color: var(--accent-2);
      box-shadow: 0 0 0 4px rgba(55, 93, 251, 0.18);
    }
    .lineage-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
    }
    .lineage-dot.ok { background: var(--good); }
    .lineage-dot.bad { background: var(--bad); }
    .lineage-card {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .lineage-meta {
      display: flex;
      gap: 10px;
      align-items: baseline;
      flex-wrap: wrap;
    }
    .lineage-id {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-weight: 700;
      font-size: 13px;
      color: var(--ink);
    }
    .lineage-score { font-size: 12px; color: var(--muted); }
    .lineage-branch {
      font-size: 11px;
      color: #1849a9;
      background: #eef4ff;
      padding: 1px 8px;
      border-radius: 999px;
    }
    .lineage-soul {
      font-size: 13px;
      color: #2a3140;
      line-height: 1.45;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .lineage-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
    .lineage-tag {
      font-size: 10px;
      padding: 1px 7px;
      border-radius: 999px;
      background: #f1f4f8;
      color: var(--muted);
    }
    @media (prefers-reduced-motion: reduce) {
      .lineage-row { transition: none; }
      .lineage-marker { transition: none; }
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
    }`;
