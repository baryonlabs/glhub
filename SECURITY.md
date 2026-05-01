# Security Policy

## Reporting a vulnerability

Please report security issues **privately**, not as public GitHub issues.

- **Email**: security@baryonlabs.io (or the address listed on the maintainer's GitHub profile)
- **GitHub Security Advisory**: https://github.com/baryonlabs/glhub/security/advisories/new

We aim to acknowledge reports within **3 business days** and to ship a fix or coordinated disclosure within **30 days** for valid reports. For high-severity issues we'll prioritize.

## Scope

Issues in scope:

- The HTTP API surface defined in `src/index.ts`
- Authentication and authorization gaps in any released configuration
- Lineage tampering vectors (writing or rewriting another company's data)
- Storage backend handling (R2 / local FS) — leaking credentials or data
- Dependency vulnerabilities that affect a default `pnpm install` build

Issues that are **NOT** typically in scope (please use a regular issue or PR instead):

- Hardening suggestions for self-host configurations
- Missing rate limits / DoS in development mode
- Issues that require a malicious operator (e.g. you control the server itself)

## Supported versions

We support the latest tagged release on `main`. Older versions receive security fixes only by upgrading.

## Coordinated disclosure

If you've reported through the channels above, we'll work with you on a disclosure timeline. We'll credit reporters in release notes unless you prefer to stay anonymous.
