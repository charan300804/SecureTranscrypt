import { type NextRequest, NextResponse } from "next/server";
import { type SessionPayload } from "./lib/definitions";

const protectedRoutes = ["/sender", "/receiver"];
const authRoutes = ["/login", "/register"];
const publicRoutes = ["/"];

const SESSION_COOKIE_NAME = "secure-transcrypt-session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicHome = pathname === '/';

  if (session) {
    // If logged in, redirect from auth routes or home page to their dashboard
    if (isAuthRoute || isPublicHome) {
      return NextResponse.redirect(new URL(`/${session.role}`, request.url));
    }

    // If on a protected route, ensure it's the correct one for their role
    if (isProtectedRoute) {
      const role = session.role;
      if (!pathname.startsWith(`/${role}`)) {
        // Wrong role for this route, redirect to their own dashboard
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }
    }
  } else {
    // If not logged in, redirect from protected routes to the home page
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/", request.url));
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
