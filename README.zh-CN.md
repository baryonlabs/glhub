# glhub

[English](README.md) | [한국어](README.ko.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md)

<p align="center">
  <img src="assets/glhub-logo.png" alt="glhub 标志" width="640">
</p>

`glctl` 是用于管理 generation lineage 的本地控制工具。它存在的原因是：
AI agent 工作不能只留下最终 patch、score 或 chat transcript。每一次 run
都需要持久记录它从哪里来、改变了什么、什么变好了、什么退化了、学到了
哪些 lesson，以及下一代 generation 应该继承哪些 memory。没有这条
lineage，agent work 就会变成一堆互相断开的 output，而不是可审计的
evolution process。

`glctl` 把这个过程记录为本地 generation history。团队可以用它初始化
lineage store、创建新的 generation、检查 parent/child、验证 repository
health、渲染 graph，并在准备共享时 push snapshot。

Nautilus 是 AI agent 工作的元循环和系统记录。Paperclip 只是一个前端，
也就是 control plane / board UI；其他前端同样可以接入。`glctl` 和
`glhub` 直接服务 Nautilus，因此不依赖某一个特定前端。

`glhub` 是本地 lineage 变成 shared memory 之后的下一步。如果说 GitHub
是通过 commit 和 pull request 进行代码审查的思考空间，那么 glhub 是
通过 generation 和 evolution document 进行演化审查的思考空间。它接收
`glctl` 记录的 history，进行存储，并把它展示为可以浏览的 evolution
workspace。

## 为什么需要 glctl 和 glhub

代码容易镜像。代码周围的工作记忆并不容易。

### Ghostty 离开 GitHub 的背景

Ghostty 决定降低对 GitHub 的依赖，是 glhub 的直接背景案例。这里的重点不是“GitHub 不好”，也不是“所有人都应该马上迁移”。重点是：即使 Git 本身是分布式的，真实的软件交付仍然依赖 Git 之上的中心化层：issue、pull request、review queue、Actions、status page、account policy 以及项目特定的 workflow state。

当这些层退化时，团队可能仍然拥有 repository，但工作无法正常流动。项目可以保留 read-only mirror、迁移代码，或者添加另一个 remote；但项目周围的记忆更难完整迁移。

参考：[Ghostty is leaving GitHub](https://news.hada.io/topic?id=28993)。

### 项目记忆问题

每当团队试图离开一个中心 forge，或需要承受一次故障时，这种差异都会出现。repository clone 可以保存 commit，但不会自动保存项目的运行记忆：ticket、pull request、已经关闭的决策、指向旧平台的链接、CI 行为、maintainer 权限、branch rule，以及为什么发生某次变更的历史。正是这些记录区分了“只有文件”和“理解工作”。

这种迁移也有情绪重量。长期使用的开发工具会成为 maintainer 学习、协作、形成习惯和积累信任的地方。当关键工作平台开始频繁阻塞 review 和 release 时，团队失去的不只是 uptime；他们也会失去对项目记忆和 delivery process 仍由自己掌控的信心。

Agent 生成的工作也有同样的问题，而且发生得更快。一次 AI run 可能留下 patch、report 或 score，但真正持久的资产是它周围的 lineage：它来自哪个 generation，发生了什么变化，什么改善了，什么退化了，学到了哪些 rule，哪些 case 改变了判断，下一步应该尝试什么。

glhub 的存在，是为了让 agent work 不被困在某个 chat session、vendor UI、CI log 或 orchestrator database 里。它为 AI-native team 提供一个 portable repository，用来保存 generated work 周围的 reasoning trail。

默认 deployment model 应该把 glhub 连接到团队已经信任的 forge：

- **GitLab OSS + glhub**：适合想要 self-host source control、issue、merge request、CI 和 agent lineage 的团队。
- **Codeberg / Forgejo + glhub**：适合想要使用 FOSS forge 或 hosted Forgejo，同时保持 AI lineage 可跨 forge provider 移动的团队。
- **GitHub + glhub**：适合继续把 GitHub 作为 collaboration surface，同时把 AI-generated lineage、evaluation 和 evolution memory 存在独立 portable system 里的团队。

glhub 不应该要求团队第一天就放弃现有 forge。它应该先让 forge 周围的 AI work 变得 portable，然后让团队决定继续留在 GitHub、运行 GitLab、使用 Codeberg、self-host Forgejo，或迁移到其他地方。

## OSS 与 Enterprise

glhub 采用 open-core model。lineage primitives，包括 record、push、view 和 forge connectors，全部以 Apache-2.0 开源。Multi-user operation、identity、audit-grade compliance 和 on-prem ops 属于单独的 commercial tier。它更接近 Sentry 式的 private repo extension point，而不是 GitLab 式的 `ee/` source-available 子目录。

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

OSS 用户不需要 commercial tier 就能部署一个可用系统。single-team、self-hosted、完整 lineage 和 viewer 是 OSS path。Cloud 和 Enterprise 添加的是 multi-team regulated buyer 在签约前通常需要的能力：identity、compliance-grade audit、policy enforcement 和 on-prem support。

## glhub 展示什么

Web view 有意围绕比较展开：

```text
Evolution document 1 | Evolution document 2
```

选择一个 generation 时，glhub 会比较：

```text
parent generation | selected generation
```

每一侧展示：

- title 和 generation id
- before / after context
- score 和 score delta
- tags
- 为什么发生 evolution
- do-not rules
- do rules
- 创建或强化的 skills
- 修复的 bugs
- 改变判断的 cases
- gains
- losses 和 tradeoffs

核心 product idea 是：重要 artifact 不是 raw JSON。重要 artifact 是解释一个 generation 如何变成下一个 generation 的 reasoning trail。

## 当前 UX

页面顺序：

1. Header：company repository selector、manual company id input、language selector、refresh、seed demo
2. Metrics
3. Lineage graph
4. Full-width side-by-side evolution documents
5. Comment / edit composer

Web view 支持：

- English / Korean UI labels
- client 侧翻译已知 demo/system content
- document identity color：evolution document 1 为 blue，evolution document 2 为 green
- semantic status color：positive/up 为 green，negative/down 为 red，warning/intermediate 为 amber，neutral structure 为 gray

Comment 和 edit proposal 会保存为 child generation。glhub 不会覆盖原始 generation document，因此 lineage 保持可审计。

## Hosted Endpoint

托管的 glhub 实例运行在以下地址：

```text
https://glhub.baryon.ai
```

此部署是仅暴露 *push 接收 + viewer* 面的 Cloudflare Worker。所有 push 快照通过 `POST /api/push` 接收（需要 Bearer token），同一个 viewer 显示所有已 push 的项目。Mutation 端点（`seed-demo`、`generations`、`comment`）在 hosted 上返回 `501`，仅在 self-host 环境下可用。

URL 结构：

```text
/                                    # 登录门户 (重定向到 GitHub OAuth)
/{owner}                             # 公开个人资料 — 项目列表 + forge 徽章
/{owner}/{project_id}                # 已 push 项目的公开 viewer
/settings                            # Personal Access Token 发放和管理 (需登录)
/login/cli                           # `glctl login` 使用的 loopback OAuth flow
/auth/github/{login,callback,logout}
/webhooks/github                     # HMAC 验证后记录到 R2
/api/health                          # auth + webhook 状态报告
/api/me, /api/tokens
/api/companies, /api/pushes/:c/latest
/api/repos/:c/{status,list,lineage,show,evolution,forge-link}
```

认证模型：

- **读取** (GET 端点、viewer、个人资料) — 公开。
- **推送** (`POST /api/push`) — 必须有 `Authorization: Bearer glhub_pat_…`。第一次向某个 `company_id` push 的用户被注册为 owner，其他用户的 token 无法向同一 `company_id` push (`403`)。
- **Forge 链接** (`POST /api/repos/:c/forge-link`) — 仅 owner 可写。
- **Webhook** — 必须有 `X-Hub-Signature-256` HMAC-SHA256 签名验证。

self-host 遵循不同的模型。全功能启用，无认证边界，直接以 subprocess 方式调用 `glctl`。

## 运行 (self-host)

在 repository root：

```sh
pnpm --filter @paperclipai/glhub build
node glhub/dist/index.js
```

打开：

```text
http://127.0.0.1:3201
```

Optional environment：

```sh
GLHUB_HOST=127.0.0.1
GLHUB_PORT=3201
GLCTL_PATH=/abs/path/to/glctl
GLCTL_DATA_DIR=/abs/path/to/data/glctl
GLHUB_DATA_DIR=/abs/path/to/data/glhub
```

如果没有设置 `GLCTL_PATH`，glhub 会优先使用 `glctl/target/release/glctl`，不存在时使用 `PATH` 中的 `glctl`。

## Seed Demo

UI 有一个 **Seed demo** button。

它会在选中的 company id 下创建一个小型 demo lineage：

```text
gen-...-001 -> gen-...-002
```

也可以通过 API seed：

```sh
curl -X POST http://127.0.0.1:3201/api/repos/demo_company/seed-demo
```

## API

### Health

```http
GET /api/health
```

`push_storage` 在配置 R2 时为 `r2`，否则为 `local`。

### Companies

```http
GET /api/companies
```

返回在 `GLCTL_DATA_DIR/companies/` 下发现的 company ids。

### Repository Summary

```http
GET /api/repos/:companyId/status
```

调用 `glctl status --json`。

### List Generations

```http
GET /api/repos/:companyId/list
```

调用 `glctl list --json`。

### Lineage

```http
GET /api/repos/:companyId/lineage
```

调用 `glctl lineage --json`。

### Show Generation

```http
GET /api/repos/:companyId/show/:generationId
```

调用 `glctl show :generationId --json`。

### Evolution Document

```http
GET /api/repos/:companyId/evolution/:generationId
```

从 current generation、parent generation、lineage children、score delta、gains/losses、retrospective fields 和 config patches 构建 readable evolution document。

### Comment / Edit Proposal

```http
POST /api/repos/:companyId/comment/:generationId
```

Body：

```json
{
  "kind": "comment",
  "text": "This decision should mention the deployment risk."
}
```

或：

```json
{
  "kind": "edit",
  "text": "Add stale process detection as a required invariant."
}
```

这会创建一个 child generation：

- `kind=comment` -> tags: `comment`, `glhub-note`
- `kind=edit` -> tags: `edit`, `glhub-note`；text 也会记录为 `do` retrospective item

### Forge Link

```http
GET  /api/repos/:companyId/forge-link
POST /api/repos/:companyId/forge-link
```

GET 公开。POST 仅 owner（同一用户的 Bearer token 或活跃 session）。写入 body：

```json
{ "url": "https://github.com/owner/repo" }
```

provider 从 URL host 自动推断（`github`、`gitlab`、`codeberg`、`forgejo`、`bitbucket`，其他为 `custom`）。存储和返回格式：

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

viewer 加载时会 fetch 此 endpoint，在 brand 旁显示徽章。个人资料页对每个项目也显示同样的徽章。

### Webhook (hosted)

```http
POST /webhooks/github
```

接收 GitHub App webhook 事件。使用配置的 `GITHUB_WEBHOOK_SECRET` 验证 `X-Hub-Signature-256` HMAC-SHA256 签名。事件元数据和完整 payload 保存到：

```text
glhub/webhooks/{event}/{delivery_id}.json
```

成功返回 `202`，签名不匹配返回 `401`，未配置 webhook secret 返回 `503`。

### Push Snapshot

```http
POST /api/push
```

hosted endpoint 必须有 `Authorization: Bearer glhub_pat_…`。第一次向某个 `company_id` push 的用户被注册为 owner，之后其他 token 会得到 `403`。self-host 允许无认证 push。

使用方式：

```sh
glctl push --remote https://glhub.baryon.ai     # hosted, 需要 `glctl login`
glctl push --remote http://127.0.0.1:3201       # self-host, 无认证
```

## R2 Storage

glhub 通过 S3-compatible API 支持 Cloudflare R2。

设置：

```sh
GLHUB_R2_BUCKET=...
GLHUB_R2_ENDPOINT=...
GLHUB_R2_ACCESS_KEY_ID=...
GLHUB_R2_SECRET_ACCESS_KEY=...
GLHUB_R2_PREFIX=glhub
```

然后重启 glhub。

配置后，`/api/push` 会写入：

```text
{prefix}/pushes/{company_id}/{push_id}.json
{prefix}/pushes/{company_id}/latest.json
```

如果没有配置 R2，glhub 会把相同的 snapshot structure 写到本地：

```text
data/glhub/pushes/{company_id}/{push_id}.json
data/glhub/pushes/{company_id}/latest.json
```

## glctl Push

先构建 `glctl`：

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

### Hosted push (需要登录)

通过浏览器认证一次后 token 会被保存。

```sh
glctl login
# 浏览器自动打开 → GitHub OAuth → token 发放 → 保存到 ~/.glctl/config
```

Headless / CI 环境可在 `https://glhub.baryon.ai/settings` 发放 token 并直接保存：

```sh
glctl auth --token glhub_pat_xxxxxxxxxxxxxxxxxxxxxxxx
```

之后 push：

```sh
GLCTL_COMPANY_ID=demo_company \
GLCTL_DATA_DIR="$HOME/.glctl/data" \
glctl push --remote https://glhub.baryon.ai
```

当没有设置 `--remote` 和 `GLHUB_URL` 时，`glctl push` 默认使用 `https://glhub.baryon.ai`。token 优先级：`--token` > `GLHUB_TOKEN` > `~/.glctl/config`。

### Forge 连接

第一次向 `company_id` push 之后，注册 forge URL 让 viewer 和个人资料页显示 backlink 徽章。provider（github / gitlab / codeberg / forgejo / bitbucket）从 URL 自动推断。

```sh
TOKEN=$(jq -r .token ~/.glctl/config)
curl -X POST https://glhub.baryon.ai/api/repos/demo_company/forge-link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/your/repo"}'
```

## 验证

在 repository root：

```sh
pnpm --filter @paperclipai/glhub typecheck
pnpm --filter @paperclipai/glhub build
```

glhub 运行时：

```sh
curl http://127.0.0.1:3201/api/health
curl http://127.0.0.1:3201/api/repos/demo_company/status
curl http://127.0.0.1:3201/api/repos/demo_company/lineage
```

## Design Notes

glhub 不应该变成 raw data browser。

Design priority：

1. 立即展示 before/after relationship。
2. 保存 reasoning trail。
3. 让 retrospective memory 可见。
4. 将 raw machine data 放在 product experience 后面。
5. 把每个 comment 或 edit 当成 new lineage，而不是原地 mutation。

Core rule：

```text
Do not overwrite evolution memory. Add a new generation.
```

## Forge Integration Direction

glhub 应该与现有 forge 集成，而不是替代它们。

First-class targets：

1. **GitLab OSS + glhub**：self-hosted default path。读取 project、issue、merge request、pipeline、commit ref 和 user，并把 generation id 与 evolution document 附加到 merge request 或 issue。
2. **Codeberg / Forgejo + glhub**：FOSS forge path。通过 Forgejo/Gitea-compatible API 读取 repository、issue、pull request、comment、commit、release 和 user，并接收 webhook event。
3. **GitHub + glhub**：面向现有 open source project 的 pragmatic adoption path。读取 repository、issue、pull request、checks、Actions run、comment 和 commit ref，并把 glhub evolution document link 写回 PR comment、issue comment 或 status/check annotation。

Integration contract 应该保持 forge-neutral：

```text
Forge event -> glhub generation context -> agent run/evaluation -> glhub
evolution document -> forge backlink
```

对于 Codeberg，应该实现为带有 configurable `base_url` 和 `api_root` 的 `forgejo` connector，而不是 Codeberg-only adapter。这样同一个 integration 可以用于 Codeberg、self-hosted Forgejo 和 compatible Gitea instance。

Forge 仍然是人类已经在协作的地方。glhub 成为围绕这种协作的 agent-generated work 的 portable memory layer。
