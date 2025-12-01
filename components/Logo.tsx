import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = false }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
  };

  const widthMap = {
    sm: 120,
    md: 180,
    lg: 240,
    xl: 360,
  };

  const heightMap = {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 120,
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.jpg"
        alt="WORD and Prayer Network Logo"
        width={widthMap[size]}
        height={heightMap[size]}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
      {showText && (
        <div className="ml-3 flex flex-col">
          <span className="text-xs text-gray-500">Sharing Faith, Building Community</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
