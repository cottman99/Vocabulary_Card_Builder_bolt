import { LLMSettings, LLMClient } from '../../types/llm';
import { OpenAIClient } from './openai';
import { AnthropicClient } from './anthropic';
import { GoogleClient } from './google';
import { CustomClient } from './custom';

export function createLLMClient(settings: LLMSettings): LLMClient {
  switch (settings.provider) {
    case 'OpenAI':
      return new OpenAIClient(settings);
    case 'Anthropic':
      return new AnthropicClient(settings);
    case 'Google':
      return new GoogleClient(settings);
    case 'Custom':
      return new CustomClient(settings);
    default:
      throw new Error(`Unsupported LLM provider: ${settings.provider}`);
  }
}