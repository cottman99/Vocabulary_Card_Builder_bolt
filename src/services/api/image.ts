import { ImageProcessingError } from './errors';

export function validateImage(imageData: string): void {
  if (!imageData.startsWith('data:image/')) {
    throw new ImageProcessingError('Invalid image format. Please upload a valid image file.');
  }
}

export function calculateBubblePosition(
  box: { xmin: number; xmax: number; ymin: number; ymax: number },
  imageWidth: number,
  imageHeight: number
) {
  try {
    // Calculate center position
    const x = ((box.xmin + box.xmax) / 2) * imageWidth;
    const y = ((box.ymin + box.ymax) / 2) * imageHeight;
    
    // Ensure coordinates are within bounds
    return {
      x: Math.max(0, Math.min(x, imageWidth)),
      y: Math.max(0, Math.min(y, imageHeight)),
    };
  } catch (error) {
    throw new ImageProcessingError('Failed to calculate bubble position. Invalid bounding box coordinates.');
  }
}