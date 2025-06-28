
import React from 'react';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  searchInterval: number;
  onApiKeyChange: (key: string) => void;
  onIntervalChange: (interval: number) => void;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  searchInterval,
  onApiKeyChange,
  onIntervalChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Configuration</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tavily API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter your Tavily API key"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              Get your API key from <a href="https://tavily.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">tavily.com</a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Search Interval (seconds)</label>
            <input
              type="number"
              value={searchInterval}
              onChange={(e) => onIntervalChange(Number(e.target.value))}
              min="60"
              max="3600"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-slate-400 mt-1">
              Minimum: 60 seconds, Maximum: 3600 seconds (1 hour)
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
