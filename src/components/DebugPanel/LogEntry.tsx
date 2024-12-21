import React from 'react';
import { LogEntry as LogEntryType } from '../../utils/logger/types';
import { CATEGORY_CONFIG } from '../../utils/logger/categories';

interface LogEntryProps {
  log: LogEntryType;
}

export const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const levelColors = {
    error: 'bg-red-50 text-red-700',
    warn: 'bg-yellow-50 text-yellow-700',
    info: 'bg-blue-50 text-blue-700',
    debug: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className={`mb-2 p-2 rounded animate-fade-in ${levelColors[log.level]}`}>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{log.level}</span>
          <span className={`px-1.5 py-0.5 rounded text-xs bg-${CATEGORY_CONFIG[log.category].color}-100 text-${CATEGORY_CONFIG[log.category].color}-700`}>
            {CATEGORY_CONFIG[log.category].label}
          </span>
        </div>
        <span className="text-gray-500">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <div className="mt-1">{log.message}</div>
      
      {log.details && (
        <pre className="mt-1 text-xs bg-black/5 p-2 rounded overflow-x-auto">
          {JSON.stringify(log.details as string, null, 2)}
        </pre>
      )}
      
      {log.stack && log.level === 'error' && (
        <pre className="mt-1 text-xs text-red-600 bg-red-50 p-2 rounded overflow-x-auto">
          {log.stack}
        </pre>
      )}
    </div>
  );
};