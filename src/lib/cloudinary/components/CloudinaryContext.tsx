import React, { createContext, useContext, useCallback } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';

interface CloudinaryContextValue {
  cloudinary: Cloudinary;
  uploadImage: (file: File) => Promise<any>;
  uploadVideo: (file: File) => Promise<any>;
  generateUrl: (publicId: string, transformations?: string) => string;
}

const CloudinaryContext = createContext<CloudinaryContextValue | undefined>(undefined);

export const CloudinaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME
    }
  });

  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }, []);

  const uploadVideo = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }, []);

  const generateUrl = useCallback((publicId: string, transformations?: string) => {
    const baseUrl = `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
    return transformations ? `${baseUrl}/${transformations}/${publicId}` : `${baseUrl}/${publicId}`;
  }, []);

  return (
    <CloudinaryContext.Provider value={{ cloudinary, uploadImage, uploadVideo, generateUrl }}>
      {children}
    </CloudinaryContext.Provider>
  );
};

export const useCloudinary = () => {
  const context = useContext(CloudinaryContext);
  if (!context) {
    throw new Error('useCloudinary must be used within a CloudinaryProvider');
  }
  return context;
};

export default CloudinaryContext;