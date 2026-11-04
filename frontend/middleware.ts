// ─── Next.js Middleware ────────────────────────────────────────────────────────
// Auth guard: redirects unauthenticated users to /smart-onboarding.
// JWT verification logic will be wired in Phase 3 (Auth).
// For now the middleware is a structural placeholder that passes all requests.

import { NextRequest, NextResponse } from 'next/server';

/**
 * Routes that are publicly accessible (no auth required).
 */
const PUBLIC_ROUTES: string[] = [
  '/smart-onboarding',
];

/**
 * Middleware runs on the Edge Runtime before every matched request.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Allow public routes without inspection
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isPublic) {
    return NextResponse.next();
  }

  // ── Phase 3: Replace this block with real JWT verification ────────────────
  // const token = request.cookies.get('access_token')?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL('/smart-onboarding', request.url));
  // }
  // ─────────────────────────────────────────────────────────────────────────

  return NextResponse.next();
}

/**
 * Limit middleware to application routes only.
 * Exclude Next.js internals, static files, and image optimisation.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
