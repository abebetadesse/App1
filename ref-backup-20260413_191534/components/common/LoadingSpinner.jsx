import React from 'react';
export default function LoadingSpinner({ message }) { return <div className="text-center p-4"><div className="spinner-border text-primary"></div>{message && <p className="mt-2">{message}</p>}</div>; }
