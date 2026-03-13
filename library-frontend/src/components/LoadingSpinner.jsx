import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
        {text && (
          <p className="text-sm text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

// Inline loading component for buttons
export const InlineLoading = ({ size = 'sm', className = '' }) => (
  <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} text-white animate-spin ${className}`} />
);

// Skeleton loading component for cards
export const SkeletonCard = ({ lines = 3 }) => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Table skeleton loading
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="border-b border-gray-200 p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    </div>
    <div className="divide-y divide-gray-200">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="h-3 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;
