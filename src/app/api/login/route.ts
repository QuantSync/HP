import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateToken, constantTimeEqual, COOKIE_NAME } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { password?: string };
    const password = body.password ?? '';
    const sitePassword = process.env.SITE_PASSWORD ?? '';

    if (!sitePassword) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Constant-time comparison
    const isValid = constantTimeEqual(password, sitePassword);

    if (!isValid) {
      // Small delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await generateToken();
    const isProd = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
