import Anthropic from '@anthropic-ai/sdk';
import { LLMClient, ImageAnalysisResult, LabelContent, LLMSettings } from '../../types/llm';

export class AnthropicClient implements LLMClient {
  private client: Anthropic;

  constructor(settings: LLMSettings) {
    this.client = new Anthropic({
      apiKey: settings.apiKey,
      baseURL: settings.apiUrl || 'https://api.anthropic.com',
    });
  }

  async analyzeImage(imageData: string, prompt: string): Promise<ImageAnalysisResult[]> {
    const response = await this.client.messages.create({
      model: 'claude-3-opus-20240229',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image',
              source: {
                type: 'base64',
                data: imageData.split(',')[1],
                media_type: 'image/jpeg',
              },
            },
          ],
        },
      ],
    });

    return JSON.parse(response.content[0].text);
  }

  async generateLabelContent(text: string, prompt: string): Promise<LabelContent> {
    const response = await this.client.messages.create({
      model: 'claude-3-opus-20240229',
      messages: [
        {
          role: 'user',
          content: prompt.replace('{{text}}', text),
        },
      ],
    });

    return JSON.parse(response.content[0].text);
  }
}