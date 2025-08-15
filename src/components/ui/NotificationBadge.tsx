import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  showZero?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  className = '',
  size = 'md',
  variant = 'default',
  showZero = false
}) => {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    destructive: 'bg-red-600 text-white'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold leading-none rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

// Specialized badge for navigation items
export const NavNotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <NotificationBadge
      count={count}
      size="sm"
      variant="primary"
      className="ml-2"
    />
  );
};

// Badge for dropdown items
export const DropdownNotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <NotificationBadge
      count={count}
      size="sm"
      variant="primary"
      className="ml-auto"
    />
  );
};
