import { NextRequest, NextResponse } from 'next/server';
import { getBanners, setBanners } from '@/lib/storage';
import type { Banners } from '@/lib/defaults';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getBanners();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Partial<Banners> | null;
  if (
    !body ||
    !Array.isArray(body.logos) ||
    !Array.isArray(body.slogans)
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const ok = await setBanners({
    logos: body.logos,
    slogans: body.slogans.filter((s) => typeof s === 'string'),
  });
  if (!ok) {
    return NextResponse.json(
      { error: 'Storage indisponible (Netlify Blobs requis en production).' },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
