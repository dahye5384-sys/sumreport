"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status =
  | { kind: "idle" }
  | { kind: "extracting"; filename: string }
  | { kind: "summarizing" }
  | { kind: "saving" }
  | { kind: "error"; message: string }
  | { kind: "done"; meetingId: string | null };

const ACCEPT = ".txt,.md,.docx,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [meeting, setMeeting] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus({ kind: "extracting", filename: file.name });
    try {
      const text = await extractText(file);
      setMeeting(text);
      if (!title.trim()) setTitle(file.name.replace(/\.(txt|md|docx)$/i, ""));
      setStatus({ kind: "idle" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus({ kind: "error", message: `파일 읽기 실패: ${msg}` });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onSummarize() {
    if (!apiKey.trim() || !meeting.trim()) {
      setStatus({
        kind: "error",
        message: "API 키와 회의록 내용을 모두 입력해주세요.",
      });
      return;
    }

    setSummary("");
    setStatus({ kind: "summarizing" });

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          meeting,
          title: title.trim() || null,
        }),
      });

      const data = (await res.json()) as {
        summary?: string;
        meetingId?: string;
        saved?: boolean;
        saveError?: string;
        error?: string;
      };

      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? `요청 실패 (HTTP ${res.status})`,
        });
        return;
      }

      setSummary(data.summary ?? "");
      setStatus({ kind: "done", meetingId: data.meetingId ?? null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus({ kind: "error", message: `네트워크 오류: ${msg}` });
    }
  }

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const busy =
    status.kind === "extracting" ||
    status.kind === "summarizing" ||
    status.kind === "saving";

  return (
    <main>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <h1>회의록 요약기</h1>
          <p className="subtitle">
            회의록을 붙여넣거나 파일을 업로드해 한국어로 요약합니다.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/history"
            style={{ color: "#0071e3", textDecoration: "none", fontSize: 14 }}
          >
            기록 보기 →
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            style={{
              background: "none",
              border: "1px solid #d2d2d7",
              color: "#1d1d1f",
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="field">
        <label className="label" htmlFor="apiKey">
          OpenAI API 키
        </label>
        <input
          id="apiKey"
          className="input"
          type="password"
          autoComplete="off"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          disabled={busy}
        />
        <p className="muted">
          서버에 저장되지 않으며 요청 1회 사용 후 폐기됩니다. 새로고침 시 사라집니다.
        </p>
      </div>

      <div className="field">
        <label className="label" htmlFor="title">
          제목 (선택)
        </label>
        <input
          id="title"
          className="input"
          type="text"
          placeholder="예: 주간 기획 회의 (10/14)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={busy}
        />
      </div>

      <div className="field">
        <label className="label">회의록</label>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            onChange={onFileSelect}
            disabled={busy}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            style={{
              display: "inline-block",
              padding: "8px 14px",
              border: "1px solid #d2d2d7",
              borderRadius: 6,
              fontSize: 13,
              cursor: busy ? "not-allowed" : "pointer",
              background: "#fff",
              color: "#1d1d1f",
              opacity: busy ? 0.5 : 1,
            }}
          >
            파일 업로드 (.txt / .md / .docx)
          </label>
          <span className="muted" style={{ marginTop: 0 }}>
            업로드 시 아래 텍스트박스에 자동 채워집니다
          </span>
        </div>
        <textarea
          className="textarea"
          placeholder="회의 내용을 여기에 붙여넣거나 위에서 파일을 업로드하세요."
          value={meeting}
          onChange={(e) => setMeeting(e.target.value)}
          disabled={busy}
        />
      </div>

      <button className="button" onClick={onSummarize} disabled={busy}>
        {status.kind === "summarizing"
          ? "요약 중..."
          : status.kind === "saving"
            ? "저장 중..."
            : "요약"}
      </button>

      {status.kind === "extracting" && (
        <div className="status info">
          파일 읽는 중: {status.filename}
        </div>
      )}
      {status.kind === "summarizing" && (
        <div className="status info">
          GPT 호출 중입니다. 보통 5~30초 걸립니다…
        </div>
      )}
      {status.kind === "error" && (
        <div className="status error">에러: {status.message}</div>
      )}
      {status.kind === "done" && status.meetingId && (
        <div className="status info">
          저장됨.{" "}
          <Link
            href={`/meeting/${status.meetingId}`}
            style={{ color: "#0040a3", textDecoration: "underline" }}
          >
            상세 보기
          </Link>
        </div>
      )}

      {summary && (
        <section className="result">
          <h2>요약 결과</h2>
          {summary}
        </section>
      )}
    </main>
  );
}

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md")) {
    return await file.text();
  }
  if (name.endsWith(".docx")) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/extract", { method: "POST", body: form });
    const data = (await res.json()) as { text?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data.text ?? "";
  }
  throw new Error("지원하지 않는 파일 형식입니다 (.txt / .md / .docx만 가능)");
}
