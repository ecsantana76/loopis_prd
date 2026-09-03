import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  hideText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', hideText = false, size = 'md' }) => {
  const gradientId = useId();
  
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48
  };
  
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const currentSize = iconSizes[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg 
        width={currentSize} 
        height={currentSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-lg"
      >
        <path 
          d="M 82 72 A 38 38 0 1 1 88 50" 
          stroke={`url(#${gradientId})`}
          strokeWidth="16" 
          strokeLinecap="round" 
        />
        <path 
          d="M 88 64 L 68 95 L 70 73 Z" 
          fill={`url(#${gradientId})`}
        />
        
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3D1E6D"/>
            <stop offset="0.5" stopColor="#7C3AED"/>
            <stop offset="1" stopColor="#C4A1F5"/>
          </linearGradient>
        </defs>
      </svg>
      {!hideText && (
        <span className={`${textSizes[size]} font-bold tracking-tighter text-brand-graphite dark:text-brand-off-white lowercase`}>
          loopis
        </span>
      )}
    </div>
  );
};
