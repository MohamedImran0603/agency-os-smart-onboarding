import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50',
    secondary:
      'backdrop-blur-md bg-white/80 border border-slate-200/80 text-textPrimary hover:bg-white hover:border-slate-300 shadow-sm disabled:opacity-50',
    glass:
      'backdrop-blur-md bg-white/60 border border-white/80 text-primary hover:bg-white/90 hover:border-primary/30 shadow-sm disabled:opacity-50',
    ghost:
      'bg-transparent text-textSecondary hover:bg-slate-100/70 hover:text-textPrimary disabled:opacity-50',
    destructive:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-sm shadow-red-500/20 disabled:opacity-50',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        isDisabled ? 'cursor-not-allowed opacity-60 pointer-events-none' : ''
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
