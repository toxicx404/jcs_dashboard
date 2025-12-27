import * as React from 'react';

import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 Frontend starting...');
console.log('React version:', React.version);

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('✅ Root element found:', rootElement);

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  public props: { children: React.ReactNode };
  public state: { hasError: boolean, error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Application Error</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Something went wrong. Please check the browser console for details.
            </p>
            {this.state.error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-mono">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('📦 Creating React root...');
const root = ReactDOM.createRoot(rootElement);

console.log('🎨 Rendering App component...');
try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully!');
} catch (error) {
  console.error('❌ Error rendering App:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1>Rendering Error</h1>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
      <pre>${error instanceof Error ? error.stack : String(error)}</pre>
    </div>
  `;
}