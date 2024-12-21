import React, { useCallback, useState } from 'react';
import { useStore } from '../store';
import { generateLabelContent } from '../services/api/index';
import { LabelField } from './label/LabelField';
import { LabelActions } from './label/LabelActions';
import { EmptyState } from './label/EmptyState';
import { logger } from '../utils/logger/Logger';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const LabelEditor: React.FC = () => {
  useKeyboardShortcuts();

  const [isRegenerating, setIsRegenerating] = useState(false);

  const { 
    labels, 
    selectedLabelId, 
    updateLabel,
    addLabel,
    removeLabel, 
    llmSettings, 
    promptSettings,
    promptParams,
    languageParams
  } = useStore();

  const selectedLabel = labels.find(label => label.id === selectedLabelId);

  const handleRegenerateLabel = async () => {
    if (!selectedLabel) return;

    try {
      setIsRegenerating(true);
      logger.label.info('Regenerating label content', {
        labelId: selectedLabel.id,
        sourceLanguage: selectedLabel.sourceLanguage
      });

      // Replace prompt parameters
      const generatePrompt = promptSettings.labelGeneration
      .replace('{{param1}}', promptParams.param1)
      .replace('{{param2}}', promptParams.param2)
      .replace('{{sourceLanguage}}', languageParams.sourceLanguage)
      .replace('{{targetLanguage}}', languageParams.targetLanguage)
      .replace('{{phonetic}}', languageParams.phonetic);
      logger.llm.debug('Prepared label generation prompt', { generatePrompt });

      const content = await generateLabelContent(
        selectedLabel.sourceLanguage,
        llmSettings,
        generatePrompt
      );
      
      updateLabel(selectedLabel.id, {
        phonetic: content.phonetic,
        targetLanguage: content.targetLanguage,
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
    } finally {
      setIsRegenerating(false);
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
      sourceLanguage: 'New Label',
      phonetic: '',
      targetLanguage: '',
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
          label="sourceLanguage"
          value={selectedLabel.sourceLanguage}
          onChange={(value) => handleFieldUpdate('sourceLanguage', value)}
          placeholder="Enter sourceLanguage text"
        />
        
        <LabelField
          label="Phonetic"
          value={selectedLabel.phonetic}
          onChange={(value) => handleFieldUpdate('phonetic', value)}
          placeholder="IPA pronunciation"
        />
        
        <LabelField
          label="targetLanguage"
          value={selectedLabel.targetLanguage}
          onChange={(value) => handleFieldUpdate('targetLanguage', value)}
          placeholder="targetLanguage translation"
        />
        
        <div className="pt-4">
          <LabelActions
            onAdd={handleAddLabel}
            onRemove={handleRemoveLabel}
            onRegenerate={handleRegenerateLabel}
            isRegenerating={isRegenerating}
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