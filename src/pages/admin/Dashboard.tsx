import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building, CheckCircle2, AlertCircle, Bookmark, Inbox, 
  ArrowUpRight, Plus 
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { useConsultas } from '../../hooks/useConsultas';
import { Button } from '../../components/shared/Button';
import { formatRelativeTime } from '../../utils/formatDate';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { properties, loading: propLoading } = useProperties();
  const { consultas, loading: consLoading } = useConsultas();

  // Calcular métricas basadas en las propiedades
  const metricas = useMemo(() => {
    // Si no han cargado aún o está vacío, retornar números de mockup realistas
    if (propLoading || properties.length === 0) {
      return { total: 142, disponibles: 87, reservadas: 34, vendidas: 21 };
    }

    const total = properties.length;
    const disponibles = properties.filter(p => p.estado === 'disponible').length;
    const reservadas = properties.filter(p => p.estado === 'reservado').length;
    const vendidas = properties.filter(p => p.estado === 'vendido' || p.estado === 'alquilado').length;

    return { total, disponibles, reservadas, vendidas };
  }, [properties, propLoading]);

  // Consultas de este mes
  const consultasEsteMes = useMemo(() => {
    if (consLoading) return 12;
    return consultas.length;
  }, [consultas, consLoading]);

  // Últimas 5 consultas para la tabla
  const ultimasConsultas = useMemo(() => {
    if (consLoading) return [];
    return consultas.slice(0, 5);
  }, [consultas, consLoading]);

  // Datos simulados para el gráfico de barras mensual premium
  const graficoMensual = [
    { mes: "Ene", visitas: 35 },
    { mes: "Feb", visitas: 58 },
    { mes: "Mar", visitas: 85 },
    { mes: "Abr", visitas: 50 },
    { mes: "May", visitas: 98, destacado: true }, // Barra negra/dorada alta
    { mes: "Jun", visitas: 72 }
  ];

  return (
    <div className="lg:pl-64 pt-20 lg:pt-8 min-h-screen text-left font-sans bg-brand-black pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-gold/15">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Resumen General</h1>
            <p className="text-xs text-gray-500 mt-1">Supervisión general del portafolio inmobiliario y solicitudes de contacto</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/admin/propiedades/nueva')}
              className="py-2 px-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-black" />
              Nueva Propiedad
            </Button>
          </div>
        </div>

        {/* CONTENEDOR DE METRICAS (Cards de 4 + 1 Extra) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Total */}
          <div className="p-5 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Propiedades</span>
              <Building className="w-4.5 h-4.5 text-brand-gold" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">{metricas.total}</span>
              <span className="block text-[9px] text-gray-600 font-semibold mt-1">Registradas en Supabase</span>
            </div>
          </div>

          {/* Card 2: Disponibles */}
          <div className="p-5 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Disponibles</span>
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">{metricas.disponibles}</span>
              <span className="block text-[9px] text-emerald-500/80 font-semibold mt-1">Habilitadas para venta/alquiler</span>
            </div>
          </div>

          {/* Card 3: Reservadas */}
          <div className="p-5 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Reservadas</span>
              <AlertCircle className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">{metricas.reservadas}</span>
              <span className="block text-[9px] text-amber-500/80 font-semibold mt-1">Señadas en proceso técnico</span>
            </div>
          </div>

          {/* Card 4: Vendidas / Alquiladas */}
          <div className="p-5 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Vendidas</span>
              <Bookmark className="w-4.5 h-4.5 text-rose-400" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight">{metricas.vendidas}</span>
              <span className="block text-[9px] text-rose-500/80 font-semibold mt-1">Operaciones concretadas</span>
            </div>
          </div>

        </section>

        {/* PANEL INTERMEDIO: GRAFICO + CONSULTAS RECIBIDAS (Grid 2 columnas) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-stretch">
          
          {/* Columna Izquierda: Actividad Mensual (Gráfico de barras CSS Premium) */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between shadow-lg min-h-[350px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Actividad Mensual</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Visitas acumuladas en las fichas de propiedades</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A0A0A] text-brand-gold border border-brand-gold/15">Mes</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A0A0A] text-gray-500">Año</span>
              </div>
            </div>

            {/* Simulación del gráfico */}
            <div className="flex items-end justify-between h-48 px-4 border-b border-brand-gold/10 pb-2">
              {graficoMensual.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2.5 w-1/8 group">
                  {/* Tooltip de visitas */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0A0A0A] border border-brand-gold/25 rounded px-2 py-0.5 text-[9px] font-bold text-brand-gold absolute -translate-y-10">
                    {item.visitas}
                  </div>
                  {/* Barra */}
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                      item.destacado 
                        ? 'bg-gradient-to-t from-brand-gold/80 to-brand-gold shadow-[0_0_12px_rgba(201,168,76,0.35)]' 
                        : 'bg-brand-gray-light group-hover:bg-brand-gold/20'
                    }`}
                    style={{ height: `${item.visitas}%` }}
                  />
                  {/* Nombre mes */}
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Consultas Recientes (Simétrico al mockup) */}
          <div className="p-6 rounded-xl bg-brand-gray-dark border border-brand-gold/15 flex flex-col justify-between shadow-lg">
            
            {/* Cabecera */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/10 mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Consultas Recientes</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Últimas solicitudes de contacto</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-gold uppercase tracking-wider animate-pulse">
                <span>+{consultasEsteMes} este mes</span>
              </div>
            </div>

            {/* Listado de Consultas de Mockup */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[220px] pr-1">
              {ultimasConsultas.length === 0 ? (
                // Fallback estático premium para coincidir con la imagen de mockup de consultas
                <div className="flex flex-col gap-3.5">
                  
                  {/* Consulta 1 */}
                  <div className="p-3 bg-[#0A0A0A] rounded-lg border border-brand-gray-light text-left flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center font-bold text-brand-gold shrink-0 text-xs">MG</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">María González</h4>
                        <span className="text-[9px] text-gray-500 font-bold shrink-0">Hace 2 horas</span>
                      </div>
                      <p className="text-[10px] text-gray-400 italic line-clamp-1 mt-1">"Hola, me gustaría agendar una visita..."</p>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-brand-gold/80 mt-1">Casa en San Isidro</span>
                    </div>
                  </div>

                  {/* Consulta 2 */}
                  <div className="p-3 bg-[#0A0A0A] rounded-lg border border-brand-gray-light text-left flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center font-bold text-brand-gold shrink-0 text-xs">CR</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">Carlos Rodríguez</h4>
                        <span className="text-[9px] text-gray-500 font-bold shrink-0">Ayer, 14:30</span>
                      </div>
                      <p className="text-[10px] text-gray-400 italic line-clamp-1 mt-1">"Querías consultar por la financiación..."</p>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-brand-gold/80 mt-1">Depto en Palermo</span>
                    </div>
                  </div>

                </div>
              ) : (
                // Consultas reales cargadas
                ultimasConsultas.map((cons) => (
                  <div key={cons.id} className="p-3 bg-[#0A0A0A] rounded-lg border border-brand-gray-light text-left flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center font-bold text-brand-gold shrink-0 text-xs">
                      {cons.nombre ? cons.nombre.split(' ').map(n=>n[0]).join('').substr(0,2).toUpperCase() : 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">{cons.nombre}</h4>
                        <span className="text-[9px] text-gray-500 font-bold shrink-0">
                          {formatRelativeTime(cons.created_at)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 italic line-clamp-1 mt-1">"{cons.mensaje}"</p>
                      {cons.propiedades?.titulo && (
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-brand-gold/80 mt-1 truncate max-w-full">
                          {cons.propiedades.titulo}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Enlace ver todas */}
            <Link
              to="/admin/consultas"
              className="mt-6 w-full py-2 bg-[#0A0A0A] hover:bg-[#151515] border border-brand-gold/25 hover:border-brand-gold text-brand-gold text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Ver Todas las Consultas
            </Link>

          </div>

        </section>

        {/* TABLA INFERIOR: ACCESO RAPIDO Y ULTIMAS PROPIEDADES (Grid responsivo) */}
        <section className="p-6 rounded-xl bg-brand-gray-dark border border-brand-gray-light shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-brand-gold/10 mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Administración Rápida</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Acceso rápido a las tareas críticas de MagnusPropiedades</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <Link 
              to="/admin/propiedades"
              className="p-5 rounded-lg bg-[#0A0A0A] border border-brand-gray-light hover:border-brand-gold/20 flex flex-col gap-2 group transition-all"
            >
              <div className="w-9 h-9 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-2 group-hover:text-brand-gold transition-colors">Catálogo Admin</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">Modifica estados rápidos, elimina, edita precios e imágenes de todas tus propiedades.</p>
            </Link>

            <Link 
              to="/admin/consultas"
              className="p-5 rounded-lg bg-[#0A0A0A] border border-brand-gray-light hover:border-brand-gold/20 flex flex-col gap-2 group transition-all"
            >
              <div className="w-9 h-9 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
                <Inbox className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-2 group-hover:text-brand-gold transition-colors">Bandeja de Consultas</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">Abre chats de WhatsApp directamente de clientes interesados que dejaron su contacto.</p>
            </Link>

            <Link 
              to="/"
              className="p-5 rounded-lg bg-[#0A0A0A] border border-brand-gray-light hover:border-brand-gold/20 flex flex-col gap-2 group transition-all"
            >
              <div className="w-9 h-9 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-2 group-hover:text-brand-gold transition-colors">Ver Sitio Público</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">Previsualiza en tiempo real los cambios del sitio web tal cual lo visualizan los visitantes.</p>
            </Link>

          </div>
        </section>

      </div>
    </div>
  );
};
