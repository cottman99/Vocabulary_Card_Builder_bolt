import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMClient, ImageAnalysisResult, LabelContent, LLMSettings } from '../../types/llm';
import { APIError } from '../api/errors';
import { parseImageAnalysisResponse, parseLabelContentResponse } from '../../utils/parsers/index';
import { logger } from '../../utils/logger/Logger';

export class GoogleClient implements LLMClient {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(settings: LLMSettings) {
    this.client = new GoogleGenerativeAI(settings.apiKey);
    this.model = settings.model;
    logger.llm.info('GoogleClient initialized', { model: settings.model });
  }

  async analyzeImage(imageData: string, prompt: string): Promise<ImageAnalysisResult[]> {
    try {
      logger.llm.debug('Analyzing image with Gemini', { prompt });
      
      const model = this.client.getGenerativeModel({ model: this.model });

      const result = await model.generateContent([
        {
          inlineData: {
            data: imageData.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        prompt,
      ]);

      const text = result.response.text();
      logger.llm.debug('Raw Gemini response', { text });

      const parsed = parseImageAnalysisResponse(text);
      logger.llm.info('Image analysis completed', { 
        detectionCount: parsed.length 
      });

      return parsed;
    } catch (error) {
      logger.llm.error('Image analysis failed', { error });
      throw new APIError(`Failed to analyze image: ${error.message}`);
    }
  }

  async generateLabelContent(text: string, prompt: string): Promise<LabelContent> {
    try {
      logger.llm.debug('Generating label content', { text, prompt });
      
      const model = this.client.getGenerativeModel({ model: this.model });

      const result = await model.generateContent([
        prompt.replace('{{text}}', text),
      ]);

      const responseText = result.response.text();
      logger.llm.debug('Raw Gemini response', { responseText });

      const parsed = parseLabelContentResponse(responseText);
      logger.llm.info('Label content generated', { parsed });

      return parsed;
    } catch (error) {
      logger.llm.error('Label generation failed', { error });
      throw new APIError(`Failed to generate label content: ${error.message}`);
    }
  }
}