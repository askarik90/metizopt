import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateToken, COOKIE_NAME } from "@/lib/auth";
import { trackEvent, getAnalytics, addEvent, type DayStats, type EventLog } from "@/lib/db";

const ALLOWED_EVENTS: (keyof DayStats)[] = [
  "whatsappClicks", "phoneClicks", "formOpens", "formSubmits", "fileUploads",
];

const TYPE_MAP: Record<string, EventLog["type"]> = {
  whatsappClicks: "whatsapp",
  phoneClicks: "phone",
  formOpens: "form_open",
  formSubmits: "form_submit",
};

// POST /api/analytics — record an event (public, from frontend)
export async function POST(request: NextRequest) {
  try {
    const { type, category, page } = await request.json();
    if (!ALLOWED_EVENTS.includes(type)) {
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
    }
    // Aggregate counter (daily totals)
    await trackEvent(type);
    // Individual event log (for timeline + per-category conversion)
    const eventType = TYPE_MAP[type];
    if (eventType) {
      await addEvent({
        type: eventType,
        timestamp: new Date().toISOString(),
        category: category || undefined,
        page: page || undefined,
      });
    }
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
