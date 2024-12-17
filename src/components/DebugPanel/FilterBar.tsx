import React from 'react';
import { LogLevel } from '../../utils/logger/types';
import { LogCategory, CATEGORY_CONFIG } from '../../utils/logger/categories';
import { LOGGER_CONFIG } from '../../config/constants';

interface FilterBarProps {
  levelFilter: LogLevel | 'all';
  categoryFilter: LogCategory | 'all';
  onLevelChange: (level: LogLevel | 'all') => void;
  onCategoryChange: (category: LogCategory | 'all') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  levelFilter,
  categoryFilter,
  onLevelChange,
  onCategoryChange,
}) => {
  return (
    <div className="flex gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">Level</label>
        <div className="flex gap-1">
          {(['all', ...LOGGER_CONFIG.LOG_LEVELS] as const).map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              className={`px-2 py-1 text-xs rounded ${
                levelFilter === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">Category</label>
        <div className="flex gap-1">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-2 py-1 text-xs rounded ${
              categoryFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            all
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category as LogCategory)}
              className={`px-2 py-1 text-xs rounded ${
                categoryFilter === category
                  ? `bg-${config.color}-500 text-white`
                  : `bg-${config.color}-50 hover:bg-${config.color}-100 text-${config.color}-700`
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};