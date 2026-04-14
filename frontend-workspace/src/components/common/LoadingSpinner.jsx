import React from 'react';
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center">
    <div className="spinner" />
    <p className="mt-2">{message}</p>
  </div>
);
export default LoadingSpinner;
