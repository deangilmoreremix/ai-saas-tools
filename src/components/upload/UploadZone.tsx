import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import UploadProgress from './UploadProgress';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  progress?: number;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  isUploading = false,
  progress = 0,
  accept,
  maxSize,
  className,
  children
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
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
        {children || (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
              </p>
              <p className="text-gray-400 mt-2">or click to select a file</p>
              {maxSize && (
                <p className="text-sm text-gray-500 mt-2">
                  Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {isUploading && <UploadProgress progress={progress} />}
    </div>
  );
};

export default UploadZone;