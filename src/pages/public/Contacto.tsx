import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Mail, MapPin } from 'lucide-react';
import { useConsultas } from '../../hooks/useConsultas';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { getWhatsappContactLink, getWhatsappFloatingLink } from '../../utils/whatsappLink';

export const Contacto: React.FC = () => {
  const { addConsulta } = useConsultas();
  
  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validar campos
    if (!nombre.trim() || !telefono.trim()) {
      setErrorMsg('Por favor, rellene todos los campos.');
      return;
    }

    setLoading(true);
    
    try {
      const res = await addConsulta({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        mensaje: "Consulta general enviada desde el formulario de contacto público.",
        propiedad_id: null
      });

      if (res) {
        setSuccess(true);
        setNombre('');
        setTelefono('');
      } else {
        setErrorMsg('Hubo un error al registrar tu consulta. Inténtalo nuevamente.');
      }
    } catch {
      setErrorMsg('Error de red. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 font-sans text-gray-200 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Hablemos</span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">Contacto</h1>
          <p className="max-w-xl mx-auto text-sm text-gray-500 leading-relaxed font-light">
            Déjanos tu contacto para una atención inmediata. Completa el formulario o escribinos directamente por WhatsApp.
          </p>
        </div>

        {/* Sección de Formulario y Datos de Contacto */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Tarjeta de Formulario (Izquierda) */}
          <div className="bg-brand-gray-dark border border-brand-gold/15 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {success ? (
              // Vista de éxito interactiva
              <div className="text-center py-10 flex flex-col items-center gap-6 animate-in fade-in duration-300">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-xs text-gray-400 mt-2 max-w-sm leading-relaxed">
                    Hemos registrado tu contacto en nuestro sistema. Uno de nuestros martilleros matriculados se comunicará contigo a la brevedad.
                  </p>
                </div>
                
                {/* Botón directo a WhatsApp de Éxito */}
                <a
                  href={getWhatsappContactLink(nombre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all duration-300 hover:scale-103 cursor-pointer shadow-[0_4px_12px_rgba(201,168,76,0.25)]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ir Directo a WhatsApp
                </a>

                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs text-gray-500 hover:text-white transition-colors duration-200 mt-4 cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              // Formulario de Contacto
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h3 className="text-lg font-bold text-white tracking-wide border-b border-brand-gold/10 pb-3 mb-2">
                  Escribinos tu consulta
                </h3>
                
                {errorMsg && (
                  <div className="p-3 bg-rose-950/20 border border-rose-500/25 text-rose-400 rounded text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <Input
                  id="nombre"
                  label="Nombre Completo"
                  placeholder="Ej: Maximiliano"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />

                <Input
                  id="telefono"
                  label="Número de Teléfono-WhatsApp"
                  placeholder="Ej: +54 9 387 123-4567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  type="tel"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="w-full py-3.5 font-bold uppercase tracking-widest text-xs cursor-pointer shadow-[0_4px_14px_rgba(201,168,76,0.2)]"
                >
                  Enviar Información
                </Button>
              </form>
            )}
          </div>

          {/* Información Institucional e Inmediata (Derecha) */}
          <div className="flex flex-col gap-8 text-left h-full justify-between">
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white tracking-wide">
                ¿Prefieres hablar de forma <span className="text-brand-gold">inmediata</span>?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Evita esperas e inicia un canal de chat directo con nuestra oficina de atención comercial. Estamos en línea para resolver tus dudas.
              </p>

              {/* Botón WhatsApp Grande Prominente */}
              <a
                href={getWhatsappFloatingLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 inline-flex items-center justify-center gap-3 bg-[#111] hover:bg-[#1A1A1A] border border-brand-gold/30 hover:border-brand-gold text-brand-gold font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all duration-300 hover:scale-101 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 animate-pulse" />
                Contactar Ahora Vía WhatsApp
              </a>
            </div>

            {/* Listado de Datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-brand-gold/10 mt-6 text-gray-400">
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Oficinas</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Oficina Mendoza 171,<br />
                    Salta Capital, Argentina
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Email</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    inmobiliariamagnus26@gmail.com
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};
