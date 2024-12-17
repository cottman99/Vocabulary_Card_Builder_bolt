import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '../../store';
import { logger } from '../../utils/logger/Logger';

interface ImageDropzoneProps {
  className?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ className }) => {
  const { setImage } = useStore();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        logger.image.info('Image uploaded via drag and drop', {
          type: file.type,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`flex flex-col items-center justify-center w-full h-full 
        bg-gray-100/50 rounded-xl border-2 border-dashed border-gray-200 
        transition-all duration-300 hover:border-primary/50 hover:bg-gray-100/70
        ${className}`}
    >
      <div className="p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-float" />
        <h3 className="text-gray-700 font-medium mb-2">Upload an image to begin</h3>
        <p className="text-gray-500 text-sm">
          Drag and drop your image here, or click to browse
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Supports: JPG, PNG, WebP • Max size: 10MB
        </p>
      </div>
    </div>
  );
};