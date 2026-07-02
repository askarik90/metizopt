import { NextRequest, NextResponse } from "next/server";
import { saveImageToGitHub } from "@/lib/db";
import { COOKIE_NAME, validateToken } from "@/lib/auth";

// Разрешаем писать только в известные папки картинок и только .jpg — защита от path traversal.
const ALLOWED = /^\/images\/(categories|types|groups|hero)\/[a-z0-9._-]+\.jpg$/i;

export async function POST(req: NextRequest) {
  if (!validateToken(req.cookies.get(COOKIE_NAME)?.value ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (Number(req.headers.get("content-length") || 0) > 4_000_000) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json({ error: "upload disabled (no storage)" }, { status: 501 });
  }
  try {
    const { path, dataBase64 } = await req.json();
    if (typeof path !== "string" || !ALLOWED.test(path)) {
      return NextResponse.json({ error: "bad path" }, { status: 400 });
    }
    if (typeof dataBase64 !== "string" || dataBase64.length < 100 || dataBase64.length > 5_000_000) {
      return NextResponse.json({ error: "bad image" }, { status: 400 });
    }
    await saveImageToGitHub("public" + path, dataBase64);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("image-upload error", e);
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}
