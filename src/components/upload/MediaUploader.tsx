import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { useCloudinaryUploader } from '../../hooks/useCloudinaryUploader';
import UploadZone from './UploadZone';
import MediaPreview from '../ui/MediaPreview';
import { Button } from '../ui/Button';

interface MediaUploaderProps {
  onUploadComplete?: (result: any) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  resourceType?: 'image' | 'video' | 'raw';
  transformations?: string[];
  className?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  resourceType = 'auto',
  transformations,
  className
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { upload, isUploading, progress, error, reset } = useCloudinaryUploader({
    maxSize,
    acceptedTypes: accept ? Object.values(accept).flat() : undefined,
    resourceType,
    transformations,
    onSuccess: (result) => {
      onUploadComplete?.(result);
    }
  });

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    await upload(uploadedFile);
  };

  const handleRemove = () => {
    setFile(null);
    reset();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {!file && (
        <UploadZone
          onUpload={handleUpload}
          isUploading={isUploading}
          progress={progress}
          accept={accept}
          maxSize={maxSize}
        />
      )}

      {file && (
        <div className="space-y-4">
          <MediaPreview
            file={file}
            onRemove={handleRemove}
            showControls={true}
          />
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
              {error.message}
            </div>
          )}

          {!isUploading && !error && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleRemove}>
                Remove
              </Button>
              <Button onClick={() => upload(file)}>
                Upload Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;