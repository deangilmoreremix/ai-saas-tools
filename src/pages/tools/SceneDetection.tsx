import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import { VideoUploader } from '../../components/video/upload/VideoUploader';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useVideoAnalysis } from '../../hooks/useVideoAnalysis';
import { useToast } from '../../hooks/useToast';
import { SceneDetectionSettings } from '../../types/video/analysis';

const SceneDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [scenes, setScenes] = useState<Array<{
    timestamp: number;
    thumbnail: string;
    description: string;
    confidence: number;
  }>>([]);

  const { detectScenes } = useVideoAnalysis({
    onProgress: setProgress,
    onComplete: (result) => {
      setScenes(result.scenes);
      setStatus('completed');
    }
  });

  const { addToast } = useToast();

  const handleUpload = (result: any) => {
    setFile(result.file);
    setStatus('idle');
    setScenes([]);
    addToast({
      title: 'Video uploaded successfully',
      type: 'success'
    });
  };

  return (
    <ToolLayout
      title="Scene Detection"
      description="Automatically detect and extract scenes from your videos"
    >
      <div className="space-y-8">
        <VideoUploader
          onUploadComplete={handleUpload}
          maxSize={200 * 1024 * 1024} // 200MB
          allowedFormats={['.mp4', '.mov', '.avi', '.webm']}
        />

        {/* Rest of the component remains the same */}
      </div>
    </ToolLayout>
  );
};

export default SceneDetection;