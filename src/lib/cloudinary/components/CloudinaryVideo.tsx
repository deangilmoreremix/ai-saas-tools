import React from 'react';
import { AdvancedVideo } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale, crop, thumbnail } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/quality';
import { videoCodec } from '@cloudinary/url-gen/actions/transcode';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';

interface CloudinaryVideoProps {
  publicId: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'crop' | 'thumb';
  quality?: 'auto' | number;
  format?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: boolean;
  className?: string;
}

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

export const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  publicId,
  width,
  height,
  crop = 'fill',
  quality: videoQuality = 'auto',
  format: videoFormat,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  poster = true,
  className
}) => {
  const video = cld.video(publicId);

  // Apply resize transformation
  if (width || height) {
    switch (crop) {
      case 'fill':
        video.resize(fill().width(width).height(height));
        break;
      case 'scale':
        video.resize(scale().width(width).height(height));
        break;
      case 'crop':
        video.resize(crop().width(width).height(height));
        break;
      case 'thumb':
        video.resize(thumbnail().width(width).height(height));
        break;
    }
  }

  // Apply quality
  if (videoQuality === 'auto') {
    video.delivery(quality(auto()));
  } else if (typeof videoQuality === 'number') {
    video.delivery(quality(videoQuality));
  }

  // Apply format if specified
  if (videoFormat) {
    video.delivery(format(videoFormat));
  } else {
    // Auto format for better browser compatibility
    video.delivery(format(autoFormat()));
  }

  // Apply video codec optimization
  video.transcode(videoCodec(auto()));

  return (
    <AdvancedVideo
      cldVid={video}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      poster={poster}
      className={className}
    />
  );
};

export default CloudinaryVideo;