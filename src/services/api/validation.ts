import { LLMSettings } from '../../types/llm';
import { LLMConfigError } from './errors';

export function validateLLMSettings(settings: LLMSettings): void {
  if (!settings.apiKey) {
    throw new LLMConfigError('API key is required. Please configure it in Settings.');
  }

  if (!settings.model) {
    throw new LLMConfigError('Model name is required. Please configure it in Settings.');
  }

  if (settings.provider === 'Custom' && !settings.apiUrl) {
    throw new LLMConfigError('API URL is required for custom provider. Please configure it in Settings.');
  }
}