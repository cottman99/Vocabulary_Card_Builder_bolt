import React, { useState, useRef, useEffect, useReducer } from 'react';
import { Crop } from 'lucide-react';
import { useImageExport } from '../../hooks/useImageExport';

// Types
interface ScaleInfo {
  scaleX: number;
  scaleY: number;
  imageWidth: number;
  imageHeight: number;
}

interface ViewportCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectionState {
  viewport: ViewportCoords | null;
  image: ViewportCoords | null;
  mode: 'idle' | 'creating' | 'moving' | 'resizing';
  activeHandle: null | 'top' | 'right' | 'bottom' | 'left' | 
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'move';
  dragStart: { x: number; y: number } | null;
}

type SelectionAction = 
  | { type: 'START_SELECTION'; payload: { x: number; y: number } }
  | { type: 'UPDATE_SELECTION'; payload: { x: number; y: number } }
  | { type: 'END_SELECTION' }
  | { type: 'START_MOVE'; payload: { x: number; y: number } }
  | { type: 'MOVE_SELECTION'; payload: { x: number; y: number } }
  | { type: 'END_MOVE' }
  | { type: 'START_RESIZE'; payload: { handle: SelectionState['activeHandle']; x: number; y: number } }
  | { type: 'RESIZE_SELECTION'; payload: { x: number; y: number } }
  | { type: 'END_RESIZE' }
  | { type: 'CLEAR_SELECTION' };

interface ExportPreviewProps {
  onSelectionChange?: (selection: ViewportCoords | null) => void;
}

// Constants
const MIN_SELECTION_SIZE = 50;
const HANDLE_SIZE = 8;

// Selection Reducer
function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case 'START_SELECTION':
      return {
        ...state,
        mode: 'creating',
        dragStart: action.payload,
        viewport: {
          x: action.payload.x,
          y: action.payload.y,
          width: 0,
          height: 0
        },
        image: null
      };

    case 'UPDATE_SELECTION': {
      if (!state.viewport || !state.dragStart) return state;

      const width = action.payload.x - state.dragStart.x;
      const height = action.payload.y - state.dragStart.y;

      return {
        ...state,
        viewport: {
          x: width > 0 ? state.dragStart.x : action.payload.x,
          y: height > 0 ? state.dragStart.y : action.payload.y,
          width: Math.abs(width),
          height: Math.abs(height)
        }
      };
    }

    case 'START_MOVE':
      return {
        ...state,
        mode: 'moving',
        dragStart: action.payload,
        activeHandle: 'move'
      };

    case 'MOVE_SELECTION': {
      if (!state.viewport || !state.dragStart) return state;

      const dx = action.payload.x - state.dragStart.x;
      const dy = action.payload.y - state.dragStart.y;

      return {
        ...state,
        viewport: {
          ...state.viewport,
          x: state.viewport.x + dx,
          y: state.viewport.y + dy
        },
        dragStart: action.payload
      };
    }

    case 'START_RESIZE':
      return {
        ...state,
        mode: 'resizing',
        dragStart: action.payload,
        activeHandle: action.payload.handle
      };

    case 'RESIZE_SELECTION': {
      if (!state.viewport || !state.dragStart || !state.activeHandle) return state;

      let { x, y, width, height } = state.viewport;
      const dx = action.payload.x - state.dragStart.x;
      const dy = action.payload.y - state.dragStart.y;

      switch (state.activeHandle) {
        case 'top-left':
          width -= dx;
          height -= dy;
          x += dx;
          y += dy;
          break;
        case 'top-right':
          width += dx;
          height -= dy;
          y += dy;
          break;
        case 'bottom-left':
          width -= dx;
          height += dy;
          x += dx;
          break;
        case 'bottom-right':
          width += dx;
          height += dy;
          break;
        case 'top':
          height -= dy;
          y += dy;
          break;
        case 'right':
          width += dx;
          break;
        case 'bottom':
          height += dy;
          break;
        case 'left':
          width -= dx;
          x += dx;
          break;
      }

      // 确保选区不小于最小尺寸
      if (width < MIN_SELECTION_SIZE) {
        width = MIN_SELECTION_SIZE;
        x = state.viewport.x;
      }
      if (height < MIN_SELECTION_SIZE) {
        height = MIN_SELECTION_SIZE;
        y = state.viewport.y;
      }

      return {
        ...state,
        viewport: { x, y, width, height },
        dragStart: action.payload
      };
    }

    case 'END_SELECTION':
    case 'END_MOVE':
    case 'END_RESIZE':
      return {
        ...state,
        mode: 'idle',
        dragStart: null,
        activeHandle: null
      };

    case 'CLEAR_SELECTION':
      return {
        viewport: null,
        image: null,
        mode: 'idle',
        activeHandle: null,
        dragStart: null
      };

    default:
      return state;
  }
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({ onSelectionChange }) => {
  const { generatePreviewImage } = useImageExport();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scaleInfo, setScaleInfo] = useState<ScaleInfo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selection, dispatch] = useReducer(selectionReducer, {
    viewport: null,
    image: null,
    mode: 'idle',
    activeHandle: null,
    dragStart: null
  });

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
    if (previewImage && containerRef.current) {
      const img = new Image();
      img.onload = () => {
        const container = containerRef.current;
        if (container) {
          const scaleX = img.width / container.offsetWidth;
          const scaleY = img.height / container.offsetHeight;
          setScaleInfo({
            scaleX,
            scaleY,
            imageWidth: img.width,
            imageHeight: img.height
          });
          console.log('Debug - Scale Info:', {
            containerWidth: container.offsetWidth,
            containerHeight: container.offsetHeight,
            imageWidth: img.width,
            imageHeight: img.height,
            scaleX,
            scaleY
          });
        }
      };
      img.src = previewImage;
    }
  }, [previewImage]);

  const convertToImageCoordinates = (viewportSelection: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    if (!scaleInfo) return viewportSelection;

    return {
      x: Math.round(viewportSelection.x * scaleInfo.scaleX),
      y: Math.round(viewportSelection.y * scaleInfo.scaleY),
      width: Math.round(viewportSelection.width * scaleInfo.scaleX),
      height: Math.round(viewportSelection.height * scaleInfo.scaleY)
    };
  };

  const getMousePosition = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    return {
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    const pos = getMousePosition(e);
    
    // 检查是否点击了调整手柄或选区
    if (selection.viewport) {
      const handle = getActiveHandle(pos.x, pos.y);
      if (handle) {
        dispatch({ type: 'START_RESIZE', payload: { handle, x: pos.x, y: pos.y } });
        return;
      }
      
      if (isInsideSelection(pos.x, pos.y)) {
        dispatch({ type: 'START_MOVE', payload: { x: pos.x, y: pos.y } });
        return;
      }
    }
    
    dispatch({ type: 'START_SELECTION', payload: { x: pos.x, y: pos.y } });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current || selection.mode === 'idle') return;

    const pos = getMousePosition(e);
    
    switch (selection.mode) {
      case 'creating':
        dispatch({ type: 'UPDATE_SELECTION', payload: { x: pos.x, y: pos.y } });
        break;
      case 'moving':
        dispatch({ type: 'MOVE_SELECTION', payload: { x: pos.x, y: pos.y } });
        break;
      case 'resizing':
        dispatch({ type: 'RESIZE_SELECTION', payload: { x: pos.x, y: pos.y } });
        break;
    }
  };

  const handleMouseUp = () => {
    if (selection.mode === 'idle') return;
    
    switch (selection.mode) {
      case 'creating':
        dispatch({ type: 'END_SELECTION' });
        break;
      case 'moving':
        dispatch({ type: 'END_MOVE' });
        break;
      case 'resizing':
        dispatch({ type: 'END_RESIZE' });
        break;
    }
    
    if (selection.viewport) {
      const imageCoords = convertToImageCoordinates(selection.viewport);
      onSelectionChange?.(imageCoords);
    }
  };

  const getActiveHandle = (x: number, y: number) => {
    if (!selection.viewport) return null;

    const { x: sx, y: sy, width, height } = selection.viewport;
    const handleSize = HANDLE_SIZE;
    const half = handleSize / 2;

    // 检查八个调整手柄
    const handles: Array<[string, number, number]> = [
      ['top-left', sx, sy],
      ['top-right', sx + width, sy],
      ['bottom-left', sx, sy + height],
      ['bottom-right', sx + width, sy + height],
      ['top', sx + width / 2, sy],
      ['right', sx + width, sy + height / 2],
      ['bottom', sx + width / 2, sy + height],
      ['left', sx, sy + height / 2]
    ];

    for (const [handle, hx, hy] of handles) {
      if (
        x >= hx - half &&
        x <= hx + half &&
        y >= hy - half &&
        y <= hy + half
      ) {
        return handle as SelectionState['activeHandle'];
      }
    }

    return null;
  };

  const isInsideSelection = (x: number, y: number) => {
    if (!selection.viewport) return false;

    const { x: sx, y: sy, width, height } = selection.viewport;
    return x >= sx && x <= sx + width && y >= sy && y <= sy + height;
  };

  const getCursorStyle = () => {
    if (!selection.viewport) return 'crosshair';

    switch (selection.activeHandle) {
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize';
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'left':
      case 'right':
        return 'ew-resize';
      case 'move':
        return 'move';
      default:
        return isInsideSelection(
          selection.dragStart?.x || 0,
          selection.dragStart?.y || 0
        )
          ? 'move'
          : 'crosshair';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Crop className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Export Preview
        </span>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg bg-gray-100 border-2 border-dashed
            border-gray-300 hover:border-primary/50 transition-colors duration-200"
          style={{ cursor: getCursorStyle() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto object-contain select-none"
              draggable={false}
            />
          )}

          {selection.viewport && (
            <>
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              <div
                className="absolute border-2 border-white bg-transparent"
                style={{
                  left: `${selection.viewport.x}px`,
                  top: `${selection.viewport.y}px`,
                  width: `${selection.viewport.width}px`,
                  height: `${selection.viewport.height}px`,
                }}
              >
                {/* Resize handles */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right',
                  'top', 'right', 'bottom', 'left'].map(handle => (
                  <div
                    key={handle}
                    className="absolute w-2 h-2 bg-white border border-gray-400
                      rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      ...getHandlePosition(handle, selection.viewport!),
                      cursor: getHandleCursor(handle)
                    }}
                  />
                ))}
                
                {/* Size indicator */}
                <div
                  className="absolute px-2 py-1 bg-black/75 text-white text-xs
                    rounded-md transform -translate-x-1/2"
                  style={{
                    left: '50%',
                    top: '-25px'
                  }}
                >
                  {Math.round(selection.viewport.width)} × {Math.round(selection.viewport.height)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            {selection.viewport
              ? `Selection: ${Math.round(selection.viewport.width)} × ${Math.round(selection.viewport.height)} px`
              : 'Click and drag to select an area'}
          </span>
          {selection.viewport && (
            <button
              onClick={() => {
                dispatch({ type: 'CLEAR_SELECTION' });
                onSelectionChange?.(null);
              }}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getHandlePosition(handle: string, viewport: ViewportCoords) {
  const { width, height } = viewport;
  switch (handle) {
    case 'top-left': return { left: '0%', top: '0%' };
    case 'top-right': return { left: '100%', top: '0%' };
    case 'bottom-left': return { left: '0%', top: '100%' };
    case 'bottom-right': return { left: '100%', top: '100%' };
    case 'top': return { left: '50%', top: '0%' };
    case 'right': return { left: '100%', top: '50%' };
    case 'bottom': return { left: '50%', top: '100%' };
    case 'left': return { left: '0%', top: '50%' };
    default: return {};
  }
}

function getHandleCursor(handle: string) {
  switch (handle) {
    case 'top-left':
    case 'bottom-right':
      return 'nwse-resize';
    case 'top-right':
    case 'bottom-left':
      return 'nesw-resize';
    case 'top':
    case 'bottom':
      return 'ns-resize';
    case 'left':
    case 'right':
      return 'ew-resize';
    default:
      return 'move';
  }
} 