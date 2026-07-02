import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, validateToken } from "@/lib/auth";

const PROTECTED_ADMIN = /^\/admin(\/|$)(?!login)/;
const PROTECTED_API = [
  "/api/leads",
  "/api/faq",
  "/api/settings",
  "/api/groups",
  "/api/categories",
  "/api/admin",
  "/api/generate-image",
  "/api/approve-hero-settings",
  "/api/image-positions",
  "/api/image-upload",
];
const ALWAYS_AUTH_API = ["/api/leads", "/api/admin"];
const WRITE_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const method = request.method;

  const token = request.cookies.get(COOKIE_NAME)?.value ?? "";
  const isAuth = validateToken(token);

  if (PROTECTED_ADMIN.test(pathname) && !isAuth) {
    const loginUrl = new URL("/admin/login", origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (ALWAYS_AUTH_API.some((route) => pathname.startsWith(route)) && !isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    WRITE_METHODS.has(method) &&
    PROTECTED_API.some((route) => pathname.startsWith(route)) &&
    !isAuth
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    "/api/admin/:path*",
    "/api/generate-image/:path*",
    "/api/approve-hero-settings/:path*",
    "/api/image-positions/:path*",
    "/api/image-upload/:path*",
  ],
};
