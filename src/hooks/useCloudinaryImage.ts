import { useState, useCallback, useEffect } from 'react';
import { buildUrl } from '../lib/cloudinary';

interface ImageTransformation {
  width?: number;
  height?: number;
  crop?: string;
  quality?: 'auto' | number;
  format?: 'auto' | string;
  effect?: string;
}

interface UseCloudinaryImageOptions {
  publicId: string;
  transformations?: ImageTransformation;
  autoload?: boolean;
}

export const useCloudinaryImage = ({ publicId, transformations, autoload = true }: UseCloudinaryImageOptions) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateUrl = useCallback(() => {
    try {
      const url = buildUrl(publicId, transformations);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate image URL'));
    }
  }, [publicId, transformations]);

  useEffect(() => {
    if (autoload) {
      generateUrl();
    }
  }, [autoload, generateUrl]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    generateUrl();
    setIsLoading(false);
  }, [generateUrl]);

  return {
    imageUrl,
    isLoading,
    error,
    refresh
  };
};

export default useCloudinaryImage;