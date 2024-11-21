import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/Button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  skipEnabled?: boolean;
  className?: string;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  skipEnabled = false,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {skipEnabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipBack}
        >
          <SkipBack className="w-5 h-5" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </Button>

      {skipEnabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipForward}
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default PlaybackControls;