import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VideoProcessingStatusProps {
  status: 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  error?: string;
  className?: string;
}

const VideoProcessingStatus: React.FC<VideoProcessingStatusProps> = ({
  status,
  progress,
  message,
  error,
  className
}) => {
  return (
    <div className={cn('bg-gray-800 rounded-lg p-6', className)}>
      <div className="flex flex-col items-center gap-4">
        {status === 'processing' && (
          <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
        )}

        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">
            {status === 'processing' && 'Processing Video...'}
            {status === 'completed' && 'Processing Complete!'}
            {status === 'error' && 'Processing Failed'}
          </h3>
          
          {message && (
            <p className="text-gray-400">{message}</p>
          )}

          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        {status === 'processing' && (
          <div className="w-full max-w-md">
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 text-center">{progress}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoProcessingStatus;