import { NextRequest, NextResponse } from "next/server";
import { checkPassword, getSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
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
        return NextResponse.redirect(new URL("/admin/login?error=1", request.url), { status: 303 });
      }
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    // Redirect to dashboard if it's a form submission
    if (!contentType?.includes("application/json")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url), { status: 303 });
    }

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
