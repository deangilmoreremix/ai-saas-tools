import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import { VideoUploader } from '../../components/video/upload/VideoUploader';
import { VideoPlayerStudio } from '../../lib/cloudinary/components/VideoPlayerStudio';
import { useToast } from '../../hooks/useToast';
import { VideoPlayerSettings } from '../../types/videoPlayer';

const VideoPlayer = () => {
  const [publicId, setPublicId] = useState<string>('');
  const [settings, setSettings] = useState<VideoPlayerSettings>({
    theme: 'default',
    primaryColor: '#FF0000',
    controls: {
      playPause: true,
      progress: true,
      volume: true,
      fullscreen: true,
      quality: true,
      speed: true,
      chapters: true,
      thumbnails: true
    },
    autoplay: false,
    loop: false,
    muted: false,
    preload: 'metadata',
    analytics: true,
    adaptiveStreaming: true,
    hotkeys: true,
    thumbnailSeeking: true,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    qualityLevels: ['auto', '2160p', '1440p', '1080p', '720p', '480p', '360p']
  });

  const { addToast } = useToast();

  return (
    <ToolLayout
      title="Video Player Studio"
      description="Create customizable video players with advanced features"
    >
      <div className="space-y-8">
        {!publicId && (
          <VideoUploader
            onUploadComplete={(result) => {
              setPublicId(result.public_id);
              addToast({
                title: 'Video uploaded successfully',
                type: 'success'
              });
            }}
            maxSize={200 * 1024 * 1024} // 200MB
            allowedFormats={['.mp4', '.mov', '.avi', '.webm']}
          />
        )}

        {publicId && (
          <VideoPlayerStudio
            publicId={publicId}
            settings={settings}
            onSettingsChange={setSettings}
            onPublish={(url) => {
              addToast({
                title: 'Player configuration saved',
                type: 'success'
              });
            }}
          />
        )}
      </div>
    </ToolLayout>
  );
};

export default VideoPlayer;