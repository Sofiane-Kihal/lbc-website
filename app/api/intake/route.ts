import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function getStoreSafe() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'lbc-leads', consistency: 'strong' });
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const lead = {
    id,
    submittedAt: payload.submittedAt || new Date().toISOString(),
    answers: payload.answers || {},
    ip: req.headers.get('x-forwarded-for') || null,
    userAgent: req.headers.get('user-agent') || null,
  };

  // Persist if Blobs available; otherwise log so dev sees it.
  const store = await getStoreSafe();
  if (store) {
    try {
      await store.setJSON(id, lead);
    } catch (e) {
      console.error('Blob write failed', e);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('[intake] (no blobs) ', JSON.stringify(lead, null, 2));
  }

  return NextResponse.json({ ok: true, id });
}
