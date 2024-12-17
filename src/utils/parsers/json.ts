import { logger } from '../logger/Logger';

export function cleanJsonString(text: string): string {
  // Remove markdown code blocks first
  let cleaned = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, '$1');
  
  // Clean up whitespace and formatting
  cleaned = cleaned
    .trim()
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

  return cleaned;
}

export function safeJsonParse(text: string): any {
  try {
    const cleanedText = cleanJsonString(text);
    return JSON.parse(cleanedText);
  } catch (firstError) {
    logger.system.warn('Initial JSON parse failed', { error: firstError.message });
    
    try {
      // Fix common JSON syntax issues
      const fixed = text
        .replace(/\n/g, '')
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/([{[,:])\s*([^"'\d\[{].*?)\s*([},\]])/g, '$1"$2"$3')
        .replace(/'/g, '"');
      
      return JSON.parse(fixed);
    } catch (secondError) {
      logger.system.error('JSON parse failed after cleanup', { 
        error: secondError.message,
        originalText: text
      });
      throw new Error(`Failed to parse JSON: ${secondError.message}`);
    }
  }
}