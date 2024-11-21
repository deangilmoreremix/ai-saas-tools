export interface VideoPlayerSettings {
  theme: 'default' | 'minimal' | 'custom';
  primaryColor: string;
  controls: {
    playPause: boolean;
    progress: boolean;
    volume: boolean;
    fullscreen: boolean;
    quality: boolean;
    speed: boolean;
    chapters: boolean;
    thumbnails: boolean;
  };
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  preload: 'auto' | 'metadata' | 'none';
  analytics: boolean;
  adaptiveStreaming: boolean;
  hotkeys: boolean;
  thumbnailSeeking: boolean;
  playbackRates: number[];
  qualityLevels: string[];
}

export interface VideoPlayerProps {
  publicId: string;
  settings: VideoPlayerSettings;
  onSettingsChange: (settings: VideoPlayerSettings) => void;
  className?: string;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  quality: string;
  playbackRate: number;
  buffered: TimeRanges | null;
}

export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setQuality: (quality: string) => void;
  setPlaybackRate: (rate: number) => void;
}