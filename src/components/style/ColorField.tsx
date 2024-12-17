import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorFieldProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  onClick: () => void;
  isActive: boolean;
}

export const ColorField: React.FC<ColorFieldProps> = ({
  label,
  color,
  onChange,
  onClick,
  isActive,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <button
        type="button"
        onClick={onClick}
        className={`w-full h-12 rounded-lg border-2 transition-all duration-200
          hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50
          ${isActive ? 'border-primary scale-105' : 'border-gray-200'}`}
        style={{ backgroundColor: color }}
      />
      
      {isActive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && onClick()}>
          <div className="bg-white p-4 rounded-xl shadow-xl space-y-4 animate-fade-in">
            <HexColorPicker color={color} onChange={onChange} />
            <button
              onClick={onClick}
              className="w-full btn btn-primary"
            >
              Apply Color
            </button>
          </div>
        </div>
      )}
    </div>
  );
};