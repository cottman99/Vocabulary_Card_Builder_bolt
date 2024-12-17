import { ImageAnalysisResult } from '../../types';
import { safeJsonParse } from './json';
import { validateBoundingBox, normalizeBoundingBox } from './boundingBox';
import { logger } from '../logger/Logger';

/**
 * Validates a single detection result
 */
function validateDetection(item: any): boolean {
  return (
    item &&
    typeof item === 'object' &&
    item.box_2d &&
    typeof item.label === 'string' &&
    validateBoundingBox(item.box_2d)
  );
}

/**
 * Parses and validates image analysis response
 */
export function parseImageAnalysisResponse(text: string): ImageAnalysisResult[] {
  logger.system.debug('Parsing image analysis response', { text });

  const parsed = safeJsonParse(text);

  if (!Array.isArray(parsed)) {
    logger.system.error('Invalid response format', { parsed });
    throw new Error('Expected array of detection results');
  }

  const results = parsed
    .filter(item => validateDetection(item))
    .map(item => ({
      box_2d: normalizeBoundingBox(item.box_2d),
      label: item.label.trim(),
    }));

  logger.system.debug('Parsed image analysis results', { results });
  return results;
}