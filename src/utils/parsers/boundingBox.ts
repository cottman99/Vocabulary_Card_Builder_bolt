import { BoundingBox } from '../../types';

/**
 * Validates and normalizes bounding box coordinates
 */
export function validateBoundingBox(box: any): boolean {
  const required = ['xmin', 'ymin', 'xmax', 'ymax'];
  return required.every(prop => typeof box[prop] === 'number');
}

/**
 * Normalizes coordinates to 0-1 range
 */
export function normalizeBoundingBox(box: any): BoundingBox {
  // Handle array format
  if (Array.isArray(box)) {
    box = box[0];
  }

  // Ensure all coordinates exist
  const coords = {
    xmin: Number(box.xmin) || 0,
    ymin: Number(box.ymin) || 0,
    xmax: Number(box.xmax) || 0,
    ymax: Number(box.ymax) || 0,
  };

  // Normalize to 0-1 range
  Object.keys(coords).forEach(key => {
    coords[key] = coords[key] / 1000;
    // Clamp values to valid range
    coords[key] = Math.max(0, Math.min(1, coords[key]));
  });

  // Ensure xmax > xmin and ymax > ymin
  if (coords.xmax <= coords.xmin) coords.xmax = coords.xmin + 0.1;
  if (coords.ymax <= coords.ymin) coords.ymax = coords.ymin + 0.1;

  return coords;
}