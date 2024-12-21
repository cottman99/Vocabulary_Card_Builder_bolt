export interface Label {
  id: string;
  sourceLanguage: string;
  phonetic: string;
  targetLanguage: string;
  position: {
    x: number;
    y: number;
  };
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface StyleSettings {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
}