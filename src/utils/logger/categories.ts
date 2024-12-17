// Define logger categories as an enum for type safety
export enum LogCategory {
  SYSTEM = 'system',
  UI = 'ui',
  API = 'api',
  IMAGE = 'image',
  LLM = 'llm',
  LABEL = 'label',
}

// Category configuration with metadata
export const CATEGORY_CONFIG = {
  [LogCategory.SYSTEM]: {
    label: 'System',
    color: 'gray',
  },
  [LogCategory.UI]: {
    label: 'UI',
    color: 'blue',
  },
  [LogCategory.API]: {
    label: 'API',
    color: 'purple',
  },
  [LogCategory.IMAGE]: {
    label: 'Image',
    color: 'green',
  },
  [LogCategory.LLM]: {
    label: 'LLM',
    color: 'orange',
  },
  [LogCategory.LABEL]: {
    label: 'Label',
    color: 'pink',
  },
} as const;