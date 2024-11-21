import { useState, useCallback, useEffect } from 'react';
import { buildVideoUrl } from '../lib/cloudinary';

interface VideoTransformation {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  format?: string;
  effect?: string;
}

interface UseCloudinaryVideoOptions {
  publicId: string;
  transformations?: VideoTransformation;
  autoload?: boolean;
}

export const useCloudinaryVideo = ({ publicId, transformations, autoload = true }: UseCloudinaryVideoOptions) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateUrl = useCallback(() => {
    try {
      const url = buildVideoUrl(publicId, {
        transformation: transformations ? [
          transformations.width && `w_${transformations.width}`,
          transformations.height && `h_${transformations.height}`,
          transformations.crop && `c_${transformations.crop}`,
          transformations.quality && `q_${transformations.quality}`,
          transformations.format && `f_${transformations.format}`,
          transformations.effect && `e_${transformations.effect}`
        ].filter(Boolean) as string[] : undefined
      });
      setVideoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate video URL'));
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
    videoUrl,
    isLoading,
    error,
    refresh
  };
};

export default useCloudinaryVideo;