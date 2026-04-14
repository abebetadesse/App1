import React, { forwardRef } from 'react';
import { ProgressBar } from 'react-bootstrap';

const PasswordStrengthMeter = forwardRef(PasswordStrengthMeter);
export default function PasswordStrengthMeter({ strength, checks }) {
  const getStrengthText = () => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };
  const getVariant = () => {
    if (strength < 30) return 'danger';
    if (strength < 60) return 'warning';
    if (strength < 80) return 'info';
    return 'success';
  };
  return (
    <div className="mt-2">
      <ProgressBar now={strength} variant={getVariant()} style={{ height: '4px' }} />
      <div className="d-flex justify-content-between mt-1">
        <small>Password strength: {getStrengthText()}</small>
      </div>
      {checks && (
        <div className="mt-2">
          <ul className="list-unstyled small">
            <li className={checks.hasMinLength ? 'text-success' : 'text-muted'}>
              {checks.hasMinLength ? '✓' : '○'} At least 8 characters
            </li>
            <li className={checks.hasUpperCase ? 'text-success' : 'text-muted'}>
              {checks.hasUpperCase ? '✓' : '○'} Uppercase letter
            </li>
            <li className={checks.hasLowerCase ? 'text-success' : 'text-muted'}>
              {checks.hasLowerCase ? '✓' : '○'} Lowercase letter
            </li>
            <li className={checks.hasNumber ? 'text-success' : 'text-muted'}>
              {checks.hasNumber ? '✓' : '○'} Number
            </li>
            <li className={checks.hasSpecialChar ? 'text-success' : 'text-muted'}>
              {checks.hasSpecialChar ? '✓' : '○'} Special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
PasswordStrengthMeter.displayName = 'PasswordStrengthMeter';
