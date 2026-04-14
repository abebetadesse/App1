import React, { forwardRef } from 'react';
const LoadingSpinner = forwardRef(LoadingSpinner);
export default function LoadingSpinner({ message }) { return <div className="text-center p-4"><div className="spinner-border text-primary"></div>{message && <p className="mt-2">{message}</p>}</div>; }
LoadingSpinner.displayName = 'LoadingSpinner';
