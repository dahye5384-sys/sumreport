import { Suspense } from "react";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<main><h1>로그인</h1><p className="subtitle">불러오는 중…</p></main>}>
      <LoginForm />
    </Suspense>
  );
}
