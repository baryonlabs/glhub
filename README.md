# glhub

`glhub` is the Generation Lineage Hub for Paperclip.

If GitHub is a thinking space for code review through commits and pull requests,
glhub is a thinking space for evolution review through generations and evolution
documents.

`glctl` records local generation history. `glhub` receives, stores, and presents
that history as a browsable evolution workspace.

## What glhub Shows

The web view is intentionally centered on comparison:

```text
Evolution document 1 | Evolution document 2
```

When a generation is selected, glhub compares:

```text
parent generation | selected generation
```

Each side shows:

- title and generation id
- before and after context
- score and score delta
- tags
- why the evolution happened
- do-not rules
- do rules
- skills created or strengthened
- bugs fixed
- cases that changed the decision
- gains
- losses and tradeoffs

This is the core product idea: the important artifact is not raw JSON. The
important artifact is the reasoning trail that explains how one generation
became the next.

## Current UX

The page order is:

1. Header
   - company repository selector
   - manual company id input
   - language selector
   - refresh
   - seed demo
2. Metrics
3. Lineage graph
4. Full-width side-by-side evolution documents
5. Comment / edit composer

The web view supports:

- English / Korean UI labels
- known demo/system content translated by the client
- color-coded document identity
  - evolution document 1: blue
  - evolution document 2: green
- semantic status colors
  - positive/up: green
  - negative/down: red
  - warning/intermediate: amber
  - neutral structure: gray

Comments and edit proposals are saved as child generations. glhub does not
overwrite the original generation document, so the lineage remains auditable.

## Run

From the repository root:

```sh
pnpm --filter @paperclipai/glhub build
node glhub/dist/index.js
```

Open:

```text
http://127.0.0.1:3201
```

Optional environment:

```sh
GLHUB_HOST=127.0.0.1
GLHUB_PORT=3201
GLCTL_PATH=/abs/path/to/glctl
GLCTL_DATA_DIR=/abs/path/to/data/glctl
GLHUB_DATA_DIR=/abs/path/to/data/glhub
```

If `GLCTL_PATH` is not set, glhub uses:

```text
glctl/target/release/glctl
```

when present, otherwise `glctl` from `PATH`.

## Seed Demo

The UI has a **Seed demo** button.

It creates a small demo lineage under the selected company id:

```text
gen-...-001 -> gen-...-002
```

You can also seed through the API:

```sh
curl -X POST http://127.0.0.1:3201/api/repos/demo_company/seed-demo
```

## API

### Health

```http
GET /api/health
```

Response:

```json
{
  "ok": true,
  "service": "glhub",
  "glctl_path": "/abs/path/to/glctl",
  "data_dir": "/abs/path/to/data/glctl",
  "push_storage": "local",
  "push_prefix": "/abs/path/to/data/glhub"
}
```

`push_storage` is `r2` when R2 is configured, otherwise `local`.

### Companies

```http
GET /api/companies
```

Returns company ids discovered under:

```text
GLCTL_DATA_DIR/companies/
```

### Repository Summary

```http
GET /api/repos/:companyId/status
```

Calls:

```sh
glctl status --json
```

### List Generations

```http
GET /api/repos/:companyId/list
```

Calls:

```sh
glctl list --json
```

### Lineage

```http
GET /api/repos/:companyId/lineage
```

Calls:

```sh
glctl lineage --json
```

### Show Generation

```http
GET /api/repos/:companyId/show/:generationId
```

Calls:

```sh
glctl show :generationId --json
```

### Evolution Document

```http
GET /api/repos/:companyId/evolution/:generationId
```

Builds a readable evolution document from:

- current generation
- parent generation
- lineage children
- score delta
- gains/losses
- retrospective fields
- config patches

Response shape:

```json
{
  "id": "gen-20260427-003",
  "title": "Capture retrospective as first-class evolution memory",
  "before": {
    "id": "gen-20260427-002",
    "soul": "Improve lineage visibility for judges",
    "score": 0.81,
    "success": true,
    "tags": ["demo", "glhub"]
  },
  "transition": {
    "relation": "evolved_from",
    "score_delta": 0.08,
    "gains": [],
    "losses": [],
    "note": "",
    "retrospective": {
      "do_not": [],
      "do": [],
      "skills": [],
      "bugs_fixed": [],
      "cases": []
    },
    "config_patches": []
  },
  "after": {
    "id": "gen-20260427-003",
    "soul": "Capture retrospective as first-class evolution memory",
    "score": 0.89,
    "success": true,
    "tags": ["retrospective", "glhub"],
    "created_at": "2026-04-27T17:55:03Z"
  },
  "next": []
}
```

### Comment / Edit Proposal

```http
POST /api/repos/:companyId/comment/:generationId
```

Body:

```json
{
  "kind": "comment",
  "text": "This decision should mention the deployment risk."
}
```

or:

```json
{
  "kind": "edit",
  "text": "Add stale process detection as a required invariant."
}
```

This creates a child generation:

- `kind=comment` -> tags: `comment`, `glhub-note`
- `kind=edit` -> tags: `edit`, `glhub-note`; the text is also recorded as a `do` retrospective item

### Push Snapshot

```http
POST /api/push
```

Used by:

```sh
glctl push --remote http://127.0.0.1:3201
```

Payload:

```json
{
  "schema_version": "glhub-push/v1",
  "company_id": "demo_company",
  "pushed_at": "2026-04-27T18:23:15Z",
  "status": {
    "company_id": "demo_company",
    "generation_count": 3,
    "relation_count": 2,
    "seed_count": 1,
    "head_count": 1,
    "latest_generation_id": "gen-...",
    "best_generation_id": "gen-..."
  },
  "generations": [],
  "relations": []
}
```

Response:

```json
{
  "ok": true,
  "company_id": "demo_company",
  "generations": 3,
  "relations": 2,
  "storage": {
    "driver": "local",
    "key": ".../data/glhub/pushes/demo_company/....json",
    "latest_key": ".../data/glhub/pushes/demo_company/latest.json"
  }
}
```

## R2 Storage

glhub supports Cloudflare R2 through the S3-compatible API.

Set:

```sh
GLHUB_R2_BUCKET=...
GLHUB_R2_ENDPOINT=...
GLHUB_R2_ACCESS_KEY_ID=...
GLHUB_R2_SECRET_ACCESS_KEY=...
GLHUB_R2_PREFIX=glhub
```

Then restart glhub.

When configured, `/api/push` writes:

```text
{prefix}/pushes/{company_id}/{push_id}.json
{prefix}/pushes/{company_id}/latest.json
```

If R2 is not configured, glhub writes the same snapshot structure locally:

```text
data/glhub/pushes/{company_id}/{push_id}.json
data/glhub/pushes/{company_id}/latest.json
```

## glctl Push

Build `glctl` first:

```sh
cd glctl
cargo build --release
```

Push:

```sh
GLCTL_COMPANY_ID=demo_company \
GLCTL_DATA_DIR=/Users/hongmartin/dev/nautilus/data/glctl \
./target/release/glctl push --remote http://127.0.0.1:3201
```

## Verification

From the repository root:

```sh
pnpm --filter @paperclipai/glhub typecheck
pnpm --filter @paperclipai/glhub build
```

With glhub running:

```sh
curl http://127.0.0.1:3201/api/health
curl http://127.0.0.1:3201/api/repos/demo_company/status
curl http://127.0.0.1:3201/api/repos/demo_company/lineage
```

## Design Notes

glhub should not become a raw data browser.

The design priority is:

1. Show the before/after relationship immediately.
2. Preserve the reasoning trail.
3. Make retrospective memory visible.
4. Keep raw machine data behind the product experience.
5. Treat every comment or edit as new lineage, not mutation in place.

The core rule:

```text
Do not overwrite evolution memory. Add a new generation.
```

