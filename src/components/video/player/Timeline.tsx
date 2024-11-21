import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface TimelineProps {
  currentTime: number;
  duration: number;
  buffered: TimeRanges | null;
  onSeek: (time: number) => void;
  thumbnails?: string[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  currentTime,
  duration,
  buffered,
  onSeek,
  thumbnails,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const time = position * duration;
      setPreviewTime(time);
      setPreviewPosition(position * 100);
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setPreviewTime(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      onSeek(position * duration);
    }
  };

  return (
    <div 
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      ref={timelineRef}
    >
      {/* Timeline bar */}
      <div className="relative h-1 bg-gray-600 rounded-full">
        {/* Buffered regions */}
        {buffered && Array.from({ length: buffered.length }).map((_, i) => (
          <div
            key={i}
            className="absolute h-full bg-gray-500 rounded-full"
            style={{
              left: `${(buffered.start(i) / duration) * 100}%`,
              width: `${((buffered.end(i) - buffered.start(i)) / duration) * 100}%`
            }}
          />
        ))}

        {/* Progress bar */}
        <div
          className="absolute h-full bg-red-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        {/* Preview position */}
        {previewTime !== null && (
          <div
            className="absolute w-0.5 h-3 bg-white -top-1"
            style={{ left: `${previewPosition}%` }}
          />
        )}
      </div>

      {/* Time indicators */}
      <div className="flex justify-between text-xs mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Thumbnail preview */}
      {previewTime !== null && thumbnails && thumbnails.length > 0 && (
        <div
          className="absolute bottom-full mb-2 transform -translate-x-1/2"
          style={{ left: `${previewPosition}%` }}
        >
          <div className="bg-black rounded-lg overflow-hidden shadow-lg">
            <img
              src={thumbnails[Math.floor((previewTime / duration) * thumbnails.length)]}
              alt="Preview"
              className="w-32 h-18 object-cover"
            />
            <div className="px-2 py-1 text-xs text-center">
              {formatTime(previewTime)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;