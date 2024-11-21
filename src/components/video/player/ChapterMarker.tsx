import React from 'react';
import { cn } from '../../../lib/utils';

interface ChapterMarkerProps {
  time: number;
  title: string;
  duration: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const ChapterMarker: React.FC<ChapterMarkerProps> = ({
  time,
  title,
  duration,
  isActive,
  onClick,
  className
}) => {
  const position = (time / duration) * 100;

  return (
    <div
      className={cn(
        'absolute -top-3 transform -translate-x-1/2 cursor-pointer group',
        className
      )}
      style={{ left: `${position}%` }}
      onClick={onClick}
    >
      <div className={cn(
        'w-2 h-2 rounded-full transition-colors',
        isActive ? 'bg-red-500' : 'bg-gray-400 group-hover:bg-red-400'
      )} />
      
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 rounded px-2 py-1 text-xs whitespace-nowrap">
          {title}
        </div>
      </div>
    </div>
  );
};

export default ChapterMarker;