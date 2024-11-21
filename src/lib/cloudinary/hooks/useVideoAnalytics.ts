import { useState, useCallback } from 'react';
import { cloudinary } from '../config';

interface VideoAnalytics {
  views: number;
  plays: number;
  completions: number;
  averageViewDuration: number;
  engagementScore: number;
}

export const useVideoAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAnalytics = useCallback(async (publicId: string): Promise<VideoAnalytics> => {
    try {
      setIsLoading(true);
      setError(null);

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        { public_id: publicId, timestamp },
        process.env.VITE_CLOUDINARY_API_SECRET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/video/analytics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            timestamp,
            signature,
            api_key: process.env.VITE_CLOUDINARY_API_KEY
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();

      return {
        views: data.views,
        plays: data.plays,
        completions: data.completions,
        averageViewDuration: data.average_view_duration,
        engagementScore: data.engagement_score
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch analytics');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getAnalytics,
    isLoading,
    error
  };
};

export default useVideoAnalytics;