import React from 'react';
export const AIErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="ai-error-fallback">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);
export default AIErrorFallback;
