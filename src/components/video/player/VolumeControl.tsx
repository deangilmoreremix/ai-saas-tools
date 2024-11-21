import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/Button';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '../../ui/Slider';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        size="sm"
        variant="ghost"
        onClick={onMuteToggle}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </Button>
      
      <div className="relative group">
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={isMuted ? 0 : volume}
          onChange={onVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default VolumeControl;