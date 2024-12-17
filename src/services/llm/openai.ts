import OpenAI from 'openai';
import { LLMClient, ImageAnalysisResult, LabelContent, LLMSettings } from '../../types/llm';

export class OpenAIClient implements LLMClient {
  private client: OpenAI;

  constructor(settings: LLMSettings) {
    this.client = new OpenAI({
      apiKey: settings.apiKey,
      baseURL: settings.apiUrl || 'https://api.openai.com/v1',
    });
  }

  async analyzeImage(imageData: string, prompt: string): Promise<ImageAnalysisResult[]> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
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
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content || '[]');
  }

  async generateLabelContent(text: string, prompt: string): Promise<LabelContent> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt.replace('{{text}}', text),
        },
      ],
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}