import React from 'react';
import { Button } from '../ui/Button';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UploadButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
  buttonText?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUpload,
  isUploading = false,
  accept,
  maxSize,
  className,
  buttonText = 'Upload File',
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (maxSize && file.size > maxSize) {
        alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      onUpload(file);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleChange}
        accept={accept}
        disabled={isUploading}
        {...props}
      />
      <Button
        type="button"
        disabled={isUploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Uploading...' : buttonText}
      </Button>
    </div>
  );
};

export default UploadButton;