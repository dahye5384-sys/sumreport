# Meeting Minutes Summarizer

## What This Is

회사 회의록(텍스트, Word, 음성 녹음 등)을 입력하면 OpenAI GPT API로 자동 요약하여 구조화된 Word 보고서로 출력하는 Windows 데스크톱 프로그램. 개인이 회의 정리 시간을 줄이기 위한 도구.

## Core Value

**원본 회의록을 넣으면 즉시 잘 정리된 Word 보고서가 나온다.** 요약 품질과 Word 출력의 형식이 가장 중요하다 — 둘 중 하나가 깨지면 도구의 가치가 사라진다.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] 텍스트 파일 (.txt, .md) 회의록 입력 지원
- [ ] Word 문서 (.docx) 회의록 입력 지원
- [ ] 음성/녹음 파일 (.mp3, .wav, .m4a) 입력 지원 (STT로 텍스트 변환 후 요약)
- [ ] GUI에서 텍스트 직접 붙여넣기 입력 지원
- [ ] OpenAI GPT API로 회의록 요약
- [ ] API 키 설정/저장 (로컬 보관)
- [ ] 한국어 + 영어 혼용 회의록 처리
- [ ] 요약 결과를 구조화된 Word(.docx) 파일로 출력
- [ ] 보고서에 "회의 개요(날짜/참석자/주제)" 섹션 자동 생성
- [ ] 보고서에 "핵심 논의 사항" 섹션 (bullet 요약)
- [ ] 보고서에 "결정사항" 섹션
- [ ] 보고서에 "액션아이템(담당자, 기한)" 섹션
- [ ] 간단한 Windows 데스크톱 GUI (드래그앤드롭 또는 파일 선택)
- [ ] 처리 진행 상황 표시 (긴 회의록 / 음성 STT 시)
- [ ] 출력 Word 파일 저장 위치 선택

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- 다중 사용자 / 협업 기능 — 개인용 도구로 정의
- 웹 서비스 / 클라우드 배포 — 로컬 데스크톱으로 충분
- 회의록 저장/검색 DB — 1회성 변환 도구. 결과는 사용자가 파일로 관리
- 실시간 회의 녹음 (라이브 캡처) — 사후 변환에 집중
- 로컬 LLM(Ollama 등) 지원 — 사용자가 GPT API 선택. 추가 복잡도 회피
- macOS / Linux 지원 — Windows 단독 환경
- 다국어 UI — 한국어 단일
- PDF / PPT 등 입력 형식 — docx/txt/음성으로 충분

## Context

- **사용자 환경**: 개인 Windows PC. 사용자 본인이 직접 설치/실행.
- **회의록 특성**: 회사 내부 회의 — 한국어 위주, 가끔 영어 혼용. 민감정보 가능성 있음.
- **프라이버시 트레이드오프**: 사용자가 OpenAI API 사용을 선택함 (요약 품질 우선). 데이터가 외부로 전송된다는 점은 인지하고 진행. API 키는 로컬에만 저장.
- **사용 빈도**: 회의 발생 시 1건씩 변환. 배치 처리는 우선순위 낮음.
- **음성 STT**: OpenAI Whisper API 또는 로컬 whisper 모델로 처리 가능 (구현 단계에서 결정).

## Constraints

- **Tech stack**: Windows 데스크톱 (Python + PyQt/Tkinter 또는 Electron 류) — 사용자가 추천 받음
- **AI**: OpenAI GPT API 고정 (사용자 결정). 다른 LLM 제공자 추상화는 v2 이상.
- **출력 형식**: Microsoft Word (.docx) 필수 — Word에서 바로 열려야 함 (python-docx 등)
- **언어**: UI 한국어, 처리 대상 한국어+영어
- **사용자 수**: 1명 (개인용) — 패키징/설치 가이드는 최소
- **보안**: API 키는 평문 저장 금지 (OS 자격증명 저장소 또는 암호화 저장)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| OpenAI GPT API 사용 | 사용자 명시 선택, 한국어 요약 품질 우수 | — Pending |
| 데스크톱 GUI (웹/CLI 아님) | 개인용 + 비개발자 친화적 사용감 | — Pending |
| 개인용으로 한정 (다중 사용자 X) | 범위 폭주 방지, MVP 빠른 출시 | — Pending |
| 음성 입력 지원 포함 (v1) | 사용자가 명시 — 회의 녹음 활용 시나리오 중요 | — Pending |
| Windows 단독 지원 | 사용자 환경 Windows | — Pending |

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
*Last updated: 2026-05-10 after initialization*
