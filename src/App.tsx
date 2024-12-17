import React from 'react';
import { useImageExport } from './hooks/useImageExport';
import { Toolbar } from './components/Toolbar';
import { ImagePreview } from './components/ImagePreview';
import { ImageControls } from './components/ImageControls';
import { LabelEditor } from './components/LabelEditor';
import { StyleEditor } from './components/StyleEditor';
import { ExportModal } from './components/export/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toast } from './components/Toast';
import { DebugPanel } from './components/DebugPanel/index';
import { useToast } from './hooks/useToast';
import { logger } from './utils/logger/Logger';

function App() {
  const { toasts, hideToast } = useToast();
  const { handleExport } = useImageExport();

  // Log app initialization
  React.useEffect(() => {
    logger.system.info('Application initialized');
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Toolbar onExport={handleExport} />
        
        <main className="container mx-auto p-4 md:p-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div id="image-preview">
                <ImagePreview />
              </div>
              <ImageControls />
            </div>
            
            <div className="space-y-4 md:space-y-8">
              <LabelEditor />
              <StyleEditor />
            </div>
          </div>
        </main>
        
        <SettingsModal />
        <ExportModal />
        
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
          />
        ))}

        {process.env.NODE_ENV === 'development' && <DebugPanel />}
      </div>
    </ErrorBoundary>
  );
}

export default App;