'use client';

import { cn } from '../../lib/utils';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 active:bg-primary-800 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus-visible:ring-gray-500 active:bg-gray-700 shadow-sm hover:shadow-md',
      outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 active:bg-primary-100 hover:border-primary-700',
      ghost: 'text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 active:bg-primary-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 active:bg-red-800 shadow-sm hover:shadow-md',
      success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 active:bg-green-800 shadow-sm hover:shadow-md',
    };
    
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className={cn(iconSizes[size], 'animate-spin')} />;
      }
      if (icon) {
        return <span className={cn(iconSizes[size])}>{icon}</span>;
      }
      return null;
    };

    return (
      <button
        className={cn(
          baseClasses, 
          variants[variant], 
          sizes[size], 
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {iconPosition === 'left' && renderIcon() && (
          <span className={cn(children && 'mr-2')}>
            {renderIcon()}
          </span>
        )}
        {children}
        {iconPosition === 'right' && renderIcon() && (
          <span className={cn(children && 'ml-2')}>
            {renderIcon()}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
