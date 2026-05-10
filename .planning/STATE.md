# Project State: Meeting Minutes Summarizer (Web v2.0)

**Initialized:** 2026-05-10 (v2.0 web pivot)
**Last updated:** 2026-05-10

## Project Reference

- **Core value:** 브라우저에서 회의록을 붙여넣고/업로드하면 즉시 잘 정리된 Word 보고서가 다운로드된다.
- **Mode:** mvp (Vertical MVP) — every phase ships an end-to-end web slice live on Vercel.
- **Stack:** Next.js (App Router) + TypeScript + React, Vercel Serverless Functions, `openai` + `docx` npm packages.
- **Repo:** `dahye5384-sys/sumreport` (`main` branch → Vercel auto-deploy).
- **Hosting:** Vercel Hobby (60s function timeout, 4.5MB request body).
- **Model:** `gpt-4o-mini` (carried over from v1.0 — Korean summary quality + cost balance).
- **API key model:** User pastes their OpenAI key per request; server uses once and discards (never persisted).

## Current Position

- **Phase:** Pre-Phase 1 (roadmap just created)
- **Plan:** None yet
- **Status:** Awaiting `/gsd-plan-phase 1`
- **Progress:** [░░░░░░░░░░] 0 / 4 phases complete

## v2.0 Pivot Note

v1.0 was a Tkinter Windows desktop app (5 phases, 22 requirements). User decided to pivot to a Vercel-hosted web app for shared small-team access. v1.0 artifacts archived under `.planning/archive/v1.0-desktop-*`. The locked-in v1.0 decisions reused here:
- Model `gpt-4o-mini`
- 4-section report structure (개요 / 핵심논의 / 결정사항 / 액션아이템)
- Korean UI / Korean+English input handling
- Audio/STT explicitly removed (incompatible with Vercel Hobby limits)

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases planned | 4 |
| Phases complete | 0 |
| v1 requirements | 26 |
| Requirements mapped | 26 (100%) |
| Plans complete | 0 |

## Accumulated Context

### Key Decisions (carried from PROJECT.md)

| Decision | Rationale |
|----------|-----------|
| Tkinter desktop → Next.js web (v2.0 pivot) | User requirement: shared URL access |
| Vercel hosting | User-mandated |
| Next.js + TypeScript | Vercel-native, rich `docx` / `openai` npm ecosystem |
| Drop audio/STT | Vercel 60s + 4.5MB limits |
| User pastes API key per request, server never persists | Security responsibility avoidance |
| Single shared password (env var) | Small group, full auth system overkill |
| Keep `gpt-4o-mini` and 4-section structure from v1.0 | Already validated in design |

### Open TODOs

- Plan Phase 1 (`/gsd-plan-phase 1`)
- First-time Vercel project wire-up (link GitHub repo → Vercel project) lives in Phase 1
- README + `ACCESS_PASSWORD` env var setup deferred to Phase 4

### Blockers

None.

## Session Continuity

- **Next action:** `/gsd-plan-phase 1`
- **Last completed:** Roadmap creation (this file + ROADMAP.md + REQUIREMENTS.md traceability)
- **Files of interest:**
  - `.planning/PROJECT.md`
  - `.planning/REQUIREMENTS.md`
  - `.planning/ROADMAP.md`
  - `.planning/archive/v1.0-desktop-*` (historical reference only — do NOT reuse phase structure)

---
*State initialized: 2026-05-10 (v2.0 web pivot)*
