import { 
  CoordinateSpace, 
  Coordinates, 
  ImageDimensions, 
  BoundingBox,
  ImageAlignment,
  ValidationConfig
} from './types';
import { CoordinateError } from './errors';
import { logger } from '../logger/Logger';

export class CoordinateService {
  // 验证图像尺寸
  private validateDimensions(dimensions: ImageDimensions): void {
    // 检查所有必需的尺寸属性是否存在
    const requiredProps = [
      'naturalWidth',
      'naturalHeight',
      'displayWidth',
      'displayHeight',
      'containerWidth',
      'containerHeight'
    ];

    const missingProps = requiredProps.filter(prop => 
      typeof dimensions[prop] !== 'number' || isNaN(dimensions[prop])
    );

    if (missingProps.length > 0) {
      logger.image.error('Missing or invalid dimension properties', {
        missingProps,
        dimensions
      });
      throw CoordinateError.invalidDimensions(dimensions);
    }

    // 检查所有尺寸是否为正数
    const invalidProps = requiredProps.filter(prop => dimensions[prop] <= 0);

    if (invalidProps.length > 0) {
      logger.image.error('Non-positive dimension values', {
        invalidProps,
        dimensions
      });
      throw CoordinateError.invalidDimensions(dimensions);
    }

    // 验证对齐信息（如果存在）
    if (dimensions.alignment) {
      const { scale, offsetX, offsetY } = dimensions.alignment;
      if (typeof scale !== 'number' || isNaN(scale) || scale <= 0) {
        logger.image.error('Invalid alignment scale', {
          scale,
          dimensions
        });
        throw CoordinateError.invalidDimensions(dimensions);
      }

      if (typeof offsetX !== 'number' || isNaN(offsetX) ||
          typeof offsetY !== 'number' || isNaN(offsetY)) {
        logger.image.error('Invalid alignment offsets', {
          offsetX,
          offsetY,
          dimensions
        });
        throw CoordinateError.invalidDimensions(dimensions);
      }
    }
  }

  // 验证坐标
  private validateCoordinates(
    coords: Coordinates,
    dimensions: ImageDimensions,
    config: ValidationConfig = {}
  ): Coordinates {
    // 验证坐标完整性
    if (typeof coords.x !== 'number' || isNaN(coords.x) ||
        typeof coords.y !== 'number' || isNaN(coords.y) ||
        !coords.space) {
      logger.image.error('Invalid coordinate values', { coords });
      throw CoordinateError.invalidCoordinates(coords);
    }

    // 根据坐标空间获取边界
    const bounds = coords.space === CoordinateSpace.IMAGE
      ? { width: dimensions.naturalWidth, height: dimensions.naturalHeight }
      : { width: dimensions.displayWidth, height: dimensions.displayHeight };

    // 检查是否超出边界
    const isOutOfBounds = coords.x < 0 || coords.x > bounds.width || 
                         coords.y < 0 || coords.y > bounds.height;

    if (isOutOfBounds && !config.allowOutOfBounds) {
      if (config.clampToEdge) {
        return {
          x: Math.max(0, Math.min(bounds.width, coords.x)),
          y: Math.max(0, Math.min(bounds.height, coords.y)),
          space: coords.space
        };
      }
      logger.image.error('Coordinates out of bounds', {
        coords,
        bounds,
        dimensions
      });
      throw CoordinateError.outOfBounds(coords, dimensions);
    }

    return coords;
  }

  // 计算图像对齐信息
  private calculateAlignment(dimensions: ImageDimensions): ImageAlignment {
    const containerAspectRatio = dimensions.containerWidth / dimensions.containerHeight;
    const imageAspectRatio = dimensions.naturalWidth / dimensions.naturalHeight;
    
    let scale: number;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspectRatio > containerAspectRatio) {
      scale = dimensions.containerWidth / dimensions.naturalWidth;
      offsetY = (dimensions.containerHeight - (dimensions.naturalHeight * scale)) / 2;
    } else {
      scale = dimensions.containerHeight / dimensions.naturalHeight;
      offsetX = (dimensions.containerWidth - (dimensions.naturalWidth * scale)) / 2;
    }

    logger.image.debug('Image alignment calculated', {
      dimensions,
      alignment: { scale, offsetX, offsetY }
    });

    return { scale, offsetX, offsetY };
  }

  // 坐标空间转换
  public convertCoordinates(
    coords: Coordinates,
    dimensions: ImageDimensions,
    targetSpace: CoordinateSpace
  ): Coordinates {
    this.validateDimensions(dimensions);
    this.validateCoordinates(coords, dimensions);

    if (coords.space === targetSpace) {
      return coords;
    }

    const alignment = dimensions.alignment || this.calculateAlignment(dimensions);

    if (coords.space === CoordinateSpace.IMAGE && targetSpace === CoordinateSpace.DISPLAY) {
      // 图像坐标 -> 显示坐标
      const x = (coords.x * alignment.scale) + alignment.offsetX;
      const y = (coords.y * alignment.scale) + alignment.offsetY;

      logger.image.debug('Converted to display coordinates', {
        from: coords,
        to: { x, y, space: targetSpace },
        dimensions
      });

      return { x, y, space: targetSpace };
    } else if (coords.space === CoordinateSpace.DISPLAY && targetSpace === CoordinateSpace.IMAGE) {
      // 显示坐标 -> 图像坐标
      const x = (coords.x - alignment.offsetX) / alignment.scale;
      const y = (coords.y - alignment.offsetY) / alignment.scale;

      logger.image.debug('Converted to image coordinates', {
        from: coords,
        to: { x, y, space: targetSpace },
        dimensions
      });

      return { x, y, space: targetSpace };
    }

    throw CoordinateError.conversionFailed(coords.space, targetSpace, coords);
  }

  // 计算气泡位置
  public calculateBubblePosition(
    box: BoundingBox,
    dimensions: ImageDimensions,
    targetSpace: CoordinateSpace = CoordinateSpace.DISPLAY
  ): Coordinates {
    this.validateDimensions(dimensions);

    // 计算图像空间中的中心点
    const imageCoords: Coordinates = {
      x: ((box.xmin + box.xmax) / 2) * dimensions.naturalWidth,
      y: ((box.ymin + box.ymax) / 2) * dimensions.naturalHeight,
      space: CoordinateSpace.IMAGE
    };

    // 验证并可能调整坐标
    const validatedImageCoords = this.validateCoordinates(
      imageCoords,
      dimensions,
      { clampToEdge: true }
    );

    // 如果目标是显示空间，进行转换
    if (targetSpace === CoordinateSpace.DISPLAY) {
      return this.convertCoordinates(validatedImageCoords, dimensions, targetSpace);
    }

    return validatedImageCoords;
  }

  // 更新拖拽位置
  public updateDragPosition(
    coords: Coordinates,
    dimensions: ImageDimensions,
    targetSpace: CoordinateSpace = CoordinateSpace.IMAGE
  ): Coordinates {
    this.validateDimensions(dimensions);

    // 验证输入坐标
    const validatedCoords = this.validateCoordinates(
      coords,
      dimensions,
      { clampToEdge: true }
    );

    // 如果需要转换空间
    if (coords.space !== targetSpace) {
      return this.convertCoordinates(validatedCoords, dimensions, targetSpace);
    }

    return validatedCoords;
  }
} 