import { Cloudinary } from '@cloudinary/url-gen';

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Missing Cloudinary configuration');
}

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName,
  },
});

interface UploadOptions {
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  folder?: string;
  publicId?: string;
  tags?: string[];
  onProgress?: (progress: number) => void;
}

export const uploadToCloudinary = async (file: File, options: UploadOptions = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('cloud_name', cloudName);
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }
  
  if (options.tags) {
    formData.append('tags', options.tags.join(','));
  }

  const xhr = new XMLHttpRequest();
  
  const uploadPromise = new Promise<any>((resolve, reject) => {
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${options.resourceType || 'auto'}/upload`);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && options.onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        options.onProgress(progress);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error('Upload failed'));
      }
    };
    
    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });

  return uploadPromise;
};