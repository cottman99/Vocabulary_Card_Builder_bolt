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
    return <ImageDropzone/>;
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
    height: 'auto',
    maxHeight: '600px'
  };

  return (
    <div 
      id="outer-container" 
      className="bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-grow flex-shrink aspect-w-16 aspect-h-9 w-full h-full max-h-screen relative"
      //最大高度为屏幕高度0.7
      style={{ maxHeight: '60vh' }}
    >
      <div id="inner-container" className="flex flex-grow justify-center items-center">
        <div 
          id="image-preview"
          className="relative bg-white rounded-none shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group"
          style={containerStyle}
        >
          <div className="absolute inset-0">
            <ImageContainer src={image} />
          </div>
          
          <div className="absolute inset-0 transition-opacity duration-300 group-hover:bg-black/5">
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
