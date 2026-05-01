# glhub — Product Requirements Document

**Status**: living document  
**SoT for product vision**: `https://glhub.baryon.ai/` landing page  
**Last sync**: 2026-05-02 with landing v1 (commit `99725e0` `feat(landing): multilingual landing`)

---

## 1. North Star

> **A portable thinking space for evolution review.**
>
> If GitHub is a thinking space for code review through commits and pull
> requests, glhub is a thinking space for evolution review through generations
> and evolution documents. AI agent work needs more than a final patch, score,
> or chat transcript — it needs a durable record of what changed, what
> improved, what regressed, and which lessons should carry forward.

This statement is canonical. Every product decision must answer: *does this
make the evolution review experience portable, durable, and forge-neutral?*

---

## 2. Problem

### 2.1 Project memory leaks at the platform layer

Even when Git itself is distributed, real software delivery depends on
centralized layers above Git: issues, pull requests, review queues, Actions,
status pages, account policy, project workflow state. A repository clone
preserves commits but **not the operating memory** around the project. When
the platform degrades or a team must move, *the work cannot move normally*.

(See: Ghostty leaving GitHub — surrounding context, not just code, is what
breaks.)

### 2.2 AI agent work has the same problem, faster

An agent run leaves a patch, a report, or a score. The durable asset is the
**lineage around it**: which generation it came from, what changed, what
improved, what regressed, which rules were learned, which cases changed the
decision, and what should be tried next. Without lineage, agent work is a pile
of disconnected outputs instead of an auditable evolution process.

### 2.3 Forge lock-in for AI lineage is unacceptable

Teams already trust their forge (GitHub, GitLab, Codeberg, Forgejo, Gitea).
glhub MUST NOT make them abandon their forge to gain AI lineage. Lineage is
*portable memory* attached to the forge, not a replacement for it.

---

## 3. Target Users

The 5-group "모두를 위한 glhub" boundary agreed at the 2026-05-01 harness team
meeting. A change ships only when none of these groups is blocked.

| # | Group | What success means for them |
|---|---|---|
| 1 | First contributor | `docker compose up` or `glctl login` works in under 60s; "처음이세요?" entry exists in the contributor flow |
| 2 | Self-host operator | runbook for backup / upgrade / rollback exists; closed-network (ISMS-P) deployment is documented |
| 3 | Forge user (GitHub / GitLab / Codeberg / Forgejo / Gitea) | first-class connector; no GitHub-only assumptions in code |
| 4 | Multi-lingual user (en / ko / ja / zh) | every public-facing surface (landing, viewer, README) ships translated together with the English source of truth |
| 5 | Regulated buyer | OSS / Cloud / Enterprise tier matrix is honest; KR/EU/US compliance signals are visible; first inquiry response uses precise regulatory vocabulary |

If a feature serves only one group at the expense of another (e.g. better
forge UX that breaks self-host), it is rejected.

---

## 4. Goals

### 4.1 Functional goals (must)

- Record AI agent generation lineage locally (`glctl`).
- Push lineage snapshots to a server (`glhub`) that can store, browse, and
  diff them.
- Render the **evolution document** (before / transition / after / next) as
  the central UX, not raw JSON.
- Treat comments and edit proposals as **child generations** — never overwrite
  evolution memory.
- Keep the forge connectors interchangeable. Adding a new forge MUST NOT
  require changing the core schema.
- Authenticate the hosted endpoint via GitHub OAuth + Personal Access Tokens
  (Bearer); enforce `company_id` ownership on first push.

### 4.2 Non-functional goals (must)

- **Self-host parity**: every read endpoint that exists on the hosted endpoint
  must work in self-host. Mutation endpoints may be hosted-restricted, but
  the data model is identical.
- **Schema durability**: `schema_version` must follow a published migration
  policy. Breaking changes to `glhub-push/v1` cannot ship without a v2 plan
  documented and a migration script available.
- **Forge-neutral wording**: README, viewer, and landing page MUST avoid
  GitHub-only metaphors except when explicitly labelled.
- **Multi-language**: en is SoT; ko / ja / zh sync MUST land in the same PR
  as the en source change for any user-facing surface.

### 4.3 Quality budgets

| Surface | Budget |
|---|---|
| Landing page (cold load) | < 250 ms TTFB on Cloudflare PoP, < 6 KB HTML gzipped |
| Worker bundle | < 200 KiB upload (currently ~100 KiB) |
| Viewer first-paint after push | < 1 s on KR PoP |
| schema breaking change cost | always ≤ "1 migration script + readme entry" |

---

## 5. Non-goals

- **glhub does not replace the forge.** Issues, code reviews, CI, releases
  remain on GitHub / GitLab / Codeberg / Forgejo. glhub stores the
  *AI evolution layer* around them.
- **glhub does not become a raw data browser.** If the user needs the JSON,
  they fetch the API. The product surface is the evolution document, not the
  payload.
- **glhub does not ship multi-tenant RBAC in the OSS tier.** Multi-user
  isolation, SSO, audit-grade compliance live in Cloud / Enterprise.
- **glhub does not ship a chat / chatbot UI.** Comments and edits are
  generations, not threads.
- **glhub does not run agents.** That is Paperclip / Nautilus. glhub stores
  the lineage they produce.

---

## 6. Open-core boundary

| Capability | OSS (Apache-2.0) | Cloud (paid hosted) | Enterprise (paid + on-prem) |
|---|---|---|---|
| `glctl` lineage record + push | ✅ | ✅ | ✅ |
| Local single-dev viewer | ✅ | ✅ | ✅ |
| Forge connectors (GitHub / GitLab / Codeberg-Forgejo) | ✅ basic | ✅ extended | ✅ extended + custom |
| GitHub OAuth login on hosted | ✅ (preview at glhub.baryon.ai) | ✅ | ✅ |
| Personal Access Token for push | ✅ | ✅ | ✅ |
| `company_id` ownership (single owner) | ✅ | ✅ | ✅ |
| Multi-user RBAC | — | ✅ | ✅ |
| SSO (SAML / SCIM / OIDC) | — | ✅ | ✅ |
| Hosted ops (backup, scaling, SLA) | self-host | ✅ | — |
| Immutable audit log (1y+) | — | partial | ✅ |
| Signed audit pack (cryptographic provenance) | — | — | ✅ |
| Policy DSL + enforcement gate | — | — | ✅ |
| Compliance evidence packs (SOC2 / EU AI Act / NIST AI RMF / HIPAA / ISO 42001) | — | — | ✅ |
| Multi-tenancy + geo-replication | — | ✅ | ✅ |
| Air-gapped / on-prem package | self-build | — | ✅ |
| White-label | — | — | ✅ |

The hosted instance at `glhub.baryon.ai` is the **OSS preview deployment**
with login. It is not Cloud-tier — multi-user RBAC is intentionally absent.
First push claims `company_id` ownership; subsequent pushes from other tokens
are rejected with `403`.

---

## 7. Roadmap

The 4-Wave plan from the 2026-05-01 meeting + Wave 0 (deploy) added in this
session.

### Wave 0 — Deploy (DONE 2026-05-01)
- Cloudflare Workers entry on `glhub.baryon.ai`
- R2 binding for push storage
- KV for token storage
- Public landing (multi-lingual en/ko/ja/zh)

### Wave 1 — Entry (DONE 2026-05-01 — 2026-05-02)
- `/api/health.mode` field
- `/login/cli` loopback flow + `glctl login`
- README ko/ja/zh sync with en SoT
- Issue templates (`good-first-issue` ready)

### Wave 2 — Forge neutrality, day-1 (in progress)
- ~~`src/connectors/{github,gitlab,forgejo}/` adapter abstraction~~ ✅ 2026-05-02
- `schema_version` v2 migration policy
- `push_id` idempotency key
- Viewer static asset extraction (zero-build retained)

### Wave 3 — Operational depth (queued)
- `docs/runbook/{backup,upgrade,rollback,closed-network-isms-p}.md`
- GitHub Actions matrix CI (4 environment scenarios)
- 4-README divergence-check CI
- Viewer i18n key extraction (ja/zh expansion ready)

### Wave 4 — Enterprise honesty (queued)
- README "Regional Compliance Mapping (preview)" section (KR/EU/US side-by-side)
- Enterprise-inquiry issue template (en/ko)
- `audit_log` and `signed_audit_pack` schema placeholders
- R2 multipart upload (lineage > 50 MB)
- Mermaid lineage graph polish

Beyond Wave 4: dashboard summarising what each harness keeper has been
working on, branch-aware lineage tree visualisation, glctl `link` command
for forge metadata.

---

## 8. Success metrics

| Metric | Target | Why |
|---|---|---|
| First contributor `time-to-first-push` (signed up to push success) | < 5 min | Group 1 unblocked |
| Self-host parity bug count vs hosted | 0 critical | Group 2 unblocked |
| Forges with first-class adapter | ≥ 3 | Group 3 unblocked |
| en→ko/ja/zh README PR lag | 0 days (same PR) | Group 4 unblocked |
| Open enterprise-inquiry response time (P50) | < 24 h | Group 5 unblocked |
| Worker bundle size | < 200 KiB | Cold-start budget |
| Hosted endpoint uptime | ≥ 99.9% | Demo credibility |

---

## 9. Anti-goals (explicit)

- **Don't build a chat UI.** It would dilute the evolution document focus.
- **Don't add features that only work on GitHub.** Forge-neutrality is a hard
  constraint. If GitHub-specific UX is necessary, it lives behind a
  GitHub-only path while the same data model serves other forges.
- **Don't put RBAC in OSS.** It belongs to Cloud — selling that is how the
  open-core model funds the OSS work.
- **Don't grow the schema speculatively.** Every field must come from a real
  user need (a generation that fails to render without it).

---

## 10. Open questions

1. ~~Should `branch?: string` be a first-class field on `GenerationRecord`?~~
   **Resolved 2026-05-02**: yes. Implemented additively (older records without
   `branch` continue to read as `null` / "main"). See `docs/SPEC.md §2.1` and
   §10.
2. Should the hosted endpoint accept GitHub App webhook events linked to a
   specific `company_id` automatically (today they are stored generically
   under `glhub/webhooks/`)? Wave 4 candidate.
3. Should the viewer's evolution document support inline diff between
   *cousin* generations (same parent, different branch tags)? Out-of-scope
   until branch experiments mature.
