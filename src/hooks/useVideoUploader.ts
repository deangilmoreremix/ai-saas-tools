import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useToast } from './useToast';

interface UseVideoUploaderOptions {
  maxSize?: number;
  allowedFormats?: string[];
  transformations?: string[];
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export const useVideoUploader = (options: UseVideoUploaderOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { addToast } = useToast();

  const upload = useCallback(async (file: File) => {
    try {
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`File size exceeds ${options.maxSize / (1024 * 1024)}MB limit`);
      }

      if (options.allowedFormats && !options.allowedFormats.some(format => 
        file.name.toLowerCase().endsWith(format.toLowerCase())
      )) {
        throw new Error('File format not supported');
      }

      setIsUploading(true);
      setError(null);
      setProgress(0);

      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
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

export default useVideoUploader;