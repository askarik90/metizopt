import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateToken, COOKIE_NAME } from "@/lib/auth";
import { getEvents } from "@/lib/db";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value ?? "";
  if (!validateToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const events = await getEvents();
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
