import { LogLevel } from './types';
import { LogCategory } from './categories';
import { useLoggerStore } from './store';

export class CategoryLogger {
  constructor(private category: LogCategory) {}

  private log(level: LogLevel, message: string, details?: unknown) {
    const store = useLoggerStore.getState();
    
    store.addLog({
      category: this.category,
      level,
      message,
      details,
      stack: new Error().stack,
    });

    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      const prefix = `[${this.category.toUpperCase()}]`;
      console[level](prefix, message, details || '');
    }
  }

  debug(message: string, details?: unknown) {
    this.log('debug', message, details);
  }

  info(message: string, details?: unknown) {
    this.log('info', message, details);
  }

  warn(message: string, details?: unknown) {
    this.log('warn', message, details);
  }

  error(message: string, details?: unknown) {
    this.log('error', message, details);
  }
}