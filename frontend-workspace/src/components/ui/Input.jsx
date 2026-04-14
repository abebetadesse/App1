import React from 'react';

const Input = ({ label, id, className = '', ...props }) => (
  <div className="floating-input-group">
    <input id={id} className={`floating-input ${className}`} placeholder=" " {...props} />
    <label htmlFor={id} className="floating-label">{label}</label>
  </div>
);
export default Input;
