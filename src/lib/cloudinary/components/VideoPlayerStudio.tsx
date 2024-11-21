import React, { useState, useEffect, useCallback } from 'react';
import { CloudinaryVideo } from './CloudinaryVideo';
import { CloudinaryUploadWidget } from './CloudinaryUploadWidget';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { Button } from '../../../components/ui/Button';
import { Settings, Layout, Palette } from 'lucide-react';

interface VideoPlayerStudioProps {
  onUploadComplete?: (publicId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const VideoPlayerStudio: React.FC<VideoPlayerStudioProps> = ({
  onUploadComplete,
  onError,
  className
}) => {
  const { upload, isUploading, progress, error } = useCloudinaryUpload({
    resourceType: 'video',
    onSuccess: (result) => {
      onUploadComplete?.(result.public_id);
    },
    onError: (err) => {
      onError?.(err);
    }
  });

  const handleUpload = useCallback(async (file: File) => {
    try {
      await upload(file);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, [upload]);

  return (
    <div className={className}>
      <CloudinaryUploadWidget
        options={{
          resourceType: 'video',
          maxFiles: 1,
          maxFileSize: 100 * 1024 * 1024, // 100MB
          sources: ['local', 'url', 'camera'],
          styles: {
            palette: {
              window: '#111827',
              windowBorder: '#374151',
              tabIcon: '#F87171',
              menuIcons: '#9CA3AF',
              textDark: '#1F2937',
              textLight: '#F3F4F6',
              link: '#F87171',
              action: '#F87171',
              inactiveTabIcon: '#6B7280',
              error: '#EF4444',
              inProgress: '#F87171',
              complete: '#10B981',
              sourceBg: '#1F2937'
            }
          }
        }}
        onSuccess={(result) => {
          onUploadComplete?.(result.public_id);
        }}
        onError={onError}
      >
        <Button className="w-full">
          Upload Video
        </Button>
      </CloudinaryUploadWidget>

      {isUploading && (
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-2">Uploading... {progress}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default VideoPlayerStudio;