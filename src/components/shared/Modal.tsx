import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Desactivar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-xl border border-brand-gold/20 bg-brand-black/95 p-6 shadow-2xl transition-all duration-300">
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-gold/15 mb-4">
          <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-brand-gold transition-colors duration-200 focus:outline-none cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Contenido */}
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};
