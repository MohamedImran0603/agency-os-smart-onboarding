import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  disabled,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-textPrimary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        disabled={disabled}
        className={`w-full px-3.5 py-2 text-sm bg-surface border rounded-lg text-textPrimary placeholder:text-textSecondary/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error
            ? 'border-error focus:ring-error'
            : 'border-border hover:border-slate-300'
        } ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-75' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      {!error && helpText && (
        <p className="text-xs text-textSecondary">{helpText}</p>
      )}
    </div>
  );
};
