export interface VideoUploadProps {
  onUpload: (file: File) => void;
  maxSize?: number;
  accept?: string[];
  isUploading?: boolean;
  progress?: number;
  error?: string;
  className?: string;
}

export interface VideoPreviewProps {
  file: File;
  onRemove?: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  showControls?: boolean;
  className?: string;
}

export interface VideoProcessingProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  error?: string;
  className?: string;
}

export interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onFullscreen: () => void;
  className?: string;
}

export interface VideoTimelineProps {
  currentTime: number;
  duration: number;
  buffered: TimeRanges | null;
  onSeek: (time: number) => void;
  thumbnails?: string[];
  className?: string;
}

export interface VideoQualityProps {
  currentQuality: string;
  qualities: string[];
  onQualityChange: (quality: string) => void;
  className?: string;
}

export interface VideoSpeedProps {
  currentSpeed: number;
  speeds: number[];
  onSpeedChange: (speed: number) => void;
  className?: string;
}

export interface VideoSettingsProps {
  settings: VideoSettings;
  onSettingsChange: (settings: VideoSettings) => void;
  className?: string;
}

export interface VideoSettings {
  quality: string;
  speed: number;
  volume: number;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  thumbnails: boolean;
  hotkeys: boolean;
}

export interface VideoTransformProps {
  file: File;
  transformations: VideoTransformation[];
  onTransformComplete: (url: string) => void;
  className?: string;
}

export interface VideoTransformation {
  type: 'resize' | 'crop' | 'rotate' | 'flip' | 'trim';
  params: Record<string, any>;
}

export interface VideoAnalyticsProps {
  publicId: string;
  onAnalyticsUpdate: (analytics: VideoAnalytics) => void;
  className?: string;
}

export interface VideoAnalytics {
  views: number;
  plays: number;
  completions: number;
  averageViewDuration: number;
  engagementScore: number;
}

export interface VideoMergeProps {
  files: File[];
  onMergeComplete: (url: string) => void;
  maxFiles?: number;
  className?: string;
}

export interface VideoTrimProps {
  file: File;
  startTime: number;
  endTime: number;
  onTrimComplete: (url: string) => void;
  className?: string;
}

export interface VideoCompressProps {
  file: File;
  quality: 'low' | 'medium' | 'high' | 'auto';
  format: 'mp4' | 'webm';
  onCompressComplete: (url: string) => void;
  className?: string;
}

export interface VideoEffectProps {
  file: File;
  effect: VideoEffect;
  onEffectComplete: (url: string) => void;
  className?: string;
}

export interface VideoEffect {
  type: string;
  params: Record<string, any>;
}

export interface VideoPlayerProps {
  url: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  width?: number;
  height?: number;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: Error) => void;
}

export interface VideoEditorProps {
  file: File;
  tools: VideoTool[];
  onSave: (url: string) => void;
  className?: string;
}

export interface VideoTool {
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
}

export interface VideoStudioProps {
  publicId?: string;
  settings: VideoStudioSettings;
  onSettingsChange: (settings: VideoStudioSettings) => void;
  onPublish?: (url: string) => void;
  className?: string;
}

export interface VideoStudioSettings {
  theme: 'default' | 'minimal' | 'custom';
  primaryColor: string;
  controls: {
    playPause: boolean;
    progress: boolean;
    volume: boolean;
    fullscreen: boolean;
    quality: boolean;
    speed: boolean;
  };
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  analytics: boolean;
  adaptiveStreaming: boolean;
}