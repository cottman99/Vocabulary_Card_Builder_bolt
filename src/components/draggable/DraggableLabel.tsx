import React, { useRef, useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Label } from '../../types';
import { useStore } from '../../store';
import { useCoordinates } from '../../hooks/useCoordinates';
import { logger } from '../../utils/logger/Logger';
import { useDragTracking } from '../../hooks/useDragTracking';
import { CoordinateSpace } from '../../utils/coordinates/types';

interface DraggableLabelProps {
  label: Label;
  styleSettings: {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export const DraggableLabel: React.FC<DraggableLabelProps> = ({ 
  label, 
  styleSettings 
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { updateLabel, selectedLabelId, setSelectedLabelId, imageSize } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const { trackDragStart, trackDragEnd } = useDragTracking();
  const { handleDragStop: updateCoordinates } = useCoordinates();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (nodeRef.current) {
      const { width, height } = nodeRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      logger.label.debug('Label mounted', {
        labelId: label.id,
        width,
        height,
        position: label.position
      });
    }
  }, [label.id, label.position, label.english, label.chinese, label.phonetic]);

  const getBubblePosition = () => {
    return {
      x: label.position.x - (dimensions.width / 2),
      y: label.position.y - (dimensions.height / 2)
    };
  };

  const handleDragStart = (e: DraggableEvent) => {
    setIsDragging(true);
    trackDragStart(label.id, e);
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!isDragging) return;

    const centerPosition = {
      x: data.x + (dimensions.width / 2),
      y: data.y + (dimensions.height / 2)
    };

    requestAnimationFrame(() => {
      updateLabel(label.id, { position: centerPosition });
    });
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    const centerPosition = {
      x: data.x + (dimensions.width / 2),
      y: data.y + (dimensions.height / 2)
    };

    requestAnimationFrame(() => {
      setIsDragging(false);
      updateLabel(label.id, { position: centerPosition });
    });

    logger.label.debug('Label drag ended', {
      labelId: label.id,
      oldPosition: label.position,
      newPosition: centerPosition,
      dragData: data,
      dimensions
    });
  };

  const isSelected = selectedLabelId === label.id;
  const position = getBubblePosition();

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
      grid={[1, 1]}
      scale={1}
      defaultClassName="draggable-label"
      defaultClassNameDragging="dragging"
      defaultClassNameDragged="dragged"
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move select-none
          ${isSelected ? 'ring-2 ring-primary z-50' : 'z-20'}
          ${isDragging ? 'opacity-90' : ''}`}
        style={{
          border: `2px solid ${styleSettings.borderColor}`,
          backgroundColor: styleSettings.backgroundColor,
          color: styleSettings.textColor,
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: isDragging
            ? '0 8px 16px rgba(0,0,0,0.12)'
            : '0 4px 6px rgba(0,0,0,0.06)',
          maxWidth: '200px',
          minWidth: '120px',
          backdropFilter: 'blur(8px)',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'all 0.2s',
          willChange: 'transform'
        }}
        onClick={() => {
          setSelectedLabelId(label.id);
          logger.label.debug('Label selected', { 
            labelId: label.id,
            dimensions
          });
        }}
      >
        <div className="font-bold text-sm mb-1">{label.english}</div>
        <div className="text-xs font-mono opacity-75">{label.phonetic}</div>
        <div className="text-xs mt-1 font-medium">{label.chinese}</div>
      </div>
    </Draggable>
  );
};