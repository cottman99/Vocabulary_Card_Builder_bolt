import { CategoryLogger } from './CategoryLogger';
import { LogCategory } from './categories';

class Logger {
  private static instance: Logger | null = null;
  
  readonly system: CategoryLogger;
  readonly ui: CategoryLogger;
  readonly api: CategoryLogger;
  readonly image: CategoryLogger;
  readonly llm: CategoryLogger;
  readonly label: CategoryLogger;

  private constructor() {
    // Initialize loggers outside of render cycle
    this.system = new CategoryLogger(LogCategory.SYSTEM);
    this.ui = new CategoryLogger(LogCategory.UI);
    this.api = new CategoryLogger(LogCategory.API);
    this.image = new CategoryLogger(LogCategory.IMAGE);
    this.llm = new CategoryLogger(LogCategory.LLM);
    this.label = new CategoryLogger(LogCategory.LABEL);
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();