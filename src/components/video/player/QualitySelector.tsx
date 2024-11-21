import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/Button';

interface QualitySelectorProps {
  currentQuality: string;
  qualities: string[];
  onChange: (quality: string) => void;
  className?: string;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({
  currentQuality,
  qualities,
  onChange,
  className
}) => {
  return (
    <div className={cn('relative group', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="text-sm"
      >
        {currentQuality.toUpperCase()}
      </Button>

      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 rounded-lg shadow-lg p-2 space-y-1">
          {qualities.map((quality) => (
            <button
              key={quality}
              onClick={() => onChange(quality)}
              className={cn(
                'block w-full px-4 py-1 text-sm text-left rounded hover:bg-gray-800',
                quality === currentQuality && 'text-red-500'
              )}
            >
              {quality.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QualitySelector;