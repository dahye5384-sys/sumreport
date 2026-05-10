# Phase 1: Minimal End-to-End Loop - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-10
**Phase:** 1-minimal-end-to-end-loop
**Areas discussed:** 기반 스택, GPT 모델, Phase 1 입력 표면 (UI), API 키 입력 방식

---

## 기반 스택 (언어/라이브러리)

| Option | Description | Selected |
|--------|-------------|----------|
| Python | python-docx, openai SDK, openai-whisper, Tkinter/PyQt. 텍스트/AI/파일 처리 가장 쉬움 | ✓ |
| Node.js / Electron | JS + Electron GUI. Word/STT 라이브러리가 Python 대비 약함 | |
| C# / .NET (WPF) | Windows 네이티브. Office Interop 강력. AI/STT 생태계 약함 | |
| Claude 추천 따름 | (추천: Python) | |

**User's choice:** Python
**Notes:** 사용자가 즉시 Python 선택. 이후 모든 phase가 이 결정을 이어간다.

---

## GPT 모델 선택

| Option | Description | Selected |
|--------|-------------|----------|
| gpt-4o-mini | 저렴·빠름. 한국어 요약 충분. Phase 1에 이상적 | ✓ |
| gpt-4o | 품질 최상. 비용 5~10배 | |
| 설정에서 선택 가능하게 | 기본 mini, 설정에서 변경. Phase 5에서 UI 노출 | |

**User's choice:** gpt-4o-mini
**Notes:** Claude's Discretion으로 모델 ID는 코드 상수로 관리, Phase 5에서 설정 UI 노출 가능성 열어둠.

---

## Phase 1 입력 표면 (UI 형태)

| Option | Description | Selected |
|--------|-------------|----------|
| 간단한 Tkinter 창 | Python 내장, 추가 설치 0. Phase 2에서 동일 프레임워크 확장 | ✓ |
| CLI 명령어 | 가장 빠른 검증이지만 Phase 2에서 GUI 코드 새로 짜야 함 | |
| Streamlit 로컬 웹 | 브라우저 UI. "데스크톱 앱" 목표와 어긋나 Phase 2에서 교체 필요 | |

**User's choice:** 간단한 Tkinter 창
**Notes:** Phase 2 데스크톱 GUI로 매끄럽게 확장하기 위해 같은 프레임워크 유지가 결정적이었음.

---

## API 키 입력 방식 (Phase 1용)

| Option | Description | Selected |
|--------|-------------|----------|
| UI 입력 필드 | Tkinter 창에 입력칸. 세션 메모리만 보관. Phase 5에서 보안 저장으로 이전 | ✓ |
| .env 파일 | OPENAI_API_KEY 텍스트 파일. 일반 사용자 친화도 낮음 | |
| 환경변수 | Windows 시스템 환경변수. 설정 번거로움 | |

**User's choice:** UI 입력 필드
**Notes:** Phase 1 "한 창에서 다 끝남" 컨셉과 맞음. 보안 강화는 Phase 5 (AI-02)로 명시 위임.

---

## Claude's Discretion

- 프로젝트 폴더 구조 (단일 파일로 시작 권장)
- 의존성 관리 (`requirements.txt`로 시작)
- 동기 vs 비동기 API 호출 (Phase 1은 동기로 충분)
- Phase 1 에러 처리 수준 (최소 — 결과 영역에 메시지 표시 정도)

## Deferred Ideas

- API 키 보안 저장 → Phase 5 (AI-02)
- 저장 위치 선택 다이얼로그 → Phase 5 (REPORT-06)
- 진행 상황 표시 / 스레딩 → Phase 5 (UI-03)
- 결과 열기 / 폴더 열기 버튼 → Phase 5 (UI-04)
- 상세 오류 메시지 분류 → Phase 5 (AI-05)
- 파일 입력 + 드래그앤드롭 → Phase 2
- 구조화된 4섹션 보고서 → Phase 3
- 한영 혼용 명시 처리 → Phase 3
- 음성 입력 / Whisper STT → Phase 4
