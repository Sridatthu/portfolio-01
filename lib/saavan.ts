interface SaavnTrack {
  id: string;
  name: string;
  artists: string;
  image: string;
  duration: number;
}

interface SaavnSearchResponse {
  success: boolean;
  songs: SaavnTrack[];
}

interface SaavnSongResponse {
  success: boolean;
   url?:string;
}
export const searchSaavnTrack = async (songName: string): Promise<SaavnSearchResponse> => {
  try {
   
    const response = await fetch(
      `https://saavn.vercel.app/api/search/songs?query=${(songName)}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      }
    );

    if (!response.ok) {
      return { success: false, songs: [] };
    }

    const data = await response.json();

    return {
      success: true,
      songs: data.data.results?.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.primary?.[0].name,
        image: track.image?.[2]?.url,
        duration: track.duration,
      })) || [],
    };
  } catch (error) {
    return { success: false, songs: [] };
  }
};

export const searchSaavnDirect = async (id: string): Promise<SaavnSongResponse> => {
  try {
    const response = await fetch(
      `https://saavn.vercel.app/api/songs/${(id)}`
    );

    if (!response.ok) {
      return { success: false, url:undefined };
    }

    const data = await response.json();
console.log(data.data?.[0].downloadUrl?.[4].url)
    return {
      success: true,
      url:data.data?.[0].downloadUrl?.[4].url
    };
  } catch (error) {
    return { success: false, url:undefined };
  }
};
