import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Building2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/contacto', label: 'Contacto' },
  ];

  const activeStyle = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
      isActive ? 'text-brand-gold font-semibold' : 'text-gray-300 hover:text-white'
    }`;

  const activeUnderline = ({ isActive }: { isActive: boolean }) =>
    `absolute bottom-0 left-0 w-full h-[2px] bg-brand-gold transform transition-transform duration-300 ${
      isActive ? 'scale-x-100' : 'scale-x-0'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-brand-black/90 backdrop-blur-md border-b border-brand-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Building2 className="w-6 h-6 text-brand-gold transition-transform duration-500 group-hover:rotate-12" />
            <span className="text-xl font-bold tracking-wider text-white font-sans">
              Jerez<span className="text-brand-gold font-light">°</span>Espinillo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={activeStyle}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span className={activeUnderline({ isActive })} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Admin CTA */}
          <div className="hidden md:block">
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-transparent border border-brand-gold/30 hover:border-brand-gold rounded hover:bg-brand-gold hover:text-brand-black transition-all duration-300 cursor-pointer"
            >
              Admin Panel
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-brand-gold transition-colors p-2 focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Drawer (Left Drawer) */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-[#0E0E0E] border-r border-brand-gold/15 p-6 shadow-2xl transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-brand-gold/10">
          <Link to="/" className="flex items-center gap-2" onClick={toggleMenu}>
            <Building2 className="w-5 h-5 text-brand-gold" />
            <span className="text-lg font-bold text-white tracking-wide">
              Jerez<span className="text-brand-gold">°</span>Espinillo
            </span>
          </Link>
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-brand-gold p-1 focus:outline-none cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleMenu}
              className={({ isActive }) =>
                `text-base font-medium tracking-wide transition-colors ${
                  isActive ? 'text-brand-gold font-semibold' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          <div className="pt-6 border-t border-brand-gold/10 mt-2">
            <Link
              to="/admin/login"
              onClick={toggleMenu}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-black bg-brand-gold hover:bg-brand-gold-hover rounded transition-all duration-300 font-bold"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
