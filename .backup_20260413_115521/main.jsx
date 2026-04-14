import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProviders } from './providers/AppProviders';

// Simple root error boundary
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Root Error Boundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1>⚠️ Application Error</h1>
          <p>Something went wrong. Please try refreshing.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1rem', background: '#646cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ marginTop: '1rem', textAlign: 'left', background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Mount the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </RootErrorBoundary>
  </React.StrictMode>
);
