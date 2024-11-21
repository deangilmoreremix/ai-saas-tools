import { useState, useCallback } from 'react';
import { cloudinary } from '../lib/cloudinary/config';

interface OptimizationOptions {
  type: 'image' | 'video';
  quality?: 'auto' | number;
  format?: 'auto' | string;
  dpr?: 'auto' | number;
  fetchFormat?: string;
  flags?: string[];
}

export const useCloudinaryOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optimize = useCallback(async (publicId: string, options: OptimizationOptions) => {
    try {
      setIsOptimizing(true);
      setError(null);

      const transformations = [
        options.quality && `q_${options.quality}`,
        options.format && `f_${options.format}`,
        options.dpr && `dpr_${options.dpr}`,
        options.fetchFormat && `fetch_format_${options.fetchFormat}`,
        options.flags && options.flags.map(flag => `fl_${flag}`),
      ].filter(Boolean);

      const transformationString = transformations.join(',');

      return `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/${options.type}/upload/${transformationString}/${publicId}`;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Optimization failed');
      setError(error);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return {
    optimize,
    isOptimizing,
    error
  };
};

export default useCloudinaryOptimization;