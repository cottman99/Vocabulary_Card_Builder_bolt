import { LogCategory } from './categories';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  category: LogCategory;
  level: LogLevel;
  message: string;
  details?: unknown;
  stack?: string;
}

export interface LoggerConfig {
  maxLogs: number;
  autoClearThreshold: number;
  updateInterval: number;
  isDevelopment: boolean;
}

export interface LogFilter {
  category: LogCategory | 'all';
  level: LogLevel | 'all';
  search: string;
}