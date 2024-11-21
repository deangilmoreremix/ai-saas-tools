import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/Button';
import { Slider } from '../../ui/Slider';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCw
} from 'lucide-react';
import QualitySelector from './QualitySelector';
import PlaybackRateSelector from './PlaybackRateSelector';
import VolumeControl from './VolumeControl';

interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  quality: string;
  playbackRate: number;
  buffered: TimeRanges | null;
  onPlayPause: () => void;
  onTimeUpdate: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onQualityChange: (quality: string) => void;
  onPlaybackRateChange: (rate: number) => void;
  settings: any;
  className?: string;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  quality,
  playbackRate,
  buffered,
  onPlayPause,
  onTimeUpdate,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onQualityChange,
  onPlaybackRateChange,
  settings,
  className
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div 
      className={cn(
        'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        {settings.controls.playPause && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
        )}

        {/* Volume */}
        {settings.controls.volume && (
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
          />
        )}

        {/* Time display */}
        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex-1" />

        {/* Quality selector */}
        {settings.controls.quality && (
          <QualitySelector
            currentQuality={quality}
            qualities={settings.qualityLevels}
            onChange={onQualityChange}
          />
        )}

        {/* Playback rate */}
        {settings.controls.speed && (
          <PlaybackRateSelector
            currentRate={playbackRate}
            rates={settings.playbackRates}
            onChange={onPlaybackRateChange}
          />
        )}

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* Fullscreen */}
        {settings.controls.fullscreen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullscreenToggle}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg p-4">
          {/* Settings content */}
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default Controls;