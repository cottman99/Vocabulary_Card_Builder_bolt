import React from 'react';

interface LabelFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LabelField: React.FC<LabelFieldProps> = ({
  label,
  value,
  onChange,
  placeholder
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">
        {label}
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          {value.length > 0 ? `${value.length} chars` : 'Empty'}
        </span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input bg-white/50 hover:bg-white focus:bg-white transition-all
          duration-200 hover:shadow-sm focus:shadow-md focus:ring-2"
      />
    </div>
  );
};