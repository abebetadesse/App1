import React from 'react';

const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}>
    {children}
  </div>
);
export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-700 font-semibold ${className}`}>{children}</div>
);
export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 ${className}`}>{children}</div>
);
export default Card;
