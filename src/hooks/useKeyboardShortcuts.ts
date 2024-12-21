import { useEffect } from 'react';
import { useStore } from '../store';
import { logger } from '../utils/logger/Logger';

export function useKeyboardShortcuts() {
  const { selectedLabelId, removeLabel, addLabel } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Delete' || (e.key === 'Backspace' && e.metaKey)) {
        if (selectedLabelId) {
          removeLabel(selectedLabelId);
          logger.ui.info('Label deleted via keyboard shortcut', { labelId: selectedLabelId });
        }
      }

      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        addLabel({
          id: String(Date.now()),
          sourceLanguage: 'New Label',
          phonetic: '',
          targetLanguage: '',
          position: { x: 100, y: 100 }
        });
        logger.ui.info('New label added via keyboard shortcut');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLabelId, removeLabel, addLabel]);
}