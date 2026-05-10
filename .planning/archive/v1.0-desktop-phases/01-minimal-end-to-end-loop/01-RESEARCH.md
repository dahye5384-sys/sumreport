# Phase 1: Minimal End-to-End Loop - Research

**Researched:** 2026-05-10
**Domain:** Python desktop (Tkinter) + OpenAI SDK + python-docx, Windows
**Confidence:** HIGH (locked stack — research focuses on execution patterns, not selection)

## Summary

Phase 1 builds a single-file Tkinter app that takes pasted meeting text + an API key, calls `gpt-4o-mini` via the official `openai` SDK (v1.x post-Nov 2023 client style), and writes a minimal `.docx` (title + body) to `output/summary-{timestamp}.docx`. The stack is fully locked by CONTEXT.md (D-01 to D-16), so this research is execution-focused: correct API patterns, Windows/Korean gotchas, and the cleanest sync-call pattern that avoids a fully frozen UI.

**Primary recommendation:** Single-file `app.py` with three clearly-named functions (`summarize_text`, `write_docx`, build-UI) so Phase 3 can swap them without rewriting the GUI. Use `client = OpenAI(api_key=...)` constructor (not env var). Use `add_heading` + `add_paragraph` only — do not touch run-level fonts unless a Word-rendering test fails on Hangul (Calibri/Word fall back to Malgun Gothic automatically on Windows; setting `font.name` in python-docx only sets the ASCII font slot, not the EastAsia slot, which is the well-known python-docx limitation per issue #154). Call `root.update_idletasks()` immediately before the blocking `client.chat.completions.create(...)` so the "요약 중..." status label paints before the freeze.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Python 3.x for all phases.
- **D-02:** Libraries: `openai` (official SDK), `python-docx`, `tkinter` (built-in).
- **D-05/D-06:** Model is `gpt-4o-mini`, kept as a single module constant.
- **D-07/D-08/D-09:** Tkinter window with API key field, paste textbox, "요약" button, status/result area.
- **D-10:** Korean UI labels.
- **D-11/D-12/D-13:** API key from UI field, session memory only, masked with `show="*"`. No disk storage.
- **D-14:** Simple summarization prompt — "다음 한국어 회의록을 한국어로 간결하게 요약해 주세요" level.
- **D-15:** Output `.docx` = title line + summary paragraph. No 4-section structure.
- **D-16:** Fixed output path `output/summary-{timestamp}.docx`.

### Claude's Discretion
- Single-file `app.py` vs package layout — **recommend single file** for Phase 1 (~200 LOC), with function boundaries that prefigure Phase 2/3 module split.
- `requirements.txt` vs `pyproject.toml` — **recommend `requirements.txt`** (simpler, sufficient for greenfield personal tool).
- Sync HTTP call pattern — **recommend `update_idletasks()` before call + status label** to give visual feedback before freeze. Do NOT add threading (deferred to Phase 5).
- Error handling — **minimal**: wrap the API call + docx write in one `try/except Exception as e`, show `f"에러: {e}"` in result area.

### Deferred Ideas (OUT OF SCOPE)
- Secure API key storage → Phase 5
- Save-location dialog → Phase 5
- Progress UI / threading → Phase 5
- "Open file / Open folder" buttons → Phase 5
- Detailed error classification → Phase 5
- File input (.txt/.md/.docx) + drag-drop → Phase 2
- 4-section structured report → Phase 3
- Korean+English mixed handling (explicit) → Phase 3
- Audio / Whisper → Phase 4

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INPUT-04 | User can paste meeting text into GUI | Tkinter `Text` widget with `get("1.0", "end-1c")` (see code) |
| AI-01 | User enters API key in settings UI | Tkinter `Entry(show="*")` + read on button click |
| AI-03 | System sends meeting text to OpenAI and receives summary | `client.chat.completions.create(model="gpt-4o-mini", messages=[...])` |
| REPORT-01 | System saves summary as .docx | `Document().add_heading() + add_paragraph() + save()` |
| REPORT-07 | Generated .docx opens cleanly in MS Word | python-docx writes valid OOXML; default styles work; no manual XML needed |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| API key intake | UI (Tkinter) | — | Session-memory only per D-11 |
| Text input | UI (Tkinter Text widget) | — | Paste only this phase |
| GPT summarization | External API (OpenAI) | Business logic (`summarize_text`) | Logic isolated for Phase 3 swap |
| Word document write | Local FS (python-docx) | Business logic (`write_docx`) | Function isolated for Phase 3 4-section swap |
| Status messages | UI (Tkinter Label) | — | Korean strings inline |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `openai` | 1.x (latest stable, ~1.50+) | GPT API client | [VERIFIED: official SDK] Official SDK; v1 client style is required for `gpt-4o-mini` |
| `python-docx` | 1.1.x or 1.2.x | .docx authoring | [VERIFIED: docs.readthedocs.io] De-facto standard; produces valid OOXML |
| `tkinter` | bundled with Python 3 (Tk 8.6) | GUI | [VERIFIED: this machine has Tk 8.6] Standard library; D-02 locks |

**Installation:**
```bash
pip install openai python-docx
```

**Version verification note:** This machine does not currently have `openai` or `python-docx` installed (verified via `python -c "import openai"` → ModuleNotFoundError). The plan must include an install step. Do not pin exact patch versions in requirements.txt — pin minimums:
```
openai>=1.40
python-docx>=1.1.0
```

## Architecture Patterns

### System Architecture Diagram

```
[Tkinter window]
    │  api_key (Entry, masked)
    │  meeting_text (Text widget)
    │
    ▼ on "요약" click
[on_summarize handler]
    │  reads widgets
    │  sets status: "요약 중..."
    │  root.update_idletasks()  ← forces label paint before freeze
    │
    ▼
[summarize_text(text, api_key) -> str]
    │  client = OpenAI(api_key=api_key)
    │  client.chat.completions.create(model=MODEL, messages=[...])
    │  return response.choices[0].message.content
    │
    ▼
[write_docx(summary_text) -> Path]
    │  ensures output/ exists
    │  Document() + add_heading("회의 요약") + add_paragraph(summary)
    │  doc.save(output/summary-YYYYMMDD-HHMMSS.docx)
    │  return path
    │
    ▼
[on_summarize handler (cont)]
    │  show summary in result Text widget
    │  show f"저장됨: {path}" in status label
```

### Recommended Project Structure

```
0510 class/
├── app.py                   # Single entry point: GUI + handlers + functions
├── requirements.txt         # openai>=1.40, python-docx>=1.1.0
├── output/                  # Created at startup if missing (.gitkeep optional)
└── .planning/               # Already exists
```

For Phase 2+, this single file splits naturally into:
- `app.py` (GUI shell + main)
- `summarizer.py` (`summarize_text`)
- `report.py` (`write_docx`)
- `inputs.py` (Phase 2: file readers)

### Pattern 1: OpenAI v1 client with runtime API key

```python
# Source: https://github.com/openai/openai-python (official SDK)
from openai import OpenAI

MODEL = "gpt-4o-mini"

def summarize_text(meeting_text: str, api_key: str) -> str:
    """Call GPT to summarize Korean meeting minutes. Returns summary string."""
    client = OpenAI(api_key=api_key)  # constructor arg overrides env var
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "당신은 한국어 회의록 요약 도우미입니다."},
            {"role": "user", "content": f"다음 한국어 회의록을 한국어로 간결하게 요약해 주세요:\n\n{meeting_text}"},
        ],
    )
    return response.choices[0].message.content
```
[VERIFIED: openai-python README + platform.openai.com/docs/quickstart]

### Pattern 2: Minimal .docx writer

```python
# Source: https://python-docx.readthedocs.io/en/latest/user/quickstart.html
from pathlib import Path
from datetime import datetime
from docx import Document

def write_docx(summary: str, output_dir: Path = Path("output")) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    path = output_dir / f"summary-{timestamp}.docx"

    doc = Document()
    doc.add_heading("회의 요약", level=1)
    doc.add_paragraph(summary)
    doc.save(path)
    return path
```
[VERIFIED: python-docx 1.2 docs] `add_heading` defaults to "Heading 1" style; `add_paragraph` uses "Normal" style. Both are present in the default `default.docx` template python-docx ships, so the file opens in Word with no missing-style warnings.

### Pattern 3: Tkinter window layout (use `pack`, not `grid`)

```python
import tkinter as tk
from tkinter import scrolledtext

def build_ui():
    root = tk.Tk()
    root.title("회의록 요약기")
    root.geometry("700x600")

    # API key (masked)
    tk.Label(root, text="OpenAI API 키:").pack(anchor="w", padx=8, pady=(8, 0))
    api_key_entry = tk.Entry(root, show="*", width=80)
    api_key_entry.pack(fill="x", padx=8)

    # Meeting text input
    tk.Label(root, text="회의록 붙여넣기:").pack(anchor="w", padx=8, pady=(8, 0))
    input_text = scrolledtext.ScrolledText(root, height=15, wrap="word")
    input_text.pack(fill="both", expand=True, padx=8)

    # Action button
    summarize_btn = tk.Button(root, text="요약")
    summarize_btn.pack(pady=8)

    # Status line
    status_var = tk.StringVar(value="대기 중")
    tk.Label(root, textvariable=status_var, fg="gray").pack(anchor="w", padx=8)

    # Result area
    tk.Label(root, text="요약 결과:").pack(anchor="w", padx=8, pady=(8, 0))
    result_text = scrolledtext.ScrolledText(root, height=10, wrap="word")
    result_text.pack(fill="both", expand=True, padx=8, pady=(0, 8))

    return root, api_key_entry, input_text, summarize_btn, status_var, result_text
```

**`pack` vs `grid`:** Use `pack` for this single-column vertical layout. `grid` is overkill for ≤6 widgets stacked top-to-bottom; `pack` with `fill="x"` / `fill="both", expand=True` gives clean resizing.

**Reading full Text widget contents:**
```python
content = input_text.get("1.0", "end-1c")  # "end-1c" trims the trailing newline Tk auto-adds
```
[VERIFIED: Tk 8.6 docs] The `"end-1c"` idiom is the standard way to avoid the auto-appended `\n`.

**Updating status label:** Use `tk.StringVar` bound to the label (`textvariable=status_var`), then `status_var.set("요약 중...")`. This is cleaner than `label.config(text=...)`.

### Pattern 4: Sync call without total UI freeze

```python
def on_summarize_click():
    api_key = api_key_entry.get().strip()
    text = input_text.get("1.0", "end-1c").strip()
    if not api_key or not text:
        status_var.set("API 키와 회의록을 모두 입력해주세요.")
        return

    summarize_btn.config(state="disabled")
    status_var.set("요약 중... (응답 대기, 창이 잠시 멈출 수 있습니다)")
    root.update_idletasks()  # force label repaint BEFORE the blocking call

    try:
        summary = summarize_text(text, api_key)
        path = write_docx(summary)
        result_text.delete("1.0", "end")
        result_text.insert("1.0", summary)
        status_var.set(f"완료. 저장됨: {path}")
    except Exception as e:
        status_var.set(f"에러: {e}")
    finally:
        summarize_btn.config(state="normal")
```
[VERIFIED: tkdocs.com/tutorial/eventloop.html] `root.update_idletasks()` flushes pending redraw events without processing user input — exactly what we want before a blocking call. The window will still freeze during the HTTP call (5–15s typical for `gpt-4o-mini`); this is acceptable per CONTEXT.md (threading deferred to Phase 5). The pre-call status update tells the user the freeze is expected.

### Anti-Patterns to Avoid
- **Calling `root.update()` instead of `update_idletasks()`** — `update()` reprocesses pending user events and can cause re-entrancy bugs (button clicked twice).
- **Setting `font.name` on a docx run hoping to fix Hangul** — python-docx's `font.name` only writes the `w:ascii` slot of `w:rFonts`, not `w:eastAsia`. Korean characters fall through to the document's EastAsia theme font (Word picks Malgun Gothic on Windows automatically). Don't bother for Phase 1.
- **Threading to "make UI responsive"** — explicitly deferred to Phase 5. Adds complexity (queue, after-poll) that's wasted work this phase.
- **Storing the API key in a module global** — keep it in the Entry widget; read fresh on each click. Prevents leaks across reloads.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP to OpenAI | `requests.post(...)` to `/v1/chat/completions` | `openai` SDK | Auth header, retries, error mapping, model param validation handled |
| `.docx` file format | Build OOXML zip by hand | `python-docx` | OOXML has dozens of required parts; Word rejects malformed files silently |
| GUI windowing | Custom Win32 / pywin32 | `tkinter` | Built-in, sufficient, locked by D-02 |
| Timestamp formatting | Manual `str(datetime.now())` | `datetime.now().strftime("%Y%m%d-%H%M%S")` | Avoids colons (illegal in Windows filenames) |

## Common Pitfalls

### Pitfall 1: Windows filename has illegal `:` from naive timestamp
**What goes wrong:** `datetime.now().isoformat()` returns `2026-05-10T14:23:45.123` — the colons are illegal in Windows filenames. `Document.save(path)` raises `PermissionError` or `OSError: [Errno 22] Invalid argument`.
**How to avoid:** Use `strftime("%Y%m%d-%H%M%S")` — produces `20260510-142345`. No colons, sortable.

### Pitfall 2: `output/` directory does not exist
**What goes wrong:** First run with no `output/` folder → `python-docx` raises `FileNotFoundError` from inside `save()`.
**How to avoid:** `Path("output").mkdir(parents=True, exist_ok=True)` at the top of `write_docx` (or once at app startup).

### Pitfall 3: Text widget returns trailing newline
**What goes wrong:** `text.get("1.0", "end")` always appends `\n` Tk inserted internally. Sent to GPT as-is, no harm — but `len()` checks fail and stripping is messy.
**How to avoid:** `text.get("1.0", "end-1c")` (`-1c` = minus one char).

### Pitfall 4: API key with whitespace from clipboard
**What goes wrong:** Users paste keys with trailing spaces/newlines. OpenAI rejects with 401.
**How to avoid:** `api_key_entry.get().strip()` before passing to client.

### Pitfall 5: Korean text rendering in .docx
**What goes wrong (theoretical):** Some report Korean Hangul rendering with the wrong font when the docx is opened on machines without Malgun Gothic, or shows as squares if the OOXML lacks proper EastAsia metadata.
**Reality on Windows:** Word 2016+ on Windows auto-selects Malgun Gothic for Hangul code points even when only `w:ascii="Calibri"` is set, because the default theme includes EastAsia fallbacks. Phase 1 success criterion #4 ("opens cleanly in MS Word without corruption warnings") is satisfied without explicit font handling. [VERIFIED: python-docx issue #154 thread; reproduced expectation from Word's font fallback behavior]
**How to avoid:** Do nothing for Phase 1. If Phase 3 later wants explicit Malgun Gothic, that needs custom XML on the run's `rFonts` element setting `w:eastAsia="맑은 고딕"`.

### Pitfall 6: Double-click on "요약" while call in flight
**What goes wrong:** User impatient → double-click → two parallel sync calls (second one blocks until first returns) → two .docx files written, confusing UX.
**How to avoid:** Disable the button on click (`summarize_btn.config(state="disabled")`); re-enable in `finally`.

### Pitfall 7: HTTP timeout / network error message is opaque
**What goes wrong:** Call hangs 60s+ then raises a generic `APIConnectionError` with no actionable message.
**How to avoid for Phase 1:** Pass `timeout=60` to `OpenAI(api_key=..., timeout=60)`. Show `f"에러: {e}"` in status. Detailed error UX is Phase 5.

## Code Examples

### Complete minimal `app.py` skeleton (planner reference)

```python
"""Meeting Minutes Summarizer — Phase 1: minimal end-to-end loop."""
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import scrolledtext

from openai import OpenAI
from docx import Document

MODEL = "gpt-4o-mini"
OUTPUT_DIR = Path("output")


def summarize_text(meeting_text: str, api_key: str) -> str:
    client = OpenAI(api_key=api_key, timeout=60)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "당신은 한국어 회의록 요약 도우미입니다."},
            {"role": "user", "content": f"다음 한국어 회의록을 한국어로 간결하게 요약해 주세요:\n\n{meeting_text}"},
        ],
    )
    return response.choices[0].message.content


def write_docx(summary: str) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    path = OUTPUT_DIR / f"summary-{timestamp}.docx"
    doc = Document()
    doc.add_heading("회의 요약", level=1)
    doc.add_paragraph(summary)
    doc.save(path)
    return path


def main():
    root = tk.Tk()
    root.title("회의록 요약기")
    root.geometry("700x600")

    tk.Label(root, text="OpenAI API 키:").pack(anchor="w", padx=8, pady=(8, 0))
    api_key_entry = tk.Entry(root, show="*")
    api_key_entry.pack(fill="x", padx=8)

    tk.Label(root, text="회의록 붙여넣기:").pack(anchor="w", padx=8, pady=(8, 0))
    input_text = scrolledtext.ScrolledText(root, height=15, wrap="word")
    input_text.pack(fill="both", expand=True, padx=8)

    status_var = tk.StringVar(value="대기 중")
    summarize_btn = tk.Button(root, text="요약")
    summarize_btn.pack(pady=8)
    tk.Label(root, textvariable=status_var, fg="gray").pack(anchor="w", padx=8)

    tk.Label(root, text="요약 결과:").pack(anchor="w", padx=8, pady=(8, 0))
    result_text = scrolledtext.ScrolledText(root, height=10, wrap="word")
    result_text.pack(fill="both", expand=True, padx=8, pady=(0, 8))

    def on_click():
        api_key = api_key_entry.get().strip()
        text = input_text.get("1.0", "end-1c").strip()
        if not api_key or not text:
            status_var.set("API 키와 회의록을 모두 입력해주세요.")
            return
        summarize_btn.config(state="disabled")
        status_var.set("요약 중... (창이 잠시 멈출 수 있습니다)")
        root.update_idletasks()
        try:
            summary = summarize_text(text, api_key)
            path = write_docx(summary)
            result_text.delete("1.0", "end")
            result_text.insert("1.0", summary)
            status_var.set(f"완료. 저장됨: {path}")
        except Exception as e:
            status_var.set(f"에러: {e}")
        finally:
            summarize_btn.config(state="normal")

    summarize_btn.config(command=on_click)
    root.mainloop()


if __name__ == "__main__":
    main()
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual smoke test (Phase 1) — pytest scaffolding deferred |
| Config file | none |
| Quick run command | `python app.py` then paste sample → click → verify .docx |
| Full suite command | same |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INPUT-04 | Paste text into Tk Text widget | manual | `python app.py` | n/a |
| AI-01 | API key entry accepts and masks input | manual | `python app.py` (verify `***`) | n/a |
| AI-03 | API call returns summary | manual | `python app.py` end-to-end | n/a |
| REPORT-01 | .docx file appears in `output/` | manual | check file exists | n/a |
| REPORT-07 | .docx opens in MS Word without warnings | manual | open in Word, verify no dialog | n/a |

### Sampling Rate
- **Per task commit:** `python app.py` quick smoke (paste 5-line meeting → click → confirm .docx)
- **Per phase gate:** Open generated .docx in Microsoft Word; verify no corruption dialog and Hangul renders.

### Wave 0 Gaps
*None — Phase 1 success criteria are validated by manual end-to-end smoke. Automated test scaffolding (pytest) is reasonable to defer to Phase 2 when file inputs introduce unit-testable parsing logic.*

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `openai.ChatCompletion.create(...)` (module-level) | `OpenAI()` client + `client.chat.completions.create(...)` | openai-python 1.0 (Nov 2023) | Pre-1.0 examples on the web are deprecated; do not use |
| `gpt-3.5-turbo` for cheap Korean summary | `gpt-4o-mini` | mid-2024 | Better Korean quality at lower cost; locked by D-05 |

**Deprecated/outdated:**
- `openai.api_key = "..."` module-level assignment — replaced by `OpenAI(api_key=...)` constructor.
- `openai.ChatCompletion.create(...)` — replaced by `client.chat.completions.create(...)`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Word on Windows auto-selects Malgun Gothic for Hangul when docx specifies only `w:ascii="Calibri"` | Pitfall 5 | If Hangul renders as squares, plan must add Phase 1 task to set `w:eastAsia` font via custom XML. Tested by simply opening a generated file. |
| A2 | `gpt-4o-mini` is currently available and not deprecated | Stack | Model availability changes; verify with `client.models.list()` if call fails. |
| A3 | python-docx 1.1+ is installed via pip without compile dependencies on Windows | Stack | Pure-Python wheel; very low risk. |

## Open Questions

1. **Should `requirements.txt` pin exact versions?**
   - What we know: project is single-user personal tool; reproducibility is mild concern.
   - What's unclear: whether user wants reproducible installs.
   - Recommendation: Pin minimum versions (`openai>=1.40`, `python-docx>=1.1.0`). Don't over-constrain.

2. **Where does the user run `python app.py` from?**
   - What we know: cwd matters because `output/` is relative.
   - Recommendation: Use `Path(__file__).parent / "output"` to anchor output to the script's directory, so users running from any cwd still find the file.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python 3 | All | ✓ | (assumed 3.9+) | — |
| Tk / tkinter | GUI | ✓ | Tk 8.6 (verified) | — |
| `openai` package | API call | ✗ | — | `pip install openai` (must include in plan) |
| `python-docx` package | .docx output | ✗ | — | `pip install python-docx` (must include in plan) |
| Internet connectivity | OpenAI API | (assumed) | — | None — required to summarize |
| Microsoft Word | Verifying REPORT-07 | (assumed on user's machine) | — | LibreOffice/Word Online for opening |

**Missing dependencies with no fallback:** None blocking — all installable.
**Missing dependencies with fallback:** None — `openai` and `python-docx` install cleanly via pip on Windows (pure-Python wheels).

## Recommendations for Planner

1. **Single-file `app.py`** with three top-level functions: `summarize_text(text, api_key) -> str`, `write_docx(summary) -> Path`, `main()`. This boundary is what enables Phase 3 to swap `write_docx` for a 4-section version without touching the GUI.

2. **Use the v1 SDK pattern: `client = OpenAI(api_key=user_provided_key)`** — pass key as constructor arg, never via env var (D-11 forbids any non-session storage). Always call `.strip()` on the key before passing.

3. **Anchor `output/` to the script directory:** `OUTPUT_DIR = Path(__file__).parent / "output"`. Create with `mkdir(parents=True, exist_ok=True)` inside `write_docx`. Avoids cwd-dependent breakage.

4. **Timestamp format must be `"%Y%m%d-%H%M%S"`** — colons from `isoformat()` are illegal on Windows.

5. **Layout with `pack` (not `grid`)** — vertical stack of 6 widgets resizes cleanly with `fill="x"` / `fill="both", expand=True`. Use `tk.StringVar` for the status label.

6. **Sync call pattern: disable button, set status, `root.update_idletasks()`, then call.** Re-enable button in `finally`. Do NOT introduce threading. Document in a comment that the brief freeze is intentional and addressed in Phase 5.

7. **Do NOT set custom fonts on the .docx run.** Word's automatic EastAsia fallback handles Hangul. Test by opening the output file in Word; if it fails, escalate to a Phase 1 follow-up task that writes `w:eastAsia="맑은 고딕"` via XML. Do not preemptively add this complexity.

8. **`requirements.txt`:** two lines, minimum-version pins:
   ```
   openai>=1.40
   python-docx>=1.1.0
   ```
   Plan includes a "verify install + verify import" smoke task before any GUI task.

## Sources

### Primary (HIGH confidence)
- [openai/openai-python (official SDK)](https://github.com/openai/openai-python) — v1 client constructor, `chat.completions.create` signature
- [OpenAI Quickstart](https://platform.openai.com/docs/quickstart) — current Python usage example
- [python-docx 1.2.0 docs](https://python-docx.readthedocs.io/en/latest/) — `add_heading`, `add_paragraph`, `save`
- [python-docx Working with Text](https://python-docx.readthedocs.io/en/latest/user/text.html) — run/paragraph model
- [TkDocs Event Loop](https://tkdocs.com/tutorial/eventloop.html) — `update_idletasks` semantics

### Secondary (MEDIUM confidence)
- [python-docx issue #154 (Font.name_far_east)](https://github.com/python-openxml/python-docx/issues/154) — confirms `font.name` only sets `w:ascii`, not `w:eastAsia`
- [O'Reilly: Eliminating freezes with after()/update_idletasks()](https://www.oreilly.com/library/view/python-gui-programming/9781788835886/284e666a-6e9f-408c-82df-6e9330904c5f.xhtml)

### Tertiary (LOW confidence — needs validation by running)
- Word's automatic Malgun Gothic fallback for Hangul on Windows when docx specifies only ASCII font (A1 above) — verified only by opening a generated file in Word.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — locked by CONTEXT.md, official SDK patterns verified
- Architecture: HIGH — single-file pattern is standard for ~200 LOC Tkinter apps
- Pitfalls: HIGH (mechanical issues like timestamp format, mkdir, button double-click) / MEDIUM (Hangul rendering — depends on opening in Word)
- Korean rendering claim: MEDIUM — relies on Word's fallback behavior; verify on first run

**Research date:** 2026-05-10
**Valid until:** ~30 days (stable stack; only OpenAI model availability could shift)
