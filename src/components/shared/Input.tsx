import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isTextArea?: boolean;
  rows?: number;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isTextArea = false,
  icon,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const baseInputClasses = "w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-300 text-sm";
  const errorInputClasses = "border-rose-500/40 focus:border-rose-500 focus:ring-rose-500/20";
  
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}
      
      {isTextArea ? (
        <textarea
          id={id}
          rows={rows}
          className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${className} resize-none`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-500">
              {icon}
            </div>
          )}
          <input
            id={id}
            className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${icon ? 'pl-11' : ''} ${className}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      )}
      
      {error && (
        <span className="text-xs text-rose-400 font-medium animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};
