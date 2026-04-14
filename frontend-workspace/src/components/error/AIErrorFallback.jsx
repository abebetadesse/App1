import React from 'react';
export const AIErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert"><p>Error: {error.message}</p><button onClick={resetErrorBoundary}>Retry</button></div>
);
export default AIErrorFallback;
