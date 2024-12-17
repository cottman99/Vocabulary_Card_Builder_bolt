export const LOGGER_CONFIG = {
  MAX_LOGS: 1000, // Maximum number of logs to keep
  AUTO_CLEAR_THRESHOLD: 800, // When to start auto-clearing old logs
  UPDATE_INTERVAL: 100, // Milliseconds between UI updates
  LOG_LEVELS: ['debug', 'info', 'warn', 'error'] as const,
} as const;

export const UI_CONFIG = {
  DEBOUNCE_DELAY: 150, // Milliseconds to wait before applying style changes
  ANIMATION_DURATION: 200, // Milliseconds for transitions
  AUTO_SAVE_INTERVAL: 1000, // Milliseconds between auto-saves
} as const;