import React from 'react';
import { LLMProvider } from '../../types';
import { DEFAULT_LLM_SETTINGS } from '../../utils/defaults';

interface ProviderSelectProps {
  value: LLMProvider;
  onChange: (provider: LLMProvider) => void;
}

export const ProviderSelect: React.FC<ProviderSelectProps> = ({
  value,
  onChange,
}) => {
  const providers = Object.keys(DEFAULT_LLM_SETTINGS) as LLMProvider[];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Provider
      </label>
      <div className="grid grid-cols-2 gap-2">
        {providers.map((provider) => (
          <button
            key={provider}
            onClick={() => onChange(provider)}
            className={`px-4 py-3 rounded-lg border-2 transition-all duration-200
              ${value === provider 
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
          >
            <span className="text-sm font-medium">{provider}</span>
          </button>
        ))}
      </div>
    </div>
  );
};