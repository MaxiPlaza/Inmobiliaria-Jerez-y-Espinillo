import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../shared/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Si está comprobando la sesión, mostrar pantalla de carga de lujo
  if (loading) {
    return (
      <div className="fixed inset-0 bg-brand-black z-50 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold animate-pulse">
          Verificando Credenciales...
        </span>
      </div>
    );
  }

  // Redirigir al login si no tiene sesión activa
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
