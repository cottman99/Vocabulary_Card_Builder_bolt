import { useState } from 'react';
import { useStore } from '../store';

// 最大容器高度（像素）
const MAX_CONTAINER_HEIGHT = 600;

export function useImageUpload() {
  const { setImage, setImageSize } = useStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // 创建图片对象以获取原始尺寸
        const img = new Image();
        img.onload = () => {
          // 计算容器尺寸，保持宽高比
          const aspectRatio = img.width / img.height;
          let containerHeight = Math.min(MAX_CONTAINER_HEIGHT, img.height);
          let containerWidth = Math.round(containerHeight * aspectRatio);
          
          // 设置容器尺寸
          // 使用实际尺寸填充 ImageSize 对象
          const imageSize = {
            width: img.width,
            height: img.height,
            aspectRatio,
            naturalWidth: img.width,
            naturalHeight: img.height,
            displayWidth: containerWidth,
            displayHeight: containerHeight,
            containerWidth,
            containerHeight,
            alignment: {
              scale: 1, // 如果需要，可以计算缩放
              offsetX: 0, // 如果需要，可以计算偏移
              offsetY: 0  // 如果需要，可以计算偏移
            }
          };
          
          // 设置容器尺寸
          setImageSize(imageSize);
          
          setImage(dataUrl);
          setIsUploading(false);
        };
        img.src = dataUrl;
      };
      
      reader.onerror = () => {
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  return { handleImageUpload, isUploading };
}