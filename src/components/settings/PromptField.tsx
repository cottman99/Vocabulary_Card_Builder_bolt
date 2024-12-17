import React from 'react';

interface PromptFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PromptField: React.FC<PromptFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none
          focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-colors duration-200 placeholder:text-gray-400"
      />
    </div>
  );
};