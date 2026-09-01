import React, { useState, useMemo } from 'react';
import { Inbox, Search, Phone, MessageSquare, Calendar, Building } from 'lucide-react';
import { useConsultas } from '../../hooks/useConsultas';
import { formatRelativeTime } from '../../utils/formatDate';
import { Spinner } from '../../components/shared/Spinner';
import { Button } from '../../components/shared/Button';

export const Consultas: React.FC = () => {
  const { consultas, loading } = useConsultas();
  const [buscar, setBuscar] = useState('');

  // Filtrado de Consultas
  const consultasFiltradas = useMemo(() => {
    return consultas.filter((cons) => {
      if (!buscar.trim()) return true;
      const query = buscar.toLowerCase();
      const matchNombre = cons.nombre.toLowerCase().includes(query);
      const matchMensaje = cons.mensaje.toLowerCase().includes(query);
      const matchPropiedad = cons.propiedades?.titulo.toLowerCase().includes(query) || false;
      return matchNombre || matchMensaje || matchPropiedad;
    });
  }, [consultas, buscar]);

  // Enlace directo al chat de WhatsApp con el cliente
  const handleAbrirWhatsapp = (telefono: string, nombre: string, tituloPropiedad?: string) => {
    // Limpiar caracteres no numéricos excepto el código de país
    const cleanPhone = telefono.replace(/\D/g, '');
    let text = `Hola ${nombre}, me comunico desde la inmobiliaria MagnusPropiedades en respuesta a tu consulta.`;
    if (tituloPropiedad) {
      text = `Hola ${nombre}, me comunico desde la inmobiliaria MagnusPropiedades en respuesta a tu consulta sobre la propiedad "${tituloPropiedad}".`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Estadísticas rápidas para el encabezado de consultas
  const stats = useMemo(() => {
    const total = consultas.length;
    const deHoy = consultas.filter(c => {
      const fechaC = new Date(c.created_at);
      const hoy = new Date();
      return fechaC.toDateString() === hoy.toDateString();
    }).length;
    
    // Propiedad más consultada
    const conteoPropiedades: { [key: string]: number } = {};
    consultas.forEach(c => {
      if (c.propiedades?.titulo) {
        conteoPropiedades[c.propiedades.titulo] = (conteoPropiedades[c.propiedades.titulo] || 0) + 1;
      }
    });
    let masConsultada = 'Ninguna';
    let maxConsultas = 0;
    Object.entries(conteoPropiedades).forEach(([titulo, count]) => {
      if (count > maxConsultas) {
        maxConsultas = count;
        masConsultada = titulo;
      }
    });

    return { total, deHoy, masConsultada };
  }, [consultas]);

  return (
    <div className="lg:pl-64 pt-20 lg:pt-8 min-h-screen text-left font-sans bg-brand-black pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-gold/15">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Inbox className="w-7 h-7 text-brand-gold" />
              Bandeja de Consultas
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Gestiona las consultas recibidas desde los formularios del sitio web y responde directamente por WhatsApp.
            </p>
          </div>
        </div>

        {/* Tarjetas de Métricas de Consultas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          
          <div className="bg-brand-gray-dark border border-brand-gray-light p-4.5 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Total Recibidas</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{stats.total}</span>
            </div>
          </div>

          <div className="bg-brand-gray-dark border border-brand-gray-light p-4.5 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Recibidas Hoy</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{stats.deHoy}</span>
            </div>
          </div>

          <div className="bg-brand-gray-dark border border-brand-gray-light p-4.5 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Más Consultada</span>
              <span className="text-xs font-bold text-white mt-0.5 block truncate max-w-[200px]" title={stats.masConsultada}>
                {stats.masConsultada}
              </span>
            </div>
          </div>

        </div>

        {/* Buscador */}
        <div className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-4.5 mb-8 shadow-md">
          <div className="relative w-full text-left">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por cliente, mensaje o propiedad de interés..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
        </div>

        {/* Listado Principal */}
        {loading ? (
          <div className="py-32">
            <Spinner size="lg" />
          </div>
        ) : consultasFiltradas.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-brand-gray-light rounded-xl bg-brand-gray-dark/50">
            <Inbox className="w-10 h-10 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white tracking-wide">Bandeja Vacía</h3>
            <p className="text-xs text-gray-500 mt-1">No se encontraron consultas registradas.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-brand-gray-light bg-brand-gray-dark shadow-xl">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="bg-[#0E0E0E] text-gray-400 border-b border-brand-gold/15 uppercase font-bold tracking-widest text-[9px]">
                    <th className="py-4.5 px-6 w-48">Cliente</th>
                    <th className="py-4.5 px-6 w-48">Propiedad Referenciada</th>
                    <th className="py-4.5 px-6">Mensaje</th>
                    <th className="py-4.5 px-6 w-36">Fecha</th>
                    <th className="py-4.5 px-6 text-right w-44">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/5">
                  {consultasFiltradas.map((cons) => (
                    <tr key={cons.id} className="hover:bg-white/2 transition-colors duration-200 align-top">
                      
                      {/* Cliente */}
                      <td className="py-5 px-6">
                        <div className="font-bold text-white text-sm">{cons.nombre}</div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium mt-1">
                          <Phone className="w-3 h-3 text-brand-gold" />
                          {cons.telefono}
                        </div>
                      </td>

                      {/* Propiedad */}
                      <td className="py-5 px-6">
                        {cons.propiedades ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-brand-gold text-[11px] uppercase tracking-wide">
                              {cons.propiedades.titulo}
                            </span>
                            <span className="text-[9px] text-gray-500 font-semibold tracking-wider">
                              ID: {cons.propiedad_id?.substring(0, 8)}...
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 italic font-semibold">
                            Contacto General
                          </span>
                        )}
                      </td>

                      {/* Mensaje */}
                      <td className="py-5 px-6">
                        <p className="text-gray-300 leading-relaxed text-xs max-w-lg break-words whitespace-pre-line font-medium bg-[#0A0A0A]/40 p-3 rounded-lg border border-brand-gray-light">
                          {cons.mensaje}
                        </p>
                      </td>

                      {/* Fecha */}
                      <td className="py-5 px-6 text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-600" />
                          {formatRelativeTime(cons.created_at)}
                        </div>
                      </td>

                      {/* Botón WhatsApp */}
                      <td className="py-5 px-6 text-right">
                        <Button
                          variant="primary"
                          onClick={() => handleAbrirWhatsapp(cons.telefono, cons.nombre, cons.propiedades?.titulo)}
                          className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(201,168,76,0.15)] bg-emerald-500 hover:bg-emerald-400 hover:scale-[1.02] border-emerald-500 hover:border-emerald-400 text-brand-black transition-all cursor-pointer inline-flex"
                        >
                          <Phone className="w-3.5 h-3.5 fill-brand-black text-brand-black" />
                          Responder WA
                        </Button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col gap-4">
              {consultasFiltradas.map((cons) => (
                <div 
                  key={cons.id}
                  className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-4 flex flex-col gap-4 shadow-md text-left"
                >
                  {/* Header Tarjeta */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{cons.nombre}</h4>
                      <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">{cons.telefono}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold bg-[#0A0A0A] px-2 py-0.5 rounded border border-brand-gray-light flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeTime(cons.created_at)}
                    </span>
                  </div>

                  {/* Propiedad Referenciada */}
                  <div className="bg-[#0A0A0A]/40 rounded-lg p-2.5 border border-brand-gold/10 flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand-gold shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase text-gray-500 font-extrabold tracking-wider block">Propiedad consultada:</span>
                      <span className="text-[10px] font-bold text-white truncate block">
                        {cons.propiedades?.titulo || 'Contacto Directo General'}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="text-xs text-gray-300 leading-relaxed bg-[#0A0A0A] p-3 rounded-lg border border-brand-gray-light whitespace-pre-line font-medium">
                    {cons.mensaje}
                  </div>

                  {/* Responder WhatsApp */}
                  <div className="pt-2 border-t border-brand-gold/5 flex justify-end">
                    <button
                      onClick={() => handleAbrirWhatsapp(cons.telefono, cons.nombre, cons.propiedades?.titulo)}
                      className="w-full py-2.5 rounded bg-emerald-500 text-brand-black font-extrabold uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform cursor-pointer"
                    >
                      <Phone className="w-4.5 h-4.5 fill-brand-black" />
                      Responder por WhatsApp
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
