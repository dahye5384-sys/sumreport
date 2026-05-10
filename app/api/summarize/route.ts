import { NextResponse } from "next/server";
import OpenAI from "openai";

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

  // Per-request client. Key lives only in this scope, never persisted.
  const client = new OpenAI({ apiKey, timeout: 55_000 });

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: meeting },
      ],
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!summary) {
      return NextResponse.json(
        { error: "GPT 응답이 비어있습니다. 회의록을 다시 확인해주세요." },
        { status: 502 },
      );
    }

    return NextResponse.json({ summary });
  } catch (err: unknown) {
    const message = formatOpenAIError(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
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
