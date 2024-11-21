import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/Button';
import { Settings as SettingsIcon, Layout, Palette } from 'lucide-react';

interface SettingsProps {
  settings: any;
  onChange: (settings: any) => void;
  className?: string;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  onChange,
  className
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Player Theme
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(['default', 'minimal', 'custom'] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => onChange({ ...settings, theme })}
              className={`p-4 rounded-lg border-2 transition-colors ${
                settings.theme === theme 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-gray-700 hover:border-red-500'
              }`}
            >
              <div className="text-lg font-bold mb-1 capitalize">{theme}</div>
            </button>
          ))}
        </div>
      </div>

      {settings.theme === 'custom' && (
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Scheme
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => onChange({
                    ...settings,
                    primaryColor: e.target.value
                  })}
                  className="h-10 w-20 bg-gray-800 rounded-lg border border-gray-700"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => onChange({
                    ...settings,
                    primaryColor: e.target.value
                  })}
                  className="flex-1 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Controls
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(settings.controls).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => onChange({
                  ...settings,
                  controls: {
                    ...settings.controls,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-gray-700 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.autoplay}
            onChange={(e) => onChange({
              ...settings,
              autoplay: e.target.checked
            })}
            className="rounded border-gray-700 text-red-500 focus:ring-red-500"
          />
          <span className="text-sm">Enable autoplay</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.loop}
            onChange={(e) => onChange({
              ...settings,
              loop: e.target.checked
            })}
            className="rounded border-gray-700 text-red-500 focus:ring-red-500"
          />
          <span className="text-sm">Enable loop</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.analytics}
            onChange={(e) => onChange({
              ...settings,
              analytics: e.target.checked
            })}
            className="rounded border-gray-700 text-red-500 focus:ring-red-500"
          />
          <span className="text-sm">Enable analytics</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.adaptiveStreaming}
            onChange={(e) => onChange({
              ...settings,
              adaptiveStreaming: e.target.checked
            })}
            className="rounded border-gray-700 text-red-500 focus:ring-red-500"
          />
          <span className="text-sm">Enable adaptive streaming</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.hotkeys}
            onChange={(e) => onChange({
              ...settings,
              hotkeys: e.target.checked
            })}
            className="rounded border-gray-700 text-red-500 focus:ring-red-500"
          />
          <span className="text-sm">Enable keyboard shortcuts</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;