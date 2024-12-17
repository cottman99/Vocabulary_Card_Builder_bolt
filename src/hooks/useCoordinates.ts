import { useCallback } from 'react';
import { useStore } from '../store';
import { CoordinateService } from '../utils/coordinates/service';
import { Coordinates, CoordinateSpace } from '../utils/coordinates/types';
import { logger } from '../utils/logger/Logger';

export function useCoordinates() {
  const { imageSize } = useStore();
  const coordinateService = new CoordinateService();

  const handleDragStop = useCallback((labelId: string, displayCoords: Coordinates) => {
    if (!imageSize) {
      logger.image.warn('Cannot update coordinates - image size not available');
      return displayCoords;
    }

    // 验证图像尺寸信息是否完整
    if (!imageSize.naturalWidth || !imageSize.naturalHeight || 
        !imageSize.displayWidth || !imageSize.displayHeight ||
        !imageSize.containerWidth || !imageSize.containerHeight) {
      logger.image.error('Incomplete image dimensions', { imageSize });
      return displayCoords;
    }

    try {
      // 添加详细的测试日志
      logger.image.debug('Drag position update test', {
        input: {
          displayCoords,
          dimensions: imageSize
        }
      });

      // 更新拖拽位置（转换到图像坐标空间）
      const imageCoords = coordinateService.updateDragPosition(
        displayCoords,
        imageSize,
        CoordinateSpace.IMAGE
      );

      // 记录转换结果
      logger.image.debug('Coordinate conversion test', {
        input: displayCoords,
        output: imageCoords,
        scale: imageSize.displayWidth / imageSize.naturalWidth,
        aspectRatio: {
          natural: imageSize.naturalWidth / imageSize.naturalHeight,
          display: imageSize.displayWidth / imageSize.displayHeight
        }
      });

      logger.image.debug('Label coordinates updated', {
        labelId,
        display: displayCoords,
        image: imageCoords
      });

      return imageCoords;
    } catch (error) {
      logger.image.error('Failed to update coordinates', {
        error: error instanceof Error ? error.message : String(error),
        labelId,
        displayCoords
      });
      
      // 发生错误时返回原始坐标
      return {
        x: displayCoords.x,
        y: displayCoords.y,
        space: displayCoords.space
      };
    }
  }, [imageSize]);

  return { handleDragStop };
}