import { useState, useCallback } from 'react';
import { cloudinary } from '../lib/cloudinary/config';

interface AnalyticsOptions {
  type: 'image' | 'video';
  features?: ('faces' | 'colors' | 'tags' | 'ocr' | 'moderation')[];
}

export const useCloudinaryAnalytics = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(async (publicId: string, options: AnalyticsOptions) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        { public_id: publicId, timestamp },
        process.env.VITE_CLOUDINARY_API_SECRET!
      );

      const params = new URLSearchParams({
        public_id: publicId,
        timestamp: timestamp.toString(),
        signature,
        api_key: process.env.VITE_CLOUDINARY_API_KEY!
      });

      if (options.features) {
        params.append('features', options.features.join(','));
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/${options.type}/analyze?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      return response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Analysis failed');
      setError(error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyze,
    isAnalyzing,
    error
  };
};

export default useCloudinaryAnalytics;