import { toPng } from 'html-to-image';
import { useStore } from '../store';
import { logger } from '../utils/logger/Logger';

interface ExportSelection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useImageExport() {
  const { labels, image, styleSettings } = useStore();

  const generatePreviewImage = async () => {
    const element = document.getElementById('image-preview');
    if (!element) {
      throw new Error('Preview element not found');
    }
    return await toPng(element);
  };

  const exportAsImage = async (selection?: ExportSelection | null) => {
    try {
      // 首先生成完整的预览图像
      const previewDataUrl = await generatePreviewImage();
      
      // 获取预览图像的实际尺寸
      const previewImg = new Image();
      await new Promise((resolve, reject) => {
        previewImg.onload = resolve;
        previewImg.onerror = reject;
        previewImg.src = previewDataUrl;
      });
      
      console.log('Debug - Export dimensions:', {
        previewWidth: previewImg.width,
        previewHeight: previewImg.height,
        selection: selection,
        containerWidth: document.getElementById('image-preview')?.offsetWidth,
        containerHeight: document.getElementById('image-preview')?.offsetHeight,
      });

      // 如果有选择区域，创建一个临时canvas来裁剪
      if (selection) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // 设置canvas尺寸为选择区域大小
        canvas.width = selection.width;
        canvas.height = selection.height;

        console.log('Debug - Canvas and Image:', {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          imageWidth: previewImg.width,
          imageHeight: previewImg.height,
          selectionX: selection.x,
          selectionY: selection.y,
          selectionWidth: selection.width,
          selectionHeight: selection.height
        });

        // 使用选择区域的坐标进行裁剪
        // 注意：此时的 selection 坐标已经是基于实际图像尺寸的
        ctx.drawImage(
          previewImg,
          selection.x,
          selection.y,
          selection.width,
          selection.height,
          0,
          0,
          selection.width,
          selection.height
        );

        // 转换为数据URL
        const croppedDataUrl = canvas.toDataURL('image/png');
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `vocabulary-card-cropped-${Date.now()}.png`;
        link.href = croppedDataUrl;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
      }

      // 如果没有选择区域，直接导出完整预览图像
      const link = document.createElement('a');
      link.download = `vocabulary-card-${Date.now()}.png`;
      link.href = previewDataUrl;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      logger.system.error('Image export failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  };

  const exportAsJson = async () => {
    try {
      const data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        image: image ? {
          type: image.split(';')[0].split('/')[1],
          size: image.length,
        } : null,
        styleSettings,
        labels: labels.map(({ id, sourceLanguage, phonetic, targetLanguage, position }) => ({
          id,
          sourceLanguage,
          phonetic,
          targetLanguage,
          position,
        })),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `vocabulary-data-${Date.now()}.json`;
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.system.info('JSON exported successfully', { 
        labelCount: labels.length 
      });
      
      return true;
    } catch (error) {
      logger.system.error('JSON export failed', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  };

  return { exportAsImage, exportAsJson, generatePreviewImage };
}