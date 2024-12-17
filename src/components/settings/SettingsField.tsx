import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from '../label/Tooltip';

interface SettingsFieldProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

export const SettingsField: React.FC<SettingsFieldProps> = ({
  label,
  tooltip,
  children,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
          <Tooltip content={tooltip}>
            <div className="cursor-help">
              <Info className="w-4 h-4 text-gray-400" />
            </div>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
};