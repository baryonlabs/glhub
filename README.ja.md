# glhub

[English](README.md) | [한국어](README.ko.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md)

<p align="center">
  <img src="assets/glhub-logo.png" alt="glhub ロゴ" width="640">
</p>

`glctl` は generation lineage を扱う local control tool です。AI agent
work には final patch、score、chat transcript だけでは足りないため、
これが必要になります。各 run は、どこから来たのか、何が変わったのか、
何が改善し何が後退したのか、どの lesson を学んだのか、次の generation
がどの memory を継承すべきかを durable に記録する必要があります。その
lineage がなければ、agent work は auditable な evolution process では
なく、互いに切り離された output の集まりになります。

`glctl` はその process を local generation history として記録します。
team は `glctl` を使って lineage store を初期化し、新しい generation を
作成し、parent/child を確認し、repository health を検証し、graph を
render し、共有できる状態になった snapshot を push できます。

Nautilus は AI agent work の meta-loop であり system of record です。
Paperclip は frontend の一つ、つまり control plane / board UI であり、
他の frontend も接続できます。`glctl` と `glhub` は Nautilus を直接支える
ため、特定の frontend には依存しません。

`glhub` は local lineage が shared memory になった後の段階です。GitHub
が commit と pull request を通じて code review を行うための思考空間だと
すれば、glhub は generation と evolution document を通じて evolution
review を行うための思考空間です。`glctl` が記録した history を受け取り、
保存し、閲覧可能な evolution workspace として提示します。

## glctl と glhub が存在する理由

コードは mirror しやすいものです。コードの周辺にある作業記憶はそうではありません。

### Ghostty が GitHub を離れる背景

Ghostty が GitHub への依存を減らす判断をしたことは、glhub の直接的な背景事例です。重要なのは「GitHub が悪い」でも「全員が今日すぐ移行すべき」でもありません。Git 自体が分散されていても、実際の software delivery は Git の上にある中央集権的な層に依存している、という点です。issue、pull request、review queue、Actions、status page、account policy、project-specific workflow state がそこに含まれます。

その層が劣化すると、team は repository を持っていても work を正常に進められません。project は read-only mirror を保つことも、code を移行することも、別の remote を追加することもできます。しかし project 周辺の memory をきれいに移すのはずっと難しいことです。

参照: [Ghostty is leaving GitHub](https://news.hada.io/topic?id=28993)。

### project memory problem

team が central forge から離れようとするとき、または outage を乗り越えようとするとき、この違いが必ず現れます。repository clone は commit を保存できますが、project の operating memory を自動的に保存するわけではありません。ticket、pull request、閉じられた decision、旧 platform への link、CI behavior、maintainer permission、branch rule、そして why a change happened の history が必要です。これらの record が、ただ file を持っている状態と work を理解している状態を分けます。

この移行には感情的な重みもあります。長く使われる developer tool は、maintainer が学び、協力し、習慣を作り、信頼を蓄積する場所になります。critical work platform が review と release work を繰り返し妨げるようになると、team は uptime だけを失うのではありません。project memory と delivery process を自分たちが control しているという信頼も失います。

Agent-generated work も同じ問題を持ち、さらに速く進みます。AI run は patch、report、score を残すかもしれません。しかし durable asset はその周辺の lineage です。どの generation から来たのか、何が変わったのか、何が改善し何が後退したのか、どの rule を学んだのか、どの case が判断を変えたのか、次に何を試すべきかが重要です。

glhub は agent work が一つの chat session、vendor UI、CI log、orchestrator database に閉じ込められないように存在します。AI-native team に、generated work 周辺の reasoning trail を保存する portable repository を提供します。

default deployment model は、team がすでに信頼している forge と glhub を接続すべきです。

- **GitLab OSS + glhub**: self-hosted source control、issue、merge request、CI、agent lineage を自分たちで control したい team。
- **Codeberg / Forgejo + glhub**: FOSS forge または hosted Forgejo instance を使いながら、AI lineage を forge provider 間で portable に保ちたい team。
- **GitHub + glhub**: GitHub を collaboration surface として維持しつつ、AI-generated lineage、evaluation、evolution memory を別の portable system に保存したい team。

glhub は team に初日から forge を捨てることを求めるべきではありません。まずその forge 周辺の AI work を portable にし、その後で team が GitHub に残るのか、GitLab を運用するのか、Codeberg を使うのか、Forgejo を self-host するのか、別の場所へ移るのかを決められるようにします。

## OSS と Enterprise

glhub は open-core model を採用します。lineage primitives、つまり record、push、view、forge connectors は Apache-2.0 の下で完全に open-source です。Multi-user operation、identity、audit-grade compliance、on-prem ops は別の commercial tier に置きます。GitLab 型の `ee/` source-available subdirectory ではなく、Sentry 型の private repo extension point に近い構成です。

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

OSS users は、動く deployment を ship するために commercial tier を必要としません。single-team、self-hosted、full lineage と viewer が OSS path です。Cloud と Enterprise は、multi-team regulated buyer が契約前に確認する identity、compliance-grade audit、policy enforcement、on-prem support を追加します。

## glhub が表示するもの

Web view は意図的に comparison を中心にしています。

```text
Evolution document 1 | Evolution document 2
```

generation を選ぶと、glhub は次を比較します。

```text
parent generation | selected generation
```

各 side は次を表示します。

- title と generation id
- before / after context
- score と score delta
- tags
- なぜ evolution が起きたのか
- do-not rules
- do rules
- 作成または強化された skills
- 修正された bugs
- 判断を変えた cases
- gains
- losses と tradeoffs

core product idea は、重要な artifact は raw JSON ではないという点です。重要な artifact は、一つの generation が次の generation になった理由を説明する reasoning trail です。

## 現在の UX

page order:

1. Header: company repository selector、manual company id input、language selector、refresh、seed demo
2. Metrics
3. Lineage graph
4. Full-width side-by-side evolution documents
5. Comment / edit composer

Web view は次をサポートします。

- English / Korean UI labels
- client が翻訳する known demo/system content
- document identity color: evolution document 1 は blue、evolution document 2 は green
- semantic status color: positive/up は green、negative/down は red、warning/intermediate は amber、neutral structure は gray

Comment と edit proposal は child generation として保存されます。glhub は original generation document を overwrite しないため、lineage は auditable なまま保たれます。

## Hosted Endpoint

ホストされている glhub インスタンスは次のアドレスで運用されています。

```text
https://glhub.baryon.ai
```

このデプロイは *push 受信 + viewer* の面積のみを公開する Cloudflare Worker です。すべての push スナップショットを `POST /api/push` で受け取り (Bearer トークン必須)、push されたすべてのプロジェクトを同じ viewer で表示します。mutation エンドポイント (`seed-demo`, `generations`, `comment`) は hosted では `501` を返し、self-host 環境でのみ動作します。

URL 構造:

```text
/                                    # サインインゲート (GitHub OAuth へリダイレクト)
/{owner}                             # 公開プロフィール — プロジェクト一覧 + forge バッジ
/{owner}/{project_id}                # push されたプロジェクトの公開 viewer
/settings                            # Personal Access Token 発行・管理 (ログイン必須)
/login/cli                           # `glctl login` が使う loopback OAuth flow
/auth/github/{login,callback,logout}
/webhooks/github                     # HMAC 検証後 R2 に記録
/api/health                          # auth + webhook ステータスを報告
/api/me, /api/tokens
/api/companies, /api/pushes/:c/latest
/api/repos/:c/{status,list,lineage,show,evolution,forge-link}
```

認証モデル:

- **読み取り** (GET エンドポイント、viewer、プロフィール) — 公開。
- **プッシュ** (`POST /api/push`) — `Authorization: Bearer glhub_pat_…` 必須。ある `company_id` に最初に push したユーザーが owner として登録され、他のユーザーのトークンでは同じ `company_id` に push できません (`403`)。
- **Forge リンク** (`POST /api/repos/:c/forge-link`) — owner 専用。
- **Webhook** — `X-Hub-Signature-256` HMAC-SHA256 署名検証必須。

self-host は別のモデルに従います。全機能有効、認証境界なし、`glctl` を直接 subprocess として実行。

## 実行 (self-host)

repository root で:

```sh
pnpm --filter @paperclipai/glhub build
node glhub/dist/index.js
```

開く:

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

`GLCTL_PATH` が設定されていない場合、glhub は `glctl/target/release/glctl` があればそれを使い、なければ `PATH` 上の `glctl` を使います。

## Seed Demo

UI には **Seed demo** button があります。

選択した company id の下に小さな demo lineage を作成します。

```text
gen-...-001 -> gen-...-002
```

API からも seed できます。

```sh
curl -X POST http://127.0.0.1:3201/api/repos/demo_company/seed-demo
```

## API

### Health

```http
GET /api/health
```

`push_storage` は R2 が設定されている場合 `r2`、それ以外は `local` です。

### Companies

```http
GET /api/companies
```

`GLCTL_DATA_DIR/companies/` 以下で見つかった company ids を返します。

### Repository Summary

```http
GET /api/repos/:companyId/status
```

`glctl status --json` を呼び出します。

### List Generations

```http
GET /api/repos/:companyId/list
```

`glctl list --json` を呼び出します。

### Lineage

```http
GET /api/repos/:companyId/lineage
```

`glctl lineage --json` を呼び出します。

### Show Generation

```http
GET /api/repos/:companyId/show/:generationId
```

`glctl show :generationId --json` を呼び出します。

### Evolution Document

```http
GET /api/repos/:companyId/evolution/:generationId
```

current generation、parent generation、lineage children、score delta、gains/losses、retrospective fields、config patches から readable evolution document を作ります。

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

または:

```json
{
  "kind": "edit",
  "text": "Add stale process detection as a required invariant."
}
```

これにより child generation が作成されます。

- `kind=comment` -> tags: `comment`, `glhub-note`
- `kind=edit` -> tags: `edit`, `glhub-note`; text も `do` retrospective item として記録されます

### Forge Link

```http
GET  /api/repos/:companyId/forge-link
POST /api/repos/:companyId/forge-link
```

GET は公開。POST は owner 専用 (同じユーザーの Bearer トークンまたはアクティブなセッション)。書き込みボディ:

```json
{ "url": "https://github.com/owner/repo" }
```

URL ホストから provider が自動推論されます (`github`, `gitlab`, `codeberg`, `forgejo`, `bitbucket`, それ以外は `custom`)。保存・返却される形:

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

viewer はロード時にこの endpoint を fetch し、brand の横にバッジを表示します。プロフィールページもプロジェクトごとに同じバッジを表示します。

### Webhook (hosted)

```http
POST /webhooks/github
```

GitHub App の webhook event を受信します。設定された `GITHUB_WEBHOOK_SECRET` で `X-Hub-Signature-256` HMAC-SHA256 署名を検証します。event のメタデータと payload 全体を次に保存します。

```text
glhub/webhooks/{event}/{delivery_id}.json
```

成功時 `202`、署名不一致時 `401`、webhook secret 未設定時 `503` を返します。

### Push Snapshot

```http
POST /api/push
```

hosted endpoint は `Authorization: Bearer glhub_pat_…` 必須です。ある `company_id` に最初に push したユーザーが owner として登録され、以降他のトークンでは `403`。self-host は認証なしの push も許可します。

使用例:

```sh
glctl push --remote https://glhub.baryon.ai     # hosted, `glctl login` が必要
glctl push --remote http://127.0.0.1:3201       # self-host, 認証なし
```

## R2 Storage

glhub は S3-compatible API を通じて Cloudflare R2 をサポートします。

設定:

```sh
GLHUB_R2_BUCKET=...
GLHUB_R2_ENDPOINT=...
GLHUB_R2_ACCESS_KEY_ID=...
GLHUB_R2_SECRET_ACCESS_KEY=...
GLHUB_R2_PREFIX=glhub
```

その後 glhub を restart してください。

設定されている場合、`/api/push` は次へ書き込みます。

```text
{prefix}/pushes/{company_id}/{push_id}.json
{prefix}/pushes/{company_id}/latest.json
```

R2 が設定されていない場合、glhub は同じ snapshot structure を local に書き込みます。

```text
data/glhub/pushes/{company_id}/{push_id}.json
data/glhub/pushes/{company_id}/latest.json
```

## glctl Push

まず `glctl` を build します。

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

### Hosted push (ログイン必須)

ブラウザで一度認証するとトークンが保存されます。

```sh
glctl login
# ブラウザが自動で開く → GitHub OAuth → トークン発行 → ~/.glctl/config に保存
```

Headless / CI 環境では `https://glhub.baryon.ai/settings` でトークンを発行して直接保存:

```sh
glctl auth --token glhub_pat_xxxxxxxxxxxxxxxxxxxxxxxx
```

その後 push:

```sh
GLCTL_COMPANY_ID=demo_company \
GLCTL_DATA_DIR="$HOME/.glctl/data" \
glctl push --remote https://glhub.baryon.ai
```

`--remote` と `GLHUB_URL` のどちらもない場合、`glctl push` は default で `https://glhub.baryon.ai` を使用します。トークン優先順位: `--token` > `GLHUB_TOKEN` > `~/.glctl/config`。

### Forge 接続

`company_id` への最初の push の後、viewer とプロフィールページに backlink バッジを表示するために forge URL を登録します。provider (github / gitlab / codeberg / forgejo / bitbucket) は URL から自動推論されます。

```sh
TOKEN=$(jq -r .token ~/.glctl/config)
curl -X POST https://glhub.baryon.ai/api/repos/demo_company/forge-link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/your/repo"}'
```

## 検証

repository root で:

```sh
pnpm --filter @paperclipai/glhub typecheck
pnpm --filter @paperclipai/glhub build
```

glhub 実行中:

```sh
curl http://127.0.0.1:3201/api/health
curl http://127.0.0.1:3201/api/repos/demo_company/status
curl http://127.0.0.1:3201/api/repos/demo_company/lineage
```

## Design Notes

glhub は raw data browser になるべきではありません。

Design priority:

1. before/after relationship をすぐに見せる。
2. reasoning trail を保存する。
3. retrospective memory を見えるようにする。
4. raw machine data を product experience の後ろに置く。
5. comment や edit を mutation ではなく new lineage として扱う。

Core rule:

```text
Do not overwrite evolution memory. Add a new generation.
```

## Forge Integration Direction

glhub は existing forge を置き換えるのではなく、統合されるべきです。

First-class targets:

1. **GitLab OSS + glhub**: self-hosted default path。project、issue、merge request、pipeline、commit ref、user を読み、generation id と evolution document を merge request または issue に添付します。
2. **Codeberg / Forgejo + glhub**: FOSS forge path。Forgejo/Gitea-compatible API を通じて repository、issue、pull request、comment、commit、release、user を読み、webhook event を受け取ります。
3. **GitHub + glhub**: existing open source project のための pragmatic adoption path。repository、issue、pull request、checks、Actions run、comment、commit ref を読み、glhub evolution document link を PR comment、issue comment、status/check annotation として書き戻します。

Integration contract は forge-neutral であるべきです。

```text
Forge event -> glhub generation context -> agent run/evaluation -> glhub
evolution document -> forge backlink
```

Codeberg については、Codeberg-only adapter ではなく configurable `base_url` と `api_root` を持つ `forgejo` connector として実装するべきです。これにより、同じ integration を Codeberg、self-hosted Forgejo、compatible Gitea instance で利用できます。

Forge は human がすでに collaborate している場所として残ります。glhub はその collaboration 周辺の agent-generated work のための portable memory layer になります。
