import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'gold' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    gold: 'border-brand-gold border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex justify-center items-center" role="status">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`} />
      <span className="sr-only">Cargando...</span>
    </div>
  );
};
