import React from 'react';
import { Upload, Play } from 'lucide-react';
import { useStore } from '../store';
import { LoadingSpinner } from './LoadingSpinner';
import { useImageUpload } from '../hooks/useImageUpload';
import { useImageAnalysis } from '../hooks/useImageAnalysis';

export const ImageControls: React.FC = () => {
  const { promptParams, setPromptParams } = useStore();
  const { handleImageUpload, isUploading } = useImageUpload();
  const { handleAnalysis, isAnalyzing } = useImageAnalysis();

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className={`btn ${isUploading ? 'btn-secondary' : 'btn-primary'}`}
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </label>
        
        <button
          onClick={handleAnalysis}
          className="btn btn-success"
          disabled={isAnalyzing || isUploading}
        >
          {isAnalyzing ? (
            <LoadingSpinner />
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Analysis
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="param1" className="label">
            Detection Parameter
          </label>
          <input
            id="param1"
            type="text"
            placeholder="e.g., objects and items"
            value={promptParams.param1}
            onChange={(e) =>
              setPromptParams({ ...promptParams, param1: e.target.value })
            }
            className="input"
          />
        </div>
        
        <div>
          <label htmlFor="param2" className="label">
            Label Parameter
          </label>
          <input
            id="param2"
            type="text"
            placeholder="e.g., descriptive label"
            value={promptParams.param2}
            onChange={(e) =>
              setPromptParams({ ...promptParams, param2: e.target.value })
            }
            className="input"
          />
        </div>
      </div>
    </div>
  );
};