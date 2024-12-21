import { LLMSettings } from '../types/llm';

export const DEFAULT_IMAGE_ANALYSIS_PROMPT = 
  'Detect {{param1}} in the image, with no more than 20 items. For each detected item, provide a JSON object with: 1) "box_2d" containing normalized coordinates (between 0-1000) for the bounding box with fields "xmin", "ymin", "xmax", "ymax", and 2) a {{param2}} in the "label" field using the {{sourceLanguage}} language. Return ONLY a JSON array of these objects, with no additional text or formatting.';

export const DEFAULT_LABEL_GENERATION_PROMPT = 
  'For the {{sourceLanguage}} text "{{text}}", generate a JSON object with: 1) "phonetic" field containing {{phonetic}} pronunciation for the {{sourceLanguage}} text, and 2) "targetLanguage" field containing Simplified {{targetLanguage}} translation. Return ONLY the JSON object, with no additional text or formatting.';

export const DEFAULT_PROMPT_PARAMS = {
  param1: 'objects and items',
  param2: 'descriptive label',
};

export const DEFAULT_LANGUAGE_PARAMS = {
  sourceLanguage: 'English',
  targetLanguage: 'Chinese',
  phonetic: 'IPA',
};

export const DEFAULT_LLM_SETTINGS: Record<string, LLMSettings> = {
  OpenAI: {
    provider: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4-vision-preview',
  },
  Anthropic: {
    provider: 'Anthropic',
    apiUrl: 'https://api.anthropic.com',
    apiKey: '',
    model: 'claude-3-opus-20240229',
  },
  Google: {
    provider: 'Google',
    apiUrl: 'https://generativelanguage.googleapis.com',
    apiKey: '',
    model: 'gemini-1.5-pro',
  },
  Custom: {
    provider: 'Custom',
    apiUrl: 'https://api.openai.com/v1', // Default to OpenAI-compatible endpoint
    apiKey: '',
    model: 'gpt-4-vision-preview',
  },
};