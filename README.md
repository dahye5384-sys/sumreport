# sumreport — 회의록 요약기 (Web)

회의록을 붙여넣으면 OpenAI GPT (`gpt-4o-mini`) 가 한국어로 요약해주는 Next.js 웹 앱.
Vercel에서 호스팅합니다.

## Phase 1 (현재 — 첫 Vercel 배포)

- 페이지에 회의록 텍스트 붙여넣기
- OpenAI API 키 입력 (브라우저에서, 서버 미저장)
- "요약" 버튼 → `/api/summarize` → GPT 호출 → 페이지에 한국어 요약 표시
- 평문 출력만 (.docx 다운로드는 Phase 2에서 추가)
- 로그인 없음 (Phase 4에서 비밀번호 게이트 추가)

이후 phase는 `.planning/ROADMAP.md` 참고.

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

API 키는 페이지 입력칸에 직접 붙여넣습니다 (서버 환경변수 X).

## Vercel 배포

1. Vercel에서 GitHub `dahye5384-sys/sumreport` 임포트
2. Framework Preset: **Next.js** (자동 감지)
3. Build/Output 설정 변경 없음 (기본값 사용)
4. Deploy 클릭
5. 이후 `main` 브랜치에 push될 때마다 자동 배포

배포되면 `https://<프로젝트이름>.vercel.app` 에서 접속 가능.

## 보안 / 데이터 정책

- **API 키**: 브라우저 → 서버 1회 전송 → 요청 처리 후 메모리에서 폐기. 디스크/로그/DB 어디에도 저장 안 함.
- **회의록 내용**: OpenAI API로 전송됩니다 (요약을 위해). 서버 자체에는 저장 안 함.
- 민감 정보가 포함된 회의록은 회사 정책상 외부 API 사용 가능 여부 확인 후 사용하세요.

## Tech Stack

- Next.js 14 (App Router) + TypeScript + React 18
- OpenAI Node SDK (v4)
- Vercel Serverless Functions (`maxDuration: 60s`)
