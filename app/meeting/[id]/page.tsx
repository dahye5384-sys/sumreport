import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface MeetingDetail {
  id: string;
  title: string | null;
  created_at: string;
  original_text: string;
  summary: string;
  model: string | null;
}

export default async function MeetingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meetings")
    .select("id, title, created_at, original_text, summary, model")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    return (
      <main>
        <Link href="/history" style={{ color: "#0071e3" }}>
          ← 목록
        </Link>
        <div className="status error" style={{ marginTop: 16 }}>
          불러오기 실패: {error.message}
        </div>
      </main>
    );
  }

  if (!data) notFound();

  const row = data as MeetingDetail;

  return (
    <main>
      <Link
        href="/history"
        style={{ color: "#0071e3", textDecoration: "none", fontSize: 14 }}
      >
        ← 목록으로
      </Link>

      <h1 style={{ marginTop: 16 }}>{row.title || "(제목 없음)"}</h1>
      <p className="subtitle">
        {formatDate(row.created_at)}
        {row.model && ` · ${row.model}`}
      </p>

      <section className="result" style={{ marginTop: 24 }}>
        <h2>요약</h2>
        {row.summary}
      </section>

      <details
        style={{
          marginTop: 24,
          background: "#fff",
          border: "1px solid #e5e5ea",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          원본 회의록 보기
        </summary>
        <pre
          style={{
            marginTop: 16,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#1d1d1f",
          }}
        >
          {row.original_text}
        </pre>
      </details>
    </main>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
