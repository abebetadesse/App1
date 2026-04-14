import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  success: 'btn-success',
  danger: 'btn-danger',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  icon,
  to,
  href,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = `${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {isLoading && <span className="spinner w-4 h-4 mr-2" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (to) {
    return <Link to={to} className={baseClasses} {...props}>{content}</Link>;
  }
  if (href) {
    return <a href={href} className={baseClasses} {...props}>{content}</a>;
  }
  return (
    <button className={baseClasses} disabled={disabled || isLoading} onClick={onClick} {...props}>
      {content}
    </button>
  );
};

export default Button;
