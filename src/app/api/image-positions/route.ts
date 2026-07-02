import { NextRequest, NextResponse } from "next/server";
import { getImagePositions, saveImagePositions, mergeImagePositions, type ImagePositions } from "@/lib/db";
import { COOKIE_NAME, validateToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await getImagePositions());
}

// Санитизация + жёсткие лимиты — чтобы хранилище нельзя было раздуть из админки.
function sanitizePositions(body: Record<string, unknown>): ImagePositions {
  const clean: ImagePositions = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof k !== "string" || k.length > 80) continue;
    if (!v || typeof v !== "object") continue;
    const o = v as Record<string, unknown>;
    const e: { x?: number; y?: number; size?: "cover" | "contain" | number } = {};
    if (typeof o.x === "number") e.x = Math.max(-100, Math.min(200, Math.round(o.x)));
    if (typeof o.y === "number") e.y = Math.max(-100, Math.min(200, Math.round(o.y)));
    if (o.size === "cover" || o.size === "contain") e.size = o.size;
    else if (typeof o.size === "number") e.size = Math.max(10, Math.min(400, Math.round(o.size)));
    // Храним только непустые/нестандартные записи — файл остаётся компактным.
    if (Object.keys(e).length) clean[k] = e;
    if (Object.keys(clean).length >= 1000) break; // верхний предел
  }
  return clean;
}

export async function POST(req: NextRequest) {
  // Явная проверка авторизации (не полагаемся только на middleware/proxy)
  if (!validateToken(req.cookies.get(COOKIE_NAME)?.value ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Защита от большого тела: лимит записей после parse не спасает от огромного запроса
  if (Number(req.headers.get("content-length") || 0) > 200_000) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }

    // Частичное обновление из инлайн-редактора: клиент шлёт только изменённый слаг,
    // сервер подмешивает его в свежую версию хранилища. Убирает гонку, из-за которой
    // быстрые правки затирали друг друга (см. mergeImagePositions).
    const b = body as Record<string, unknown>;
    if (b.merge === true && b.positions && typeof b.positions === "object" && !Array.isArray(b.positions)) {
      const clean = sanitizePositions(b.positions as Record<string, unknown>);
      const merged = await mergeImagePositions(clean);
      return NextResponse.json({ ok: true, count: Object.keys(merged).length });
    }

    // Полная перезамена (массовое сохранение из админки).
    const clean = sanitizePositions(b);
    await saveImagePositions(clean);
    return NextResponse.json({ ok: true, count: Object.keys(clean).length });
  } catch (e) {
    console.error("image-positions save error", e);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}
