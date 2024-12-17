import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="inline-flex items-center">
      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
      <span className="ml-2">Processing...</span>
    </div>
  );
};