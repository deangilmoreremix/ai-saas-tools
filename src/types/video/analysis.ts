interface SceneDetectionSettings {
  minDuration: number;
  detectionMode: 'scene' | 'content' | 'hybrid';
  sensitivity: number;
  thumbnailSize: {
    width: number;
    height: number;
  };
}

interface SmartCropSettings {
  aspectRatio: string;
  mode: 'content' | 'faces' | 'custom';
  customFocus?: string;
  preserveQuality: boolean;
}

interface VideoOverlaySettings {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size: number;
  opacity: number;
  timing: {
    start: number;
    duration: number;
  };
  transition: {
    type: 'fade' | 'slide' | 'zoom';
    duration: number;
  };
}

interface ThumbnailSettings {
  count: number;
  interval: 'uniform' | 'smart';
  format: 'jpg' | 'png' | 'webp';
  quality: number;
  size: {
    width: number;
    height: number;
  };
}

interface VideoTransformSettings {
  resize?: {
    width?: number;
    height?: number;
    mode: 'scale' | 'pad' | 'crop' | 'fill';
  };
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  quality?: number;
  format?: 'mp4' | 'webm';
  fps?: number;
  audio?: {
    codec?: string;
    bitrate?: number;
    volume?: number;
  };
}

interface BackgroundRemovalSettings {
  mode: 'ai' | 'chroma';
  chromaColor?: string;
  tolerance?: number;
  feather?: number;
  preserveShadows?: boolean;
}

export type {
  SceneDetectionSettings,
  SmartCropSettings,
  VideoOverlaySettings,
  ThumbnailSettings,
  VideoTransformSettings,
  BackgroundRemovalSettings
};