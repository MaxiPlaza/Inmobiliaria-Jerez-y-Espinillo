import React from 'react';

interface BadgeProps {
  variant: 'disponible' | 'reservado' | 'vendido' | 'alquilado' | 'tipo' | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-300";
  
  const variantClasses = {
    disponible: "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30",
    reservado: "bg-amber-950/40 text-amber-400 border border-amber-500/30",
    vendido: "bg-rose-950/40 text-rose-400 border border-rose-500/30",
    alquilado: "bg-rose-950/40 text-rose-400 border border-rose-500/30",
    tipo: "bg-brand-gold/10 text-brand-gold border border-brand-gold/20",
    default: "bg-brand-gray-light text-gray-300 border border-gray-700"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};
