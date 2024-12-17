import { LLMSettings, ImageAnalysisResult, LabelContent } from '../../types';
import { createLLMClient } from '../llm/factory';
import { validateLLMSettings } from './validation';
import { validateImage, calculateBubblePosition } from './image';
import { APIError } from './errors';

export async function analyzeImage(
  imageData: string,
  settings: LLMSettings,
  prompt: string
): Promise<ImageAnalysisResult[]> {
  try {
    validateLLMSettings(settings);
    validateImage(imageData);

    const client = createLLMClient(settings);
    const results = await client.analyzeImage(imageData, prompt);

    if (!Array.isArray(results)) {
      throw new APIError('Invalid response format from LLM API');
    }

    return results;
  } catch (error) {
    if (error instanceof Error) {
      throw new APIError(`Image analysis failed: ${error.message}`, error);
    }
    throw new APIError('Image analysis failed with an unknown error');
  }
}

export async function generateLabelContent(
  text: string,
  settings: LLMSettings,
  prompt: string
): Promise<LabelContent> {
  try {
    validateLLMSettings(settings);

    const client = createLLMClient(settings);
    const content = await client.generateLabelContent(text, prompt);

    if (!content?.phonetic || !content?.chinese) {
      throw new APIError('Invalid label content format from LLM API');
    }

    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new APIError(`Label generation failed: ${error.message}`, error);
    }
    throw new APIError('Label generation failed with an unknown error');
  }
}

export { calculateBubblePosition } from './image';