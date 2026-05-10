# sumreport — 회의록 요약기 (Web)

회의록(텍스트 / .txt / .md / .docx)을 입력하면 **Google Gemini** (`gemini-2.0-flash`)가
한국어로 요약해주는 Next.js 웹 앱. **Supabase로 사용자 계정 + 요약 기록 저장**.
Vercel에서 호스팅합니다.

> Gemini API는 **카드 등록 없이 무료 한도** 안에서 사용 가능 (분당 15회, 일일 1500회 정도).
> 키 발급: https://aistudio.google.com/app/apikey

## 기능 (현재)

- 이메일/비밀번호 회원가입·로그인 (Supabase Auth)
- 회의록 입력:
  - 텍스트 직접 붙여넣기
  - **파일 업로드** — `.txt`, `.md`, `.docx` (Word는 서버에서 mammoth로 본문 추출)
- Gemini API 키는 사용자가 페이지에서 직접 입력 (서버 미저장)
- 요약 성공 시 **자동으로 Supabase에 저장** (원본 + 요약)
- `/history` 페이지에서 본인 회의록 목록 확인
- `/meeting/[id]` 페이지에서 상세 보기 (요약 + 원본)
- Row Level Security로 사용자 간 데이터 분리

이후 phase는 `.planning/ROADMAP.md` 참고. 다음 예정: 4섹션 구조화 + .docx 다운로드.

---

## 셋업 가이드

### 1. Supabase 프로젝트 만들기

1. https://supabase.com → "New project" → 이름·비밀번호 설정
2. 프로젝트 생성되면 좌측 메뉴 **SQL Editor** → **New query**
3. 이 저장소의 [`supabase/schema.sql`](supabase/schema.sql) 내용을 **전체 복사·붙여넣고 Run**
4. **Authentication → Providers → Email**에서:
   - 개인 사용/테스트라면 **"Confirm email" 체크 해제** (메일 링크 클릭 없이 바로 로그인 가능)
   - 공개 배포라면 그대로 두고 SMTP 설정 추가
5. **Project Settings → API**에서 두 값을 메모:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Vercel 환경변수 등록

Vercel Dashboard → 프로젝트 → **Settings → Environment Variables**에 두 개 추가:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (Supabase에서 복사한 Project URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase에서 복사한 anon public key) |

저장 후 **Deployments → 최신 배포 → Redeploy** 클릭 (환경변수는 새로 빌드해야 적용됨).

### 3. 첫 로그인

배포된 URL 접속 → 로그인 페이지로 리다이렉트 → "회원가입" → 이메일/비밀번호로 가입 → 메인 페이지.

---

## 로컬 개발

```bash
cp .env.example .env.local   # 두 개 값 채우기
npm install
npm run dev
```

http://localhost:3000 접속.

---

## 보안 / 데이터 정책

- **Gemini API 키**: 브라우저 → 서버 1회 전송 → 요청 처리 후 메모리에서 폐기.
  디스크/로그/DB 어디에도 저장 안 함.
- **회의록 본문**: Google Gemini API로 전송됩니다 (요약 목적). Supabase DB에는 본인 계정으로만 저장됨.
- **Row Level Security (RLS)**: Supabase 정책으로 본인 행만 읽기/쓰기 가능. 다른 사용자는 절대 못 봄.
- 민감 정보가 포함된 회의록은 회사 정책상 외부 API/DB 사용 가능 여부 확인 후 사용하세요.

---

## Tech Stack

- Next.js 14 (App Router) + TypeScript + React 18
- Supabase (Postgres + Auth) via `@supabase/ssr`
- Google Gemini API via `@google/generative-ai` — `gemini-2.0-flash`
- Word 파싱: `mammoth`
- Vercel Serverless Functions (`maxDuration: 60s`)
