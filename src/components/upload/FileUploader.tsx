import React from 'react';
import { cn } from '../../lib/utils';
import { useCloudinaryUploader } from '../../hooks/useCloudinaryUploader';
import UploadButton from './UploadButton';
import UploadProgress from './UploadProgress';

interface FileUploaderProps {
  onUploadComplete?: (result: any) => void;
  accept?: string;
  maxSize?: number;
  buttonText?: string;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  buttonText,
  className
}) => {
  const { upload, isUploading, progress, error } = useCloudinaryUploader({
    maxSize,
    acceptedTypes: accept ? [accept] : undefined,
    onSuccess: (result) => {
      onUploadComplete?.(result);
    }
  });

  return (
    <div className={cn('space-y-4', className)}>
      <UploadButton
        onUpload={upload}
        isUploading={isUploading}
        accept={accept}
        maxSize={maxSize}
        buttonText={buttonText}
      />

      {isUploading && <UploadProgress progress={progress} />}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default FileUploader;