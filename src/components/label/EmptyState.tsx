import React from 'react';
import { MousePointer2 } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MousePointer2 className="w-6 h-6 text-primary" />
      </div>
      <p className="text-gray-600 font-medium">Select a label to edit</p>
      <p className="text-gray-400 text-sm mt-2">
        Click on any label in the image
      </p>
    </div>
  );
};