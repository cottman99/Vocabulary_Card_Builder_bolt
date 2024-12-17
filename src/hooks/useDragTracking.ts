import { useCallback } from 'react';
import { DraggableEvent } from 'react-draggable';
import { logger } from '../utils/logger/Logger';

export function useDragTracking() {
  const trackDragStart = useCallback((labelId: string, event: DraggableEvent) => {
    const { clientX, clientY } = event as MouseEvent;
    logger.label.debug('Drag tracking started', {
      labelId,
      startPosition: { x: clientX, y: clientY }
    });
  }, []);

  const trackDragEnd = useCallback((labelId: string, position: { x: number; y: number }) => {
    logger.label.debug('Drag tracking ended', {
      labelId,
      endPosition: position
    });
  }, []);

  return { trackDragStart, trackDragEnd };
}