import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = token ? await verifyToken(token) : false;

  const isLoginPage = pathname === '/login';
  const isApiLogin = pathname === '/api/login';
  const isApiLogout = pathname === '/api/logout';

  if (isApiLogin || isApiLogout) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginPage) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!login|api/login|api/logout|_next/static|_next/image|favicon.ico|gallery).*)',
  ],
};
