import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { logError } from '../../services/loggingService';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="container text-center py-5">
    <div className="display-1">⚠️</div>
    <h2>Something went wrong</h2>
    <p className="text-muted">{error.message}</p>
    <button className="btn btn-primary" onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export const EnterpriseErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => logError('UI Error', error)}>
    {children}
  </ErrorBoundary>
);
