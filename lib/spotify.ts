import querystring from 'querystring';

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: { spotify: string };
  duration_ms: number;
}

interface NowPlayingResponse {
  isPlaying: boolean;
  track?: {
    name: string;
    artist: string;
    album: string;
    albumImage: string;
    spotifyUrl: string;
    duration: number;
    progress: number;
  };
  error?: string;
}

interface RecentlyPlayedResponse {
  tracks: Array<{
    name: string;
    artist: string;
    album: string;
    albumImage: string;
    spotifyUrl: string;
    playedAt: string;
  }>;
  error?: string;
}

const getAccessToken = async (): Promise<string> => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Spotify credentials');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  return data.access_token;
};

export const getNowPlaying = async (): Promise<NowPlayingResponse> => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 204 = No content (nothing playing)
    if (response.status === 204 || response.status === 404) {
      return { isPlaying: false };
    }

    if (!response.ok) {
      return { isPlaying: false, error: 'Failed to fetch' };
    }

    const data = await response.json();

    if (!data.item) {
      return { isPlaying: false };
    }

    return {
      isPlaying: data.is_playing,
      track: {
        name: data.item.name,
        artist: data.item.artists.map((a: any) => a.name).join(', '),
        album: data.item.album.name,
        albumImage: data.item.album.images[0]?.url || '',
        spotifyUrl: data.item.external_urls.spotify,
        duration: data.item.duration_ms,
        progress: data.progress_ms || 0,
      },
    };
  } catch (error) {
    return { isPlaying: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getRecentlyPlayed = async (limit: number = 5): Promise<RecentlyPlayedResponse> => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return { tracks: [], error: 'Failed to fetch' };
    }

    const data = await response.json();

    return {
      tracks: data.items.map((item: any) => ({
        name: item.track.name,
        artist: item.track.artists.map((a: any) => a.name).join(', '),
        album: item.track.album.name,
        albumImage: item.track.album.images[0]?.url || '',
        spotifyUrl: item.track.external_urls.spotify,
        playedAt: new Date(item.played_at).toLocaleString(),
      })),
    };
  } catch (error) {
    return { tracks: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
