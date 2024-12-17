import React from 'react';
import { Settings, Share, Camera, Palette } from 'lucide-react';
import { useStore } from '../store';

export const Toolbar: React.FC<{ onExport: () => void }> = ({ onExport }) => {
  const { promptParams, setPromptParams } = useStore();

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Visual Vocabulary Builder
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              className="btn btn-secondary"
              onClick={() => document.getElementById('settingsModal')?.showModal()}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById('exportModal')?.showModal()}
            >
              <Share className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};