import { CoordinateSpace, Coordinates, ImageDimensions } from './types';
import { logger } from '../logger/Logger';

// 错误代码枚举
export enum CoordinateErrorCode {
  INVALID_DIMENSIONS = 'INVALID_DIMENSIONS',
  INVALID_COORDINATES = 'INVALID_COORDINATES',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  OUT_OF_BOUNDS = 'OUT_OF_BOUNDS',
  INVALID_SPACE = 'INVALID_SPACE',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}

// 基础坐标错误类
export class CoordinateError extends Error {
  constructor(
    message: string,
    public code: CoordinateErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'CoordinateError';

    // 记录错误
    logger.image.error(message, {
      code,
      details,
      stack: this.stack
    });
  }

  static invalidDimensions(dimensions: Partial<ImageDimensions>): CoordinateError {
    const missingProps = [];
    const invalidProps = [];

    ['naturalWidth', 'naturalHeight', 'displayWidth', 'displayHeight', 'containerWidth', 'containerHeight'].forEach(prop => {
      if (!(prop in dimensions)) {
        missingProps.push(prop);
      } else if (typeof dimensions[prop] !== 'number' || isNaN(dimensions[prop])) {
        invalidProps.push(prop);
      } else if (dimensions[prop] <= 0) {
        invalidProps.push(`${prop} (non-positive)`);
      }
    });

    let message = 'Invalid image dimensions provided';
    if (missingProps.length > 0) {
      message += `\nMissing properties: ${missingProps.join(', ')}`;
    }
    if (invalidProps.length > 0) {
      message += `\nInvalid properties: ${invalidProps.join(', ')}`;
    }

    return new CoordinateError(
      message,
      CoordinateErrorCode.INVALID_DIMENSIONS,
      { dimensions, missingProps, invalidProps }
    );
  }

  static invalidCoordinates(coords: Partial<Coordinates>): CoordinateError {
    const issues = [];
    if (typeof coords.x !== 'number' || isNaN(coords.x)) {
      issues.push('invalid x coordinate');
    }
    if (typeof coords.y !== 'number' || isNaN(coords.y)) {
      issues.push('invalid y coordinate');
    }
    if (!coords.space) {
      issues.push('missing coordinate space');
    }

    return new CoordinateError(
      `Invalid coordinates provided: ${issues.join(', ')}`,
      CoordinateErrorCode.INVALID_COORDINATES,
      { coordinates: coords, issues }
    );
  }

  static conversionFailed(
    from: CoordinateSpace,
    to: CoordinateSpace,
    coords: Coordinates
  ): CoordinateError {
    return new CoordinateError(
      `Failed to convert coordinates from ${from} to ${to} space`,
      CoordinateErrorCode.CONVERSION_FAILED,
      { from, to, coordinates: coords }
    );
  }

  static outOfBounds(
    coords: Coordinates,
    dimensions: ImageDimensions
  ): CoordinateError {
    const bounds = coords.space === CoordinateSpace.IMAGE
      ? { width: dimensions.naturalWidth, height: dimensions.naturalHeight }
      : { width: dimensions.displayWidth, height: dimensions.displayHeight };

    return new CoordinateError(
      `Coordinates are out of bounds for ${coords.space} space`,
      CoordinateErrorCode.OUT_OF_BOUNDS,
      { coordinates: coords, bounds, dimensions }
    );
  }

  static invalidSpace(
    expected: CoordinateSpace,
    received: CoordinateSpace
  ): CoordinateError {
    return new CoordinateError(
      `Invalid coordinate space: expected ${expected}, received ${received}`,
      CoordinateErrorCode.INVALID_SPACE,
      { expected, received }
    );
  }

  static validationFailed(
    coords: Coordinates,
    reason: string
  ): CoordinateError {
    return new CoordinateError(
      `Coordinate validation failed: ${reason}`,
      CoordinateErrorCode.VALIDATION_FAILED,
      { coordinates: coords }
    );
  }
} 