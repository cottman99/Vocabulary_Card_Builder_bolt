import { toPng } from 'html-to-image';
import { useStore } from '../store';
import { logger } from '../utils/logger/Logger';

export function useImageExport() {
  const { labels, image, styleSettings } = useStore();

  const exportAsImage = async () => {
    try {
      const element = document.getElementById('image-preview');
      if (!element) {
        logger.system.error('Export failed: Preview element not found');
        throw new Error('Preview element not found');
      }

      const dataUrl = await toPng(element);
      logger.system.debug('Image generated', { size: dataUrl.length });
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.download = `vocabulary-card-${Date.now()}.png`;
      link.href = dataUrl;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      logger.system.info('Image exported successfully');
      
      return true;
    } catch (error) {
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
        labels: labels.map(({ id, english, phonetic, chinese, position }) => ({
          id,
          english,
          phonetic,
          chinese,
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

  return { exportAsImage, exportAsJson };
}