import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateToken, COOKIE_NAME } from "@/lib/auth";
import { trackEvent, getAnalytics, type DayStats } from "@/lib/db";

const ALLOWED_EVENTS: (keyof DayStats)[] = [
  "whatsappClicks", "phoneClicks", "formOpens", "formSubmits", "fileUploads",
];

// POST /api/analytics — record an event (public, from frontend)
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    if (!ALLOWED_EVENTS.includes(type)) {
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
    }
    await trackEvent(type);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET /api/analytics — read stats (admin only)
export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value ?? "";
  if (!validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await getAnalytics();
    return NextResponse.json({ analytics: data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
