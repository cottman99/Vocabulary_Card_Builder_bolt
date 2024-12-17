import React, { useState } from 'react';
import { X, Download, Image, FileJson } from 'lucide-react';
import { useImageExport } from '../../hooks/useImageExport';
import { logger } from '../../utils/logger/Logger';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => Promise<void>;
}

export const ExportModal: React.FC = () => {
  const { exportAsImage, exportAsJson } = useImageExport();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const exportOptions: ExportOption[] = [
    {
      id: 'image',
      label: 'Export as Image',
      description: 'Save the current view as a PNG image',
      icon: <Image className="w-5 h-5" />,
      action: exportAsImage,
    },
    {
      id: 'json',
      label: 'Export as JSON',
      description: 'Save label data and positions as JSON',
      icon: <FileJson className="w-5 h-5" />,
      action: exportAsJson,
    },
  ];

  const handleExport = async (option: ExportOption) => {
    setIsExporting(true);
    setSelectedOption(option.id);
    
    try {
      await option.action();
      logger.system.info('Export completed', { type: option.id });
      document.getElementById('exportModal')?.close();
    } catch (error) {
      logger.system.error('Export failed', { 
        type: option.id,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsExporting(false);
      setSelectedOption(null);
    }
  };

  return (
    <dialog
      id="exportModal"
      className="modal p-6 rounded-xl shadow-xl bg-white max-w-md w-full
        backdrop-blur-lg backdrop-saturate-150 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Export Project</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose an export format
          </p>
        </div>
        <button
          onClick={() => document.getElementById('exportModal')?.close()}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {exportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleExport(option)}
            disabled={isExporting}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all
              duration-200 hover:border-primary/50 hover:bg-gray-50 group
              ${selectedOption === option.id ? 'border-primary bg-primary/5' : 'border-gray-200'}
              ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 text-gray-600
                group-hover:bg-primary/10 group-hover:text-primary transition-colors
                ${selectedOption === option.id ? 'bg-primary/10 text-primary' : ''}`}>
                {option.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-primary">
                  {option.label}
                </div>
                <div className="text-sm text-gray-500">
                  {option.description}
                </div>
              </div>
              <Download className={`w-5 h-5 ml-auto text-gray-400
                group-hover:text-primary transition-colors
                ${selectedOption === option.id ? 'text-primary' : ''}`} />
            </div>
          </button>
        ))}
      </div>
    </dialog>
  );
};