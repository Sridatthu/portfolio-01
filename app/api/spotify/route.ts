import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'now-playing';
  const limit = request.nextUrl.searchParams.get('limit') || '5';

  try {
    if (type === 'recently-played') {
      const data = await getRecentlyPlayed(parseInt(limit));
      return NextResponse.json(data);
    }

    const data = await getNowPlaying();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Spotify data' },
      { status: 500 }
    );
  }
}
