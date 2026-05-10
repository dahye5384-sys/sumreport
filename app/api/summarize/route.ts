import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `당신은 한국어 회의록 요약 전문가입니다.
입력된 회의록을 한국어로 간결하고 명확하게 요약하세요.
회의록이 한국어와 영어가 섞여 있더라도 결과는 반드시 한국어로 작성하세요.
요약은 핵심 논의 내용, 결정사항, 액션아이템을 자연스럽게 포함하되,
이번 단계에서는 줄글/불릿 형태의 자유로운 요약으로 작성하면 됩니다.`;

interface SummarizeRequest {
  apiKey?: string;
  meeting?: string;
  title?: string | null;
}

export async function POST(req: Request) {
  let body: SummarizeRequest;
  try {
    body = (await req.json()) as SummarizeRequest;
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청 형식입니다." },
      { status: 400 },
    );
  }

  const apiKey = body.apiKey?.trim();
  const meeting = body.meeting?.trim();
  const title = body.title?.trim() || null;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API 키가 누락되었습니다." },
      { status: 400 },
    );
  }
  if (!meeting) {
    return NextResponse.json(
      { error: "회의록 내용이 비어있습니다." },
      { status: 400 },
    );
  }

  // Auth check — only logged-in users may summarize+save.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  // Per-request OpenAI client — key is never persisted.
  const client = new OpenAI({ apiKey, timeout: 55_000 });

  let summary = "";
  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: meeting },
      ],
      temperature: 0.3,
    });
    summary = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!summary) {
      return NextResponse.json(
        { error: "GPT 응답이 비어있습니다. 회의록을 다시 확인해주세요." },
        { status: 502 },
      );
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { error: formatOpenAIError(err) },
      { status: 502 },
    );
  }

  // Auto-save to Supabase. Failure to save is reported but the summary
  // still returns so the user does not lose work.
  let meetingId: string | null = null;
  let saveError: string | null = null;
  try {
    const { data, error } = await supabase
      .from("meetings")
      .insert({
        user_id: user.id,
        title,
        original_text: meeting,
        summary,
        model: MODEL,
      })
      .select("id")
      .single();
    if (error) throw error;
    meetingId = data.id as string;
  } catch (err: unknown) {
    saveError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    summary,
    meetingId,
    saved: meetingId !== null,
    saveError,
  });
}

function formatOpenAIError(err: unknown): string {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401) return "API 키가 잘못되었거나 권한이 없습니다.";
    if (err.status === 429)
      return "요청 한도를 초과했거나 결제가 필요합니다 (429).";
    if (err.status === 408) return "요청이 시간 초과되었습니다.";
    return `OpenAI 오류 (${err.status ?? "unknown"}): ${err.message}`;
  }
  if (err instanceof Error) return `처리 중 오류: ${err.message}`;
  return "알 수 없는 오류가 발생했습니다.";
}
