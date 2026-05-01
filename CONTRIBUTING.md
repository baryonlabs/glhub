# Contributing to glhub

Thanks for your interest in glhub. This document explains how to file issues, propose changes, and ship a PR.

## Quick start for contributors

```sh
git clone https://github.com/baryonlabs/glhub.git
cd glhub
pnpm install
pnpm dev
```

Hit `http://localhost:3201/api/health` and confirm the response. That's your green-light.

## What kinds of contributions are welcome

- **Bug reports** — open an issue with the `bug` template. Smallest reproducer wins.
- **Forge connectors** (GitLab / Codeberg-Forgejo / GitHub) — extending or adding adapters
- **Storage backend ports** (R2, S3, GCS, MinIO, ...) — keep the interface generic
- **Docs / examples** — especially anything that improves the 5-minute quickstart
- **Performance work** — measured improvements with before/after numbers
- **Security improvements** — coordinated disclosure preferred (see [SECURITY.md](./SECURITY.md))

## What we'd rather you discuss first

Before you spend significant effort, please open an issue (or comment on an existing one):

- New top-level concepts (new endpoint families, new schema fields)
- Major refactors that span the whole `src/` tree
- Anything that overlaps with [Enterprise tier features](./README.md#whats-oss-whats-enterprise) — these likely live in the commercial repo and shipping them in OSS would re-draw our open-core line

## How to write a good PR

1. **Small** — one concern per PR. Easier to review, merge, and revert.
2. **Tested** — even a single repro added to `tests/` is more useful than a long description.
3. **Documented in the diff itself** — code comments + commit message. Avoid PR-only context that gets lost after merge.
4. **Linked to an issue** if non-trivial — `Closes #N` in the description.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/) loosely:

```
type(scope): subject — concise body line

Longer explanation if useful. Reference issues at the bottom.

Closes #42
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`. Don't agonize — clarity beats taxonomy.

## Code of conduct

Participating in this project means agreeing to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree your contributions are licensed under the Apache License 2.0 (see [LICENSE](./LICENSE)).
