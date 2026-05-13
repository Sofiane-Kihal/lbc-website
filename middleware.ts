import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE = 'lbc_session';

function getSecret() {
  const secret =
    process.env.SESSION_SECRET || 'dev-only-do-not-use-in-prod-please-change';
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/dashboard and /api/admin/*
  const protectedPath =
    pathname.startsWith('/admin/dashboard') ||
    (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login'));

  if (!protectedPath) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return redirectToLogin(req);

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/admin';
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
