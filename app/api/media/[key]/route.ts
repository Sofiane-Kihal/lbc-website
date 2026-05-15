import { NextResponse } from 'next/server';
import { getMedia } from '@/lib/storage';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!/^[A-Za-z0-9._-]+$/.test(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }
  const media = await getMedia(key);
  if (!media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return new NextResponse(media.body, {
    status: 200,
    headers: {
      'Content-Type': media.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
