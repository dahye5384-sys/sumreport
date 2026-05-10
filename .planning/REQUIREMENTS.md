# Requirements: Meeting Minutes Summarizer (Web v2.0)

**Defined:** 2026-05-10 (v2.0 web pivot)
**Core Value:** 브라우저에서 회의록을 붙여넣고/업로드하면 즉시 잘 정리된 Word 보고서가 다운로드된다.

## v1 Requirements (= v2.0 web release)

### Input (입력)

- [ ] **INPUT-01**: 사용자는 textarea에 회의록 텍스트를 직접 붙여넣을 수 있다
- [ ] **INPUT-02**: 사용자는 .txt / .md 파일을 업로드해 회의록으로 사용할 수 있다
- [ ] **INPUT-03**: 사용자는 .docx (Word) 파일을 업로드해 회의록으로 사용할 수 있다 (서버에서 본문 텍스트 추출)
- [ ] **INPUT-04**: 입력 파일이 너무 크거나 형식이 잘못되었을 때 사용자에게 명확한 한국어 오류 메시지를 보여준다

### AI (요약)

- [ ] **AI-01**: 사용자는 페이지에서 OpenAI API 키를 입력할 수 있다
- [ ] **AI-02**: 입력된 API 키는 요청당 한 번 사용 후 서버 메모리에서 폐기되며, 디스크/로그/DB에 저장되지 않는다
- [ ] **AI-03**: 시스템은 입력된 회의록을 OpenAI GPT API (gpt-4o-mini)로 보내 요약 결과를 받는다
- [ ] **AI-04**: 시스템은 한국어 + 영어 혼용 회의록을 자연스럽게 처리한다 (한국어로 요약 출력)
- [ ] **AI-05**: API 호출 실패(네트워크 / 키 오류 / 한도 초과 / 타임아웃)시 사용자에게 원인을 한국어로 명확히 표시한다

### Report (Word 보고서)

- [ ] **REPORT-01**: 시스템은 요약 결과를 .docx (Word) 파일로 생성한다
- [ ] **REPORT-02**: 보고서에는 "회의 개요" 섹션이 자동 생성된다 (날짜, 참석자, 주제 — 본문에서 추출)
- [ ] **REPORT-03**: 보고서에는 "핵심 논의 사항" 섹션이 bullet 형태로 생성된다
- [ ] **REPORT-04**: 보고서에는 "결정사항" 섹션이 명확히 구분되어 생성된다
- [ ] **REPORT-05**: 보고서에는 "액션아이템" 섹션이 담당자/기한과 함께 표 또는 목록으로 생성된다
- [ ] **REPORT-06**: 사용자는 생성된 .docx를 브라우저에서 다운로드 받는다 (파일명에 timestamp 포함)
- [ ] **REPORT-07**: 다운로드된 .docx는 Microsoft Word 및 호환 프로그램에서 손상 경고 없이 열린다

### UI (웹 인터페이스)

- [ ] **UI-01**: 사용자는 공개 URL (Vercel)에서 페이지에 접속한다
- [ ] **UI-02**: 페이지는 한국어 라벨/안내문으로 표시된다
- [ ] **UI-03**: 사용자는 처리 진행 상태(요청 중 / 완료 / 실패)를 시각적으로 확인한다 (스피너 또는 상태 메시지)
- [ ] **UI-04**: API 키 입력 필드는 마스킹(`type=password`)되며, 페이지 새로고침 시 사라진다 (브라우저 자동저장 의도적 회피)
- [ ] **UI-05**: 데스크톱 브라우저(Chrome/Edge/Safari) 1280px 이상에서 깔끔하게 표시된다 (모바일은 동작만 보장)

### Auth (접근 제어)

- [ ] **AUTH-01**: 페이지 접근 시 단일 비밀번호 입력을 요구한다 (Vercel 환경변수에 설정)
- [ ] **AUTH-02**: 비밀번호 통과 후에는 세션 동안 재입력 요구하지 않는다 (httpOnly 쿠키 또는 미들웨어 토큰)
- [ ] **AUTH-03**: 잘못된 비밀번호 입력 시 명확한 오류 표시

### Deploy (배포)

- [ ] **DEPLOY-01**: GitHub `main` 브랜치 push 시 Vercel이 자동 배포한다
- [ ] **DEPLOY-02**: 환경변수(`ACCESS_PASSWORD`)는 Vercel Dashboard에 설정되어 코드/git에 노출되지 않는다
- [ ] **DEPLOY-03**: README에 배포 URL과 비밀번호 설정 방법이 문서화되어 있다

## v2 Requirements (이후 release)

### Quality of Life

- **QOL-01**: 사용자는 보고서 템플릿(섹션 추가/제거)을 편집할 수 있다
- **QOL-02**: 사용자는 요약 길이/스타일을 선택할 수 있다 (간결/상세)
- **QOL-03**: API 키를 브라우저 localStorage에 선택적으로 저장 (체크박스, 사용자 동의)

### Streaming

- **STREAM-01**: 긴 회의록 요약 시 GPT 응답을 streaming으로 받아 Vercel 60초 제약 회피 + UX 개선

### Provider

- **PROV-01**: OpenAI 외 Claude API 등 다른 LLM 제공자 선택 가능

## Out of Scope

| Feature | Reason |
|---------|--------|
| 음성/녹음 파일 (STT) | Vercel 60초/4.5MB 제약. 데스크톱 v1 또는 별도 서비스로 |
| 사용자 계정 시스템 | 단일 비밀번호로 충분 (소규모 공유) |
| API 키 서버 저장 | 보안/책임 회피 — 사용자가 매번 입력 |
| 회의록 / 결과 저장소 | 1회성 변환 도구. 사용자가 다운로드해 관리 |
| 다중 사용자 권한 분리 | 비밀번호 통과 = 동등 권한 |
| 다국어 UI | 한국어 단일 |
| 모바일 전용 디자인 | 데스크톱 우선, 모바일 동작만 보장 |
| PDF / PPT 입력 | Word + 텍스트로 충분 |
| Tkinter 데스크톱 앱 | v1에서 시도, 사용자가 웹으로 pivot 결정 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INPUT-01 | Phase 1 | Pending |
| INPUT-02 | Phase 3 | Pending |
| INPUT-03 | Phase 3 | Pending |
| INPUT-04 | Phase 4 | Pending |
| AI-01 | Phase 1 | Pending |
| AI-02 | Phase 1 | Pending |
| AI-03 | Phase 1 | Pending |
| AI-04 | Phase 1 | Pending |
| AI-05 | Phase 4 | Pending |
| REPORT-01 | Phase 2 | Pending |
| REPORT-02 | Phase 2 | Pending |
| REPORT-03 | Phase 2 | Pending |
| REPORT-04 | Phase 2 | Pending |
| REPORT-05 | Phase 2 | Pending |
| REPORT-06 | Phase 2 | Pending |
| REPORT-07 | Phase 2 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 4 | Pending |
| UI-04 | Phase 4 | Pending |
| UI-05 | Phase 1 | Pending |
| AUTH-01 | Phase 4 | Pending |
| AUTH-02 | Phase 4 | Pending |
| AUTH-03 | Phase 4 | Pending |
| DEPLOY-01 | Phase 1 | Pending |
| DEPLOY-02 | Phase 4 | Pending |
| DEPLOY-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 26 total (Input 4 + AI 5 + Report 7 + UI 5 + Auth 3 + Deploy 2)
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-05-10 (v2.0 web pivot)*
*Traceability populated: 2026-05-10 at roadmap creation*
