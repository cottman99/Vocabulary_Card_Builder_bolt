import React from 'react';
import { Command } from 'lucide-react';

interface ShortcutHintProps {
  shortcut: string;
}

export const ShortcutHint: React.FC<ShortcutHintProps> = ({ shortcut }) => {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-mono">
      <Command className="w-3 h-3" />
      {shortcut}
    </span>
  );
};