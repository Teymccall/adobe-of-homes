
import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VerifiedBadge = ({ size = 'md', className = '' }: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-base px-2.5 py-1',
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };
  
  return (
    <div className={`verified-badge ${sizeClasses[size]} ${className}`}>
      <BadgeCheck size={iconSizes[size]} />
      <span>Verified</span>
    </div>
  );
};

export default VerifiedBadge;
