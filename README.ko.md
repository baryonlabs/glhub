# glhub

[English](README.md) | [한국어](README.ko.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md)

<p align="center">
  <img src="assets/glhub-logo.png" alt="glhub 로고" width="640">
</p>

`glctl`은 generation lineage를 다루는 로컬 제어 도구입니다. AI 에이전트
작업에는 최종 patch, score, chat transcript만으로는 부족하기 때문에
필요합니다. 각 run은 어디에서 왔는지, 무엇이 바뀌었는지, 무엇이
개선되거나 퇴보했는지, 어떤 lesson을 배웠는지, 다음 generation이 어떤
memory를 물려받아야 하는지 남겨야 합니다. 이 lineage가 없으면 agent
work는 감사 가능한 evolution process가 아니라 서로 끊어진 output 더미가
됩니다.

`glctl`은 그 과정을 로컬 generation history로 기록합니다. 팀은 `glctl`로
lineage store를 초기화하고, 새 generation을 만들고, parent/child를
확인하고, repository health를 검증하고, graph를 렌더링하고, 공유할 준비가
되면 snapshot을 push할 수 있습니다.

Nautilus는 AI 에이전트 작업을 위한 메타 루프이자 시스템 오브 레코드입니다.
Paperclip은 하나의 프론트엔드, 즉 컨트롤 플레인/보드 UI일 뿐이며 다른
프론트엔드도 가능합니다. `glctl`과 `glhub`는 Nautilus를 직접 지원하므로
특정 프론트엔드에 의존하지 않습니다.

`glhub`는 로컬 lineage가 shared memory가 된 다음 단계입니다. GitHub가
커밋과 풀 리퀘스트를 통해 코드 리뷰를 위한 사고 공간이라면, glhub는
generation과 evolution document를 통해 진화 리뷰를 위한 사고 공간입니다.
`glhub`는 `glctl`이 기록한 history를 받아 저장하고, 탐색 가능한 evolution
workspace로 보여줍니다.

## glctl과 glhub가 필요한 이유

코드는 미러링하기 쉽습니다. 코드 주변의 작업 기억은 그렇지 않습니다.

### Ghostty가 GitHub를 떠난 배경

Ghostty가 GitHub 의존도를 줄이기로 한 결정은 glhub의 직접적인 배경 사례입니다. 중요한 교훈은 "GitHub가 나쁘다"거나 "모두 오늘 당장 이전해야 한다"가 아닙니다. Git 자체가 분산되어 있어도 실제 소프트웨어 delivery는 Git 위의 중앙화된 계층에 의존한다는 점입니다. 이슈, 풀 리퀘스트, 리뷰 큐, Actions, 상태 페이지, 계정 정책, 프로젝트별 workflow state가 여기에 포함됩니다.

그 계층이 흔들리면 팀은 여전히 저장소를 가지고 있을 수 있지만 작업은 정상적으로 움직이지 않습니다. 프로젝트는 read-only mirror를 유지하거나, 코드를 이전하거나, 다른 remote를 추가할 수 있습니다. 하지만 프로젝트 주변의 기억은 훨씬 더 옮기기 어렵습니다.

참고: [Ghostty is leaving GitHub](https://news.hada.io/topic?id=28993).

### 프로젝트 기억 문제

중앙 forge를 떠나거나 장애를 견디려는 순간마다 이 차이가 드러납니다. 저장소 clone은 commit을 보존할 수 있지만 프로젝트 운영 기억까지 자동으로 보존하지는 않습니다. 티켓, 풀 리퀘스트, 닫힌 의사결정, 예전 플랫폼으로 향하는 링크, CI 동작, maintainer 권한, branch rule, 변경 이유의 history가 그 기억입니다. 이 기록들이 파일만 가진 상태와 작업을 이해하는 상태를 가릅니다.

이 이동의 정서적 무게도 중요합니다. 오래 쓰는 개발 도구는 maintainer가 배우고 협업하고 습관을 만들고 신뢰를 쌓는 장소가 됩니다. 핵심 작업 플랫폼이 리뷰와 릴리즈를 자주 막기 시작하면 팀은 uptime만 잃는 것이 아닙니다. 프로젝트 기억과 delivery process를 자신들이 통제하고 있다는 신뢰를 잃습니다.

에이전트가 생성한 작업도 같은 문제를 겪고, 더 빠르게 겪습니다. AI run은 patch, report, score를 남길 수 있습니다. 하지만 오래 남는 자산은 그 주변의 lineage입니다. 어떤 generation에서 왔는지, 무엇이 바뀌었는지, 무엇이 개선되거나 퇴보했는지, 어떤 rule을 배웠는지, 어떤 case가 판단을 바꿨는지, 다음에 무엇을 시도해야 하는지가 중요합니다.

glhub는 에이전트 작업이 하나의 chat session, vendor UI, CI log, orchestrator database 안에 갇히지 않도록 존재합니다. AI-native team에게 generated work 주변의 reasoning trail을 담는 portable repository를 제공합니다.

기본 deployment model은 팀이 이미 신뢰하는 forge와 glhub를 연결해야 합니다.

- **GitLab OSS + glhub**: self-hosted source control, issue, merge request, CI, agent lineage를 직접 통제하려는 팀.
- **Codeberg / Forgejo + glhub**: FOSS forge 또는 hosted Forgejo instance를 쓰면서 AI lineage는 forge provider 사이에서 portable하게 유지하려는 팀.
- **GitHub + glhub**: GitHub를 collaboration surface로 유지하면서 AI-generated lineage, evaluation, evolution memory를 별도의 portable system에 저장하려는 팀.

glhub는 팀에게 첫날부터 forge를 버리라고 요구하지 않아야 합니다. 먼저 forge 주변의 AI 작업을 portable하게 만들고, 이후 팀이 GitHub에 남을지, GitLab을 운영할지, Codeberg를 쓸지, Forgejo를 self-host할지, 다른 곳으로 갈지 결정하게 해야 합니다.

## OSS와 Enterprise

glhub는 open-core model을 따릅니다. lineage primitive, 즉 record, push, view, forge connector는 Apache-2.0 아래 완전히 open-source입니다. Multi-user operation, identity, audit-grade compliance, on-prem ops는 별도의 commercial tier에 둡니다. 구조는 GitLab식 `ee/` source-available 하위 디렉터리가 아니라 Sentry식 private repo extension point에 가깝습니다.

| Capability | OSS (this repo) | Cloud (paid hosted) | Enterprise (paid + on-prem) |
|---|---|---|---|
| Generation lineage record + `glctl push` | ✅ | ✅ | ✅ |
| Local single-dev viewer (this server) | ✅ | ✅ | ✅ |
| Forge connectors (GitLab / Codeberg-Forgejo / GitHub) | ✅ basic | ✅ extended | ✅ extended + custom |
| Multi-user RBAC | — | ✅ | ✅ |
| SSO (SAML / SCIM / OIDC) | — | ✅ | ✅ |
| Hosted ops (backup, scaling, SLA) | self-host yourself | ✅ | — |
| Immutable audit log (1y+ retention) | — | partial | ✅ full |
| Signed audit pack (cryptographic provenance) | — | — | ✅ |
| Policy DSL + enforcement gate | — | — | ✅ |
| Compliance evidence packs (SOC2 / EU AI Act / NIST AI RMF / HIPAA / ISO 42001) | — | — | ✅ |
| Multi-tenancy + geo-replication | — | ✅ | ✅ |
| Air-gapped / on-prem package | self-build | — | ✅ supported |
| Org-level dashboards (cost / decisions / drift) | — | basic | ✅ full |
| Tamper-evident hash chain (Merkle per company) | — | — | ✅ |
| HSM-backed signing keys | — | — | ✅ |
| White-label (custom domain / branding) | — | — | ✅ |

OSS 사용자는 동작하는 deployment를 위해 commercial tier가 필요하지 않습니다. single-team, self-hosted, full lineage와 viewer가 OSS path입니다. Cloud와 Enterprise는 multi-team regulated buyer가 계약 전에 확인하는 identity, compliance-grade audit, policy enforcement, on-prem support를 추가합니다.

## glhub가 보여주는 것

Web view는 비교에 집중합니다.

```text
Evolution document 1 | Evolution document 2
```

generation을 선택하면 glhub는 다음을 비교합니다.

```text
parent generation | selected generation
```

각 side는 다음을 보여줍니다.

- title과 generation id
- before/after context
- score와 score delta
- tags
- 왜 evolution이 일어났는지
- do-not rules
- do rules
- 생성되거나 강화된 skills
- 고친 bugs
- 판단을 바꾼 cases
- gains
- losses와 tradeoffs

핵심 product idea는 raw JSON이 중요한 artifact가 아니라는 점입니다. 중요한 artifact는 한 generation이 다음 generation이 된 이유를 설명하는 reasoning trail입니다.

## 현재 UX

페이지 순서:

1. Header: company repository selector, manual company id input, language selector, refresh, seed demo
2. Metrics
3. Lineage graph
4. Full-width side-by-side evolution documents
5. Comment / edit composer

Web view는 다음을 지원합니다.

- English / Korean UI label
- client가 번역하는 known demo/system content
- document identity color: evolution document 1은 blue, evolution document 2는 green
- semantic status color: positive/up은 green, negative/down은 red, warning/intermediate는 amber, neutral structure는 gray

Comment와 edit proposal은 child generation으로 저장됩니다. glhub는 원본 generation document를 덮어쓰지 않기 때문에 lineage는 auditable하게 유지됩니다.

## Hosted Endpoint

호스팅 중인 glhub 인스턴스가 다음 주소에서 운영되고 있어요.

```text
https://glhub.baryon.ai
```

이 배포는 *push 수신 + viewer* 면적만 노출하는 Cloudflare Worker입니다. 모든 push snapshot은 `POST /api/push`로 받고(Bearer 토큰 필수), 같은 viewer가 push된 모든 프로젝트를 보여줍니다. mutation 엔드포인트(`seed-demo`, `generations`, `comment`)는 hosted에서 `501`을 반환하며 self-host 환경에서만 동작합니다.

URL 구조:

```text
/                                    # 로그인 게이트 (GitHub OAuth로 redirect)
/{owner}                             # 공개 프로필 — 프로젝트 목록 + forge 배지
/{owner}/{project_id}                # push된 프로젝트의 공개 viewer
/settings                            # Personal Access Token 발급/관리 (로그인 필요)
/login/cli                           # `glctl login`이 사용하는 loopback OAuth flow
/auth/github/{login,callback,logout}
/webhooks/github                     # HMAC 검증 후 R2에 기록
/api/health                          # auth + webhook 상태 보고
/api/me, /api/tokens
/api/companies, /api/pushes/:c/latest
/api/repos/:c/{status,list,lineage,show,evolution,forge-link}
```

인증 모델:

- **읽기** (GET 엔드포인트, viewer, 프로필) — 공개.
- **푸시** (`POST /api/push`) — `Authorization: Bearer glhub_pat_…` 필수. 어떤 `company_id`에 처음 push한 사용자가 owner로 등록되며, 다른 사용자의 토큰으로는 같은 `company_id`에 push할 수 없습니다 (`403`).
- **Forge 링크** (`POST /api/repos/:c/forge-link`) — owner 전용.
- **웹훅** — `X-Hub-Signature-256` HMAC-SHA256 서명 검증 필수.

self-host는 다른 모델을 따릅니다. 모든 기능 활성화, 인증 경계 없음, `glctl`을 직접 subprocess로 실행.

## 실행 (self-host)

Repository root에서:

```sh
pnpm --filter @paperclipai/glhub build
node glhub/dist/index.js
```

열기:

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

`GLCTL_PATH`가 없으면 glhub는 `glctl/target/release/glctl`이 있을 때 그것을 사용하고, 없으면 `PATH`의 `glctl`을 사용합니다.

## Seed Demo

UI에는 **Seed demo** button이 있습니다.

선택한 company id 아래에 작은 demo lineage를 만듭니다.

```text
gen-...-001 -> gen-...-002
```

API로도 seed할 수 있습니다.

```sh
curl -X POST http://127.0.0.1:3201/api/repos/demo_company/seed-demo
```

## API

### Health

```http
GET /api/health
```

`push_storage`는 R2가 설정되어 있으면 `r2`, 아니면 `local`입니다.

### Companies

```http
GET /api/companies
```

`GLCTL_DATA_DIR/companies/` 아래에서 발견한 company id를 반환합니다.

### Repository Summary

```http
GET /api/repos/:companyId/status
```

`glctl status --json`을 호출합니다.

### List Generations

```http
GET /api/repos/:companyId/list
```

`glctl list --json`을 호출합니다.

### Lineage

```http
GET /api/repos/:companyId/lineage
```

`glctl lineage --json`을 호출합니다.

### Show Generation

```http
GET /api/repos/:companyId/show/:generationId
```

`glctl show :generationId --json`을 호출합니다.

### Evolution Document

```http
GET /api/repos/:companyId/evolution/:generationId
```

current generation, parent generation, lineage children, score delta, gains/losses, retrospective fields, config patches로 readable evolution document를 만듭니다.

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

또는:

```json
{
  "kind": "edit",
  "text": "Add stale process detection as a required invariant."
}
```

이 요청은 child generation을 만듭니다.

- `kind=comment` -> tags: `comment`, `glhub-note`
- `kind=edit` -> tags: `edit`, `glhub-note`; text도 `do` retrospective item으로 기록됩니다.

### Forge Link

```http
GET  /api/repos/:companyId/forge-link
POST /api/repos/:companyId/forge-link
```

GET은 공개. POST는 owner 전용(같은 사용자 Bearer 토큰 또는 활성 세션). 쓰기 body:

```json
{ "url": "https://github.com/owner/repo" }
```

URL host로부터 provider가 자동 추론됩니다(`github`, `gitlab`, `codeberg`, `forgejo`, `bitbucket`, 그 외 `custom`). 저장·반환 형태:

```json
{
  "schema_version": "glhub-forge-link/v1",
  "company_id": "demo",
  "provider": "github",
  "repo": "owner/repo",
  "url": "https://github.com/owner/repo",
  "set_by_user_id": "...",
  "set_by_login": "...",
  "set_at": "..."
}
```

viewer는 로드 시 이 endpoint를 fetch하여 brand 옆에 배지를 그립니다. 프로필 페이지도 프로젝트별로 같은 배지를 표시합니다.

### Webhook (hosted)

```http
POST /webhooks/github
```

GitHub App webhook event를 수신합니다. 설정된 `GITHUB_WEBHOOK_SECRET`로 `X-Hub-Signature-256` HMAC-SHA256 서명을 검증합니다. event 메타데이터와 전체 payload를 다음에 저장합니다.

```text
glhub/webhooks/{event}/{delivery_id}.json
```

성공 시 `202`, 서명 불일치 시 `401`, webhook secret 미설정 시 `503`을 반환합니다.

### Push Snapshot

```http
POST /api/push
```

hosted endpoint은 `Authorization: Bearer glhub_pat_…` 필수입니다. 어떤 `company_id`에 처음 push한 사용자가 owner로 등록되며, 이후 다른 토큰으로는 `403`. self-host는 인증 없는 push도 허용합니다.

사용 예:

```sh
glctl push --remote https://glhub.baryon.ai     # hosted, `glctl login` 필요
glctl push --remote http://127.0.0.1:3201       # self-host, 인증 없음
```

## R2 Storage

glhub는 S3-compatible API를 통해 Cloudflare R2를 지원합니다.

설정:

```sh
GLHUB_R2_BUCKET=...
GLHUB_R2_ENDPOINT=...
GLHUB_R2_ACCESS_KEY_ID=...
GLHUB_R2_SECRET_ACCESS_KEY=...
GLHUB_R2_PREFIX=glhub
```

설정 후 glhub를 재시작하세요.

R2가 설정되면 `/api/push`는 다음에 씁니다.

```text
{prefix}/pushes/{company_id}/{push_id}.json
{prefix}/pushes/{company_id}/latest.json
```

R2가 없으면 같은 snapshot structure를 로컬에 씁니다.

```text
data/glhub/pushes/{company_id}/{push_id}.json
data/glhub/pushes/{company_id}/latest.json
```

## glctl Push

먼저 `glctl`을 빌드합니다.

```sh
cd glctl
cargo build --release
```

### Self-host push

```sh
GLCTL_COMPANY_ID=demo_company \
GLCTL_DATA_DIR="$HOME/.glctl/data" \
./target/release/glctl push --remote http://127.0.0.1:3201
```

### Hosted push (로그인 필요)

브라우저 인증을 한 번 거치면 토큰이 저장됩니다.

```sh
glctl login
# 브라우저 자동 오픈 → GitHub OAuth → 토큰 발급 → ~/.glctl/config에 저장
```

Headless / CI 환경에서는 `https://glhub.baryon.ai/settings`에서 토큰을 발급한 뒤 직접 저장:

```sh
glctl auth --token glhub_pat_xxxxxxxxxxxxxxxxxxxxxxxx
```

이후 push:

```sh
GLCTL_COMPANY_ID=demo_company \
GLCTL_DATA_DIR="$HOME/.glctl/data" \
glctl push --remote https://glhub.baryon.ai
```

`--remote`과 `GLHUB_URL`이 모두 없으면 `glctl push`는 기본값으로 `https://glhub.baryon.ai`를 사용합니다. 토큰 우선순위: `--token` > `GLHUB_TOKEN` > `~/.glctl/config`.

### Forge 연결

`company_id`에 첫 push를 보낸 후, viewer와 프로필 페이지에 backlink 배지를 띄우려면 forge URL을 등록합니다. provider(github / gitlab / codeberg / forgejo / bitbucket)는 URL에서 자동 추론됩니다.

```sh
TOKEN=$(jq -r .token ~/.glctl/config)
curl -X POST https://glhub.baryon.ai/api/repos/demo_company/forge-link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/your/repo"}'
```

## 검증

Repository root에서:

```sh
pnpm --filter @paperclipai/glhub typecheck
pnpm --filter @paperclipai/glhub build
```

glhub 실행 중:

```sh
curl http://127.0.0.1:3201/api/health
curl http://127.0.0.1:3201/api/repos/demo_company/status
curl http://127.0.0.1:3201/api/repos/demo_company/lineage
```

## Design Notes

glhub는 raw data browser가 되면 안 됩니다.

Design priority:

1. before/after relationship을 즉시 보여줍니다.
2. reasoning trail을 보존합니다.
3. retrospective memory를 보이게 합니다.
4. raw machine data는 product experience 뒤에 둡니다.
5. comment나 edit은 mutation이 아니라 new lineage로 다룹니다.

Core rule:

```text
Do not overwrite evolution memory. Add a new generation.
```

## Forge Integration Direction

glhub는 기존 forge를 대체하기보다 기존 forge와 통합되어야 합니다.

First-class targets:

1. **GitLab OSS + glhub**: self-hosted default path. project, issue, merge request, pipeline, commit ref, user를 읽고 generation id와 evolution document를 merge request 또는 issue에 붙입니다.
2. **Codeberg / Forgejo + glhub**: FOSS forge path. Forgejo/Gitea-compatible API로 repository, issue, pull request, comment, commit, release, user를 읽고 webhook event를 받습니다.
3. **GitHub + glhub**: 기존 open source project를 위한 pragmatic adoption path. repository, issue, pull request, checks, Actions run, comment, commit ref를 읽고 glhub evolution document link를 PR comment, issue comment, status/check annotation으로 되돌려 씁니다.

Integration contract는 forge-neutral이어야 합니다.

```text
Forge event -> glhub generation context -> agent run/evaluation -> glhub
evolution document -> forge backlink
```

Codeberg는 Codeberg-only adapter가 아니라 configurable `base_url`과 `api_root`를 가진 `forgejo` connector로 구현해야 합니다. 이렇게 하면 Codeberg, self-hosted Forgejo, compatible Gitea instance에서 같은 integration을 사용할 수 있습니다.

Forge는 사람이 이미 협업하는 장소로 남습니다. glhub는 그 협업 주변의 agent-generated work를 위한 portable memory layer가 됩니다.
