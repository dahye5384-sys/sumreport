# Roadmap: Meeting Minutes Summarizer

**Created:** 2026-05-10
**Mode:** mvp (Vertical MVP)
**Granularity:** standard
**Core Value:** 원본 회의록을 넣으면 즉시 잘 정리된 Word 보고서가 나온다.

## Phases

- [ ] **Phase 1: Minimal End-to-End Loop** — Paste text, summarize via GPT, save basic .docx. Prove the pipeline works.
- [ ] **Phase 2: File Input + Desktop GUI Shell** — Load .txt/.md/.docx files via picker or drag-drop in a real Windows desktop window.
- [ ] **Phase 3: Structured Word Report** — Replace plaintext output with proper sections (개요/핵심 논의/결정사항/액션아이템) and Korean+English handling.
- [ ] **Phase 4: Audio Input via STT** — Drop .mp3/.wav/.m4a files and get the same structured report.
- [ ] **Phase 5: Secure Keys, Errors & Polish** — Secure API key storage, progress UI, error messaging, save-location chooser, post-completion actions.

## Phase Details

### Phase 1: Minimal End-to-End Loop
**Goal:** A user can paste meeting text, click summarize, and receive a working .docx file containing a GPT-generated summary.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** INPUT-04, AI-01, AI-03, REPORT-01, REPORT-07
**Success Criteria** (what must be TRUE):
  1. User can paste raw meeting text into a simple input surface and trigger summarization.
  2. User can enter an OpenAI API key once and have it used for the call (in-memory or simple config is acceptable for this slice).
  3. User receives a .docx file on disk that contains the GPT summary text.
  4. The generated .docx opens cleanly in Microsoft Word without corruption warnings.
**Plans:** TBD

### Phase 2: File Input + Desktop GUI Shell
**Goal:** A user runs a real Windows desktop app, picks or drops a .txt/.md/.docx meeting file, and gets a summary .docx — no copy-paste required.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** INPUT-01, INPUT-02, UI-01, UI-02, UI-05
**Success Criteria** (what must be TRUE):
  1. User launches the app as a standalone Windows desktop window (not a console/REPL).
  2. User can select a .txt or .md file via a file picker and have its contents summarized.
  3. User can select a .docx file and have its body text extracted and summarized.
  4. User can drag-and-drop a supported file onto the window to trigger the same flow.
  5. The UI labels, buttons, and prompts are in Korean.
**Plans:** TBD
**UI hint**: yes

### Phase 3: Structured Word Report
**Goal:** A user receives a properly structured Korean Word report with the four canonical sections instead of a plaintext blob, even on mixed Korean/English meetings.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** AI-04, REPORT-02, REPORT-03, REPORT-04, REPORT-05
**Success Criteria** (what must be TRUE):
  1. The output .docx contains a "회의 개요" section with date, attendees, and topic auto-extracted from the source.
  2. The output .docx contains a "핵심 논의 사항" section rendered as a bulleted list.
  3. The output .docx contains a clearly delimited "결정사항" section.
  4. The output .docx contains an "액션아이템" section formatted as a list or table with owner and due-date columns.
  5. A meeting transcript that mixes Korean and English produces a coherent Korean-language summary across all four sections.
**Plans:** TBD

### Phase 4: Audio Input via STT
**Goal:** A user drops a meeting audio recording and gets the same structured Word report, end to end.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** INPUT-03
**Success Criteria** (what must be TRUE):
  1. User can select or drop a .mp3, .wav, or .m4a file as input.
  2. The app transcribes the audio to text automatically before summarization (no manual step).
  3. The resulting .docx has the full Phase 3 four-section structure, derived from the transcribed audio.
**Plans:** TBD

### Phase 5: Secure Keys, Errors & Polish
**Goal:** A user can trust the app for repeated real use — key is stored securely, save location is chosen, progress is visible, and failures explain themselves.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements:** AI-02, AI-05, INPUT-05, REPORT-06, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. The OpenAI API key is persisted across app restarts using OS credential storage or encrypted local storage (never plaintext on disk).
  2. User chooses the output .docx save location via a save dialog before each generation.
  3. User sees a visible progress indicator covering file read, STT (when applicable), summarization, and Word generation stages.
  4. On API failure (network/invalid key/quota) or invalid/oversized input, the user sees a specific Korean error message identifying the cause.
  5. After successful generation, the user can click a button to open the resulting file or open its containing folder directly.
**Plans:** TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Minimal End-to-End Loop | 0/0 | Not started | - |
| 2. File Input + Desktop GUI Shell | 0/0 | Not started | - |
| 3. Structured Word Report | 0/0 | Not started | - |
| 4. Audio Input via STT | 0/0 | Not started | - |
| 5. Secure Keys, Errors & Polish | 0/0 | Not started | - |

## Coverage

- v1 requirements total: 22
- Mapped: 22
- Unmapped: 0

---
*Last updated: 2026-05-10 at roadmap creation*
