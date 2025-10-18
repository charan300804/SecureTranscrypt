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
  const isPublicRoute = publicRoutes.includes(pathname);

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  let session: SessionPayload | null = null;
  
  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (error) {
      console.error('Failed to parse session cookie:', error);
    }
  }

  // Handle expired session
  if (session && new Date(session.expires) < new Date()) {
    session = null;
    // We can't delete the cookie here directly, but we can treat the session as null.
    // The response will proceed as if unauthenticated.
  }

  if (session) {
    // User is authenticated
    const userDashboard = `/${session.role}`;

    if (isProtectedRoute) {
      // If user is on a protected route, ensure it's their own dashboard
      if (!pathname.startsWith(userDashboard)) {
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
    } else if (isAuthRoute || isPublicRoute) {
      // If authenticated user is on an auth or public page, redirect to their dashboard
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }
  } else {
    // User is not authenticated
    if (isProtectedRoute) {
      // If unauthenticated user tries to access a protected route, redirect to home
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
