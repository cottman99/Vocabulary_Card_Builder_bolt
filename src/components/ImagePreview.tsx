import React from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '../store';
import { DraggableLabel } from './draggable/DraggableLabel';
import { ImageContainer } from './image/ImageContainer';
import { ImageDropzone } from './image/ImageDropzone';
import { logger } from '../utils/logger/Logger';

export const ImagePreview: React.FC = () => {
  const { image, labels, styleSettings } = useStore();

  React.useEffect(() => {
    logger.label.debug('Labels updated in preview', { 
      count: labels.length,
      labels: labels.map(l => ({ id: l.id, position: l.position }))
    });
  }, [labels]);

  if (!image) {
    return <ImageDropzone className="h-[600px]" />;
  }

  return (
    <div className="relative w-full h-[600px] bg-white rounded-xl shadow-sm overflow-hidden 
      transition-all duration-300 hover:shadow-md group">
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
  );
};