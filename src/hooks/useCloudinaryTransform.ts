import { useState, useCallback } from 'react';
import { cloudinary } from '../lib/cloudinary/config';

interface TransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
  effect?: string | string[];
  overlay?: string;
  underlay?: string;
  radius?: number | string;
  angle?: number;
  opacity?: number;
  border?: string;
  background?: string;
  gravity?: string;
  color?: string;
  dpr?: string | number;
}

export const useCloudinaryTransform = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const transform = useCallback(async (
    publicId: string,
    options: TransformOptions,
    resourceType: 'image' | 'video' = 'image'
  ) => {
    try {
      setIsProcessing(true);
      setError(null);

      const transformations = [];

      if (options.width) transformations.push(`w_${options.width}`);
      if (options.height) transformations.push(`h_${options.height}`);
      if (options.crop) transformations.push(`c_${options.crop}`);
      if (options.quality) transformations.push(`q_${options.quality}`);
      if (options.format) transformations.push(`f_${options.format}`);
      if (options.effect) {
        if (Array.isArray(options.effect)) {
          transformations.push(...options.effect.map(e => `e_${e}`));
        } else {
          transformations.push(`e_${options.effect}`);
        }
      }
      if (options.overlay) transformations.push(`l_${options.overlay}`);
      if (options.underlay) transformations.push(`u_${options.underlay}`);
      if (options.radius) transformations.push(`r_${options.radius}`);
      if (options.angle) transformations.push(`a_${options.angle}`);
      if (options.opacity) transformations.push(`o_${options.opacity}`);
      if (options.border) transformations.push(`bo_${options.border}`);
      if (options.background) transformations.push(`b_${options.background}`);
      if (options.gravity) transformations.push(`g_${options.gravity}`);
      if (options.color) transformations.push(`co_${options.color}`);
      if (options.dpr) transformations.push(`dpr_${options.dpr}`);

      const transformationString = transformations.join(',');

      const url = `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transformationString}/${publicId}`;

      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transformation failed');
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    transform,
    isProcessing,
    error
  };
};

export default useCloudinaryTransform;