"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    try {
      const supabase = createClient();
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.replace(next);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.session) {
          router.replace(next);
          router.refresh();
        } else {
          setMessage(
            "가입 확인 메일을 보냈습니다. 메일함을 확인해주세요. (Supabase 설정에서 이메일 확인을 끈 경우 바로 로그인 가능)",
          );
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(translateAuthError(msg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420 }}>
      <h1>{mode === "signin" ? "로그인" : "회원가입"}</h1>
      <p className="subtitle">회의록 요약기</p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            required
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            minLength={6}
            required
          />
          <p className="muted">최소 6자 이상</p>
        </div>

        <button className="button" type="submit" disabled={busy}>
          {busy ? "처리 중..." : mode === "signin" ? "로그인" : "가입하기"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: 24 }}>
        {mode === "signin" ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#0071e3",
            cursor: "pointer",
            padding: 0,
            font: "inherit",
            textDecoration: "underline",
          }}
        >
          {mode === "signin" ? "회원가입" : "로그인"}
        </button>
      </p>

      {message && <div className="status info">{message}</div>}
      {error && <div className="status error">에러: {error}</div>}
    </main>
  );
}

function translateAuthError(msg: string): string {
  if (/invalid login credentials/i.test(msg))
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (/email not confirmed/i.test(msg))
    return "이메일 확인이 완료되지 않았습니다. 받은 메일의 링크를 클릭해주세요.";
  if (/user already registered/i.test(msg))
    return "이미 가입된 이메일입니다. 로그인 해주세요.";
  if (/password should be at least/i.test(msg))
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  if (/supabase url|fetch failed|network/i.test(msg))
    return "Supabase 연결 실패. 환경변수가 설정되었는지 확인해주세요.";
  return msg;
}
