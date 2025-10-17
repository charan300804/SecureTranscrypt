import { type NextRequest, NextResponse } from "next/server";
import { type SessionPayload } from "./src/lib/definitions";

const protectedRoutes = ["/sender", "/receiver"];
const authRoutes = ["/login", "/register"];
const publicRoutes = ["/"];

const SESSION_COOKIE_NAME = "secure-transcrypt-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  let session: SessionPayload | null = null;
  
  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (error) {
      console.error('Failed to parse session cookie:', error);
      // Invalid session cookie, treat as unauthenticated
    }
  }

  if (isProtectedRoute) {
    if (!session) {
      // Not authenticated, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Check role access
    const role = session.role;
    if (!pathname.startsWith(`/${role}`)) {
      // Wrong role for this route, redirect to their own dashboard
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  if (isAuthRoute) {
    if (session) {
      // Authenticated user on an auth route, redirect to their dashboard
      return NextResponse.redirect(new URL(`/${session.role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
