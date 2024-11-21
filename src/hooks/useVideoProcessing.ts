import { useState, useCallback } from 'react';
import { useToast } from './useToast';

interface ProcessingOptions {
  type: string;
  settings: Record<string, any>;
}

interface ProcessingStatus {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  error?: string;
}

export const useVideoProcessing = () => {
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0
  });
  const { addToast } = useToast();

  const processVideo = useCallback(async (publicId: string, options: ProcessingOptions) => {
    try {
      setStatus({
        status: 'processing',
        progress: 0,
        message: 'Starting video processing...'
      });

      // Build transformation string based on options
      const transformations = [];

      if (options.type === 'gif') {
        transformations.push(
          `f_gif`,
          options.settings.fps && `fps_${options.settings.fps}`,
          options.settings.quality && `q_${options.settings.quality}`,
          options.settings.width && `w_${options.settings.width}`,
          options.settings.height && `h_${options.settings.height}`
        );
      }

      // Add other transformation types here...

      const transformationString = transformations.filter(Boolean).join(',');

      // Process video using Cloudinary
      const processedUrl = `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/${transformationString}/${publicId}`;

      setStatus({
        status: 'completed',
        progress: 100
      });

      addToast({
        title: 'Video processed successfully',
        type: 'success'
      });

      return processedUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setStatus({
        status: 'error',
        progress: 0,
        error: errorMessage
      });

      addToast({
        title: 'Processing failed',
        description: errorMessage,
        type: 'error'
      });

      throw error;
    }
  }, [addToast]);

  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0
    });
  }, []);

  return {
    status: status.status,
    progress: status.progress,
    message: status.message,
    error: status.error,
    processVideo,
    reset
  };
};

export default useVideoProcessing;