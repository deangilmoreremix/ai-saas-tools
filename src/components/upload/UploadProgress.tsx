import React from 'react';
import { cn } from '../../lib/utils';

interface UploadProgressProps {
  progress: number;
  className?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Uploading...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-red-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default UploadProgress;