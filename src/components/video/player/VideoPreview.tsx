import React from 'react';
import { CloudinaryVideo } from '../../../lib/cloudinary/components/CloudinaryVideo';
import { VideoPlayerSettings } from '../../../types/videoPlayer';
import Controls from './Controls';
import Timeline from './Timeline';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';

interface VideoPreviewProps {
  publicId: string;
  settings: VideoPlayerSettings;
  onSettingsChange: (settings: VideoPlayerSettings) => void;
  className?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  publicId,
  settings,
  onSettingsChange,
  className
}) => {
  const { videoRef, state, controls } = useVideoPlayer({
    publicId,
    settings,
    onTimeUpdate: (time) => {
      // Handle time update
    },
    onDurationChange: (duration) => {
      // Handle duration change
    }
  });

  return (
    <div className={className}>
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
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
            thumbnails={settings.thumbnailSeeking}
          />
        )}
      </div>
    </div>
  );
};

export default VideoPreview;