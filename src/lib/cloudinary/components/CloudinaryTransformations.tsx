import React from 'react';
import { Cloudinary, Transformation } from '@cloudinary/url-gen';
import { Effect } from '@cloudinary/url-gen/actions/effect';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { Rotate } from '@cloudinary/url-gen/actions/rotate';
import { Adjust } from '@cloudinary/url-gen/actions/adjust';
import { Quality } from '@cloudinary/url-gen/actions/delivery';

interface CloudinaryTransformationsProps {
  publicId: string;
  type?: 'image' | 'video';
  transformations: Transformation[];
  children: (url: string) => React.ReactNode;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const CloudinaryTransformations: React.FC<CloudinaryTransformationsProps> = ({
  publicId,
  type = 'image',
  transformations,
  children
}) => {
  const resource = type === 'image' ? cld.image(publicId) : cld.video(publicId);

  // Apply all transformations
  transformations.forEach(transformation => {
    if (transformation instanceof Effect) {
      resource.effect(transformation);
    } else if (transformation instanceof Resize) {
      resource.resize(transformation);
    } else if (transformation instanceof Rotate) {
      resource.rotate(transformation);
    } else if (transformation instanceof Adjust) {
      resource.adjust(transformation);
    } else if (transformation instanceof Quality) {
      resource.delivery(transformation);
    }
  });

  return <>{children(resource.toURL())}</>;
};

export default CloudinaryTransformations;