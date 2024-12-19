import React, { useState } from 'react';
import { X, Download, Image, FileJson, Crop, AlertCircle } from 'lucide-react';
import { useImageExport } from '../../hooks/useImageExport';
import { logger } from '../../utils/logger/Logger';
import { ExportPreview } from './ExportPreview';

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
  const [showPreview, setShowPreview] = useState(false);
  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const exportOptions: ExportOption[] = [
    {
      id: 'image',
      label: 'Export as Image',
      description: 'Save the current view as a PNG image with labels',
      icon: <Image className="w-5 h-5" />,
      action: exportAsImage,
    },
    {
      id: 'json',
      label: 'Export as JSON',
      description: 'Save vocabulary data and positions as JSON file',
      icon: <FileJson className="w-5 h-5" />,
      action: exportAsJson,
    },
  ];

  const handleExport = async (option: ExportOption) => {
    if (option.id === 'image') {
      setShowPreview(true);
      setSelectedOption(option.id);
      return;
    }

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

  const handleSelectionChange = (newSelection: { x: number; y: number; width: number; height: number } | null) => {
    setSelection(newSelection);
  };

  const handleConfirmExport = async () => {
    if (!selectedOption) return;

    setIsExporting(true);
    try {
      await exportAsImage(selection);
      logger.system.info('Export completed', { type: selectedOption, selection });
      document.getElementById('exportModal')?.close();
    } catch (error) {
      logger.system.error('Export failed', {
        type: selectedOption,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsExporting(false);
      setSelectedOption(null);
      setShowPreview(false);
      setSelection(null);
    }
  };

  const handleClose = () => {
    setShowPreview(false);
    setSelection(null);
    setSelectedOption(null);
    document.getElementById('exportModal')?.close();
  };

  const isExportDisabled = () => {
    return isExporting;
  };

  const getExportButtonText = () => {
    if (isExporting) return 'Exporting...';
    if (!showPreview) return 'Export';
    return selection ? 'Export Selection' : 'Export Full Image';
  };

  return (
    <dialog
      id="exportModal"
      className="modal p-6 rounded-xl shadow-xl bg-white max-w-3xl w-full
        backdrop-blur-lg backdrop-saturate-150 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Export Project</h2>
          <p className="text-sm text-gray-500 mt-1">
            {showPreview ? 'Preview and customize export area' : 'Choose an export format'}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {showPreview ? (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Export Preview</p>
                <p className="text-blue-600">
                  The exported image will include all vocabulary labels and annotations.
                  You can select a specific area or export the entire view.
                </p>
              </div>
            </div>
          </div>

          <ExportPreview onSelectionChange={handleSelectionChange} />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={() => {
                setShowPreview(false);
                setSelection(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800
                transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirmExport}
              disabled={isExportDisabled()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg
                transition-all duration-200 flex items-center gap-2
                ${isExportDisabled()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 active:scale-95'
                }`}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{getExportButtonText()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </dialog>
  );
};