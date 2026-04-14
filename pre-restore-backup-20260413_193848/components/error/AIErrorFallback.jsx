import React from 'react';
export const AIErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="ai-error-fallback">
    <h3>AI Assistant Error</h3>
    <p>{error?.message || 'An error occurred'}</p>
    <button onClick={resetErrorBoundary}>Try Again</button>
  </div>
);
export default AIErrorFallback;
