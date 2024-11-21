import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import { VideoUploader } from '../../components/video/upload/VideoUploader';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useVideoAnalysis } from '../../hooks/useVideoAnalysis';
import { useToast } from '../../hooks/useToast';
import { ThumbnailSettings } from '../../types/video/analysis';

const AutoThumbnailing = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [settings, setSettings] = useState<ThumbnailSettings>({
    count: 6,
    interval: 'smart',
    format: 'jpg',
    quality: 80,
    size: {
      width: 640,
      height: 360
    }
  });

  const { generateThumbnails } = useVideoAnalysis({
    onProgress: setProgress,
    onComplete: (result) => {
      setThumbnails(result.eager.map((img: any) => img.secure_url));
      setStatus('completed');
      addToast({
        title: 'Thumbnails generated successfully',
        type: 'success'
      });
    },
    onError: (error) => {
      setStatus('error');
      addToast({
        title: 'Thumbnail generation failed',
        description: error.message,
        type: 'error'
      });
    }
  });

  const { addToast } = useToast();

  const handleUpload = (result: any) => {
    setFile(result.file);
    setStatus('idle');
    setThumbnails([]);
    addToast({
      title: 'Video uploaded successfully',
      type: 'success'
    });
  };

  const handleGenerate = async () => {
    if (!file) return;

    try {
      setStatus('processing');
      await generateThumbnails(file, settings);
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
    }
  };

  return (
    <ToolLayout
      title="Auto Thumbnailing"
      description="Generate intelligent video thumbnails automatically"
    >
      <div className="space-y-8">
        <VideoUploader
          onUploadComplete={handleUpload}
          maxSize={200 * 1024 * 1024} // 200MB
          allowedFormats={['.mp4', '.mov', '.avi', '.webm']}
        />

        {file && status === 'idle' && (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Generation Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, interval: 'uniform' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.interval === 'uniform' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-700 hover:border-red-500'
                    }`}
                  >
                    <div className="text-lg font-bold mb-1">Uniform</div>
                    <div className="text-sm text-gray-400">Equal time intervals</div>
                  </button>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, interval: 'smart' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.interval === 'smart' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-700 hover:border-red-500'
                    }`}
                  >
                    <div className="text-lg font-bold mb-1">Smart</div>
                    <div className="text-sm text-gray-400">AI-detected key frames</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Thumbnails: {settings.count}
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={settings.count}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    count: Number(e.target.value)
                  }))}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select
                  value={settings.format}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    format: e.target.value as 'jpg' | 'png' | 'webp'
                  }))}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
                >
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {settings.quality}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    quality: Number(e.target.value)
                  }))}
                  className="w-full accent-red-500"
                />
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleGenerate}>Generate Thumbnails</Button>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <ProcessingStatus
            status="processing"
            progress={progress}
            message="Generating thumbnails..."
          />
        )}

        {status === 'completed' && thumbnails.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {thumbnails.map((url, index) => (
                <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full"
                  />
                  <div className="p-2 bg-gray-800 flex justify-end">
                    <Button as="a" href={url} download size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setProgress(0);
                  setThumbnails([]);
                  setFile(null);
                }}
              >
                Generate More Thumbnails
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default AutoThumbnailing;