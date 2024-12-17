export class APIError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'APIError';
  }
}

export class LLMConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LLMConfigError';
  }
}

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageProcessingError';
  }
}