<!-- GSD:project-start source:PROJECT.md -->
## Project

**Meeting Minutes Summarizer**

회사 회의록(텍스트, Word, 음성 녹음 등)을 입력하면 OpenAI GPT API로 자동 요약하여 구조화된 Word 보고서로 출력하는 Windows 데스크톱 프로그램. 개인이 회의 정리 시간을 줄이기 위한 도구.

**Core Value:** **원본 회의록을 넣으면 즉시 잘 정리된 Word 보고서가 나온다.** 요약 품질과 Word 출력의 형식이 가장 중요하다 — 둘 중 하나가 깨지면 도구의 가치가 사라진다.

### Constraints

- **Tech stack**: Windows 데스크톱 (Python + PyQt/Tkinter 또는 Electron 류) — 사용자가 추천 받음
- **AI**: OpenAI GPT API 고정 (사용자 결정). 다른 LLM 제공자 추상화는 v2 이상.
- **출력 형식**: Microsoft Word (.docx) 필수 — Word에서 바로 열려야 함 (python-docx 등)
- **언어**: UI 한국어, 처리 대상 한국어+영어
- **사용자 수**: 1명 (개인용) — 패키징/설치 가이드는 최소
- **보안**: API 키는 평문 저장 금지 (OS 자격증명 저장소 또는 암호화 저장)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
