import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store';
import { logger } from '../../utils/logger/Logger';

interface ImageContainerProps {
  src: string;
  onLoad?: () => void;
}

export const ImageContainer: React.FC<ImageContainerProps> = ({ src, onLoad }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setImageSize } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current || !imageRef.current) return;

      const container = containerRef.current;
      const image = imageRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // 计算显示尺寸
      const imageAspectRatio = image.naturalWidth / image.naturalHeight;
      const containerAspectRatio = containerRect.width / containerRect.height;

      let displayWidth = containerRect.width;
      let displayHeight = containerRect.height;
      let scale: number;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspectRatio > containerAspectRatio) {
        // 图片较宽 - 适应宽度
        displayHeight = Math.round(displayWidth / imageAspectRatio);
        scale = displayWidth / image.naturalWidth;
        offsetY = Math.round((containerRect.height - displayHeight) / 2);
      } else {
        // 图片较高 - 适应高度
        displayWidth = Math.round(displayHeight * imageAspectRatio);
        scale = displayHeight / image.naturalHeight;
        offsetX = Math.round((containerRect.width - displayWidth) / 2);
      }

      // 设置完整的尺寸信息
      const dimensions = {
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        displayWidth: Math.round(displayWidth),
        displayHeight: Math.round(displayHeight),
        containerWidth: Math.round(containerRect.width),
        containerHeight: Math.round(containerRect.height),
        alignment: { 
          scale: Number(scale.toFixed(6)), 
          offsetX, 
          offsetY 
        }
      };

      logger.image.debug('Container size updated', {
        container: { 
          width: dimensions.containerWidth, 
          height: dimensions.containerHeight 
        },
        image: { 
          naturalWidth: dimensions.naturalWidth,
          naturalHeight: dimensions.naturalHeight,
          displayWidth: dimensions.displayWidth,
          displayHeight: dimensions.displayHeight
        },
        alignment: dimensions.alignment
      });

      // Convert to ImageSize format
      setImageSize({
        width: dimensions.displayWidth,
        height: dimensions.displayHeight,
        aspectRatio: dimensions.naturalWidth / dimensions.naturalHeight,
        naturalWidth: dimensions.naturalWidth,
        naturalHeight: dimensions.naturalHeight,
        displayWidth: dimensions.displayWidth,
        displayHeight: dimensions.displayHeight,
        containerWidth: dimensions.containerWidth,
        containerHeight: dimensions.containerHeight,
        alignment: dimensions.alignment
      });
      
      onLoad?.();
      setIsLoading(false);
    };

    const image = imageRef.current;
    if (image) {
      if (image.complete) {
        updateSize();
      } else {
        image.addEventListener('load', updateSize);
      }
    }

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      image?.removeEventListener('load', updateSize);
      resizeObserver.disconnect();
    };
  }, [setImageSize, onLoad, src]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full pointer-events-auto bg-gray-50"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary/20 border-t-primary" />
            <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-3 border-primary/10" />
          </div>
        </div>
      )}
      <img
        ref={imageRef}
        src={src}
        alt="Preview"
        className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => {
          logger.image.error('Image failed to load', { src });
        }}
      />
    </div>
  );
};