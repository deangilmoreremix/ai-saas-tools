import React from 'react';
import { cn } from '../../../lib/utils';

interface ThumbnailPreviewProps {
  src: string;
  time: number;
  position: number;
  className?: string;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  src,
  time,
  position,
  className
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'absolute bottom-full transform -translate-x-1/2 mb-2',
        className
      )}
      style={{ left: `${position * 100}%` }}
    >
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <img
          src={src}
          alt={`Preview at ${formatTime(time)}`}
          className="w-32 h-18 object-cover"
        />
        <div className="px-2 py-1 text-xs text-center">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailPreview;