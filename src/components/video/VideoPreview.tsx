import React from 'react';
import { Play, Pause, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VideoPreviewProps {
  file: File;
  onRemove?: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  showControls?: boolean;
  className?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  file,
  onRemove,
  isPlaying = false,
  onTogglePlay,
  showControls = true,
  className
}) => {
  const videoUrl = URL.createObjectURL(file);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <div className={cn('relative group', className)}>
      <video
        src={videoUrl}
        className="w-full rounded-lg"
        controls={showControls}
        autoPlay={isPlaying}
        loop
        muted
      />
      
      {onTogglePlay && (
        <button
          onClick={onTogglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isPlaying ? (
            <Pause className="w-12 h-12 text-white" />
          ) : (
            <Play className="w-12 h-12 text-white" />
          )}
        </button>
      )}

      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs">
        {file.name} ({Math.round(file.size / 1024 / 1024)}MB)
      </div>
    </div>
  );
};

export default VideoPreview;