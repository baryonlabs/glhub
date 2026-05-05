# glhub — Technical Specification

**Status**: living document  
**Source of truth for behaviour**: `src/worker.ts`, `src/index.ts`, `src/core/*`  
**Last sync**: 2026-05-02 (post commit `99725e0`)

---

## 1. Architecture

```text
┌─────────────────────────┐         ┌────────────────────────┐
│   glctl (Rust CLI)      │  push   │  glhub (TS server)     │
│   ───────────────────   │ ──────► │  ────────────────────  │
│   ~/.glctl/config       │  Bearer │  src/index.ts (Node)   │
│   data/glctl/...yaml    │         │    └─ self-host full   │
│                         │         │  src/worker.ts (CF)    │
│                         │         │    └─ hosted push-only │
└─────────────────────────┘         └────────────────────────┘
                                              │
                              ┌───────────────┴───────────────┐
                              │                               │
                          R2 bucket                       KV namespace
                       glhub/pushes/                      token:{hash}
                       glhub/owners/
                       glhub/links/
                       glhub/webhooks/
```

### 1.1 Dual-entry pattern

A single `src/core/` folder is shared between two runtime entries:

| Entry | Runtime | Storage | Auth | glctl subprocess |
|---|---|---|---|---|
| `src/index.ts` | Node.js (`pnpm dev`) | S3-compatible R2 SDK + local fs | none (trust boundary = host) | yes |
| `src/worker.ts` | Cloudflare Workers (`pnpm deploy:worker`) | R2 binding + KV binding | GitHub OAuth + Bearer + ownership | no (push-only) |

Pure modules in `src/core/`:
- `types.ts` — shared types + regexes (`COMPANY_ID_RE`, `GENERATION_ID_RE`)
- `push-fallback.ts` — pure derivers from a `PushPayload` (lineage, show, evolution)
- `viewer.ts` — server-embedded HTML (single page, no build step)
- `landing-html.ts` — public landing page (i18n)
- `cookie.ts` — HMAC-SHA256 signed cookie (Web Crypto)
- `token.ts` — `glhub_pat_*` PAT generation, hash, lookup
- `github-oauth.ts` — GitHub OAuth code exchange + user fetch
- `github-webhook.ts` — `X-Hub-Signature-256` HMAC verification
- `forge-link.ts` — provider auto-inference from URL
- `profile-html.ts` — `/{owner}` profile page
- `settings-html.ts` — `/settings` token management page

### 1.2 Runtime configuration

| Var | Type | Required where | Purpose |
|---|---|---|---|
| `GLHUB_R2` | binding | Workers | R2 bucket for pushes / owners / links / webhooks |
| `GLHUB_KV` | binding | Workers | KV for token storage |
| `GLHUB_R2_PREFIX` | var | both | key prefix (default `glhub`) |
| `GLHUB_INSTANCE_ID` | var | both | instance hostname; used in OAuth callback URL |
| `GITHUB_CLIENT_ID` | var | Workers | GitHub OAuth / App client id (public) |
| `GITHUB_CLIENT_SECRET` | secret | Workers | GitHub OAuth / App client secret |
| `SESSION_SECRET` | secret | Workers | HMAC key for cookie signing (32+ byte hex) |
| `GITHUB_WEBHOOK_SECRET` | secret | Workers | HMAC key for webhook signature verification |
| `GLCTL_DATA_DIR`, `GLCTL_PATH`, `GLHUB_DATA_DIR` | env | Node | self-host paths |
| `GLHUB_R2_BUCKET`, `GLHUB_R2_ENDPOINT`, `GLHUB_R2_ACCESS_KEY_ID`, `GLHUB_R2_SECRET_ACCESS_KEY` | env | Node | self-host R2 via S3 SDK |

---

## 2. Data schemas

All schemas carry an explicit `schema_version` to allow forward migration.

### 2.1 `GenerationRecord` (canonical)

```ts
type GenerationRecord = {
  id: string;                     // gen-YYYYMMDD-NNN
  parent_id?: string | null;
  created_at?: string;            // ISO 8601 UTC
  branch?: string | null;         // experiment/{topic} or omitted/null = main
  soul?: string;                  // human-readable title / intent
  gains?: string[];
  losses?: string[];
  philosophical_note?: string | null;
  metrics?: {
    score?: number;               // [0, 1]
    execution_time_s?: number | null;
    success?: boolean;
  };
  tags?: string[];                // free-form, prefixes used: `branch:`, `experiment`
  config_patch?: JsonValue;
  config_patches?: JsonValue[];
  retrospective?: {
    do_not?: string[];
    do?: string[];
    skills?: string[];
    bugs_fixed?: string[];
    cases?: Array<{ name?: string; impact?: string }>;
  };
};
```

### 2.2 `PushPayload`

```ts
type PushPayload = {
  schema_version?: "glhub-push/v1";  // missing → treated as "glhub-push/v1" by normalizePushPayload()
  company_id: string;                 // matches /^[A-Za-z0-9_-]+$/
  push_id?: string;                   // client-supplied idempotency key; sanitized to [A-Za-z0-9_-]
  pushed_at: string;                  // ISO 8601 UTC
  status?: { /* ... */ };
  lineage?: { nodes: ...; edges: ... };
  generations: GenerationRecord[];
  relations: Array<{ from, to, relation_type, created_at }>;
};
```

R2 key layout:
```text
{prefix}/pushes/{company_id}/{push_id}.json   # immutable per push
{prefix}/pushes/{company_id}/latest.json      # mutable pointer to latest
```

`push_id = company_id + "-" + safeTime(pushed_at)`.

### 2.3 `OwnerRecord` (hosted only)

```ts
type OwnerRecord = {
  schema_version: "glhub-owner/v1";
  company_id: string;
  owner_id: string;               // GitHub user id (string)
  owner_login: string;
  claimed_at: string;             // ISO 8601
};
```

R2 key:
```text
{prefix}/owners/{company_id}.json
```

Created on first authenticated push. Subsequent pushes from a token whose
`user_id != owner_id` are rejected with HTTP 403.

### 2.4 `ForgeLink`

```ts
type ForgeLink = {
  schema_version: "glhub-forge-link/v1";
  company_id: string;
  provider: "github" | "gitlab" | "codeberg" | "forgejo" | "bitbucket" | "custom";
  repo: string;                   // "owner/repo"
  url: string;                    // canonical URL (provider host + repo)
  set_by_user_id: string;
  set_by_login: string;
  set_at: string;
};
```

R2 key:
```text
{prefix}/links/{company_id}.json
```

Provider is inferred from URL host by `inferProvider()` in
`core/forge-link.ts`.

### 2.5 `TokenRecord` (KV)

```ts
type TokenRecord = {
  user_id: string;
  login: string;
  name: string;                   // user-supplied label, ≤64 chars
  created_at: string;
  last_used_at: string | null;
};
```

KV key:
```text
token:{sha256_hex(token)}
```

Token format: `glhub_pat_<24 random base64url chars>`. The plain token
appears once in the issuance response and is never stored.

### 2.6 `WebhookMetadata`

```ts
type WebhookMetadata = {
  schema_version: "glhub-webhook/v1";
  event: string;                  // X-GitHub-Event
  delivery_id: string;            // X-GitHub-Delivery
  received_at: string;
  hook_id: string | null;
  installation_id: number | null;
  repository_full_name: string | null;
  sender_login: string | null;
};
```

R2 key:
```text
{prefix}/webhooks/{event}/{delivery_id}.json
```

Stored object is `{...metadata, payload}` — full GitHub payload preserved
for later replay / analysis.

### 2.7 Session + OAuth state cookies

```ts
type SessionClaims    = { uid: string; login: string; exp: number };       // glhub_session
type OAuthStateClaims = { state: string; exp: number; return_to?: string }; // glhub_oauth_state
```

Both are `<base64url(payload)>.<base64url(HMAC_SHA256(payload, SESSION_SECRET))>`.
TTL: session 7 days, OAuth state 10 min.

---

## 3. URL surface

| URL | Method | Auth | Notes |
|---|---|---|---|
| `/` | GET | optional | landing if no session, 302 to `/{login}` if session |
| `/?lang=en\|ko\|ja\|zh` | GET | optional | landing in selected language |
| `/{owner}` | GET | optional | public profile; lists projects + forge badges |
| `/{owner}/{project_id}` | GET | optional | public viewer with bootstrap forge badge |
| `/settings` | GET | optional | landing if no session, token UI if session |
| `/auth/github/login` | GET | — | starts OAuth; supports `?return_to=` |
| `/auth/github/callback` | GET | — | OAuth callback; redirects to `return_to` or `/{login}` |
| `/auth/logout` | POST | session | clears session cookie |
| `/login/cli` | GET | optional | loopback OAuth for `glctl login` |
| `/api/health` | GET | — | reports mode + auth + webhook status |
| `/api/me` | GET | optional | returns logged-in user or `{login: null}` |
| `/api/tokens` | POST | session | issues new PAT (form or JSON body with `name`) |
| `/api/companies` | GET | — | lists company ids that have pushed |
| `/api/pushes/:company_id/latest` | GET | — | full push payload |
| `/api/repos/:company_id/status` | GET | — | glctl status (Node) or pushed status (Worker fallback) |
| `/api/repos/:company_id/list` | GET | — | generations |
| `/api/repos/:company_id/lineage` | GET | — | nodes + edges |
| `/api/repos/:company_id/show/:gen` | GET | — | one record |
| `/api/repos/:company_id/evolution/:gen` | GET | — | derived evolution document |
| `/api/repos/:company_id/forge-link` | GET | — | public forge metadata |
| `/api/repos/:company_id/forge-link` | POST | Bearer or session, owner-only | set forge metadata |
| `/api/repos/:company_id/seed-demo` | POST | — | self-host: glctl init + 2 generations. **hosted: 501** |
| `/api/repos/:company_id/generations` | POST | — | self-host: glctl new. **hosted: 501** |
| `/api/repos/:company_id/comment/:gen` | POST | — | self-host: glctl new --parent. **hosted: 501** |
| `/api/repos/:company_id/fsck` | GET | — | self-host: glctl fsck. **hosted: 501** |
| `/api/push` | POST | self-host: none / hosted: Bearer + ownership | persist push snapshot |
| `/webhooks/github` | POST | HMAC-SHA256 (`X-Hub-Signature-256`) | persist webhook event (GitHub) |
| `/webhooks/gitlab` | POST | `X-Gitlab-Token` comparison | persist webhook event (GitLab) |
| `/webhooks/forgejo` | POST | HMAC-SHA256 (`X-Forgejo-Signature` / `X-Hub-Signature-256`) | persist webhook event (Forgejo/Codeberg) |

Reserved first segments (cannot be `/{owner}`): `api`, `auth`, `webhooks`,
`settings`, `favicon.ico`, `robots.txt`.

`{owner}` matches `/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38}[A-Za-z0-9])?$/`
(GitHub login shape).

---

## 4. Auth + ownership

### 4.1 GitHub OAuth flow (web)

```text
User → GET /auth/github/login[?return_to=<internal-path>]
  └ Worker: signs OAuthStateClaims{state,exp,return_to}, sets glhub_oauth_state cookie
  └ 302 → github.com/login/oauth/authorize?...&state=...

GitHub → GET /auth/github/callback?code=...&state=...
  └ Worker: verifies state cookie matches state param
  └ POSTs github.com/login/oauth/access_token with client_secret
  └ GETs api.github.com/user
  └ signs SessionClaims{uid,login,exp=+7d}, sets glhub_session
  └ clears glhub_oauth_state
  └ 302 → return_to or /{login}
```

### 4.2 PAT (Bearer) flow (CLI)

```text
glctl login → spawns local HTTP server on http://localhost:PORT
            → opens browser to /login/cli?redirect_uri=http://localhost:PORT/callback&state=<uuid>
              └ Worker: validates loopback redirect_uri (only localhost / 127.0.0.1 / [::1])
              └ if no session → 302 to /auth/github/login?return_to=/login/cli?...
              └ on session → mints token + storeToken(KV) + 302 to redirect_uri?token=...&state=...
            → loopback server captures token, verifies state, writes ~/.glctl/config

glctl push → reads token from --token > GLHUB_TOKEN > ~/.glctl/config
           → POST /api/push with Authorization: Bearer <token>
              └ Worker: lookupToken(KV) → TokenRecord
              └ readOwner(R2)
                  └ no owner: claimOwner(R2, user_id, login)
                  └ owner_id != user_id: 403
              └ storePush(R2)
              └ touchToken(KV) — updates last_used_at
```

### 4.3 Webhook flow

```text
GitHub → POST /webhooks/github
         headers: X-GitHub-Event, X-GitHub-Delivery, X-GitHub-Hook-ID, X-Hub-Signature-256
         body: <raw JSON, byte-for-byte stable>
  └ Worker: HMAC_SHA256(body, GITHUB_WEBHOOK_SECRET) === signature?
  └ extractMetadata + r2PutJson({prefix}/webhooks/{event}/{delivery_id}.json)
  └ 202 with stored_key
```

---

## 5. Forge integration contract

```text
Forge event → glhub generation context → agent run/evaluation → glhub
evolution document → forge backlink
```

Connectors live behind a single `ForgeAdapter` abstraction (`src/connectors/`) landed in Wave 2:

```ts
// src/connectors/types.ts
interface ForgeAdapter {
  readonly provider: ForgeProvider;
  verifyWebhookSignature(secret: string, headers: Headers, rawBody: string): Promise<boolean>;
  parseEvent(headers: Headers, payload: unknown): NormalizedForgeEvent;
  buildBacklinkUrl(repo: string, generationId: string): string;
  // optional: read PR / issue, post comment, etc. (Cloud / Enterprise only)
}
```

Implementations: `src/connectors/github.ts`, `src/connectors/gitlab.ts`, `src/connectors/forgejo.ts`.
Registry: `src/connectors/index.ts` — `getAdapter(provider: ForgeProvider): ForgeAdapter | null`.

Provider is auto-inferred from URL host (see `core/forge-link.ts`):

| Host pattern | Provider |
|---|---|
| `github.com`, `*.github.com` | `github` |
| `gitlab.com`, `*.gitlab.com`, `*gitlab*` | `gitlab` |
| `codeberg.org` | `codeberg` |
| `*forgejo*`, `*gitea*` | `forgejo` |
| `bitbucket.org`, `*.bitbucket.org` | `bitbucket` |
| anything else | `custom` |

---

## 6. Schema evolution policy

1. Every persisted JSON document has a `schema_version` field of the form
   `glhub-{kind}/v{n}`. Documents written before this rule existed
   (`schema_version` missing) are read as `v1` by convention.
2. Adding optional fields is **always** allowed without a version bump
   (readers must default missing fields).
3. Renaming, type-changing, or removing fields requires:
   - a new version (`v{n+1}`)
   - documented migration path in this file (see §6.2)
   - reader code that accepts both `v{n}` and `v{n+1}`
   - a published cutover date before the writer flips to `v{n+1}`
4. The `schema-keeper` agent owns this policy. Other keepers must request
   sign-off before introducing schema changes.

### 6.1 Reader fallback implementation

`src/core/push-fallback.ts` exports `normalizePushPayload(payload)`. Every
read path that deserialises a stored `PushPayload` **must** pass the raw object
through this function before returning it to callers. The function fills in
`schema_version: "glhub-push/v1"` when the field is absent or empty, ensuring
old documents are transparently upgraded in memory without any writes.

Call sites (kept in sync):
- `src/worker.ts` `readLatestPush` — R2 binding path
- `src/index.ts` `readLatestPush` — S3 SDK + local fs paths

### 6.2 Migration script convention

When a schema bump to `v{n+1}` is required, a one-shot migration script must
be placed at:

```
docs/migrations/glhub-{kind}-v{n}-to-v{n+1}.ts
```

The script must be idempotent (safe to run twice), accept `--dry-run`, and
output a count of objects rewritten. It runs against the self-host data
directory or an S3-compatible endpoint. No migration scripts are required until
a schema bump occurs.

Currently documented migration paths:

| Migration | Script path | Status |
|---|---|---|
| `glhub-push` v1 → v2 | `docs/migrations/glhub-push-v1-to-v2.ts` | not yet needed |

Currently active versions:

| Schema | Version | First commit |
|---|---|---|
| `glhub-push` | v1 | `8a40832` |
| `glhub-owner` | v1 | `ed178af` |
| `glhub-forge-link` | v1 | `ed178af` |
| `glhub-webhook` | v1 | `ed178af` |

### 2.2.1 Push payload validation rules (server-side, since 2026-05-05)

`POST /api/push` rejects with HTTP 422 when any rule fails. Response body
includes `error: "payload validation failed"` and `errors[]` with one human
message per violation.

| Rule | Why |
|---|---|
| `schema_version` (if present) must equal `glhub-push/v1` | reject unknown schema rather than silently store |
| `company_id` required, matches `[A-Za-z0-9_-]+` | route key safety |
| `pushed_at` (if present) ISO 8601 | downstream parsing safety |
| `generations[]` required (may be empty) | enforce array shape |
| each `generations[i].id` matches `gen-YYYYMMDD-NNN` | viewer / lineage assumptions |
| each `generations[i].metrics.score` is a finite number, `> 0`, `≤ 1` | **0 indicates "no actual evaluation done" — see `docs/SCORING.md`** |
| each `generations[i].parent_id` (if present) matches `gen-YYYYMMDD-NNN` | edge integrity |
| each `generations[i].metrics.success` (if present) boolean | type safety |
| `generations[i].id` unique within payload | no duplicate inside one snapshot |
| `relations[]` required (may be empty) | enforce array shape |
| each `relations[i].from`, `to` match `gen-YYYYMMDD-NNN` | edge integrity |
| each `relations[i].relation_type` non-empty string | semantic edge label |
| each `relations[i].from`, `to` resolves to a generation in the same payload | snapshot is self-contained |

Implementation: `src/core/validation.ts` (pure module, ~150 lines). Both Node
self-host and Workers entry call it before `storePush`. Existing demo and
experiment data already pass — score=0 was never used, ids always conformed.

---

## 7. Public landing page contract

The landing page at `/` (no session) is the public entry surface and serves
as the *canonical product description*. The PRD's "North Star" section MUST
match the landing page lede paragraph word-for-word in English.

Languages: en (default) / ko / ja / zh, selected by:
1. `?lang=` query param (highest priority)
2. `Accept-Language` header (first match in `[ko, ja, zh, en]`)
3. fallback `en`

---

## 8. Self-host vs hosted parity matrix

| Capability | Self-host | Hosted (`glhub.baryon.ai`) |
|---|---|---|
| Read endpoints (`GET /api/...`) | full | full (push-fallback path on missing glctl) |
| `POST /api/push` | unauthenticated | Bearer + ownership |
| `POST /api/repos/.../seed-demo` | full (glctl init + 2 gen) | 501 |
| `POST /api/repos/.../generations` | full (glctl new) | 501 |
| `POST /api/repos/.../comment/...` | full | 501 |
| `GET /api/repos/.../fsck` | full | 501 |
| `POST /webhooks/github` | not exposed | active (HMAC required) |
| GitHub OAuth | not used | active |
| `company_id` ownership | not enforced | enforced |

Adding a new hosted-only endpoint (e.g. dashboard counters) requires either:
- adding a self-host equivalent that produces the same shape, or
- a written justification in the PR that this surface is hosted-tier-only
  (review by schema-keeper + selfhost-operator agents).

---

## 9. Operational parameters

| Parameter | Value | Source |
|---|---|---|
| Worker bundle (post auth+webhook+landing) | ~106 KiB upload / ~26 KiB gzip | `wrangler deploy --dry-run` |
| Custom domain | `glhub.baryon.ai` (Cloudflare custom domain binding) | `wrangler.toml [[routes]]` |
| R2 bucket | `glhub-pushes` (location: APAC) | `wrangler r2 bucket info` |
| KV namespace | `GLHUB_KV` | `wrangler.toml [[kv_namespaces]]` |
| Session TTL | 7 days | `SESSION_TTL_SECONDS` in `worker.ts` |
| OAuth state TTL | 10 min | `OAUTH_STATE_TTL_SECONDS` |
| OAuth scope | `read:user` | `core/github-oauth.ts` |

---

## 10. Out-of-spec / TODO

- ~~`branch?: string` first-class field on `GenerationRecord`~~ ✅ landed 2026-05-02.
- ~~Forge connector adapter abstraction (`src/connectors/`)~~ ✅ landed 2026-05-02.
  GitHub / GitLab / Forgejo adapters live behind `ForgeAdapter` interface.
  `/webhooks/github`, `/webhooks/gitlab`, `/webhooks/forgejo` routes active.
  GITLAB_WEBHOOK_SECRET / FORGEJO_WEBHOOK_SECRET secrets added to Env + wrangler docs.
- `glctl --token` flag (currently relies on env / config). Likely small.
- Worker bundle size monitoring CI step.
- Self-host migration tool when `schema_version` v2 lands.
- viewer-side `Accept-Language` detection for the embedded HTML viewer.
