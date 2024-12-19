import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { Crop, Maximize2, Minimize2, Move } from 'lucide-react';
import { useImageExport } from '../../hooks/useImageExport';

interface ExportPreviewProps {
  onSelectionChange?: (selection: { x: number; y: number; width: number; height: number } | null) => void;
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({ onSelectionChange }) => {
  const { generatePreviewImage } = useImageExport();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [isFullPreview, setIsFullPreview] = useState(true);

  // 最小选择区域尺寸
  const MIN_SELECTION_SIZE = 100;

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const dataUrl = await generatePreviewImage();
        setPreviewImage(dataUrl);
      } catch (error) {
        console.error('Failed to generate preview:', error);
      }
    };
    loadPreview();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPreviewDimensions({ width, height });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || isFullPreview) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsSelecting(true);
    setSelection({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !containerRef.current || !selection || isFullPreview) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);

    setSelection(prev => ({
      ...prev!,
      endX: x,
      endY: y,
    }));
  };

  const handleMouseUp = () => {
    if (!selection || !isSelecting) return;
    
    const width = Math.abs(selection.endX - selection.startX);
    const height = Math.abs(selection.endY - selection.startY);
    
    if (width < MIN_SELECTION_SIZE || height < MIN_SELECTION_SIZE) {
      setSelection(null);
      onSelectionChange?.(null);
    } else {
      const x = Math.min(selection.startX, selection.endX);
      const y = Math.min(selection.startY, selection.endY);
      onSelectionChange?.({ x, y, width, height });
    }
    
    setIsSelecting(false);
  };

  const getSelectionStyle = () => {
    if (!selection) return {};

    const x = Math.min(selection.startX, selection.endX);
    const y = Math.min(selection.startY, selection.endY);
    const width = Math.abs(selection.endX - selection.startX);
    const height = Math.abs(selection.endY - selection.startY);

    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const getSelectionDimensions = () => {
    if (!selection) return null;
    return {
      width: Math.round(Math.abs(selection.endX - selection.startX)),
      height: Math.round(Math.abs(selection.endY - selection.startY)),
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Export Preview
          </span>
        </div>
        <button
          onClick={() => {
            setIsFullPreview(prev => !prev);
            setSelection(null);
            onSelectionChange?.(null);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium
            text-gray-600 hover:text-gray-900 transition-colors rounded-md
            hover:bg-gray-100 border border-gray-200"
        >
          {isFullPreview ? (
            <>
              <Crop className="w-3.5 h-3.5" />
              <span>Enable Selection</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Preview</span>
            </>
          )}
        </button>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-lg bg-gray-100 border-2
            transition-colors duration-200 ${
              isFullPreview
                ? 'border-transparent'
                : 'border-dashed border-gray-300 hover:border-primary/50'
            }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto object-contain"
            />
          )}

          {!isFullPreview && !selection && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg
                shadow-sm text-sm text-gray-600">
                <Move className="w-4 h-4" />
                <span>Click and drag to select an area</span>
              </div>
            </div>
          )}
          
          {selection && !isFullPreview && (
            <>
              <div
                className="absolute border-2 border-primary bg-primary/5
                  shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] backdrop-blur-[2px]"
                style={getSelectionStyle()}
              >
                {/* 选择区域尺寸指示器 */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2
                  bg-white px-2 py-1 rounded-md shadow-sm text-xs font-medium
                  text-gray-600 whitespace-nowrap border border-gray-200">
                  {getSelectionDimensions()?.width} × {getSelectionDimensions()?.height} px
                </div>
              </div>
            </>
          )}
        </div>

        {!isFullPreview && (
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              {selection
                ? `Selected area: ${getSelectionDimensions()?.width} × ${getSelectionDimensions()?.height} px`
                : `Minimum selection size: ${MIN_SELECTION_SIZE}×${MIN_SELECTION_SIZE} px`}
            </span>
            {selection && (
              <button
                onClick={() => {
                  setSelection(null);
                  onSelectionChange?.(null);
                }}
                className="px-2 py-1 text-primary hover:text-primary/80
                  hover:bg-primary/5 rounded transition-colors"
              >
                Clear Selection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 