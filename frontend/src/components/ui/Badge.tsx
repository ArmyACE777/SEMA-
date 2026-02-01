import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  
  const variants = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-gray-100 text-gray-600 border-gray-300',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

export function CategoryBadge({ 
  category, 
  size = 'xs' 
}: { 
  category: string; 
  size?: BadgeProps['size'];
}) {
  const categoryVariants: Record<string, BadgeProps['variant']> = {
    akademik: 'info',
    organisasi: 'success',
    kemahasiswaan: 'primary',
    umum: 'secondary',
  };

  const categoryLabels: Record<string, string> = {
    akademik: 'Akademik',
    organisasi: 'Organisasi', 
    kemahasiswaan: 'Kemahasiswaan',
    umum: 'Umum',
  };

  const variant = categoryVariants[category] || 'secondary';
  const label = categoryLabels[category] || category;

  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
}
