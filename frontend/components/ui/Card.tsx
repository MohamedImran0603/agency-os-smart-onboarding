import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  ...props
}) => {
  const variantStyles = {
    glass:
      'glass-card border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
    solid:
      'bg-surface border border-border shadow-sm',
    interactive:
      'glass-card border border-white/80 hover:border-primary/40 hover:shadow-[0_12px_36px_rgb(37,99,235,0.09)] hover:-translate-y-0.5 cursor-pointer',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 p-6 md:p-8 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
