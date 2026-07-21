import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertTriangle, KeyRound } from 'lucide-react';
import { useAuth, MOCK_ADMIN_EMAIL, MOCK_ADMIN_PASSWORD } from '../../hooks/useAuth';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email.trim() || !contrasena) {
      setErrorMsg('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email.trim(), contrasena);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.error || 'Credenciales incorrectas.');
      }
    } catch {
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#060606] flex items-center justify-center p-4 z-40 font-sans">
      
      {/* Caja de Login */}
      <div className="w-full max-w-md bg-brand-gray-dark border border-brand-gold/15 rounded-2xl p-8 sm:p-10 shadow-2xl flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 select-none">
          <Building2 className="w-8 h-8 text-brand-gold" />
          <span className="text-2xl font-extrabold tracking-wider text-white">
            Jerez<span className="text-brand-gold">°</span>Espinillo
          </span>
        </div>

        {/* Info Acceso */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-wide">Panel Administrativo</h2>
          <p className="text-xs text-gray-500 mt-1">Ingresa tus credenciales para administrar tus propiedades y consultas</p>
        </div>

        {errorMsg && (
          <div className="w-full p-3 mb-4 rounded-lg bg-rose-950/20 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-400 font-medium text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          <Input
            id="email"
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@jerezespinillo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full py-3.5 mt-2 text-xs font-bold uppercase tracking-widest cursor-pointer"
          >
            Ingresar
          </Button>
        </form>


      </div>

    </div>
  );
};
