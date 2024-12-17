import { LabelContent } from '../../types';
import { safeJsonParse } from './json';

/**
 * Validates label content structure
 */
function validateLabelContent(content: any): boolean {
  return (
    content &&
    typeof content === 'object' &&
    typeof content.phonetic === 'string' &&
    typeof content.chinese === 'string'
  );
}

/**
 * Parses and validates label content response
 */
export function parseLabelContentResponse(text: string): LabelContent {
  const parsed = safeJsonParse(text);

  if (!validateLabelContent(parsed)) {
    throw new Error('Invalid label content format');
  }

  return {
    phonetic: parsed.phonetic.trim(),
    chinese: parsed.chinese.trim(),
  };
}