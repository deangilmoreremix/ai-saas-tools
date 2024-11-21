import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { useCloudinaryUploader } from '../../../hooks/useCloudinaryUploader';
import UploadZone from '../../upload/UploadZone';
import VideoPreview from '../VideoPreview';
import ProcessingStatus from '../../tools/ProcessingStatus';

interface VideoUploaderProps {
  onUploadComplete: (result: any) => void;
  maxSize?: number;
  allowedFormats?: string[];
  showPreview?: boolean;
  className?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  maxSize = 200 * 1024 * 1024, // 200MB default
  allowedFormats = ['.mp4', '.mov', '.avi', '.webm'],
  showPreview = true,
  className
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { upload, isUploading, progress, error } = useCloudinaryUploader({
    resourceType: 'video',
    maxSize,
    acceptedTypes: allowedFormats,
    onSuccess: (result) => {
      onUploadComplete(result);
    }
  });

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    await upload(uploadedFile);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <UploadZone
        onUpload={handleUpload}
        isUploading={isUploading}
        progress={progress}
        accept={{ 'video/*': allowedFormats }}
        maxSize={maxSize}
      />

      {file && showPreview && (
        <VideoPreview
          file={file}
          showControls={true}
        />
      )}

      {isUploading && (
        <ProcessingStatus
          status="processing"
          progress={progress}
          message="Uploading video..."
        />
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;