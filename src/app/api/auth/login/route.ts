import { NextRequest, NextResponse } from "next/server";
import { checkPassword, getSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Use the Host header so redirects go to localhost, not 0.0.0.0
    const host = request.headers.get("host") ?? "localhost:3000";
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";
    const origin = `${proto}://${host}`;

    let password: string | null = null;

    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      password = body.password;
    } else {
      const formData = await request.formData();
      password = formData.get("password") as string | null;
    }

    if (!password || !checkPassword(password)) {
      await new Promise((r) => setTimeout(r, 500)); // анти-брутфорс

      // Redirect to login page with error if it's a form submission
      if (!contentType?.includes("application/json")) {
        return NextResponse.redirect(`${origin}/admin/login?error=1`, { status: 303 });
      }
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    };

    // Form submission → redirect with cookie
    if (!contentType?.includes("application/json")) {
      const redirectResponse = NextResponse.redirect(`${origin}/admin/dashboard`, { status: 303 });
      redirectResponse.cookies.set(COOKIE_NAME, getSessionToken(), cookieOptions);
      return redirectResponse;
    }

    // JSON request → return JSON with cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, getSessionToken(), cookieOptions);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
