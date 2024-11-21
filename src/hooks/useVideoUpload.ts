import { useState, useCallback } from 'react';
import { useCloudinaryUpload } from './useCloudinaryUpload';
import { useToast } from './useToast';

interface UseVideoUploadOptions {
  maxSize?: number;
  acceptedFormats?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export const useVideoUpload = (options: UseVideoUploadOptions = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const {
    upload,
    isUploading,
    progress,
    error,
    reset
  } = useCloudinaryUpload({
    resourceType: 'video',
    maxSize: options.maxSize || 100 * 1024 * 1024, // 100MB default
    acceptedTypes: options.acceptedFormats || [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm'
    ],
    onSuccess: (result) => {
      addToast({
        title: 'Upload successful',
        type: 'success'
      });
      options.onSuccess?.(result);
    },
    onError: (error) => {
      addToast({
        title: 'Upload failed',
        description: error.message,
        type: 'error'
      });
      options.onError?.(error);
    }
  });

  const handleUpload = useCallback(async (uploadedFile: File) => {
    try {
      setFile(uploadedFile);
      await upload(uploadedFile);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [upload]);

  const clearUpload = useCallback(() => {
    setFile(null);
    reset();
  }, [reset]);

  return {
    file,
    isUploading,
    progress,
    error,
    upload: handleUpload,
    clear: clearUpload
  };
};

export default useVideoUpload;