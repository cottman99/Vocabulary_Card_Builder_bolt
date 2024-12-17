import React, { useEffect, useCallback } from 'react';
import { useLoggerStore } from '../../utils/logger/store';
import { LOGGER_CONFIG } from '../../config/constants';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { LogEntry } from './LogEntry';

export const DebugPanel: React.FC = () => {
  const {
    filter,
    isVisible,
    setFilter,
    setVisibility,
    clearLogs,
    getFilteredLogs,
  } = useLoggerStore();

  // Debounced update for performance
  const updatePanel = useCallback(() => {
    if (!isVisible) return;
    
    const filteredLogs = getFilteredLogs();
    if (filteredLogs.length > 0) {
      setVisibility(true);
    }
  }, [getFilteredLogs, isVisible, setVisibility]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(updatePanel, LOGGER_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isVisible, updatePanel]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setVisibility(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        Show Debug Logs
      </button>
    );
  }

  const filteredLogs = getFilteredLogs();

  return (
    <div className="fixed bottom-4 right-4 w-[800px] h-[500px] bg-white rounded-lg shadow-xl p-4 overflow-hidden">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="space-y-4 flex-1">
          <SearchBar
            value={filter.search}
            onChange={(search) => setFilter({ search })}
          />
          <FilterBar
            levelFilter={filter.level}
            categoryFilter={filter.category}
            onLevelChange={(level) => setFilter({ level })}
            onCategoryChange={(category) => setFilter({ category })}
          />
        </div>
        
        <div className="space-x-2">
          <button
            onClick={clearLogs}
            className="text-red-500 hover:text-red-600"
          >
            Clear
          </button>
          <button
            onClick={() => setVisibility(false)}
            className="text-gray-500 hover:text-gray-600"
          >
            Hide
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-8rem)] overflow-auto">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No logs to display
          </div>
        ) : (
          filteredLogs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))
        )}
      </div>
    </div>
  );
};