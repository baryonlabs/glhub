# glhub — Generation Lineage Hub

이 저장소는 Paperclip의 generation lineage를 받아 저장·브라우징하는 별도 제품(@paperclipai/glhub)이다. README.md가 비전과 forge 중립성 정책의 SoT.

---

## 하네스: glhub-core

**목표:** glhub repo 내부 코드(`src/index.ts`)·환경 변수·README·self-host 운영을 5명 keeper 팀(ingest-storage / lineage-read / viewer / schema / glhub-qa)이 cross-cut 정합을 유지하며 진화시킨다.

**트리거:** glhub repo 내부 작업(ingest endpoint, R2/local storage, glctl subprocess + push fallback, evolution document, 서버 임베디드 viewer HTML, schema 진화, 환경 매트릭스 검증) 요청 시 `glhub-core` 스킬을 사용. 후속 요청("재실행", "업데이트", "보완", "{영역}만 다시")도 동일 스킬로 트리거.

**부모 하네스와 경계:**
- `paperclip-gen-extend` (`/dev/nautilus/CLAUDE.md`) — Paperclip server 측 통합. glhub *외부* push 클라이언트 책임.
- `oss-launch` (`/dev/nautilus/CLAUDE.md`) — 제품·사업·OSS 출시. 코드 외 메시징·design partner·investor memo.
- **`glhub-core` (본 하네스)** — glhub repo 내부 코드·환경·README만.

요청이 마케팅/OSS 메시징이면 `oss-launch`로, Paperclip 서버 측 통합이면 `paperclip-gen-extend`로 라우팅하라.

---

**변경 이력:**

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-05-01 | 초기 구성 — 5 keeper(ingest-storage / lineage-read / viewer / schema / glhub-qa) + `glhub-core` 오케스트레이터 + 5 도메인 스킬 | 전체 | glhub repo 단독 운영 하네스 신설. 부모 paperclip-gen-extend / oss-launch와 책임 분리. |
| 2026-05-01 | 한국 페르소나 5인 보강 (additive) — korean-i18n-quality-keeper / korean-forge-integration-architect / korean-selfhost-operator / korean-oss-onboarding-host / korean-enterprise-inquiry-triage | `.claude/agents/` | 기존 기술 5 keeper가 다루지 않는 4갭(README ko/ja/zh i18n 품질, forge 어댑터 설계 무주공산, self-host 한국어 runbook, OSS 컨트리뷰터 응대 voice) + enterprise-inquiry 한국 규제 응대를 메움. lightweight 모드(Nemotron-Personas-Korea 미사용). 산출물: `_workspace/korean-persona-harness/`. |
| 2026-05-01 | 듀얼 엔트리 리팩터 + Cloudflare Workers 배포 준비 — `src/core/{types,push-fallback,viewer}.ts` 추출, `src/worker.ts` 신규(R2 binding, push-only), `wrangler.toml`/`tsconfig.worker.json`/배포 스크립트 추가 | `src/`, 빌드 설정 | hosted endpoint `glhub.baryon.ai`을 README 약속과 일치시킨다. self-host = full feature, hosted = push receiver + viewer 전용. 회의 합의 "모두를 위한 glhub" Wave 0(Deploy)에 해당. 배포 가이드: `_workspace/korean-persona-harness/07_deploy_guide.md`. |
| 2026-05-01 | 인증 boundary L1 — GitHub OAuth + Personal Access Token + company_id ownership. `src/core/{cookie,token,github-oauth,settings-html}.ts` 신규, `src/worker.ts`에 OAuth handler·token endpoint·push gate 추가, `wrangler.toml`에 KV binding 추가 | hosted endpoint | hosted glhub.baryon.ai이 *unauthenticated demo*에서 *single-user OSS preview with login*으로 포지션 변경. POST /api/push는 Bearer 토큰 + ownership 체크 필수. README "What's OSS / Enterprise" 매트릭스의 Multi-user RBAC는 여전히 Cloud/Enterprise 영역(L3). 셋업 가이드: `_workspace/korean-persona-harness/08_auth_setup_guide.md`. |
