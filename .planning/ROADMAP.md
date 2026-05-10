# Roadmap: Meeting Minutes Summarizer (Web v2.0)

**Created:** 2026-05-10 (v2.0 web pivot)
**Mode:** mvp (Vertical MVP)
**Granularity:** standard
**Core Value:** 브라우저에서 회의록을 붙여넣고/업로드하면 즉시 잘 정리된 Word 보고서가 다운로드된다.
**Stack:** Next.js (App Router) + TypeScript + React, Vercel Serverless Functions, `openai` + `docx` npm.
**Repo:** `dahye5384-sys/sumreport` (main → Vercel auto-deploy)

## Phases

- [ ] **Phase 1: First Vercel Deploy + Paste-to-Summary** — Minimal Next.js app live on Vercel; paste text + API key → returns plain text summary in the page.
- [ ] **Phase 2: Structured 4-Section .docx Download** — Replace plain-text response with a downloadable Word report containing 개요/핵심논의/결정사항/액션아이템.
- [ ] **Phase 3: File Upload (.txt / .md / .docx)** — Add file picker so users can upload meeting files instead of pasting; server extracts body text and feeds the same pipeline.
- [ ] **Phase 4: Auth + Korean UX Polish + Deploy Docs** — Password gate via Vercel env var, Korean error messages, loading states, API key field hardening, README.

## Phase Details

### Phase 1: First Vercel Deploy + Paste-to-Summary
**Goal:** A user opens the public Vercel URL, pastes meeting text, pastes their OpenAI key, clicks summarize, and sees a GPT-generated summary appear on the page.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** INPUT-01, AI-01, AI-02, AI-03, AI-04, UI-01, UI-02, UI-05, DEPLOY-01
**Success Criteria** (what must be TRUE):
  1. The app is reachable at a public Vercel URL (e.g. `https://sumreport.vercel.app`) and loads a Korean-labeled page in Chrome/Edge/Safari at 1280px+.
  2. User can paste raw Korean (or Korean+English) meeting text into a textarea and paste an OpenAI API key into a separate field.
  3. Clicking the summarize button calls a Next.js API route that invokes `gpt-4o-mini` with the user's key and returns a Korean summary rendered in the page.
  4. The API key is used once per request and never persisted to disk, logs, env vars, or any storage — verifiable by code review of the API route.
  5. Pushing to `main` on `dahye5384-sys/sumreport` triggers a successful Vercel auto-deploy of the change.
**Plans:** TBD
**UI hint**: yes

### Phase 2: Structured 4-Section .docx Download
**Goal:** A user receives a downloadable Word file containing the canonical four-section Korean report instead of plain text on the page.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** REPORT-01, REPORT-02, REPORT-03, REPORT-04, REPORT-05, REPORT-06, REPORT-07
**Success Criteria** (what must be TRUE):
  1. After summarization, the browser downloads a `.docx` file (filename includes a timestamp) instead of (or in addition to) showing text in the page.
  2. The downloaded `.docx` opens in Microsoft Word and Word-compatible viewers with no corruption warning.
  3. The report contains a "회의 개요" section (date, attendees, topic auto-extracted from the source text).
  4. The report contains "핵심 논의 사항" rendered as bullets, a clearly delimited "결정사항" section, and an "액션아이템" section formatted as a list or table with owner/due-date columns.
  5. The new behavior is live on the public Vercel URL after a `main` push.

### Phase 3: File Upload (.txt / .md / .docx)
**Goal:** A user can upload a meeting file from disk instead of pasting text, and receive the same structured Word report.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** INPUT-02, INPUT-03
**Success Criteria** (what must be TRUE):
  1. The page exposes a file picker that accepts `.txt`, `.md`, and `.docx` files.
  2. Uploading a `.txt` or `.md` file produces the same 4-section `.docx` report as pasting equivalent text.
  3. Uploading a `.docx` meeting file extracts the body text on the server and produces the 4-section `.docx` report.
  4. File upload behavior is live on the public Vercel URL and respects Vercel Hobby's 4.5MB request limit (graceful behavior at the edge, not a generic 500).

### Phase 4: Auth + Korean UX Polish + Deploy Docs
**Goal:** The live URL is gated behind a single shared password, the user sees clear Korean feedback during and after each request, and the deploy is documented for the owner to operate.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** INPUT-04, AI-05, UI-03, UI-04, AUTH-01, AUTH-02, AUTH-03, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Visiting the public Vercel URL prompts for a password; the correct password (from Vercel env var `ACCESS_PASSWORD`) grants access for the rest of the session via an httpOnly cookie, and a wrong password shows a clear Korean error.
  2. While a summarization request is in flight, the user sees a visible loading/progress indicator; on completion or failure the state updates accordingly.
  3. On API failure (network / invalid key / quota / timeout) or invalid/oversized input, the user sees a specific Korean error message identifying the cause.
  4. The API key input field is `type=password` (masked) and is cleared on page reload (no browser autofill persistence).
  5. `ACCESS_PASSWORD` lives only in Vercel Dashboard env vars (never in code/git), and the README at the repo root documents the deploy URL plus how to set the password.
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. First Vercel Deploy + Paste-to-Summary | 0/0 | Not started | - |
| 2. Structured 4-Section .docx Download | 0/0 | Not started | - |
| 3. File Upload (.txt / .md / .docx) | 0/0 | Not started | - |
| 4. Auth + Korean UX Polish + Deploy Docs | 0/0 | Not started | - |

## Coverage

- v1 requirements total: 26
- Mapped: 26
- Unmapped: 0

### Coverage Map

| Phase | Requirements |
|-------|--------------|
| 1 | INPUT-01, AI-01, AI-02, AI-03, AI-04, UI-01, UI-02, UI-05, DEPLOY-01 (9) |
| 2 | REPORT-01, REPORT-02, REPORT-03, REPORT-04, REPORT-05, REPORT-06, REPORT-07 (7) |
| 3 | INPUT-02, INPUT-03 (2) |
| 4 | INPUT-04, AI-05, UI-03, UI-04, AUTH-01, AUTH-02, AUTH-03, DEPLOY-02, DEPLOY-03 (9) |
| **Total** | **26 / 26** |

---
*Last updated: 2026-05-10 at v2.0 roadmap creation*
