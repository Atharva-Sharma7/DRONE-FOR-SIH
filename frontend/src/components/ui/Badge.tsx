import React from 'react';
import { cn, getSeverityColor, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'severity' | 'status' | 'default';
  value?: string;
}

export function Badge({ children, className, variant = 'default', value }: BadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  
  if (variant === 'severity' && value) {
    colorClass = getSeverityColor(value);
  } else if (variant === 'status' && value) {
    colorClass = getStatusColor(value);
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClass, className)}>
      {children}
    </span>
  );
}
