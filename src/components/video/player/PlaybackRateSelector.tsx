import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/Button';

interface PlaybackRateSelectorProps {
  currentRate: number;
  rates: number[];
  onChange: (rate: number) => void;
  className?: string;
}

const PlaybackRateSelector: React.FC<PlaybackRateSelectorProps> = ({
  currentRate,
  rates,
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
        {currentRate}x
      </Button>

      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 rounded-lg shadow-lg p-2 space-y-1">
          {rates.map((rate) => (
            <button
              key={rate}
              onClick={() => onChange(rate)}
              className={cn(
                'block w-full px-4 py-1 text-sm text-left rounded hover:bg-gray-800',
                rate === currentRate && 'text-red-500'
              )}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaybackRateSelector;