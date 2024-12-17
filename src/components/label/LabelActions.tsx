import React from 'react';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface LabelActionsProps {
  onAdd: () => void;
  onRemove: () => void;
  onRegenerate: () => void;
  disabled?: boolean;
}

export const LabelActions: React.FC<LabelActionsProps> = ({
  onAdd,
  onRemove,
  onRegenerate,
  disabled
}) => {
  return (
    <div className="flex gap-2">
      <Tooltip content="Remove label (⌫)">
        <button
          onClick={onRemove}
          disabled={disabled}
          className="btn btn-danger p-2 hover:scale-102 active:scale-98"
          aria-label="Remove label"
        >
          <Minus className="w-5 h-5" />
        </button>
      </Tooltip>
      
      <Tooltip content="Regenerate translations">
        <button
          onClick={onRegenerate}
          disabled={disabled}
          className="btn btn-primary flex-1 p-2 hover:scale-102 active:scale-98"
          aria-label="Regenerate translations"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </Tooltip>
      
      <Tooltip content="Add new label (⌘N)">
        <button
          onClick={onAdd}
          className="btn btn-success p-2 hover:scale-102 active:scale-98"
          aria-label="Add new label"
        >
          <Plus className="w-5 h-5" />
        </button>
      </Tooltip>
    </div>
  );
};