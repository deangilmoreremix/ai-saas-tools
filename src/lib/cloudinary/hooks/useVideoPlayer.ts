import { useState, useCallback, useEffect } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';

interface VideoPlayerOptions {
  cloudName?: string;
  publicId: string;
  sourceTypes?: string[];
  autoplayMode?: 'never' | 'always' | 'if-possible';
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  posterOptions?: {
    publicId?: string;
    transformation?: string;
  };
}

export const useVideoPlayer = (options: VideoPlayerOptions) => {
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: options.cloudName || process.env.VITE_CLOUDINARY_CLOUD_NAME
      }
    });

    const videoPlayer = cld.videoPlayer();

    videoPlayer.source(options.publicId, {
      sourceTypes: options.sourceTypes || ['mp4', 'webm', 'ogg'],
      transformation: {
        streaming_profile: 'full_hd'
      }
    });

    videoPlayer
      .on('ready', () => {
        setIsReady(true);
        setDuration(videoPlayer.duration());
      })
      .on('play', () => setIsPlaying(true))
      .on('pause', () => setIsPlaying(false))
      .on('timeupdate', () => setCurrentTime(videoPlayer.currentTime()))
      .on('volumechange', () => setVolume(videoPlayer.volume()))
      .on('error', (error: Error) => setError(error));

    setPlayer(videoPlayer);

    return () => {
      videoPlayer.dispose();
    };
  }, [options.cloudName, options.publicId, options.sourceTypes]);

  const play = useCallback(() => {
    if (player) {
      player.play();
    }
  }, [player]);

  const pause = useCallback(() => {
    if (player) {
      player.pause();
    }
  }, [player]);

  const seek = useCallback((time: number) => {
    if (player) {
      player.currentTime(time);
    }
  }, [player]);

  const setPlayerVolume = useCallback((value: number) => {
    if (player) {
      player.volume(Math.max(0, Math.min(1, value)));
    }
  }, [player]);

  const toggleMute = useCallback(() => {
    if (player) {
      player.muted(!player.muted());
    }
  }, [player]);

  const toggleFullscreen = useCallback(() => {
    if (player) {
      player.isFullscreen() ? player.exitFullscreen() : player.requestFullscreen();
    }
  }, [player]);

  return {
    player,
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    error,
    controls: {
      play,
      pause,
      seek,
      setVolume: setPlayerVolume,
      toggleMute,
      toggleFullscreen
    }
  };
};

export default useVideoPlayer;