# Meeting Minutes Summarizer (Web)

## What This Is

회사 회의록(텍스트 또는 Word 파일)을 웹에 업로드하면 OpenAI GPT API로 요약하여 구조화된 Word 보고서로 다운로드할 수 있는 Vercel 웹 앱. 소규모 인원이 공유 URL로 접속해 사용한다.

> **Pivoted from v1.0**: 이전 v1.0은 Tkinter Windows 데스크톱 앱이었음. 웹 배포 요구로 Next.js + Vercel로 재설계. 이전 산출물은 `.planning/archive/v1.0-desktop-*/`에 보존.

## Core Value

**브라우저에서 회의록을 붙여넣고/업로드하면 즉시 잘 정리된 Word 보고서가 다운로드된다.** 요약 품질, Word 출력 형식, 그리고 "Vercel에서 끊김 없이 동작" 이 셋 중 하나가 깨지면 도구의 가치가 사라진다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 웹 페이지에 회의록 텍스트 직접 붙여넣기
- [ ] .docx (Word) 파일 업로드로 회의록 입력
- [ ] .txt / .md 파일 업로드 지원
- [ ] 사용자가 페이지에서 OpenAI API 키 입력 (요청당 사용, 서버 미저장)
- [ ] OpenAI GPT API로 한국어 + 영어 혼용 회의록 요약
- [ ] 요약을 4섹션 구조 (개요 / 핵심 논의 / 결정사항 / 액션아이템) Word 보고서로 생성
- [ ] 사용자가 결과 .docx 파일을 브라우저에서 다운로드
- [ ] 처리 진행 상태 표시 (요청 중 → 완료/실패)
- [ ] API 호출 실패 시 사용자에게 원인 표시
- [ ] UI 한국어
- [ ] 가벼운 비밀번호 보호 (소규모 공유용, Vercel 환경변수에 저장)
- [ ] Vercel에 배포되어 공개 URL로 접근 가능

### Out of Scope

- 음성/녹음 파일 입력 (STT) — Vercel 60초 타임아웃 + 4.5MB 요청 크기 제약. 필요시 v3 또는 별도 데스크톱 버전
- 사용자 계정 / 로그인 시스템 — 단일 비밀번호로 충분 (소규모)
- API 키 서버 저장 — 보안/책임 회피, 사용자가 매번 입력
- 회의록 저장 / 검색 / 이력 DB — 1회성 변환, 결과는 사용자가 다운로드해 관리
- 다중 사용자별 권한 / 협업 기능 — 모두가 같은 권한
- 다국어 UI — 한국어 단일
- 모바일 전용 디자인 — 데스크톱 브라우저 우선, 모바일은 동작만 보장
- PDF / PPT 입력 — Word + 텍스트로 충분

## Context

- **호스팅**: Vercel 필수 (사용자 결정). Hobby 플랜 가정 (60초 함수 타임아웃, 4.5MB 요청 크기).
- **사용 범위**: 팀/가족 등 소규모 공유. 비밀번호 1개로 보호. URL은 비공개로 관리.
- **사용자 환경**: 데스크톱 브라우저 (Chrome/Edge/Safari). 모바일은 보너스.
- **회의록 특성**: 한국어 중심, 영어 혼용. 회사 내부 정보 가능성 → 서버에 저장 안 함이 원칙.
- **API 키 모델**: 사용자가 자기 OpenAI 키를 매번 브라우저에서 입력. 서버는 요청당 한 번 사용 후 메모리에서 폐기. 키는 절대 로그/DB/환경변수에 안 남김.
- **GPT 모델**: 기본 `gpt-4o-mini` (한국어 품질·비용 균형). v1에서 검증됨.

## Constraints

- **Tech stack**: Next.js (TypeScript) + React, Vercel Serverless Functions (Vercel 표준, 사용자 결정)
- **Word 라이브러리**: npm `docx` 패키지 (서버에서 .docx 생성 후 다운로드 응답)
- **AI**: OpenAI Node.js SDK (`openai` npm)
- **함수 시간 제약**: Vercel Hobby 60초 — 매우 긴 회의록은 streaming 또는 안내 메시지로 우회. gpt-4o-mini는 일반 회의록(수천~만 토큰)에서 30초 안에 끝남.
- **요청 크기 제약**: Hobby 4.5MB — 텍스트/Word는 충분, 음성을 의도적으로 제외한 이유.
- **보안**: API 키 서버 저장 절대 금지. 비밀번호는 Vercel 환경변수 1개. HTTPS는 Vercel 기본.
- **언어**: UI 한국어, 처리 대상 한국어+영어
- **저장소**: GitHub `dahye5384-sys/sumreport` 메인 브랜치에 push → Vercel 자동 배포

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tkinter 데스크톱 → Next.js 웹 (v2.0 pivot) | Vercel 배포 요구 | — Pending |
| Vercel 호스팅 | 사용자 명시 | — Pending |
| Next.js + TypeScript | Vercel 정석 스택, .docx/OpenAI 라이브러리 풍부 | — Pending |
| 음성 입력 제거 | Vercel 60초/4.5MB 제약 회피 | — Pending |
| API 키는 사용자가 매번 입력, 서버 미저장 | 보안 책임 회피, 단일 사용자 가정 | — Pending |
| 단일 비밀번호 보호 | 소규모 공유, 풀 인증 시스템 과잉 | — Pending |
| 4섹션 보고서 구조 (Phase 3에서 도입했던 것) | v1에서 정의된 가치 그대로 | — Pending |
| GitHub `dahye5384-sys/sumreport` 그대로 사용 | 이미 연결됨 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-10 — v2.0 web pivot*
