import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { LLMProvider } from '../types';
import { DEFAULT_LLM_SETTINGS } from '../utils/defaults';
import { ProviderSelect } from './settings/ProviderSelect';
import { SettingsField } from './settings/SettingsField';
import { PromptField } from './settings/PromptField';
import { logger } from '../utils/logger/Logger';

export const SettingsModal: React.FC = () => {
  const { llmSettings, promptSettings, setLLMSettings, setPromptSettings } =
    useStore();

  const handleProviderChange = useCallback((provider: LLMProvider) => {
    logger.system.info('LLM provider changed', { provider });
    setLLMSettings({
      ...DEFAULT_LLM_SETTINGS[provider],
      apiKey: llmSettings.apiKey, // Preserve API key when switching providers
    });
  }, [llmSettings.apiKey, setLLMSettings]);

  return (
    <dialog
      id="settingsModal"
      className="modal p-6 rounded-xl shadow-xl bg-white max-w-2xl w-full
        backdrop-blur-lg backdrop-saturate-150 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure API settings and prompts
          </p>
        </div>
        <button
          onClick={() => document.getElementById('settingsModal')?.close()}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            LLM Provider Settings
          </h3>
          <div className="space-y-4">
            <ProviderSelect
              value={llmSettings.provider}
              onChange={handleProviderChange}
            />
            
            <SettingsField
              label="API URL"
              tooltip="The base URL for API requests"
            >
              <input
                type="text"
                value={llmSettings.apiUrl}
                onChange={(e) =>
                  setLLMSettings({ ...llmSettings, apiUrl: e.target.value })
                }
                className="input"
                placeholder="https://api.example.com/v1"
              />
            </SettingsField>
            
            <SettingsField
              label="API Key"
              tooltip="Your authentication key"
            >
              <input
                type="password"
                value={llmSettings.apiKey}
                onChange={(e) =>
                  setLLMSettings({ ...llmSettings, apiKey: e.target.value })
                }
                className="input font-mono"
                placeholder="sk-..."
              />
            </SettingsField>
            
            <SettingsField
              label="Model"
              tooltip="The model to use for generation"
            >
              <input
                type="text"
                value={llmSettings.model}
                onChange={(e) =>
                  setLLMSettings({ ...llmSettings, model: e.target.value })
                }
                className="input"
                placeholder="gpt-4-vision-preview"
              />
            </SettingsField>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Prompt Templates
          </h3>
          <div className="space-y-4">
            <PromptField
              label="Image Analysis"
              value={promptSettings.imageAnalysis}
              onChange={(value) =>
                setPromptSettings({
                  ...promptSettings,
                  imageAnalysis: value,
                })
              }
              placeholder="Enter prompt for analyzing images..."
            />
            
            <PromptField
              label="Label Generation"
              value={promptSettings.labelGeneration}
              onChange={(value) =>
                setPromptSettings({
                  ...promptSettings,
                  labelGeneration: value,
                })
              }
              placeholder="Enter prompt for generating labels..."
            />
          </div>
        </section>
      </div>
      
      <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
        <button
          onClick={() => document.getElementById('settingsModal')?.close()}
          className="btn btn-primary px-6"
        >
          Done
        </button>
      </div>
    </dialog>
  );
};