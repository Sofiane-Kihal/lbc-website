import { NextRequest, NextResponse } from 'next/server';
import { getPricing, setPricing } from '@/lib/storage';
import type { PricingGroup } from '@/lib/defaults';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPricing();
  return NextResponse.json({ items: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const items = body.items as PricingGroup[];
  const ok = await setPricing(items);
  if (!ok) {
    return NextResponse.json(
      { error: 'Storage indisponible (Netlify Blobs requis en production).' },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, items });
}
