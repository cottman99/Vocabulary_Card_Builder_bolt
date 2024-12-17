import { LLMClient, ImageAnalysisResult, LabelContent, LLMSettings } from '../../types/llm';
import { APIError } from '../api/errors';
import { parseImageAnalysisResponse, parseLabelContentResponse } from '../../utils/parsers/index';
import { handleApiResponse } from '../api/response';
import { logger } from '../../utils/logger/Logger';

export class CustomClient implements LLMClient {
  private settings: LLMSettings;

  constructor(settings: LLMSettings) {
    this.settings = settings;
  }

  async analyzeImage(imageData: string, prompt: string): Promise<ImageAnalysisResult[]> {
    try {
      logger.llm.info('Starting image analysis', { prompt });

      const response = await fetch(`${this.settings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.settings.apiKey}`,
        },
        body: JSON.stringify({
          model: this.settings.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData,
                  },
                },
              ],
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      const data = await handleApiResponse(response, 'Image Analysis');
      logger.llm.debug('Parsed API response', { data });

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        logger.llm.error('Empty API response content', { data });
        throw new Error('Empty response from API');
      }

      logger.llm.debug('Raw LLM response', { content });

      const results = parseImageAnalysisResponse(content);
      logger.llm.info('Image analysis completed', { 
        detectionCount: results.length,
        results 
      });
      
      return results;
    } catch (error) {
      logger.llm.error('Image analysis failed', { 
        error: error.message,
        stack: error.stack
      });
      throw new APIError(`Custom API error: ${error.message}`);
    }
  }

  async generateLabelContent(text: string, prompt: string): Promise<LabelContent> {
    try {
      logger.llm.info('Generating label content', { text, prompt });

      const response = await fetch(`${this.settings.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.settings.apiKey}`,
        },
        body: JSON.stringify({
          model: this.settings.model,
          messages: [
            {
              role: 'user',
              content: prompt.replace('{{text}}', text),
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      const data = await handleApiResponse(response, 'Label Generation');
      logger.llm.debug('Parsed API response', { data });

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        logger.llm.error('Empty API response content', { data });
        throw new Error('Empty response from API');
      }

      logger.llm.debug('Raw LLM response', { content });

      const result = parseLabelContentResponse(content);
      logger.llm.info('Label content generated', { result });
      
      return result;
    } catch (error) {
      logger.llm.error('Label generation failed', {
        error: error.message,
        stack: error.stack
      });
      throw new APIError(`Custom API error: ${error.message}`);
    }
  }
}