import { useState, useCallback } from 'react';
import { cloudinary } from '../config';

interface VideoTransformOptions {
  resize?: {
    width?: number;
    height?: number;
    crop?: string;
  };
  quality?: string | number;
  format?: string;
  effects?: string[];
  fps?: number;
  keyframeInterval?: number;
  bitRate?: string | number;
  audioCodec?: string;
  videoCodec?: string;
}

export const useVideoTransformations = () => {
  const [isTransforming, setIsTransforming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const transform = useCallback(async (publicId: string, options: VideoTransformOptions) => {
    try {
      setIsTransforming(true);
      setError(null);

      const transformations = [];

      // Resize transformations
      if (options.resize) {
        if (options.resize.width) transformations.push(`w_${options.resize.width}`);
        if (options.resize.height) transformations.push(`h_${options.resize.height}`);
        if (options.resize.crop) transformations.push(`c_${options.resize.crop}`);
      }

      // Quality and format
      if (options.quality) transformations.push(`q_${options.quality}`);
      if (options.format) transformations.push(`f_${options.format}`);

      // Video-specific settings
      if (options.fps) transformations.push(`fps_${options.fps}`);
      if (options.keyframeInterval) transformations.push(`ki_${options.keyframeInterval}`);
      if (options.bitRate) transformations.push(`br_${options.bitRate}`);
      if (options.audioCodec) transformations.push(`ac_${options.audioCodec}`);
      if (options.videoCodec) transformations.push(`vc_${options.videoCodec}`);

      // Effects
      if (options.effects) {
        options.effects.forEach(effect => transformations.push(`e_${effect}`));
      }

      const transformationString = transformations.join(',');

      return `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/${transformationString}/${publicId}`;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transformation failed');
      setError(error);
      throw error;
    } finally {
      setIsTransforming(false);
    }
  }, []);

  return {
    transform,
    isTransforming,
    error
  };
};

export default useVideoTransformations;