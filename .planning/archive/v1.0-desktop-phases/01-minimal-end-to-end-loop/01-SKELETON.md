# Walking Skeleton — Meeting Minutes Summarizer

**Created:** 2026-05-10
**Phase:** 01-minimal-end-to-end-loop
**Status:** Architectural decisions locked. Subsequent phases extend this skeleton without renegotiating.

## Purpose

Phase 1 is the thinnest possible end-to-end vertical slice that proves the core pipeline works:

```
[paste Korean text] → [OpenAI gpt-4o-mini] → [.docx file on disk]
```

This SKELETON.md records the architectural decisions made for Phase 1 so that Phases 2–5 build on the same foundation rather than re-litigating stack, layout, or boundaries each time.

## Architectural Decisions

### Language & Runtime
- **Language:** Python 3.x (D-01). Locked for all phases.
- **Runtime:** User's local Python on Windows. No bundling/installer in Phase 1; `python app.py` is the entry point.

### Stack
| Layer | Choice | Rationale | Locked by |
|-------|--------|-----------|-----------|
| GUI | `tkinter` (built-in, Tk 8.6) | Standard library, sufficient for Phase 1–5 needs, no install | D-02, D-07, D-08 |
| LLM client | `openai` SDK ≥ 1.40 (v1 client style) | Official, handles auth/retries/error mapping, supports `gpt-4o-mini` | D-02, D-05 |
| Word output | `python-docx` ≥ 1.1.0 | De-facto standard for OOXML authoring; pure-Python wheel | D-02, D-15 |
| Audio STT (future Phase 4) | `openai` Whisper API (same SDK) | Avoids second auth pathway | D-04 |
| .docx file reading (future Phase 2/3) | `python-docx` or `docx2txt` | Same lib already in tree for output | D-03 |

### Model
- **Default model:** `gpt-4o-mini` — strong Korean summary quality at low cost (D-05).
- **Storage:** Single module constant `MODEL = "gpt-4o-mini"` at top of `app.py`. Phase 5+ may surface this in a settings UI; until then it's one-line edit (D-06).

### GUI Framework Continuity
- **Phase 1 establishes the Tkinter window.** Phase 2 EXTENDS the same window with file picker / drag-drop — does NOT replace with a different toolkit (D-08). This means widget identity (`api_key_entry`, `input_text`, `status_var`, `result_text`, `summarize_btn`) is part of the skeleton.

### Layout (Phase 1 widgets, vertical pack order)
1. Label "OpenAI API 키:" + masked Entry (`show="*"`)
2. Label "회의록 붙여넣기:" + ScrolledText (paste input)
3. Button "요약"
4. Status Label bound to StringVar
5. Label "요약 결과:" + ScrolledText (rendered summary)

Phase 2+ adds a file-picker / drag-drop region above (or beside) the paste textbox. Phase 5 adds progress + save-location + open-folder buttons near the status label.

### Module Boundaries
Phase 1 is single-file `app.py` with three named function boundaries:

| Function | Phase 1 implementation | Where it grows |
|----------|------------------------|----------------|
| `summarize_text(text, api_key) -> str` | Single GPT call, simple prompt | Phase 3: structured 4-section prompt; Phase 4: STT transcript handling |
| `write_docx(summary) -> Path` | Heading + paragraph | Phase 3: 4-section template (개요/논의/결정/액션) |
| `main()` | Build UI, wire on_click | Phase 2: add file/drag-drop handlers; Phase 5: threading, save-dialog, open-file buttons |

When Phase 2 arrives, this single file naturally splits into:
- `app.py` — GUI shell + main()
- `summarizer.py` — `summarize_text` (extracted unchanged)
- `report.py` — `write_docx` (replaced with structured version in Phase 3)
- `inputs.py` — Phase 2 file readers (.txt/.md/.docx)

### Filesystem Layout
```
0510 class/                       (repo root)
├── app.py                        (Phase 1 single-file app; splits in Phase 2)
├── requirements.txt              (openai>=1.40, python-docx>=1.1.0)
├── README.md                     (Korean stub; expands per phase)
├── .gitignore                    (ignores venv, __pycache__, output/* except .gitkeep)
├── output/                       (.gitkeep tracked; .docx outputs ignored)
│   └── .gitkeep
└── .planning/                    (already exists; do not modify)
```

**Output anchor:** `OUTPUT_DIR = Path(__file__).parent / "output"`. Files saved relative to the script, NOT cwd. Survives users running from any directory. Phase 5 introduces a save-as dialog that overrides this default.

**Output file naming:** `summary-{YYYYMMDD-HHMMSS}.docx` — colon-free for Windows compatibility (Phase 1 lock; Phase 5 dialog can override path entirely).

### API Key Handling — Skeleton Stance
Phase 1 reads the key from a UI Entry widget on every click. The key is never stored anywhere. There is no module global, no env-var read, no file write. This is intentional: it keeps Phase 1 simple AND it leaves the secure-storage interface as a clean Phase 5 addition (AI-02) — Phase 5 will introduce a `load_api_key()` / `save_api_key()` pair backed by Windows Credential Manager (or equivalent). Until Phase 5, the user re-pastes the key each session.

### Concurrency Model — Skeleton Stance
Phase 1 is fully synchronous. The Tkinter window freezes during the GPT call (5–15s typical). This is acceptable for a personal tool with infrequent usage. The brief freeze is preceded by a status update + `root.update_idletasks()` so the user sees "요약 중..." before the freeze begins.

Phase 5 (UI-03) introduces threading for the API call + Whisper STT, with a `tk.after()` polling pattern to drain a result queue. The skeleton anticipates this by keeping the on_click handler small and the business logic in pure functions.

### Error Handling — Skeleton Stance
Phase 1 wraps the API + write in a single `try/except Exception as e`, displaying `f"에러: {e}"` in the status label. No classification, no retry, no log file. Phase 5 (AI-05, INPUT-05) introduces structured error messages distinguishing network / invalid key / quota / oversized input.

### Testing — Skeleton Stance
Phase 1 has NO automated test framework (pytest is intentionally deferred). All Phase 1 success criteria are validated by manual smoke test (Task 5 human checkpoint). pytest scaffolding is appropriate to add in Phase 2 when file-input parsing introduces unit-testable logic.

Per-task automated checks in this plan use plain `python -c` one-liners rather than a test framework — appropriate for greenfield where "test framework" itself would be Phase 2 work.

## Deployment / Runtime
- **Environment:** Python 3 on Windows. User installs deps via `pip install -r requirements.txt`.
- **Packaging:** None in Phase 1. PyInstaller or similar is out of scope until validated demand.
- **Running:** `python app.py` from the repo directory.

## Future Phase Compatibility Checklist

Each item below is a constraint on Phase 1 design to keep Phase 2–5 cheap:

- [x] **Phase 2** can add file input by extending `main()` UI, calling new readers, then routing the resulting text into the existing `summarize_text` — no refactor needed.
- [x] **Phase 3** can replace `write_docx` with a 4-section variant — `summarize_text` returns a richer structure (e.g., dict) and the GUI handler doesn't care about the shape.
- [x] **Phase 4** can prepend an STT step (`transcribe_audio(file) -> str`) before `summarize_text` — no other changes.
- [x] **Phase 5** can add `load_api_key`/`save_api_key`, threading, save-dialog, error classification, open-folder buttons — all additive, no rewrite.

## What This Skeleton Does NOT Decide

These remain open and will be decided in their respective phases:
- Specific drag-drop library (Phase 2 — likely `tkinterdnd2`, but not locked).
- Exact prompt template for 4-section structured summary (Phase 3).
- STT model selection between OpenAI Whisper API vs local whisper (Phase 4 — D-04 leans API but reaffirm at decision time).
- Secure-storage backend (Phase 5 — Windows Credential Manager via `keyring`, or DPAPI directly).

---
*Skeleton recorded: 2026-05-10*
*Subsequent phases consume this document; do not edit retroactively without an ADR.*
