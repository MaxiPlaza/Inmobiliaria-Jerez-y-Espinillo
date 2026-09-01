import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import logo from '../../assets/logo Magnus (1).png';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-brand-gold/10 pt-16 pb-8 text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-brand-gold/5">
          
          {/* Logo & Descripción */}
          <div className="flex flex-col gap-4 text-left">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo MagnusPropiedades" className="w-8 h-8 object-contain" />
              <span className="text-lg sm:text-xl font-bold tracking-wider text-white">
                Magnus<span className="text-brand-gold">Propiedades</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Ventas, Tasaciones y Administración de Propiedades.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="flex flex-col gap-4 text-left md:items-center">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Secciones</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
                <Link to="/" className="text-sm hover:text-brand-gold transition-colors duration-200">Inicio</Link>
                <Link to="/nosotros" className="text-sm hover:text-brand-gold transition-colors duration-200">Nosotros</Link>
                <Link to="/servicios" className="text-sm hover:text-brand-gold transition-colors duration-200">Servicios</Link>
                <Link to="/catalogo" className="text-sm hover:text-brand-gold transition-colors duration-200">Catálogo</Link>
                <Link to="/contacto" className="text-sm hover:text-brand-gold transition-colors duration-200">Contacto</Link>
              </div>
            </div>
          </div>

          {/* Redes Sociales y Contacto */}
          <div className="flex flex-col gap-4 text-left md:items-end">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 md:text-right">Contacto</h4>
              <p className="text-sm text-gray-500 mb-4 md:text-right">
                 Oficina Mendoza 171 -Salta, Argentina<br />
                inmobiliariamagnus26@gmail.com <br />
                Oscar Daniel Espinillo Cifuentes <br />
                Cucis 650 m.p
              </p>
              <div className="flex items-center gap-4 md:justify-end">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-gray-dark border border-brand-gold/15 hover:border-brand-gold hover:text-brand-gold transition-all duration-300 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-gray-dark border border-brand-gold/15 hover:border-brand-gold hover:text-brand-gold transition-all duration-300 cursor-pointer"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="mailto:contacto@magnuspropiedades.com"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-gray-dark border border-brand-gold/15 hover:border-brand-gold hover:text-brand-gold transition-all duration-300 cursor-pointer"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-600">
          <p>© {currentYear} MagnusPropiedades. Todos los derechos reservados. Arquitectura de Negocios Inmobiliarios.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-gold transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-brand-gold transition-colors">Política de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
