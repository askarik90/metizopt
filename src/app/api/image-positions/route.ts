import { NextRequest, NextResponse } from "next/server";
import { getImagePositions, saveImagePositions, type ImagePositions } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await getImagePositions());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }
    // Санитизация + жёсткие лимиты — чтобы Blob нельзя было раздуть из админки.
    const clean: ImagePositions = {};
    for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
      if (typeof k !== "string" || k.length > 80) continue;
      if (!v || typeof v !== "object") continue;
      const o = v as Record<string, unknown>;
      const e: { x?: number; y?: number; size?: "cover" | "contain" } = {};
      if (typeof o.x === "number") e.x = Math.max(0, Math.min(100, Math.round(o.x)));
      if (typeof o.y === "number") e.y = Math.max(0, Math.min(100, Math.round(o.y)));
      if (o.size === "cover" || o.size === "contain") e.size = o.size;
      // Храним только непустые/нестандартные записи — файл остаётся компактным.
      if (Object.keys(e).length) clean[k] = e;
      if (Object.keys(clean).length >= 1000) break; // верхний предел
    }
    await saveImagePositions(clean);
    return NextResponse.json({ ok: true, count: Object.keys(clean).length });
  } catch (e) {
    console.error("image-positions save error", e);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}
