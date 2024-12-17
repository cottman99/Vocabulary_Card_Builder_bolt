import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1
        bg-gray-800 text-white text-xs rounded pointer-events-none opacity-0
        group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {content}
        <div className="absolute left-1/2 -translate-x-1/2 top-full
          border-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  );
};