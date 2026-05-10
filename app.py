"""Meeting Minutes Summarizer — Phase 1: minimal end-to-end loop.

Paste Korean meeting text, click 요약, get a .docx summary in output/.
"""
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import scrolledtext

from openai import OpenAI
from docx import Document

MODEL = "gpt-4o-mini"
OUTPUT_DIR = Path(__file__).parent / "output"


def summarize_text(meeting_text: str, api_key: str) -> str:
    """Call gpt-4o-mini to summarize Korean meeting minutes."""
    client = OpenAI(api_key=api_key.strip(), timeout=60)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "당신은 한국어 회의록 요약 도우미입니다."},
            {"role": "user",   "content": f"다음 한국어 회의록을 한국어로 간결하게 요약해 주세요:\n\n{meeting_text}"},
        ],
    )
    return response.choices[0].message.content


def write_docx(summary: str) -> Path:
    """Write summary to output/summary-{YYYYMMDD-HHMMSS}.docx. Returns the path."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    path = OUTPUT_DIR / f"summary-{timestamp}.docx"
    doc = Document()
    doc.add_heading("회의 요약", level=1)
    doc.add_paragraph(summary)
    doc.save(path)
    return path


if __name__ == "__main__":
    print("Phase 1 app.py — Task 3 placeholder. main() will be added in Task 4.")
