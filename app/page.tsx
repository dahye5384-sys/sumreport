"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "done" };

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [meeting, setMeeting] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSummarize() {
    if (!apiKey.trim() || !meeting.trim()) {
      setStatus({
        kind: "error",
        message: "API 키와 회의록을 모두 입력해주세요.",
      });
      return;
    }

    setSummary("");
    setStatus({ kind: "loading" });

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), meeting }),
      });

      const data = (await res.json()) as { summary?: string; error?: string };

      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? `요청 실패 (HTTP ${res.status})`,
        });
        return;
      }

      setSummary(data.summary ?? "");
      setStatus({ kind: "done" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatus({ kind: "error", message: `네트워크 오류: ${msg}` });
    }
  }

  const busy = status.kind === "loading";

  return (
    <main>
      <h1>회의록 요약기</h1>
      <p className="subtitle">
        회의록을 붙여넣고 요약 버튼을 누르세요. OpenAI gpt-4o-mini로 한국어 요약을 생성합니다.
      </p>

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
        <label className="label" htmlFor="meeting">
          회의록
        </label>
        <textarea
          id="meeting"
          className="textarea"
          placeholder="회의 내용을 여기에 붙여넣으세요."
          value={meeting}
          onChange={(e) => setMeeting(e.target.value)}
          disabled={busy}
        />
      </div>

      <button className="button" onClick={onSummarize} disabled={busy}>
        {busy ? "요약 중..." : "요약"}
      </button>

      {status.kind === "loading" && (
        <div className="status info">GPT 호출 중입니다. 보통 5~30초 걸립니다…</div>
      )}
      {status.kind === "error" && (
        <div className="status error">에러: {status.message}</div>
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
