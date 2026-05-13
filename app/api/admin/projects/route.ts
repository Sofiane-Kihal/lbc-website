import { NextRequest, NextResponse } from 'next/server';
import { getProjects, setProjects } from '@/lib/storage';
import type { Project } from '@/lib/defaults';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getProjects();
  return NextResponse.json({ items: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const items = body.items as Project[];
  const ok = await setProjects(items);
  if (!ok) {
    return NextResponse.json(
      { error: 'Storage indisponible (Netlify Blobs requis en production).' },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, items });
}
