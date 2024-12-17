import { create } from 'zustand';
import { LogEntry, LogFilter } from './types';
import { LogCategory } from './categories';
import { LOGGER_CONFIG } from '../../config/constants';

interface LoggerState {
  logs: LogEntry[];
  filter: LogFilter;
  isVisible: boolean;
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  setFilter: (filter: Partial<LogFilter>) => void;
  setVisibility: (visible: boolean) => void;
  getFilteredLogs: () => LogEntry[];
}

export const useLoggerStore = create<LoggerState>((set, get) => ({
  logs: [],
  filter: {
    category: 'all',
    level: 'all',
    search: '',
  },
  isVisible: false,

  addLog: (entry) => {
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    set((state) => {
      let logs = [newLog, ...state.logs];
      
      if (logs.length > LOGGER_CONFIG.AUTO_CLEAR_THRESHOLD) {
        logs = logs.slice(0, LOGGER_CONFIG.MAX_LOGS);
      }
      
      return { logs };
    });
  },

  clearLogs: () => set({ logs: [] }),
  
  setFilter: (newFilter) => set((state) => ({
    filter: { ...state.filter, ...newFilter }
  })),
  
  setVisibility: (isVisible) => set({ isVisible }),
  
  getFilteredLogs: () => {
    const { logs, filter } = get();
    
    return logs.filter(log => {
      if (filter.category !== 'all' && log.category !== filter.category) {
        return false;
      }
      
      if (filter.level !== 'all' && log.level !== filter.level) {
        return false;
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          log.message.toLowerCase().includes(searchLower) ||
          JSON.stringify(log.details).toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  },
}));