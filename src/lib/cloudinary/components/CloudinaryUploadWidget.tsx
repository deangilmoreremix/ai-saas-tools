import React, { useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { Upload } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  options?: {
    cloudName?: string;
    uploadPreset?: string;
    folder?: string;
    tags?: string[];
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    sources?: string[];
    styles?: Record<string, any>;
  };
  className?: string;
  children?: React.ReactNode;
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onSuccess,
  onError,
  options = {},
  className,
  children
}) => {
  const cloudName = options.cloudName || process.env.VITE_CLOUDINARY_CLOUD_NAME;

  const initializeWidget = useCallback(() => {
    if (!cloudName) {
      console.error('Cloud name is required');
      return;
    }

    const widget = (window as any).cloudinary?.createUploadWidget(
      {
        cloudName,
        uploadPreset: options.uploadPreset || 'ml_default',
        folder: options.folder,
        tags: options.tags,
        resourceType: options.resourceType || 'auto',
        multiple: options.multiple ?? true,
        maxFiles: options.maxFiles || 10,
        maxFileSize: options.maxFileSize || 10485760, // 10MB
        sources: options.sources || ['local', 'url', 'camera'],
        styles: {
          palette: {
            window: '#111827',
            windowBorder: '#374151',
            tabIcon: '#F87171',
            menuIcons: '#9CA3AF',
            textDark: '#1F2937',
            textLight: '#F3F4F6',
            link: '#F87171',
            action: '#F87171',
            inactiveTabIcon: '#6B7280',
            error: '#EF4444',
            inProgress: '#F87171',
            complete: '#10B981',
            sourceBg: '#1F2937'
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
              active: true
            }
          },
          ...options.styles
        }
      },
      (error: Error, result: any) => {
        if (error) {
          onError?.(error);
          return;
        }

        if (result.event === 'success') {
          onSuccess?.(result.info);
        }
      }
    );

    return widget;
  }, [cloudName, options, onSuccess, onError]);

  useEffect(() => {
    // Load Cloudinary Upload Widget script
    if (!(window as any).cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleClick = useCallback(() => {
    const widget = initializeWidget();
    widget?.open();
  }, [initializeWidget]);

  return (
    <Button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {children || (
        <>
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </>
      )}
    </Button>
  );
};

export default CloudinaryUploadWidget;