export type LLMProvider = 'OpenAI' | 'Anthropic' | 'Google' | 'Custom';

export interface LLMSettings {
  provider: LLMProvider;
  apiUrl: string;
  apiKey: string;
  model: string;
}

export interface LLMResponse {
  text: string;
}

export interface ImageAnalysisResult {
  box_2d: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
  label: string;
}

export interface LabelContent {
  phonetic: string;
  targetLanguage: string;
}

export interface LLMClient {
  analyzeImage(imageData: string, prompt: string): Promise<ImageAnalysisResult[]>;
  generateLabelContent(text: string, prompt: string): Promise<LabelContent>;
}