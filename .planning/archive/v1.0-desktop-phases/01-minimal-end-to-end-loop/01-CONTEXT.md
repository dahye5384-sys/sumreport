# Phase 1: Minimal End-to-End Loop - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning

<domain>
## Phase Boundary

사용자가 회의록 텍스트를 붙여넣고 "요약" 버튼을 누르면, OpenAI GPT가 요약하고, 결과가 .docx 파일로 저장된다. 파이프라인(입력→AI→출력)이 실제로 동작함을 증명하는 최소 슬라이스.

**In scope:** 텍스트 붙여넣기 입력, API 키 UI 입력, GPT API 호출, .docx 저장, Word 호환성.
**Out of scope (다른 phase):** 파일 입력 (Phase 2), 구조화된 보고서 섹션 (Phase 3), 음성 STT (Phase 4), 보안 키 저장/진행 표시/오류 UX (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### 기반 스택
- **D-01:** 언어는 **Python 3.x**로 통일. 이후 모든 phase가 이 결정을 이어감.
- **D-02:** 핵심 라이브러리:
  - `openai` (공식 SDK) — GPT API 호출
  - `python-docx` — .docx 파일 생성
  - `tkinter` — GUI (Python 내장, 추가 설치 불필요)
- **D-03:** Phase 2/3에서 .docx 읽기는 `python-docx` 또는 `docx2txt` 추가 (이번 phase는 출력만).
- **D-04:** Phase 4 STT는 `openai` SDK의 Whisper API로 일관 (별도 결정 시점에 재확인).

### GPT 모델
- **D-05:** 기본 모델은 **`gpt-4o-mini`**. 한국어 요약 품질 충분, 비용/속도 우수.
- **D-06:** 모델 ID는 코드 상수로 두되, 추후(Phase 5+) 설정 UI로 노출 가능하게 한 곳에 모아둘 것.

### Phase 1 UI 형태
- **D-07:** Phase 1에서 **간단한 Tkinter 창**으로 시작. CLI는 사용 안 함.
- **D-08:** Phase 2에서도 **동일한 Tkinter 프레임워크**를 그대로 확장 — 새 GUI 라이브러리로 교체하지 않음. Phase 1 코드를 버리지 않고 키워나간다.
- **D-09:** Phase 1 창 구성 (최소):
  - API Key 입력 필드 (한 줄)
  - 회의록 붙여넣기 텍스트박스 (멀티라인, 큰 영역)
  - "요약" 버튼
  - 결과/상태 표시 영역 (요약 결과 텍스트 + 저장된 .docx 경로 메시지)
- **D-10:** UI 라벨/버튼 텍스트는 **한국어**로. (UI-05는 Phase 2 요구사항이지만 Phase 1부터 준수해 일관성 확보)

### API 키 입력 (Phase 1 한정)
- **D-11:** API 키는 **UI 입력 필드**로 받아 **세션 메모리에만 보관**.
- **D-12:** Phase 1에서는 디스크 저장/암호화/OS 자격증명 저장소 사용 안 함 — Phase 5에서 도입.
- **D-13:** 키 입력 필드는 가능하면 마스킹(`show="*"`) 처리.

### 요약 / Word 출력 (Phase 1 한정)
- **D-14:** Phase 1 GPT 프롬프트는 단순함을 우선: "다음 한국어 회의록을 한국어로 간결하게 요약해 주세요" 수준. 4개 섹션 구조화는 **Phase 3에서** 도입.
- **D-15:** Phase 1 .docx 출력은 단순 구조: 제목 1줄(예: "회의 요약") + 요약 본문 단락. 이걸로 REPORT-07(Word 호환)을 실증.
- **D-16:** 출력 파일명/경로: Phase 1은 **고정 경로** (예: 프로젝트 폴더의 `output/summary-{timestamp}.docx`). 저장 위치 다이얼로그(REPORT-06)는 Phase 5.

### Claude's Discretion
- 프로젝트 폴더 구조 (예: `app.py` 단일 파일 vs `summarizer/`, `gui/` 등 분리). 작은 규모 phase 1은 단일 파일로 시작 권장.
- requirements.txt vs pyproject.toml. 단순 `requirements.txt`로 시작 가능.
- API 호출 시 동기 호출 vs 비동기. Phase 1은 **동기 호출** 충분 (UI는 호출 동안 잠시 멈춤 — Phase 5에서 진행 표시/스레딩 도입).
- 에러 처리는 Phase 1에서는 **최소** — 예외 발생 시 결과 영역에 "에러: {메시지}" 정도. 정교한 오류 분류는 Phase 5 (AI-05).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level
- `.planning/PROJECT.md` — 프로젝트 정의, 핵심 가치, 제약
- `.planning/REQUIREMENTS.md` — Phase 1 요구사항: INPUT-04, AI-01, AI-03, REPORT-01, REPORT-07
- `.planning/ROADMAP.md` §"Phase 1: Minimal End-to-End Loop" — Goal과 Success Criteria

### External libraries (planner가 참조)
- python-docx 공식 문서 — https://python-docx.readthedocs.io/
- openai Python SDK — https://github.com/openai/openai-python
- Tkinter (Python 표준 라이브러리 문서)

(외부 ADR/SPEC 문서 별도 없음 — 결정은 본 CONTEXT.md와 ROADMAP에 모두 잠겨 있음)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
없음 — greenfield 프로젝트. 본 phase가 모든 기반을 수립한다.

### Established Patterns
없음. **이 phase에서 수립할 패턴 (이후 phase의 기반):**
- 모듈 분리: GUI(`tkinter`) ↔ 비즈니스 로직(요약, Word 생성) ↔ 외부 API(OpenAI). 향후 phase에서 입력 형식이 늘어도 GUI가 비대해지지 않도록.
- 단일 진입점(`main.py` 또는 `app.py`).

### Integration Points
- 향후 Phase 2: 파일 입력은 동일 GUI 창에 파일 선택/드래그앤드롭 추가로 확장.
- 향후 Phase 3: 요약 함수와 .docx 생성 함수가 분리되어 있어야 섹션 구조화로 교체 용이.
- 향후 Phase 4: 입력 단계 앞에 STT 변환 단계만 끼워 넣으면 되는 형태로 파이프라인 구성.

</code_context>

<specifics>
## Specific Ideas

- "한 창에서 다 끝남" — 사용자는 Phase 1 결과로 Tkinter 한 화면에서 키 입력→붙여넣기→요약→결과 확인을 모두 본다.
- API 키 필드는 마스킹(`*`) 처리.
- 결과 .docx는 자동으로 한 폴더(`output/`)에 timestamp 파일명으로 저장 — 사용자 혼란 최소.

</specifics>

<deferred>
## Deferred Ideas

- **API 키 보안 저장** → Phase 5 (AI-02)
- **저장 위치 선택 다이얼로그** → Phase 5 (REPORT-06)
- **진행 상황 표시 / 비동기 호출 / 스피너** → Phase 5 (UI-03)
- **결과 파일 / 폴더 열기 버튼** → Phase 5 (UI-04)
- **상세한 오류 메시지 분류 (네트워크/키/할당량)** → Phase 5 (AI-05)
- **파일 입력 (.txt/.md/.docx) 및 드래그앤드롭** → Phase 2
- **구조화된 4섹션 보고서 (개요/논의/결정/액션)** → Phase 3
- **한·영 혼용 처리 명시** → Phase 3 (Phase 1 프롬프트는 한국어 위주이지만 mixed input도 자연 처리됨)
- **음성 입력 / Whisper STT** → Phase 4

</deferred>

---

*Phase: 1-minimal-end-to-end-loop*
*Context gathered: 2026-05-10*
