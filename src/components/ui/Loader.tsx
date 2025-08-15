import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-3 w-0.5',
    md: 'h-5 w-1', 
    lg: 'h-6 w-1.5'
  };

  const barSizeClasses = {
    sm: 'h-3 w-0.5',
    md: 'h-5 w-1', 
    lg: 'h-6 w-1.5'
  };

  const middleBarSizeClasses = {
    sm: 'h-4 w-0.5',
    md: 'h-6 w-1',
    lg: 'h-8 w-1.5'
  };

  return (
    <div className={`loader ${className}`}>
      <div className={`bar ${barSizeClasses[size]}`}></div>
      <div className={`bar ${middleBarSizeClasses[size]}`}></div>
      <div className={`bar ${barSizeClasses[size]}`}></div>
    </div>
  );
};

export default Loader;
