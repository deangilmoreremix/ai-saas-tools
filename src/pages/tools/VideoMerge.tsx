import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import VideoUploadArea from '../../components/video/VideoUploadArea';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { useToast } from '../../hooks/useToast';

interface VideoFile {
  id: string;
  file: File;
  preview?: string;
}

const VideoMerge = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string>('');
  const { addToast } = useToast();

  const handleUpload = (acceptedFiles: File[]) => {
    const newVideos = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file)
    }));

    setVideos(prev => [...prev, ...newVideos].slice(0, 10)); // Limit to 10 videos
  };

  const removeVideo = (id: string) => {
    setVideos(prev => {
      const filtered = prev.filter(v => v.id !== id);
      filtered.forEach(v => v.preview && URL.revokeObjectURL(v.preview));
      return filtered;
    });
  };

  const moveVideo = (id: string, direction: 'up' | 'down') => {
    setVideos(prev => {
      const index = prev.findIndex(v => v.id === id);
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === prev.length - 1)
      ) return prev;

      const newVideos = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
      return newVideos;
    });
  };

  const handleMerge = async () => {
    if (videos.length < 2) {
      addToast({
        title: 'At least 2 videos required',
        type: 'error'
      });
      return;
    }

    try {
      setStatus('processing');
      setProgress(10);

      // Upload all videos
      const uploadedVideos = await Promise.all(
        videos.map(async (video, index) => {
          const result = await uploadToCloudinary(video.file);
          setProgress(10 + ((index + 1) / videos.length) * 40);
          return result.public_id;
        })
      );

      setProgress(50);

      // Create concatenation transformation
      const transformations = uploadedVideos.map((id, index) => {
        if (index === 0) return id;
        return `/fl_splice,l_video:${id}`;
      }).join('');

      // Generate final URL
      const mergedUrl = `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/${transformations}`;
      
      setResultUrl(mergedUrl);
      setProgress(100);
      setStatus('completed');

      addToast({
        title: 'Videos merged successfully',
        type: 'success'
      });
    } catch (error) {
      setStatus('error');
      addToast({
        title: 'Merge failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      });
    }
  };

  return (
    <ToolLayout
      title="Video Merger"
      description="Combine multiple videos into a single video file"
    >
      <div className="space-y-8">
        <VideoUploadArea
          onUpload={handleUpload}
          maxFiles={10}
          maxFileSize={200 * 1024 * 1024} // 200MB
          currentFileCount={videos.length}
          files={videos.map(v => v.file)}
          onRemove={(index) => removeVideo(videos[index].id)}
          onReorder={(fromIndex, toIndex) => {
            const id = videos[fromIndex].id;
            moveVideo(id, toIndex > fromIndex ? 'down' : 'up');
          }}
        />

        {videos.length >= 2 && status === 'idle' && (
          <div className="text-center">
            <Button onClick={handleMerge}>Merge Videos</Button>
          </div>
        )}

        {status === 'processing' && (
          <ProcessingStatus 
            status="processing" 
            progress={progress}
            message="Merging videos..."
          />
        )}

        {status === 'completed' && resultUrl && (
          <div className="text-center space-y-4">
            <p className="text-green-500 mb-4">Videos merged successfully!</p>
            <div className="max-w-2xl mx-auto border border-gray-800 rounded-lg overflow-hidden">
              <video 
                src={resultUrl} 
                controls 
                className="w-full"
                poster={resultUrl.replace(/\.[^/.]+$/, '.jpg')}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button as="a" href={resultUrl} download>
                Download Merged Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setProgress(0);
                  setResultUrl('');
                  setVideos([]);
                }}
              >
                Merge More Videos
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default VideoMerge;