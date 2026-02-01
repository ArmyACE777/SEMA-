'use client';
import React, { InputHTMLAttributes, forwardRef, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  icon,
  clearable = false,
  onClear,
  type = 'text',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword && type === 'password' ? 'text' : type;

  return (
    <div className={cn('flex flex-col w-full', className)}>
      {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        <input
          {...props}
          type={inputType}
          ref={ref}
          className={cn(
            'block w-full rounded-md border border-gray-300 bg-white py-2 px-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-10' : '',
            clearable || showPasswordToggle ? 'pr-10' : '',
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
            props.disabled ? 'bg-gray-100' : '',
          )}
        />
        {clearable && props.value && props.value.toString().length > 0 && onClear && (
          <button
            type="button"
            aria-label="Clear input"
            onClick={onClear}
            className="absolute right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
