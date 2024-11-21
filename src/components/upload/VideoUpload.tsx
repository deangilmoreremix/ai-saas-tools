import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Video, Upload, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface VideoUploadProps {
  onUpload: (file: File) => void;
  maxSize?: number;
  accept?: string[];
  isUploading?: boolean;
  progress?: number;
  error?: string;
  className?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onUpload,
  maxSize = 100 * 1024 * 1024, // 100MB default
  accept = ['.mp4', '.mov', '.avi', '.webm'],
  isUploading = false,
  progress = 0,
  error,
  className
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': accept
    },
    maxSize,
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragActive ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-red-500',
          isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <div className="relative">
                <Video className="w-12 h-12 text-gray-400 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <p className="text-lg font-medium">Uploading video...</p>
              <p className="text-sm text-gray-400">{progress}% complete</p>
            </>
          ) : (
            <>
              <Video className="w-12 h-12 text-gray-400" />
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
              </p>
              <p className="text-gray-400">or click to select a file</p>
              <p className="text-sm text-gray-500">
                Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: {accept.join(', ')}
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500 rounded-lg p-4">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isUploading && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            Uploading and processing your video...
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;