import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — under Vercel Hobby 4.5MB request limit

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "파일을 읽을 수 없습니다." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "파일이 첨부되지 않았습니다." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `파일이 너무 큽니다 (최대 ${MAX_BYTES / 1024 / 1024}MB)` },
      { status: 413 },
    );
  }

  const name = file.name.toLowerCase();
  if (!name.endsWith(".docx")) {
    return NextResponse.json(
      { error: ".docx 파일만 서버 추출 대상입니다 (.txt/.md는 브라우저에서 직접 읽음)" },
      { status: 400 },
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Word 문서에서 텍스트를 추출할 수 없습니다." },
        { status: 422 },
      );
    }
    return NextResponse.json({ text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Word 파싱 실패: ${msg}` },
      { status: 500 },
    );
  }
}
