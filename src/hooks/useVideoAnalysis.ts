import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useToast } from './useToast';
import type {
  SceneDetectionSettings,
  SmartCropSettings,
  VideoOverlaySettings,
  ThumbnailSettings,
  VideoTransformSettings,
  BackgroundRemovalSettings
} from '../types/video/analysis';

interface UseVideoAnalysisOptions {
  onProgress?: (progress: number) => void;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

export const useVideoAnalysis = (options: UseVideoAnalysisOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { addToast } = useToast();

  const updateProgress = (value: number) => {
    setProgress(value);
    options.onProgress?.(value);
  };

  const detectScenes = useCallback(async (
    file: File,
    settings: SceneDetectionSettings
  ) => {
    try {
      setIsProcessing(true);
      updateProgress(10);

      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
        eager: [{
          raw_transformation: `e_scene_detect:${settings.detectionMode}:${settings.minDuration}:${settings.sensitivity}`
        }],
        eager_async: true
      });

      updateProgress(100);
      options.onComplete?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Scene detection failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const smartCrop = useCallback(async (
    file: File,
    settings: SmartCropSettings
  ) => {
    try {
      setIsProcessing(true);
      updateProgress(10);

      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
        eager: [{
          raw_transformation: `c_${settings.mode},ar_${settings.aspectRatio}${settings.customFocus ? `,g_${settings.customFocus}` : ''}`
        }],
        eager_async: true
      });

      updateProgress(100);
      options.onComplete?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Smart crop failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const applyOverlay = useCallback(async (
    file: File,
    overlay: File,
    settings: VideoOverlaySettings
  ) => {
    try {
      setIsProcessing(true);
      updateProgress(10);

      // Upload main video
      const mainResult = await uploadToCloudinary(file, {
        resourceType: 'video'
      });
      updateProgress(40);

      // Upload overlay
      const overlayResult = await uploadToCloudinary(overlay);
      updateProgress(70);

      // Apply overlay transformation
      const transformation = `l_${overlayResult.public_id},w_${settings.size},o_${settings.opacity},g_${settings.position}`;
      
      const finalResult = await uploadToCloudinary(file, {
        resourceType: 'video',
        eager: [{ raw_transformation: transformation }],
        eager_async: true
      });

      updateProgress(100);
      options.onComplete?.(finalResult);
      return finalResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Overlay application failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const generateThumbnails = useCallback(async (
    file: File,
    settings: ThumbnailSettings
  ) => {
    try {
      setIsProcessing(true);
      updateProgress(10);

      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
        eager: Array.from({ length: settings.count }).map((_, i) => ({
          transformation: [
            { width: settings.size.width, height: settings.size.height, crop: 'fill' },
            { start_offset: `${i * (100 / settings.count)}p` }
          ],
          format: settings.format,
          quality: settings.quality
        })),
        eager_async: true
      });

      updateProgress(100);
      options.onComplete?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Thumbnail generation failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const transformVideo = useCallback(async (
    file: File,
    settings: VideoTransformSettings
  ) => {
    try {
      setIsProcessing(true);
      updateProgress(10);

      const transformations = [];

      if (settings.resize) {
        transformations.push(`w_${settings.resize.width},h_${settings.resize.height},c_${settings.resize.mode}`);
      }
      if (settings.rotate) {
        transformations.push(`a_${settings.rotate}`);
      }
      if (settings.flip) {
        transformations.push(`e_flip:${settings.flip}`);
      }
      if (settings.quality) {
        transformations.push(`q_${settings.quality}`);
      }
      if (settings.format) {
        transformations.push(`f_${settings.format}`);
      }
      if (settings.fps) {
        transformations.push(`fps_${settings.fps}`);
      }
      if (settings.audio) {
        if (settings.audio.codec) transformations.push(`ac_${settings.audio.codec}`);
        if (settings.audio.bitrate) transformations.push(`ab_${settings.audio.bitrate}`);
        if (settings.audio.volume) transformations.push(`e_volume:${settings.audio.volume}`);
      }

      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
        eager: [{ raw_transformation: transformations.join(',') }],
        eager_async: true
      });

      updateProgress(100);
      options.onComplete?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Video transformation failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const removeBackground = useCallback(async (
    file: File,
    settings: BackgroundRemovalSettings
  ) => {
    try {
      setIsProcessing(true);
      updateProgress(10);

      const transformation = settings.mode === 'ai'
        ? 'e_background_removal'
        : `e_chroma:${settings.chromaColor}:${settings.tolerance}:${settings.feather}`;

      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
        eager: [{ raw_transformation: transformation }],
        eager_async: true
      });

      updateProgress(100);
      options.onComplete?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Background removal failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  return {
    detectScenes,
    smartCrop,
    applyOverlay,
    generateThumbnails,
    transformVideo,
    removeBackground,
    isProcessing,
    progress,
    error
  };
};

export default useVideoAnalysis;