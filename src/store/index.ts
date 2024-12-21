import { create } from 'zustand';
import { Label, LLMSettings, PromptSettings, StyleSettings } from '../types';
import { DEFAULT_IMAGE_ANALYSIS_PROMPT, DEFAULT_LABEL_GENERATION_PROMPT, DEFAULT_PROMPT_PARAMS, DEFAULT_LANGUAGE_PARAMS } from '../utils/defaults';
import { logger } from '../utils/logger/Logger';

interface ImageSize {
  width: number;
  height: number;
  aspectRatio: number;
  naturalWidth: number;
  naturalHeight: number;
  displayWidth: number;
  displayHeight: number;
  containerWidth: number;
  containerHeight: number;
  alignment?: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
}

interface State {
  image: string | null;
  imageSize: ImageSize | null;
  labels: Label[];
  selectedLabelId: string | null;
  llmSettings: LLMSettings;
  promptSettings: PromptSettings;
  styleSettings: StyleSettings;
  promptParams: {
    param1: string;
    param2: string;
  };
  languageParams: {
    sourceLanguage: string;
    targetLanguage: string;
    phonetic: string;
  };
  isAnalyzing: boolean;
  setImage: (image: string | null) => void;
  setImageSize: (size: ImageSize | null) => void;
  setLabels: (labels: Label[]) => void;
  addLabel: (label: Label) => void;
  removeLabel: (id: string) => void;
  updateLabel: (id: string, label: Partial<Label>) => void;
  setSelectedLabelId: (id: string | null) => void;
  setLLMSettings: (settings: LLMSettings) => void;
  setPromptSettings: (settings: PromptSettings) => void;
  setStyleSettings: (settings: StyleSettings) => void;
  setPromptParams: (params: { param1: string; param2: string }) => void;
  setLanguageParams: (params: { sourceLanguage: string; targetLanguage: string; phonetic: string }) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
}

export const useStore = create<State>((set) => ({
  image: null,
  imageSize: null,
  labels: [],
  selectedLabelId: null,
  llmSettings: {
    provider: 'Custom',
    apiUrl: 'https://aihubmix.com/v1',
    apiKey: 'sk-XKGh0k2Q3JiKDPyo9fA4612c41B94dFcA5891eA366C0Cc82',
    model: 'gemini-1.5-flash',
  },
  promptSettings: {
    imageAnalysis: DEFAULT_IMAGE_ANALYSIS_PROMPT,
    labelGeneration: DEFAULT_LABEL_GENERATION_PROMPT,
  },
  styleSettings: {
    borderColor: '#FF4444',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  promptParams: DEFAULT_PROMPT_PARAMS,
  languageParams: DEFAULT_LANGUAGE_PARAMS,
  isAnalyzing: false,
  setImage: (image) => set({ image }),
  setImageSize: (size) => set({ imageSize: size }),
  setLabels: (labels) => set({ labels }),
  addLabel: (label) => set((state) => ({ 
    labels: [...state.labels, label],
    selectedLabelId: label.id
  })),
  removeLabel: (id) => set((state) => ({
    labels: state.labels.filter((l) => l.id !== id),
    selectedLabelId: state.selectedLabelId === id ? null : state.selectedLabelId
  })),
  updateLabel: (id, label) =>
    set((state) => ({
      labels: state.labels.map((l) =>
        l.id === id ? { ...l, ...label } : l
      ),
    })),
  setSelectedLabelId: (id) => set({ selectedLabelId: id }),
  setLLMSettings: (settings) => set({ llmSettings: settings }),
  setPromptSettings: (settings) => set({ promptSettings: settings }),
  setStyleSettings: (settings) => set({ styleSettings: settings }),
  setPromptParams: (params) => set({ promptParams: params }),
  setLanguageParams: (params) => set({ languageParams: params }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}));