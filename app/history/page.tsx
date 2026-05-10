import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface MeetingRow {
  id: string;
  title: string | null;
  created_at: string;
  summary: string;
}

export default async function HistoryPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("meetings")
    .select("id, title, created_at, summary")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>저장된 회의록</h1>
          <p className="subtitle">최근 50개</p>
        </div>
        <Link
          href="/"
          style={{ color: "#0071e3", textDecoration: "none", fontSize: 14 }}
        >
          ← 새 요약 만들기
        </Link>
      </header>

      {error && (
        <div className="status error">
          기록을 불러올 수 없습니다: {error.message}
        </div>
      )}

      {data && data.length === 0 && (
        <div className="status info">
          아직 저장된 회의록이 없습니다. 메인 페이지에서 첫 요약을 만들어보세요.
        </div>
      )}

      {data && data.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {(data as MeetingRow[]).map((row) => (
            <li
              key={row.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e5ea",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 12,
              }}
            >
              <Link
                href={`/meeting/${row.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}
                >
                  <strong style={{ fontSize: 16 }}>
                    {row.title || "(제목 없음)"}
                  </strong>
                  <span className="muted" style={{ marginTop: 0 }}>
                    {formatDate(row.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6e6e73",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {row.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
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
