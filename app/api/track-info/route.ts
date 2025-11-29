import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'now-playing';

  try {
    let trackData;

    if (type === 'recently-played') {
      const spotifyData = await getRecentlyPlayed(1);
      if (!spotifyData.tracks[0]) {
        return NextResponse.json({ spotify: null }, { status: 200 });
      }
      trackData = spotifyData.tracks[0];
    } else {
      const spotifyData = await getNowPlaying();
      if (!spotifyData.isPlaying || !spotifyData.track) {
        return NextResponse.json({ isPlaying: false }, { status: 200 });
      }
      trackData = spotifyData.track;
    }

   
    return NextResponse.json({
      spotify: trackData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process' },
      { status: 500 }
    );
  }
}
