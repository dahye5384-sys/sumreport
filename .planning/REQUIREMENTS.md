# Requirements: Meeting Minutes Summarizer

**Defined:** 2026-05-10
**Core Value:** 원본 회의록을 넣으면 즉시 잘 정리된 Word 보고서가 나온다.

## v1 Requirements

### Input (입력 처리)

- [ ] **INPUT-01**: 사용자는 .txt / .md 텍스트 파일을 회의록으로 입력할 수 있다
- [ ] **INPUT-02**: 사용자는 .docx (Word) 파일을 회의록으로 입력할 수 있다
- [ ] **INPUT-03**: 사용자는 음성 파일(.mp3, .wav, .m4a)을 입력하면 자동으로 텍스트로 변환된다 (STT)
- [ ] **INPUT-04**: 사용자는 GUI 입력창에 회의록 텍스트를 직접 붙여넣을 수 있다
- [ ] **INPUT-05**: 입력 파일이 너무 크거나 형식이 잘못되었을 때 명확한 오류 메시지를 본다

### AI (요약 처리)

- [ ] **AI-01**: 사용자는 OpenAI API 키를 설정 화면에서 입력하고 저장할 수 있다
- [ ] **AI-02**: API 키는 OS 자격증명 저장소 또는 암호화된 형태로 저장된다 (평문 저장 금지)
- [ ] **AI-03**: 시스템은 입력된 회의록을 OpenAI GPT API로 보내 요약 결과를 받는다
- [ ] **AI-04**: 시스템은 한국어 + 영어 혼용 회의록을 자연스럽게 처리한다 (한국어로 요약 출력)
- [ ] **AI-05**: API 호출 실패(네트워크/키오류/한도초과) 시 사용자에게 원인을 명확히 표시한다

### Report (Word 보고서 생성)

- [ ] **REPORT-01**: 시스템은 요약 결과를 .docx (Word) 파일로 저장한다
- [ ] **REPORT-02**: 보고서에는 "회의 개요" 섹션이 자동 생성된다 (날짜, 참석자, 주제)
- [ ] **REPORT-03**: 보고서에는 "핵심 논의 사항" 섹션이 bullet 형태로 생성된다
- [ ] **REPORT-04**: 보고서에는 "결정사항" 섹션이 명확히 구분되어 생성된다
- [ ] **REPORT-05**: 보고서에는 "액션아이템" 섹션이 담당자/기한과 함께 표 또는 목록으로 생성된다
- [ ] **REPORT-06**: 사용자는 출력 Word 파일의 저장 위치를 선택할 수 있다
- [ ] **REPORT-07**: 생성된 Word 파일은 Microsoft Word 및 호환 프로그램에서 정상적으로 열린다

### UI (Windows 데스크톱 GUI)

- [ ] **UI-01**: 사용자는 Windows에서 실행 가능한 데스크톱 앱으로 프로그램을 실행한다
- [ ] **UI-02**: 사용자는 회의록 파일을 드래그앤드롭 또는 파일 선택 버튼으로 입력할 수 있다
- [ ] **UI-03**: 사용자는 처리 진행 상황(파일 읽기 / STT 변환 / 요약 / Word 생성)을 시각적으로 확인한다
- [ ] **UI-04**: 처리 완료 후 결과 파일을 바로 열거나 폴더를 여는 버튼이 표시된다
- [ ] **UI-05**: UI는 한국어로 표시된다

## v2 Requirements

### Customization

- **CUST-01**: 사용자는 보고서 템플릿(섹션 구성)을 편집할 수 있다
- **CUST-02**: 사용자는 요약 길이/스타일(상세/간결)을 선택할 수 있다
- **CUST-03**: 사용자는 회사 로고/머리말이 들어간 Word 템플릿을 적용할 수 있다

### Batch & History

- **BATCH-01**: 사용자는 여러 회의록을 한 번에 처리할 수 있다
- **HIST-01**: 처리한 회의록 이력을 조회/재출력할 수 있다

### Provider

- **PROV-01**: 사용자는 OpenAI 외 다른 LLM 제공자(Claude, 로컬 LLM)를 선택할 수 있다

## Out of Scope

| Feature | Reason |
|---------|--------|
| 다중 사용자 / 협업 | 개인용 도구로 정의됨 |
| 클라우드 / 웹 서비스 배포 | 로컬 데스크톱으로 충분 |
| 실시간 회의 녹음 (라이브 캡처) | 사후 변환에 집중 |
| 회의록 저장/검색 DB | 1회성 변환 도구 |
| 로컬 LLM (Ollama) 지원 | 사용자가 GPT API 선택, 추가 복잡도 회피 |
| macOS / Linux 지원 | Windows 단독 환경 |
| 다국어 UI | 한국어 단일 |
| PDF / PPT 입력 | docx/txt/음성으로 충분 |

## Traceability

Empty initially. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (filled by roadmapper) | | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 0 (pending)
- Unmapped: 22 ⚠️

---
*Requirements defined: 2026-05-10*
*Last updated: 2026-05-10 after initial definition*
