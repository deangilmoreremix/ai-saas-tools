import React, { useState } from 'react';
import { VideoStudioProps, VideoStudioSettings } from '../../../types/video/interfaces';
import { CloudinaryVideo } from '../../../lib/cloudinary/components/CloudinaryVideo';
import { CloudinaryUploadWidget } from '../../../lib/cloudinary/components/CloudinaryUploadWidget';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import Controls from './Controls';
import Timeline from './Timeline';
import Settings from './Settings';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';

const VideoPlayerStudio: React.FC<VideoStudioProps> = ({
  publicId,
  settings,
  onSettingsChange,
  onPublish,
  className
}) => {
  const { videoRef, state, controls } = useVideoPlayer({
    publicId,
    settings: settings,
    onTimeUpdate: (time) => {
      // Handle time update
    },
    onDurationChange: (duration) => {
      // Handle duration change
    }
  });

  const { addToast } = useToast();

  const handleUploadSuccess = (result: any) => {
    onPublish?.(result.secure_url);
    addToast({
      title: 'Video uploaded successfully',
      type: 'success'
    });
  };

  const handleUploadError = (error: Error) => {
    addToast({
      title: 'Upload failed',
      description: error.message,
      type: 'error'
    });
  };

  const generateCode = () => {
    return `
<!-- Cloudinary Video Player -->
<script src="https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.js"></script>
<link href="https://unpkg.com/cloudinary-video-player/dist/cld-video-player.min.css" rel="stylesheet">

<video
  id="player"
  controls
  class="cld-video-player ${settings.theme === 'minimal' ? 'minimal' : ''}"
  data-cld-public-id="${publicId}"
  ${settings.autoplay ? 'autoplay' : ''}
  ${settings.loop ? 'loop' : ''}
  ${settings.muted ? 'muted' : ''}
  data-cld-colors='{ "base": "${settings.primaryColor}" }'
></video>

<script>
const player = cloudinary.videoPlayer('player', {
  cloud_name: '${process.env.VITE_CLOUDINARY_CLOUD_NAME}',
  controls: ${JSON.stringify(settings.controls)},
  analytics: ${settings.analytics},
  fluid: true,
  adaptiveStreaming: ${settings.adaptiveStreaming}
});
</script>`;
  };

  return (
    <div className={className}>
      {!publicId ? (
        <CloudinaryUploadWidget
          options={{
            resourceType: 'video',
            maxFiles: 1,
            sources: ['local', 'url', 'camera'],
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
              }
            }
          }}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
        >
          <Button className="w-full">Upload Video</Button>
        </CloudinaryUploadWidget>
      ) : (
        <div className="space-y-8">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            <CloudinaryVideo
              ref={videoRef}
              publicId={publicId}
              controls={settings.controls.playPause}
              autoPlay={settings.autoplay}
              loop={settings.loop}
              muted={settings.muted}
              className="w-full h-full"
            />
            
            <Controls
              isPlaying={state.isPlaying}
              currentTime={state.currentTime}
              duration={state.duration}
              volume={state.volume}
              isMuted={state.isMuted}
              isFullscreen={state.isFullscreen}
              quality={state.quality}
              playbackRate={state.playbackRate}
              buffered={state.buffered}
              onPlayPause={state.isPlaying ? controls.pause : controls.play}
              onTimeUpdate={controls.seek}
              onVolumeChange={controls.setVolume}
              onMuteToggle={controls.toggleMute}
              onFullscreenToggle={controls.toggleFullscreen}
              onQualityChange={controls.setQuality}
              onPlaybackRateChange={controls.setPlaybackRate}
              settings={settings}
            />

            {settings.controls.progress && (
              <Timeline
                currentTime={state.currentTime}
                duration={state.duration}
                buffered={state.buffered}
                onSeek={controls.seek}
                thumbnails={[]} // Add thumbnail URLs here
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Settings
              settings={settings}
              onChange={onSettingsChange}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Implementation Code</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{generateCode()}</code>
                </pre>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generateCode());
                    addToast({
                      title: 'Code copied to clipboard',
                      type: 'success'
                    });
                  }}
                  className="mt-4"
                >
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerStudio;