import React, { useCallback } from 'react';
import { Cursor } from 'lucide-react';
import { useStore } from '../store';
import { generateLabelContent } from '../services/api/index';
import { LabelField } from './label/LabelField';
import { LabelActions } from './label/LabelActions';
import { EmptyState } from './label/EmptyState';
import { logger } from '../utils/logger/Logger';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const LabelEditor: React.FC = () => {
  useKeyboardShortcuts();

  const { 
    labels, 
    selectedLabelId, 
    updateLabel,
    addLabel,
    removeLabel, 
    llmSettings, 
    promptSettings 
  } = useStore();

  const selectedLabel = labels.find(label => label.id === selectedLabelId);

  const handleRegenerateLabel = async () => {
    if (!selectedLabel) return;

    try {
      logger.label.info('Regenerating label content', {
        labelId: selectedLabel.id,
        english: selectedLabel.english
      });

      const content = await generateLabelContent(
        selectedLabel.english,
        llmSettings,
        promptSettings.labelGeneration
      );
      
      updateLabel(selectedLabel.id, {
        phonetic: content.phonetic,
        chinese: content.chinese,
      });

      logger.label.info('Label content regenerated', {
        labelId: selectedLabel.id,
        content
      });
    } catch (error) {
      logger.label.error('Label regeneration failed', {
        labelId: selectedLabel.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleFieldUpdate = useCallback((field: string, value: string) => {
    if (!selectedLabel) return;
    
    logger.label.debug('Label field updated', {
      labelId: selectedLabel.id,
      field,
      value
    });
    updateLabel(selectedLabel.id, { [field]: value });
  }, [selectedLabel, updateLabel]);

  const handleAddLabel = () => {
    const newLabel = {
      id: String(Date.now()),
      english: 'New Label',
      phonetic: '',
      chinese: '',
      position: { x: 100, y: 100 }
    };
    addLabel(newLabel);
    logger.label.info('New label added', { label: newLabel });
  };

  const handleRemoveLabel = () => {
    if (!selectedLabel) return;
    removeLabel(selectedLabel.id);
    logger.label.info('Label removed', { labelId: selectedLabel.id });
  };

  if (!selectedLabel) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm transition-all duration-300 
        hover:shadow-md border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Label Editor</h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm transition-all duration-300 
      hover:shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Label Editor</h2>
        <div className="text-xs text-gray-400 tabular-nums">
          Label #{selectedLabel.id}
        </div>
      </div>
      <div className="space-y-6">
        <LabelField
          label="English"
          value={selectedLabel.english}
          onChange={(value) => handleFieldUpdate('english', value)}
          placeholder="Enter English text"
        />
        
        <LabelField
          label="Phonetic"
          value={selectedLabel.phonetic}
          onChange={(value) => handleFieldUpdate('phonetic', value)}
          placeholder="IPA pronunciation"
        />
        
        <LabelField
          label="Chinese"
          value={selectedLabel.chinese}
          onChange={(value) => handleFieldUpdate('chinese', value)}
          placeholder="Chinese translation"
        />
        
        <div className="pt-4">
          <LabelActions
            onAdd={handleAddLabel}
            onRemove={handleRemoveLabel}
            onRegenerate={handleRegenerateLabel}
          />
        </div>
        <div className="text-xs text-gray-400 text-center bg-gray-50/50
          py-2 px-3 rounded-lg border border-gray-100 mt-4">
          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white rounded border
            shadow-sm">⌘N</kbd> to add &nbsp;•&nbsp; 
          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white rounded border
            shadow-sm">⌫</kbd> to remove
        </div>
      </div>
    </div>
  );
};