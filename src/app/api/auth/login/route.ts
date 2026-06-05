import { NextRequest, NextResponse } from "next/server";
import { generateSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

const PASSWORD = process.env.ADMIN_PASSWORD || "krp.admin.2024";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || password !== PASSWORD) {
      await new Promise((r) => setTimeout(r, 500)); // Защита от брутфорса
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    const token = await generateSessionToken(password);
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
