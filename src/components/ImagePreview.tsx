import React from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '../store';
import { DraggableLabel } from './draggable/DraggableLabel';
import { ImageContainer } from './image/ImageContainer';
import { ImageDropzone } from './image/ImageDropzone';
import { logger } from '../utils/logger/Logger';

export const ImagePreview: React.FC = () => {
  const { image, labels, styleSettings, imageSize } = useStore();

  React.useEffect(() => {
    logger.label.debug('Labels updated in preview', { 
      count: labels.length,
      labels: labels.map(l => ({ id: l.id, position: l.position }))
    });
  }, [labels]);

  if (!image) {
    return <ImageDropzone className="h-[400pX]" />;
  }

  const containerStyle = imageSize ? (() => {
    const aspectRatio = imageSize ? imageSize.naturalWidth / imageSize.naturalHeight : 16/9;
    return {
        width: aspectRatio >= 16/9 ? '100%' : 'auto',
        height: aspectRatio >= 16/9 ? 'auto' : '100%',
        aspectRatio: aspectRatio,
    }
    
})() : {
    width: '100%',
    height: '600pX'
};


return (
  // 外层容器 浅灰色 圆角 投影 鼠标悬浮阴影
  <div 
    id="outer-container" 
    className="bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
    style={{
      display: 'flex', 
      flexGrow: 1, 
      flexShrink: 1, 
      aspectRatio: 16 / 9,
      width: '100%', // 确保容器宽度占满可用空间
      height: '100%', // 确保容器高度占满可用空间
      maxHeight: '600px',
      position: 'relative',
    }}
  >
    {/* 居中 */}
    <div id="inner-container" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        id="image-preview"
        className="relative bg-white rounded-none shadow-sm overflow-hidden 
          transition-all duration-300 hover:shadow-md group"
        style={containerStyle}
      >
        <div className="absolute inset-0">
          <ImageContainer src={image} />
        </div>
        
        <div className="absolute inset-0 transition-opacity duration-300 
          group-hover:bg-black/5">
          {labels.map((label) => (
            <DraggableLabel
              key={label.id}
              label={label}
              styleSettings={styleSettings}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

};
