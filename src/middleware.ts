import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, validateToken } from "@/lib/auth";

const PROTECTED_ADMIN = /^\/admin(\/|$)(?!login)/;
const PROTECTED_API = ["/api/leads", "/api/faq", "/api/settings", "/api/groups", "/api/categories"];
const WRITE_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const method = request.method;

  const token = request.cookies.get(COOKIE_NAME)?.value ?? "";
  const isAuth = token ? await validateToken(token) : false;

  // Защита /admin/* (кроме /admin/login)
  if (PROTECTED_ADMIN.test(pathname)) {
    if (!isAuth) {
      const loginUrl = new URL("/admin/login", origin);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Защита write-операций на API
  if (
    WRITE_METHODS.has(method) &&
    PROTECTED_API.some((r) => pathname.startsWith(r))
  ) {
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/leads/:path*",
    "/api/faq/:path*",
    "/api/settings/:path*",
    "/api/groups/:path*",
    "/api/categories/:path*",
  ],
};
