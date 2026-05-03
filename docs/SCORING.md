# glhub — Scoring & Score Tracking

**Status**: living document
**Last sync**: 2026-05-04

## What `metrics.score` is

`GenerationRecord.metrics.score` is a single floating-point value in the range
`[0, 1]` that represents a **subjective evaluation** of a generation against
its parent. It is set explicitly by the author or agent that creates the
generation, typically via:

```sh
glctl new --soul "..." --score 0.82
```

It is **not auto-computed**. glhub never overwrites a score after it is
recorded.

## What is tracked automatically

Although the score itself is manual, glhub computes derived metrics for
every generation pair:

- **`score_delta`** = `child.metrics.score − parent.metrics.score`, rounded
  to 6 decimal places. Surfaced in:
  - `GET /api/repos/:c/evolution/:gen` → `transition.score_delta`
  - The viewer's evolution document (color-coded: + green / − red / 0 gray)
  - The lineage timeline (each row shows score; deltas are visually
    apparent in the timeline)
- **`success`** flag (boolean) — recorded next to score, surfaced as a
  green/red dot on each lineage row
- **Time series** — generations are timestamped, so the lineage IS the
  score history

## What is NOT tracked

By design, glhub OSS does not enforce:

- A formal scoring **rubric** (which dimensions count, how to weight them)
- Automated **score validation** (a token can submit `0.99` for any change)
- LLM-as-judge or test-pass-rate **auto-evaluation**
- **Anomaly detection** (e.g., flag a +0.30 jump for review)

These belong to a higher tier (Cloud / Enterprise) where buyer-side
expectations include audit-grade scoring.

## Why scoring is intentionally subjective

> Forced rubrics drift across domains.

A score of `0.85` for a hackathon agent that improved code-gen latency by
40% is incomparable to `0.85` for a regulated-buyer agent that closed an
ISMS-P compliance gap. Per-domain rubrics are the right granularity, but
they belong **next to the team**, not in the lineage primitive.

The companion design: a per-company `rubric.yaml` that documents which
dimensions count for that team, with the viewer rendering a dimension
breakdown when present. This is queued for a future schema iteration
(`schema_version: glhub-rubric/v1`) and is **not** in the current OSS
release.

## How to use scoring well today

Recommended conventions (not enforced by code):

1. **Anchor the seed** — give the first generation in a lineage a
   conservative score (`~0.5`) so deltas tell a real story.
2. **Score against the parent only** — not against absolute perfection.
   `score = how much better than parent`, normalized to `[0, 1]`.
3. **Document the dimensions in `philosophical_note`** — because there is
   no rubric, the prose explains *why* this generation earned this number.
4. **Include `cases[]` for big jumps** — a `+0.10` jump should have at
   least one `retrospective.cases[].name` recording the case that changed
   judgment.
5. **Failure goes to `success: false` not `score: 0`** — a failed run is
   distinct from a low-quality result. `success` is independent of `score`.

## Future tracking (Cloud / Enterprise tier candidates)

| Capability | Tier | Status |
|---|---|---|
| Per-company `rubric.yaml` schema | Cloud | designed, not built |
| Dimension breakdown in viewer | Cloud | designed, not built |
| Auto-score from test pass rate | Cloud | not designed |
| LLM-as-judge integration | Cloud | not designed |
| Score audit log (who set what when) | Enterprise | implicit via R2 immutable push records; explicit log not built |
| Tamper-evident hash chain on scores | Enterprise | tier matrix item, not built |
| Anomaly detection on score deltas | Cloud / Enterprise | not designed |

## Where this is referenced

- **PRD §4.1** — "Authenticate the hosted endpoint via GitHub OAuth +
  Personal Access Tokens; enforce `company_id` ownership on first push"
  is the only auth boundary that constrains who can submit scores in OSS.
- **SPEC §2.1** — `GenerationRecord.metrics.score` field definition.
- **README open-core matrix** — Cloud / Enterprise rows hint at scoring
  governance that ships in commercial tiers.

## Open questions

1. Should `score` accept negative values for explicit regression
   markers, or stay `[0, 1]` and rely on `score_delta < 0`?
   **Decision**: stay `[0, 1]`. Delta carries direction.
2. Should the viewer show a small inline rubric link when
   `rubric.yaml` exists for the company?
   **Decision pending**: yes, when the rubric schema lands.
3. Should `glctl new --score` validate the value is `[0, 1]`?
   **Yes** — currently *no* validation. Track as a `glctl` issue.
