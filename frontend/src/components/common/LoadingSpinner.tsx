import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  className = '',
  text,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-primary-500" size={size} />
      {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;