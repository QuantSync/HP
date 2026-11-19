import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateToken, constantTimeEqual, COOKIE_NAME } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const rawPassword = body.password ?? '';
    const inputClean = rawPassword.trim();

    // Accept MUM191828 as the primary password, plus env variable and legacy fallback
    const validPasswords = [
      'MUM191828',
      (process.env.SITE_PASSWORD || '').trim(),
      'MUM193746',
    ].filter(Boolean);

    // Constant-time comparison, tolerant to casing & whitespace
    const isValid = validPasswords.some(
      (expected) =>
        constantTimeEqual(inputClean, expected) ||
        constantTimeEqual(inputClean.toUpperCase(), expected.toUpperCase())
    );

    if (!isValid) {
      await new Promise((r) => setTimeout(r, 400));
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
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
