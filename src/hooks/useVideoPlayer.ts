import { useState, useCallback, useEffect, useRef } from 'react';
import { VideoPlayerSettings, VideoPlayerState, VideoPlayerControls } from '../types/videoPlayer';

interface UseVideoPlayerOptions {
  publicId?: string;
  settings: VideoPlayerSettings;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onQualityChange?: (quality: string) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onError?: (error: Error) => void;
}

export const useVideoPlayer = ({
  publicId,
  settings,
  onTimeUpdate,
  onDurationChange,
  onQualityChange,
  onPlaybackRateChange,
  onError
}: UseVideoPlayerOptions) => {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: settings.muted,
    isFullscreen: false,
    quality: 'auto',
    playbackRate: 1,
    buffered: null
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        setState(prev => ({ ...prev, currentTime: video.currentTime }));
        onTimeUpdate?.(video.currentTime);
      };

      const handleDurationChange = () => {
        setState(prev => ({ ...prev, duration: video.duration }));
        onDurationChange?.(video.duration);
      };

      const handleProgress = () => {
        setState(prev => ({ ...prev, buffered: video.buffered }));
      };

      const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
      const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));
      const handleVolumeChange = () => setState(prev => ({ 
        ...prev, 
        volume: video.volume,
        isMuted: video.muted
      }));
      const handleError = () => {
        const error = new Error('Video playback error');
        setState(prev => ({ ...prev, error }));
        onError?.(error);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('durationchange', handleDurationChange);
      video.addEventListener('progress', handleProgress);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('volumechange', handleVolumeChange);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('durationchange', handleDurationChange);
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('volumechange', handleVolumeChange);
        video.removeEventListener('error', handleError);
      };
    }
  }, [onTimeUpdate, onDurationChange, onError]);

  const controls: VideoPlayerControls = {
    play: useCallback(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, []),

    pause: useCallback(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, []),

    seek: useCallback((time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }, []),

    setVolume: useCallback((volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
    }, []),

    toggleMute: useCallback(() => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    }, []),

    toggleFullscreen: useCallback(() => {
      if (videoRef.current) {
        if (!document.fullscreenElement) {
          videoRef.current.requestFullscreen();
          setState(prev => ({ ...prev, isFullscreen: true }));
        } else {
          document.exitFullscreen();
          setState(prev => ({ ...prev, isFullscreen: false }));
        }
      }
    }, []),

    setQuality: useCallback((quality: string) => {
      setState(prev => ({ ...prev, quality }));
      onQualityChange?.(quality);
    }, [onQualityChange]),

    setPlaybackRate: useCallback((rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setState(prev => ({ ...prev, playbackRate: rate }));
        onPlaybackRateChange?.(rate);
      }
    }, [onPlaybackRateChange])
  };

  return {
    videoRef,
    state,
    controls
  };
};

export default useVideoPlayer;