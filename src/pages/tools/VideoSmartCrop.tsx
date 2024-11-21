import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import { VideoUploader } from '../../components/video/upload/VideoUploader';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useVideoAnalysis } from '../../hooks/useVideoAnalysis';
import { useToast } from '../../hooks/useToast';
import { SmartCropSettings } from '../../types/video/analysis';

const VideoSmartCrop = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [settings, setSettings] = useState<SmartCropSettings>({
    aspectRatio: '16:9',
    mode: 'content',
    customFocus: '',
    preserveQuality: true
  });

  const { smartCrop } = useVideoAnalysis({
    onProgress: setProgress,
    onComplete: (result) => {
      setResultUrl(result.secure_url);
      setStatus('completed');
    },
    onError: (error) => {
      setStatus('error');
      addToast({
        title: 'Smart crop failed',
        description: error.message,
        type: 'error'
      });
    }
  });

  const { addToast } = useToast();

  const handleUpload = (file: File) => {
    setFile(file);
    setStatus('idle');
    setResultUrl('');
  };

  const handleCrop = async () => {
    if (!file) return;

    try {
      setStatus('processing');
      await smartCrop(file, settings);
    } catch (error) {
      console.error('Smart crop failed:', error);
    }
  };

  const aspectRatios = {
    '16:9': { width: 1920, height: 1080, description: 'Landscape HD' },
    '9:16': { width: 1080, height: 1920, description: 'Portrait/Stories' },
    '1:1': { width: 1080, height: 1080, description: 'Square' },
    '4:3': { width: 1440, height: 1080, description: 'Traditional' },
    '21:9': { width: 2560, height: 1080, description: 'Ultrawide' }
  };

  return (
    <ToolLayout
      title="Video Smart Crop"
      description="Automatically crop and resize videos while preserving the important content"
    >
      <div className="space-y-8">
        <VideoUploader
          onUploadComplete={(result) => {
            handleUpload(result.file);
            addToast({
              title: 'Video uploaded successfully',
              type: 'success'
            });
          }}
          maxSize={200 * 1024 * 1024} // 200MB
          allowedFormats={['.mp4', '.mov', '.avi', '.webm']}
        />

        {file && status === 'idle' && (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(aspectRatios).map(([ratio, details]) => (
                    <button
                      key={ratio}
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        aspectRatio: ratio
                      }))}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.aspectRatio === ratio 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-gray-700 hover:border-red-500'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1">{ratio}</div>
                      <div className="text-sm text-gray-400">{details.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {details.width}x{details.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Crop Mode</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['content', 'faces', 'custom'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        mode,
                        customFocus: mode === 'custom' ? prev.customFocus : ''
                      }))}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.mode === mode 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-gray-700 hover:border-red-500'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1 capitalize">{mode}</div>
                      <div className="text-sm text-gray-400">
                        {mode === 'content' && 'Focus on main content'}
                        {mode === 'faces' && 'Focus on faces'}
                        {mode === 'custom' && 'Custom focus point'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {settings.mode === 'custom' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Focus</label>
                  <input
                    type="text"
                    value={settings.customFocus}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      customFocus: e.target.value
                    }))}
                    placeholder="e.g., 'center', 'north_west', 'g_auto'"
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="preserveQuality"
                  checked={settings.preserveQuality}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preserveQuality: e.target.checked
                  }))}
                  className="rounded border-gray-700 text-red-500 focus:ring-red-500"
                />
                <label htmlFor="preserveQuality" className="text-sm">
                  Preserve original video quality
                </label>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleCrop}>Crop Video</Button>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <ProcessingStatus
            status="processing"
            progress={progress}
            message="Analyzing content and applying smart crop..."
          />
        )}

        {status === 'completed' && resultUrl && (
          <div className="text-center space-y-4">
            <p className="text-green-500 mb-4">Video cropped successfully!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <h4 className="text-sm font-medium p-2 bg-gray-800">Original</h4>
                <video 
                  src={URL.createObjectURL(file)} 
                  controls 
                  className="w-full"
                />
              </div>
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <h4 className="text-sm font-medium p-2 bg-gray-800">
                  Cropped ({settings.aspectRatio})
                </h4>
                <video 
                  src={resultUrl} 
                  controls 
                  className="w-full"
                  poster={resultUrl.replace(/\.[^/.]+$/, '.jpg')}
                />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button as="a" href={resultUrl} download>
                Download Cropped Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setProgress(0);
                  setResultUrl('');
                  setFile(null);
                }}
              >
                Crop Another Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default VideoSmartCrop;