import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';

interface UseCloudinaryUploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw';
  transformation?: string;
  eager?: any[];
  maxSize?: number;
  acceptedTypes?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const useCloudinaryUpload = (options: UseCloudinaryUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(async (file: File) => {
    try {
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`File size exceeds ${options.maxSize / (1024 * 1024)}MB limit`);
      }

      if (options.acceptedTypes && !options.acceptedTypes.includes(file.type)) {
        throw new Error('File type not supported');
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      const result = await uploadToCloudinary(file, {
        ...options,
        onProgress: (p) => {
          setProgress(p);
          options.onProgress?.(p);
        }
      });

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    reset
  };
};

export default useCloudinaryUpload;