import React from 'react';
import { useCloudinaryUploader } from '../../hooks/useCloudinaryUploader';
import UploadZone from '../upload/UploadZone';
import MediaPreview from '../ui/MediaPreview';

interface FileUploadProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  file?: File | null;
  onRemove?: () => void;
  className?: string;
  showControls?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 100 * 1024 * 1024, // 100MB default
  onUpload,
  isUploading = false,
  file,
  onRemove,
  className,
  showControls = true
}) => {
  const { upload, isUploading: uploading, progress, error } = useCloudinaryUploader({
    maxSize,
    acceptedTypes: accept ? Object.values(accept).flat() : undefined,
    onSuccess: (result) => {
      onUpload(file!);
    }
  });

  const handleUpload = async (uploadedFile: File) => {
    try {
      await upload(uploadedFile);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className={className}>
      {!file && (
        <UploadZone
          onUpload={handleUpload}
          isUploading={isUploading || uploading}
          progress={progress}
          accept={accept}
          maxSize={maxSize}
        />
      )}

      {file && (
        <MediaPreview
          file={file}
          onRemove={onRemove}
          showControls={showControls}
        />
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500 rounded text-sm text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;