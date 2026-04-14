import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProviders } from './providers/AppProviders';

// Suppress specific dev warnings
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    const msg = args[0]?.toString?.() || '';
    if (msg.includes('Unexpected ref object')) return;
    originalError(...args);
  };
}

// Root Error Boundary
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Service Worker (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/service-worker.js');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </RootErrorBoundary>
  </React.StrictMode>
);
