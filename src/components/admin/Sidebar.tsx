import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Building, Inbox, LogOut, Plus, 
  Menu, X, Building2 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/admin/propiedades', label: 'Propiedades', icon: <Building className="w-5 h-5" /> },
    { to: '/admin/consultas', label: 'Consultas', icon: <Inbox className="w-5 h-5" /> },
  ];

  const handleCerrarSesion = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
      isActive 
        ? 'bg-brand-gold text-brand-black shadow-[0_4px_12px_rgba(201,168,76,0.2)]' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {/* Botón Hamburger para Móviles */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center p-2.5 rounded-lg bg-brand-gray-dark border border-brand-gold/30 text-brand-gold cursor-pointer"
          aria-label="Abrir panel"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer Overlay Móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR PRINCIPAL (Fijo en desktop, Drawer en móvil) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-35 bg-brand-gray-dark border-r border-brand-gold/15 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Superior */}
        <div className="flex flex-col gap-8 text-left">
          
          {/* Logo y Encabezado */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-gold/10">
            <Link to="/" className="flex items-center gap-2 group">
              <Building2 className="w-5 h-5 text-brand-gold" />
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-wider text-white">
                  Jerez<span className="text-brand-gold">°</span>Espinillo
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest mt-0.5">Control de Mando</span>
              </div>
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-400 hover:text-brand-gold p-1 cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Botón "+ Nueva Propiedad" destacado */}
          <Link
            to="/admin/propiedades/nueva"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 inline-flex items-center justify-center gap-2 bg-transparent hover:bg-brand-gold/5 text-brand-gold hover:text-brand-gold border border-brand-gold/30 hover:border-brand-gold rounded-lg font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(201,168,76,0.05)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Propiedad
          </Link>

          {/* Enlaces de Navegación */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={navLinkStyle}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Inferior (Cerrar Sesión) */}
        <div className="pt-4 border-t border-brand-gold/10 text-left">
          <button
            onClick={handleCerrarSesion}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/15 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>
    </>
  );
};
