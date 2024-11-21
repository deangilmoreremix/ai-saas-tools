import { GifSettings, GifResult } from '../types/gif';

export const buildGifTransformations = (settings: GifSettings): string => {
  const transformations: string[] = [];

  // Basic transformations
  if (settings.width) transformations.push(`w_${settings.width}`);
  if (settings.height) transformations.push(`h_${settings.height}`);
  if (settings.fps) transformations.push(`fps_${settings.fps}`);
  if (settings.quality) transformations.push(`q_${settings.quality}`);
  if (settings.startTime) transformations.push(`so_${settings.startTime}`);
  if (settings.duration) transformations.push(`du_${settings.duration}`);

  // Loop settings
  if (settings.loop) {
    transformations.push(settings.loopCount > 0 ? `fl_loop,loop_${settings.loopCount}` : 'fl_loop');
  } else {
    transformations.push('fl_noloop');
  }

  // Optimization settings
  if (settings.optimization?.enabled) {
    if (settings.optimization.colorReduction) {
      transformations.push(`colors_${settings.optimization.colorReduction}`);
    }
    if (settings.optimization.dithering) transformations.push('e_dither');
    if (settings.optimization.lossy) transformations.push(`lossy_${settings.optimization.lossy}`);
  }

  // Effects
  if (settings.effects?.reverse) transformations.push('e_reverse');
  if (settings.effects?.boomerang) transformations.push('e_boomerang');
  if (settings.effects?.speedUp !== 1) {
    transformations.push(`e_acceleration:${settings.effects.speedUp * 100}`);
  }
  if (settings.effects?.fadeIn) transformations.push('e_fade:2000');
  if (settings.effects?.fadeOut) transformations.push('e_fade:-2000');

  // Format specification
  transformations.push('f_gif');

  return transformations.join(',');
};

export const calculateOptimalSettings = (
  width: number,
  height: number,
  duration: number
): GifSettings => {
  // Calculate optimal settings based on input dimensions and duration
  const maxSize = 8 * 1024 * 1024; // 8MB target size
  const bitsPerPixel = 8;
  const targetFps = Math.min(24, Math.ceil(30 * (maxSize / (width * height * duration * bitsPerPixel))));

  return {
    width: width > 800 ? 800 : width,
    height: Math.round((width > 800 ? 800 : width) * (height / width)),
    fps: targetFps,
    quality: 85,
    startTime: 0,
    duration: Math.min(duration, 10),
    loop: true,
    loopCount: 0,
    optimization: {
      enabled: true,
      colorReduction: 256,
      dithering: true,
      lossy: 20
    },
    effects: {
      reverse: false,
      boomerang: false,
      speedUp: 1,
      fadeIn: false,
      fadeOut: false
    }
  };
};

export const validateGifSettings = (settings: GifSettings): string[] => {
  const errors: string[] = [];

  if (settings.width && (settings.width < 1 || settings.width > 4096)) {
    errors.push('Width must be between 1 and 4096 pixels');
  }
  if (settings.height && (settings.height < 1 || settings.height > 4096)) {
    errors.push('Height must be between 1 and 4096 pixels');
  }
  if (settings.fps && (settings.fps < 1 || settings.fps > 60)) {
    errors.push('FPS must be between 1 and 60');
  }
  if (settings.quality && (settings.quality < 1 || settings.quality > 100)) {
    errors.push('Quality must be between 1 and 100');
  }
  if (settings.optimization?.colorReduction && 
      (settings.optimization.colorReduction < 2 || settings.optimization.colorReduction > 256)) {
    errors.push('Color reduction must be between 2 and 256 colors');
  }

  return errors;
};