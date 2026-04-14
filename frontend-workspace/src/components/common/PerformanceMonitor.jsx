import React from 'react';
const PerformanceMonitor = () => import.meta.env.DEV ? <div className="fixed bottom-4 right-4 bg-black/70 text-white text-xs p-2 rounded">Perf Monitor</div> : null;
export default PerformanceMonitor;
