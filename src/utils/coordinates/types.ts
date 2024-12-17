// 坐标空间枚举
export enum CoordinateSpace {
  IMAGE = 'image',
  DISPLAY = 'display'
}

// 基础坐标类型
export interface Coordinates {
  x: number;
  y: number;
  space: CoordinateSpace;
}

// 边界框类型
export interface BoundingBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

// 图像对齐信息
export interface ImageAlignment {
  scale: number;
  offsetX: number;
  offsetY: number;
}

// 图像尺寸类型
export interface ImageDimensions {
  // 原始尺寸
  naturalWidth: number;
  naturalHeight: number;
  
  // 显示尺寸
  displayWidth: number;
  displayHeight: number;
  
  // 容器尺寸
  containerWidth: number;
  containerHeight: number;
  
  // 对齐信息（避免重复计算）
  alignment?: ImageAlignment;
}

// 验证配置
export interface ValidationConfig {
  allowOutOfBounds?: boolean;
  clampToEdge?: boolean;
}