import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import MediaUploader from '../../components/upload/MediaUploader';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { Globe, Gauge, BarChart, Grid, List, Folder, Image, Video, File, Search, Filter } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: number;
  created: Date;
  tags: string[];
  publicId: string;
}

const MediaLibrary = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const { addToast } = useToast();

  const handleUploadComplete = (result: any) => {
    const newItem: MediaItem = {
      id: result.public_id,
      url: result.secure_url,
      type: result.resource_type,
      name: result.original_filename,
      size: result.bytes,
      created: new Date(result.created_at),
      tags: result.tags || [],
      publicId: result.public_id
    };

    setMediaItems(prev => [...prev, newItem]);
    addToast({
      title: 'File uploaded successfully',
      type: 'success'
    });
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = !selectedFolder || 
                         (selectedFolder === 'images' && item.type === 'image') ||
                         (selectedFolder === 'videos' && item.type === 'video') ||
                         (selectedFolder === 'documents' && item.type === 'document');
    return matchesSearch && matchesFolder;
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ToolLayout
      title="Media Library"
      description="Organize and manage your media assets"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid' ? 'bg-red-500' : 'hover:bg-gray-800'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'list' ? 'bg-red-500' : 'hover:bg-gray-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media..."
                className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 space-y-4">
            <MediaUploader
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
                'video/*': ['.mp4', '.mov', '.avi'],
                'application/pdf': ['.pdf']
              }}
              maxSize={100 * 1024 * 1024} // 100MB limit
              onUploadComplete={handleUploadComplete}
            />

            <div className="space-y-2">
              <h3 className="font-medium">Folders</h3>
              {['images', 'videos', 'documents'].map(folder => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder === selectedFolder ? null : folder)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    folder === selectedFolder 
                      ? 'bg-red-500' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <Folder className="w-5 h-5" />
                  <span className="capitalize">{folder}</span>
                  <span className="ml-auto text-sm text-gray-400">
                    {mediaItems.filter(item => 
                      (folder === 'images' && item.type === 'image') ||
                      (folder === 'videos' && item.type === 'video') ||
                      (folder === 'documents' && item.type === 'document')
                    ).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No media items found
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="border border-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      {item.type === 'image' && (
                        <img 
                          src={item.url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.type === 'video' && (
                        <video 
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {item.type === 'document' && (
                        <File className="w-12 h-12 text-gray-600" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-gray-400">{formatBytes(item.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-gray-800 rounded-lg divide-y divide-gray-800">
                <div className="grid grid-cols-12 gap-4 p-3 font-medium text-sm text-gray-400">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-3">Created</div>
                </div>
                {filteredItems.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-3">
                    <div className="col-span-5 flex items-center gap-3">
                      {item.type === 'image' && <Image className="w-5 h-5" />}
                      {item.type === 'video' && <Video className="w-5 h-5" />}
                      {item.type === 'document' && <File className="w-5 h-5" />}
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="col-span-2 capitalize">{item.type}</div>
                    <div className="col-span-2">{formatBytes(item.size)}</div>
                    <div className="col-span-3">{formatDate(item.created)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MediaLibrary;