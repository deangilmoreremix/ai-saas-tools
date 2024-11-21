import React from 'react';
import { AdvancedImage, lazyload, responsive, placeholder } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale, crop, thumbnail } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { faces, subject } from '@cloudinary/url-gen/qualifiers/focusOn';

interface CloudinaryImageProps {
  publicId: string;
  alt?: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'crop' | 'thumb';
  gravity?: 'faces' | 'subject';
  quality?: 'auto' | number;
  format?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: boolean;
  responsive?: boolean;
  className?: string;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  alt = '',
  width,
  height,
  crop = 'fill',
  gravity,
  quality: imageQuality = 'auto',
  format: imageFormat,
  loading = 'lazy',
  placeholder: showPlaceholder = true,
  responsive: isResponsive = true,
  className
}) => {
  const image = cld.image(publicId);

  // Apply resize transformation
  if (width || height) {
    switch (crop) {
      case 'fill':
        image.resize(fill().width(width).height(height));
        break;
      case 'scale':
        image.resize(scale().width(width).height(height));
        break;
      case 'crop':
        image.resize(crop().width(width).height(height));
        break;
      case 'thumb':
        image.resize(thumbnail().width(width).height(height));
        break;
    }
  }

  // Apply gravity if specified
  if (gravity) {
    switch (gravity) {
      case 'faces':
        image.gravity(focusOn(faces()));
        break;
      case 'subject':
        image.gravity(focusOn(subject()));
        break;
    }
  }

  // Apply quality
  if (imageQuality === 'auto') {
    image.delivery(quality(auto()));
  } else if (typeof imageQuality === 'number') {
    image.delivery(quality(imageQuality));
  }

  // Apply format if specified
  if (imageFormat) {
    image.delivery(format(imageFormat));
  }

  // Collect plugins based on options
  const plugins = [];
  if (loading === 'lazy') plugins.push(lazyload());
  if (isResponsive) plugins.push(responsive());
  if (showPlaceholder) plugins.push(placeholder());

  return (
    <AdvancedImage
      cldImg={image}
      plugins={plugins}
      alt={alt}
      className={className}
    />
  );
};

export default CloudinaryImage;