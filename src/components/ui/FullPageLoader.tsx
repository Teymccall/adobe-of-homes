import React from 'react';
import { Loader } from './Loader';

interface FullPageLoaderProps {
  message?: string;
  className?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        {message && (
          <p className="text-muted-foreground text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default FullPageLoader;
