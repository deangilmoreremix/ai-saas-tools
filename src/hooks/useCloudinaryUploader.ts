import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useToast } from './useToast';

interface UseCloudinaryUploaderOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  maxSize?: number;
  acceptedTypes?: string[];
  resourceType?: 'image' | 'video' | 'raw';
  transformations?: string[];
}

export const useCloudinaryUploader = (options: UseCloudinaryUploaderOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { addToast } = useToast();

  const upload = useCallback(async (file: File) => {
    try {
      // Validate file size
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`File size exceeds ${options.maxSize / (1024 * 1024)}MB limit`);
      }

      // Validate file type
      if (options.acceptedTypes && !options.acceptedTypes.includes(file.type)) {
        throw new Error('File type not supported');
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      const result = await uploadToCloudinary(file, {
        resourceType: options.resourceType || 'auto',
        transformation: options.transformations?.join(','),
        onProgress: (progress) => {
          setProgress(progress);
        }
      });

      addToast({
        title: 'Upload successful',
        type: 'success'
      });

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      
      addToast({
        title: 'Upload failed',
        description: error.message,
        type: 'error'
      });

      options.onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [options, addToast]);

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

export default useCloudinaryUploader;