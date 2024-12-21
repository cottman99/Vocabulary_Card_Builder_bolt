import React from 'react';
import { Palette } from 'lucide-react';

interface StylePreset {
  name: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  textSize: string;
}

const presets: StylePreset[] = [
  {
    name: 'Classic',
    borderColor: '#FF4444',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    textSize: '16px',
  },
  {
    name: 'Dark',
    borderColor: '#6366F1',
    backgroundColor: '#1F2937',
    textColor: '#FFFFFF',
    textSize: '16px',
  },
  {
    name: 'Minimal',
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
    textSize: '16px',
  },
  {
    name: 'Vibrant',
    borderColor: '#8B5CF6',
    backgroundColor: '#EEF2FF',
    textColor: '#4338CA',
    textSize: '16px',
  },
];

interface StylePresetsProps {
  onSelect: (preset: StylePreset) => void;
}

export const StylePresets: React.FC<StylePresetsProps> = ({ onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Palette className="w-4 h-4" />
        <span>Style Presets</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset)}
            className="p-3 rounded-lg border border-gray-200 hover:border-primary/50
              hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: preset.borderColor }}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {preset.name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div
                className="h-2 rounded"
                style={{ backgroundColor: preset.borderColor }}
              />
              <div
                className="h-2 rounded"
                style={{ backgroundColor: preset.backgroundColor }}
              />
              <div
                className="h-2 rounded"
                style={{ backgroundColor: preset.textColor }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};