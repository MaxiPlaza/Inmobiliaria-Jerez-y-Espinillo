import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { WhatsAppButton } from './components/public/WhatsAppButton';
import { Sidebar } from './components/admin/Sidebar';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Páginas Públicas
import { Home } from './pages/public/Home';
import { Catalogo } from './pages/public/Catalogo';
import { Propiedad } from './pages/public/Propiedad';
import { Nosotros } from './pages/public/Nosotros';
import { Servicios } from './pages/public/Servicios';
import { Contacto } from './pages/public/Contacto';

// Páginas de Administración
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Propiedades } from './pages/admin/Propiedades';
import { PropertyFormPage } from './pages/admin/PropertyFormPage';
import { Consultas } from './pages/admin/Consultas';

import { Building2 } from 'lucide-react';
import { Button } from './components/shared/Button';

// Layout del Sitio Público (Navbar, Footer, WhatsAppButton)
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black text-gray-200">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// Layout del Panel de Administración (Sidebar)
const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-brand-black text-gray-200">
      <Sidebar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
};

// Página 404 Elegante (Luxury)
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-center px-4 font-sans">
      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-4">
        Error 404
      </span>
      <Building2 className="w-14 h-14 text-brand-gold mb-6 animate-pulse" />
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
        Residencia no encontrada
      </h1>
      <p className="max-w-md text-xs text-gray-500 mb-8 leading-relaxed">
        El enlace que intentas buscar no está disponible en este momento o ha sido retirado de nuestra base de datos.
      </p>
      <Link to="/">
        <Button variant="primary" className="py-2.5 px-6 font-bold text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(201,168,76,0.25)]">
          Volver al Inicio
        </Button>
      </Link>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rutas Públicas (Con Navbar y Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/propiedad/:id" element={<Propiedad />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>

        {/* Ruta de Login del Admin */}
        <Route path="/admin/login" element={<Login />} />

        {/* Rutas de Administración Protegidas (Con Sidebar) */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/propiedades" element={<Propiedades />} />
          <Route path="/admin/propiedades/nueva" element={<PropertyFormPage />} />
          <Route path="/admin/propiedades/:id/editar" element={<PropertyFormPage />} />
          <Route path="/admin/consultas" element={<Consultas />} />
        </Route>

        {/* Catch All / Redirecciones */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
