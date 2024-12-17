import { useStore } from '../store';
import { useToast } from './useToast';
import { analyzeImage, generateLabelContent } from '../services/api/index';
import { APIError, LLMConfigError, ImageProcessingError } from '../services/api/errors';
import { logger } from '../utils/logger/Logger';
import { CoordinateService } from '../utils/coordinates/service';
import { CoordinateSpace } from '../utils/coordinates/types';
import { CoordinateError } from '../utils/coordinates/errors';

export function useImageAnalysis() {
  const {
    image,
    imageSize,
    promptParams,
    setLabels,
    llmSettings,
    promptSettings,
    isAnalyzing,
    setIsAnalyzing,
  } = useStore();

  const { showToast } = useToast();
  const coordinateService = new CoordinateService();

  const handleAnalysis = async () => {
    if (!image || !imageSize) {
      logger.ui.warn('Analysis attempted without image', { hasImage: !!image, hasSize: !!imageSize });
      showToast('Please upload an image first', 'error');
      return;
    }

    // 验证图像尺寸信息是否完整
    if (!imageSize.naturalWidth || !imageSize.naturalHeight || 
        !imageSize.displayWidth || !imageSize.displayHeight ||
        !imageSize.containerWidth || !imageSize.containerHeight) {
      logger.image.error('Incomplete image dimensions', { imageSize });
      showToast('Image dimensions are not properly initialized', 'error');
      return;
    }

    setIsAnalyzing(true);
    logger.image.info('Starting image analysis', { imageSize, promptParams });

    try {
      // Replace prompt parameters
      const analysisPrompt = promptSettings.imageAnalysis
        .replace('{{param1}}', promptParams.param1)
        .replace('{{param2}}', promptParams.param2);

      logger.llm.debug('Prepared analysis prompt', { analysisPrompt });

      // Analyze image
      const detectionResults = await analyzeImage(
        image,
        llmSettings,
        analysisPrompt
      );

      logger.llm.info('Image analysis completed', { 
        detectionCount: detectionResults.length,
        results: detectionResults 
      });

      // Process each detection
      const labelPromises = detectionResults.map(async (result, index) => {
        logger.label.debug('Processing detection', { index, result });

        try {
          // 计算气泡位置（直接获取显示坐标）
          const displayPosition = coordinateService.calculateBubblePosition(
            result.box_2d,
            imageSize,
            CoordinateSpace.DISPLAY
          );

          // 添加详细的测试日志
          logger.label.debug('Coordinate calculation test', {
            input: {
              box: result.box_2d,
              dimensions: imageSize
            },
            output: {
              displayPosition,
              normalizedCenter: {
                x: (result.box_2d.xmin + result.box_2d.xmax) / 2,
                y: (result.box_2d.ymin + result.box_2d.ymax) / 2
              }
            }
          });

          // Generate label content
          const content = await generateLabelContent(
            result.label,
            llmSettings,
            promptSettings.labelGeneration
          );

          return {
            id: String(index + 1),
            english: result.label,
            phonetic: content.phonetic,
            chinese: content.chinese,
            position: {
              x: displayPosition.x,
              y: displayPosition.y
            },
            boundingBox: {
              x: result.box_2d.xmin * imageSize.naturalWidth,
              y: result.box_2d.ymin * imageSize.naturalHeight,
              width: (result.box_2d.xmax - result.box_2d.xmin) * imageSize.naturalWidth,
              height: (result.box_2d.ymax - result.box_2d.ymin) * imageSize.naturalHeight,
            },
          };
        } catch (error) {
          logger.label.error('Failed to process detection', {
            error: error instanceof Error ? error.message : String(error),
            detection: result
          });
          throw error;
        }
      });

      const labels = await Promise.all(labelPromises);
      logger.label.info('Labels generated', { 
        count: labels.length,
        labels: labels.map(l => ({ id: l.id, english: l.english, position: l.position }))
      });
      
      setLabels(labels);
      showToast('Analysis completed successfully', 'success');
    } catch (error) {
      let message = 'An unexpected error occurred';
      
      if (error instanceof LLMConfigError) {
        message = error.message;
        logger.llm.error('LLM configuration error', { error: error.message });
      } else if (error instanceof ImageProcessingError) {
        message = error.message;
        logger.image.error('Image processing error', { error: error.message });
      } else if (error instanceof APIError) {
        message = error.message;
        logger.api.error('API error', { error: error.message, details: error.details });
      } else if (error instanceof CoordinateError) {
        message = error.message;
        logger.image.error('Coordinate error', { error: error.message, code: error.code });
      } else {
        logger.system.error('Unexpected error during analysis', { 
          error: error instanceof Error ? error.message : String(error)
        });
      }
      
      showToast(message, 'error');
    } finally {
      setIsAnalyzing(false);
      logger.image.info('Analysis process completed');
    }
  };

  return { handleAnalysis, isAnalyzing };
}