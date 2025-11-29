'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumImage: string;
  spotifyUrl: string;
}

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
interface SongUrl {
  success: boolean;
  url: string
}
interface TrackInfoResponse {
  isPlaying?: boolean;
  spotify?: SpotifyTrack;
}

const formatTime = (seconds: number) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function NowPlaying() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [displayData, setDisplayData] = useState<TrackInfoResponse | null>(null);
  const [saavnData, setSaavnData] = useState<SaavnSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusLabel, setStatusLabel] = useState('Now Playing');
  const [audioUrl, setAudioUrl] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const nowPlayingRes = await axios.get<TrackInfoResponse>('/api/track-info?type=now-playing');

      if (nowPlayingRes.data.isPlaying === false) {
        const recentlyPlayedRes = await axios.get<TrackInfoResponse>('/api/track-info?type=recently-played');
        setDisplayData(recentlyPlayedRes.data);
        setStatusLabel('Last played');
      } else {
        setDisplayData(nowPlayingRes.data);
        setStatusLabel('Now Playing');
      }
      setError(false);
    } catch (err) {
      console.error('Error fetching track info:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setIsAudioPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  if (error) return <div className="text-red-500">Failed to load</div>;
  if (loading) return <div className="mt-6">
                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-border/50 shadow-inner">
                        <div className="w-12 h-12 rounded-md bg-muted animate-pulse"></div>
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium">Loading...</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                                <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>

  if (!displayData || (!displayData.spotify)) {
    return <div>No data available</div>;
  }

  const trackName = displayData.spotify?.name
  const artistName = displayData.spotify?.artist
  const albumImage = displayData.spotify?.albumImage
  const spotifyUrl = displayData.spotify?.spotifyUrl

  const togglePlay = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!trackName) return;

    try {
      if (isAudioPlaying) {
        setIsAudioPlaying(false);
        return;
      }


      const saavnTrack = await axios.get<SaavnSearchResponse>('/api/music/search?query=' + encodeURIComponent(trackName));
      if (saavnTrack.data.songs && saavnTrack.data.songs.length > 0) {
        setSaavnData(saavnTrack.data);
        const saavnUrl = await axios.get<SongUrl>('/api/music/stream?id=' + saavnTrack.data.songs[0].id);
        if (saavnUrl.data.success && saavnUrl.data.url) {
          setAudioUrl(saavnUrl.data.url);
          console.log(saavnUrl.data.url)
          setIsAudioPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error fetching audio", error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsAudioPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(Math.max(x / rect.width, 0), 1);
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-border/50 shadow-inner">
        <div className="flex items-center gap-3">
          <img
            alt="Album art"
            width="48"
            height="48"
            className="rounded-md shadow-inner ring-1 ring-black/10 dark:ring-white/10"
            src={albumImage}
          />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-green-500/10 shadow-inner transition-opacity">
                {/* Inline Spotify SVG */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 filter drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{statusLabel}</span>
            </div>
            <div className="flex flex-col min-h-[2.5rem] max-h-[2.5rem]">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium truncate text-foreground hover:underline hover:text-green-500 transition-colors cursor-pointer h-5"
                title="Open in Spotify"
              >
                {trackName}
              </a>
              <span className="text-xs text-muted-foreground truncate h-4">
                by {artistName}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive btn-inner-shadow hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9"
            aria-label={isAudioPlaying ? "Pause" : "Play"}
          >
            {isAudioPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause h-4 w-4">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play h-4 w-4">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            )}
          </button>
        </div>
        {audioUrl && (<>
          <div className="flex flex-col gap-3">
            <div data-orientation="horizontal" role="none" className="bg-border shrink-0 h-px w-full"></div>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium h-5">{trackName}</div>
                <div className="truncate text-xs text-muted-foreground h-4">{artistName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>

              {/* Slider */}
              <div
                className="relative flex w-full touch-none items-center select-none cursor-pointer"
                onClick={handleSeek}
              >
                <span className="bg-muted relative grow overflow-hidden rounded-full h-1.5 w-full">
                  <span
                    className="bg-primary absolute h-full"
                    style={{ width: `${progressPercent}%` }}
                  ></span>
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: `${progressPercent}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <span className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden"></span>
                </span>
              </div>

              <span className="text-xs tabular-nums text-muted-foreground w-10">{formatTime(duration)}</span>
            </div>
          </div>
          <audio
            ref={audioRef}
            className="hidden"
            loop
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          ></audio></>)}
      </div>
    </div>
  );
}