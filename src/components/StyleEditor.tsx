import React from 'react';
import { useStore } from '../store';
import { ColorField } from './style/ColorField';
import { StylePresets } from './style/StylePresets';
import { logger } from '../utils/logger/Logger';

export const StyleEditor: React.FC = () => {
  const { styleSettings, setStyleSettings } = useStore();
  const [activeColor, setActiveColor] = React.useState<
    'border' | 'background' | 'text' | null
  >(null);

  const handleColorChange = (type: 'borderColor' | 'backgroundColor' | 'textColor', color: string) => {
    setStyleSettings({
      ...styleSettings,
      [type]: color,
    });
    logger.ui.debug('Style color updated', { type, color });
  };

  const handlePresetSelect = (preset: {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
  }) => {
    setStyleSettings(preset);
    logger.ui.info('Style preset applied', { preset });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
      <h2 className="text-lg font-bold mb-6 text-gray-800">Style Editor</h2>
      
      <div className="space-y-6">
        <StylePresets onSelect={handlePresetSelect} />

        <div className="space-y-4">
          <ColorField
            label="Border Color"
            color={styleSettings.borderColor}
            onChange={(color) => handleColorChange('borderColor', color)}
            onClick={() => setActiveColor(activeColor === 'border' ? null : 'border')}
            isActive={activeColor === 'border'}
          />
          
          <ColorField
            label="Background Color"
            color={styleSettings.backgroundColor}
            onChange={(color) => handleColorChange('backgroundColor', color)}
            onClick={() => setActiveColor(activeColor === 'background' ? null : 'background')}
            isActive={activeColor === 'background'}
          />
          
          <ColorField
            label="Text Color"
            color={styleSettings.textColor}
            onChange={(color) => handleColorChange('textColor', color)}
            onClick={() => setActiveColor(activeColor === 'text' ? null : 'text')}
            isActive={activeColor === 'text'}
          />
        </div>
      </div>
    </div>
  );
};