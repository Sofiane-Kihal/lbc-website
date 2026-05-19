import { NextRequest, NextResponse } from 'next/server';
import { setMedia } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — Netlify Functions limite le body à ~6 Mo en sync.
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]);

function extFromType(type: string): string {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/svg+xml') return 'svg';
  return type.split('/')[1] || 'bin';
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData().catch(() => null);
    const file = form?.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: 'Format non supporté (JPG, PNG, WebP, GIF, AVIF, SVG).' },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 5 Mo).' },
        { status: 413 }
      );
    }

    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const key = `m_${ts}_${rand}.${extFromType(file.type)}`;
    const body = await file.arrayBuffer();

    const ok = await setMedia({ key, body, contentType: file.type });
    if (!ok) {
      return NextResponse.json(
        { error: 'Stockage indisponible (Netlify Blobs requis).' },
        { status: 500 }
      );
    }
    return NextResponse.json({ key, url: `/api/media/${key}` });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Erreur serveur : ${e?.message || 'inconnue'}` },
      { status: 500 }
    );
  }
}
