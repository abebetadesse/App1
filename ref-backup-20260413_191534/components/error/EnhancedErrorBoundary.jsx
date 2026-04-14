import React from 'react';
import { useOfflineDetect } from '../../hooks/useOfflineDetect';

export default class EnhancedErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary:', error, info); }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

const ErrorFallback = ({ error, reset }) => {
  const isOffline = useOfflineDetect();
  return (
    <div className="text-center p-5">
      <div className="display-1">{isOffline ? '📡' : '⚠️'}</div>
      <h2 className="mt-3">{isOffline ? 'You are offline' : 'Something went wrong'}</h2>
      <p className="text-muted">{isOffline ? 'Please check your internet connection.' : error?.message || 'An unexpected error occurred.'}</p>
      <div className="d-flex gap-2 justify-content-center">
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload Page</button>
        <button className="btn btn-outline-secondary" onClick={reset}>Try Again</button>
      </div>
    </div>
  );
};
