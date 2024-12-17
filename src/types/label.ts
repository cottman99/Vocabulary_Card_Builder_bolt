export interface Label {
  id: string;
  english: string;
  phonetic: string;
  chinese: string;
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