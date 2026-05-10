# 회의록 요약기 (Meeting Minutes Summarizer)

## 프로젝트 소개

회사 회의록 텍스트를 입력하면 OpenAI GPT API로 자동 요약하여 Microsoft Word(.docx) 보고서로 저장하는 Windows 데스크톱 도구입니다. 개인이 회의 정리 시간을 줄이기 위한 1인용 도구로 출발하며, 원본 회의록을 넣으면 즉시 정리된 Word 보고서가 나오는 것을 핵심 가치로 둡니다.

## 설치

```
pip install -r requirements.txt
```

Python 3.x 가 설치되어 있어야 합니다. `tkinter` 는 Python 표준 라이브러리에 포함되어 있어 별도 설치가 필요 없습니다.

## 실행

```
python app.py
```

창이 열리면 OpenAI API 키를 붙여넣고, 회의록 본문을 텍스트박스에 붙여넣은 뒤 "요약" 버튼을 누릅니다. 결과 .docx 파일은 `output/summary-{YYYYMMDD-HHMMSS}.docx` 로 저장됩니다.

## Phase 1 범위

- 텍스트 붙여넣기 입력
- API 키 UI 입력 (세션 메모리 전용, 디스크 저장 없음)
- gpt-4o-mini 호출로 요약 생성
- 제목 + 본문 단락 1개의 단순한 .docx 출력

이후 Phase 에서 추가될 기능: 파일/드래그앤드롭 입력 (Phase 2), 4섹션 구조화 보고서 (Phase 3), 음성 STT (Phase 4), API 키 보안 저장 / 진행 표시 / 저장 위치 다이얼로그 / 상세 오류 처리 (Phase 5).
