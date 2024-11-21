import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import { VideoUploader } from '../../components/video/upload/VideoUploader';
import { MediaUploader } from '../../components/upload/MediaUploader';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useVideoAnalysis } from '../../hooks/useVideoAnalysis';
import { useToast } from '../../hooks/useToast';
import { VideoOverlaySettings } from '../../types/video/analysis';
import { Move, X } from 'lucide-react';

interface Overlay {
  id: string;
  file: File;
  settings: VideoOverlaySettings;
}

const VideoOverlays = () => {
  const [mainVideo, setMainVideo] = useState<File | null>(null);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string>('');

  const { applyOverlay } = useVideoAnalysis({
    onProgress: setProgress,
    onComplete: (result) => {
      setResultUrl(result.secure_url);
      setStatus('completed');
    },
    onError: (error) => {
      setStatus('error');
      addToast({
        title: 'Failed to apply overlays',
        description: error.message,
        type: 'error'
      });
    }
  });

  const { addToast } = useToast();

  const handleMainVideoUpload = (file: File) => {
    setMainVideo(file);
    setStatus('idle');
    setResultUrl('');
  };

  const handleOverlayUpload = (file: File) => {
    const newOverlay: Overlay = {
      id: Math.random().toString(36).substring(7),
      file,
      settings: {
        position: 'top-right',
        size: 30,
        opacity: 100,
        timing: {
          start: 0,
          duration: 5
        },
        transition: {
          type: 'fade',
          duration: 0.5
        }
      }
    };
    setOverlays([...overlays, newOverlay]);
  };

  const updateOverlay = (id: string, settings: Partial<VideoOverlaySettings>) => {
    setOverlays(overlays.map(overlay => 
      overlay.id === id ? {
        ...overlay,
        settings: { ...overlay.settings, ...settings }
      } : overlay
    ));
  };

  const removeOverlay = (id: string) => {
    setOverlays(overlays.filter(overlay => overlay.id !== id));
  };

  const handleApplyOverlays = async () => {
    if (!mainVideo || overlays.length === 0) return;

    try {
      setStatus('processing');
      
      // Process each overlay sequentially
      let currentVideo = mainVideo;
      for (let i = 0; i < overlays.length; i++) {
        const overlay = overlays[i];
        const result = await applyOverlay(
          currentVideo,
          overlay.file,
          overlay.settings
        );
        currentVideo = result.file;
        setProgress((i + 1) / overlays.length * 100);
      }

    } catch (error) {
      console.error('Failed to apply overlays:', error);
    }
  };

  return (
    <ToolLayout
      title="Video Overlays"
      description="Add custom overlays, watermarks, and logos to your videos"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Main Video</h3>
            <VideoUploader
              onUploadComplete={(result) => {
                handleMainVideoUpload(result.file);
                addToast({
                  title: 'Video uploaded successfully',
                  type: 'success'
                });
              }}
              maxSize={200 * 1024 * 1024} // 200MB
              allowedFormats={['.mp4', '.mov', '.avi', '.webm']}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Add Overlay</h3>
            <MediaUploader
              onUploadComplete={(result) => {
                handleOverlayUpload(result.file);
                addToast({
                  title: 'Overlay added successfully',
                  type: 'success'
                });
              }}
              maxSize={10 * 1024 * 1024} // 10MB
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
            />
          </div>
        </div>

        {overlays.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Overlay Settings</h3>
            {overlays.map((overlay) => (
              <div 
                key={overlay.id}
                className="bg-gray-800 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Move className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Overlay: {overlay.file.name}</span>
                  </div>
                  <button
                    onClick={() => removeOverlay(overlay.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <select
                      value={overlay.settings.position}
                      onChange={(e) => updateOverlay(overlay.id, {
                        position: e.target.value as VideoOverlaySettings['position']
                      })}
                      className="w-full bg-gray-900 rounded-lg px-3 py-2 border border-gray-700"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Size: {overlay.settings.size}%
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={overlay.settings.size}
                      onChange={(e) => updateOverlay(overlay.id, {
                        size: Number(e.target.value)
                      })}
                      className="w-full accent-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Opacity: {overlay.settings.opacity}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={overlay.settings.opacity}
                      onChange={(e) => updateOverlay(overlay.id, {
                        opacity: Number(e.target.value)
                      })}
                      className="w-full accent-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time (s)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={overlay.settings.timing.start}
                      onChange={(e) => updateOverlay(overlay.id, {
                        timing: {
                          ...overlay.settings.timing,
                          start: Number(e.target.value)
                        }
                      })}
                      className="w-full bg-gray-900 rounded-lg px-3 py-2 border border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (s)</label>
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={overlay.settings.timing.duration}
                      onChange={(e) => updateOverlay(overlay.id, {
                        timing: {
                          ...overlay.settings.timing,
                          duration: Number(e.target.value)
                        }
                      })}
                      className="w-full bg-gray-900 rounded-lg px-3 py-2 border border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Transition</label>
                    <select
                      value={overlay.settings.transition.type}
                      onChange={(e) => updateOverlay(overlay.id, {
                        transition: {
                          ...overlay.settings.transition,
                          type: e.target.value as VideoOverlaySettings['transition']['type']
                        }
                      })}
                      className="w-full bg-gray-900 rounded-lg px-3 py-2 border border-gray-700"
                    >
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {mainVideo && overlays.length > 0 && status === 'idle' && (
          <div className="text-center">
            <Button onClick={handleApplyOverlays}>Apply Overlays</Button>
          </div>
        )}

        {status === 'processing' && (
          <ProcessingStatus 
            status="processing" 
            progress={progress}
            message="Applying overlays to video..."
          />
        )}

        {status === 'completed' && resultUrl && (
          <div className="text-center space-y-4">
            <p className="text-green-500 mb-4">Overlays applied successfully!</p>
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
                Download Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setProgress(0);
                  setResultUrl('');
                  setMainVideo(null);
                  setOverlays([]);
                }}
              >
                Create New Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default VideoOverlays;