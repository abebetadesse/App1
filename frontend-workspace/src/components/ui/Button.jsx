import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn-premium',
  secondary: 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
};

const Button = ({ children, variant = 'primary', to, href, onClick, className = '', ...props }) => {
  const classes = `inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={classes}>{children}</Link>;
  if (href) return <a href={href} className={classes}>{children}</a>;
  return <button onClick={onClick} className={classes} {...props}>{children}</button>;
};
export default Button;
