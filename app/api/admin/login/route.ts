import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSession, isWhitelisted } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
  }

  if (!isWhitelisted(email) || !checkPassword(password)) {
    // Same message either way to avoid email enumeration.
    return NextResponse.json(
      { error: 'Email ou mot de passe invalide' },
      { status: 401 }
    );
  }

  await createSession(email);
  return NextResponse.json({ ok: true });
}
