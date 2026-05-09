import React from 'react';

interface DaxamLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

const DaxamLogo: React.FC<DaxamLogoProps> = ({ size = 'md', showTagline = false }) => {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const taglineSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`font-orbitron font-bold tracking-wider ${sizeMap[size]} daxam-gradient-text`}
        >
          DAXAM
        </div>
        {showTagline && (
          <div
            className={`${taglineSize[size]} font-body tracking-[0.3em] uppercase text-muted-foreground mt-0.5`}
          >
            Social-Fi Gaming
          </div>
        )}
      </div>
    </div>
  );
};

export default DaxamLogo;
