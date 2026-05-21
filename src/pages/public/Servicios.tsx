import React from 'react';
import { Home as HomeIcon, Key, Landmark, ClipboardCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/shared/Button';

export const Servicios: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <HomeIcon className="w-6 h-6" />,
      title: "Comercialización de Ventas",
      description: "Desarrollamos una estrategia multimedia a medida para tu propiedad VIP. Publicamos en redes de alto impacto, portales premium y realizamos visitas guiadas privadas bajo rigurosa coordinación de seguridad.",
      linkText: "Explorar Propiedades en Venta",
      type: "venta"
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Gestión Integral de Alquileres",
      description: "Garantizamos contratos blindados y análisis exhaustivos de solvencia de inquilinos y garantes. Nos encargamos de todo el proceso administrativo para que rentabilizar tu propiedad sea una experiencia pacífica.",
      linkText: "Ver Alquileres Disponibles",
      type: "alquiler"
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Desarrollos & Lotes (Terrenos)",
      description: "Ofrecemos oportunidades exclusivas en barrios privados y zonas de gran revalorización en Salta y el interior. Asesoramiento completo sobre zonificación, factibilidad de servicios e índices de plusvalía.",
      linkText: "Ver Terrenos Disponibles",
      type: "terreno"
    },
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "Tasaciones Técnicas Certificadas",
      description: "Determinamos el valor real de mercado de tu propiedad basándonos en rigurosos estudios de mercado comparativos y factores constructivos. Aprobado y certificado bajo firmas habilitadas matriculadas.",
      linkText: "Solicitar Tasación Profesional",
      type: "tasacion"
    }
  ];

  return (
    <div className="pt-24 pb-20 font-sans text-gray-200 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Nuestros Servicios</span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">Servicios Inmobiliarios de Lujo</h1>
          <p className="max-w-xl mx-auto text-sm text-gray-500 leading-relaxed font-light">
            Arquitectura de Negocios Inmobiliarios diseñada para proteger e incrementar el patrimonio de los propietarios más exigentes.
          </p>
        </div>

        {/* Grid de 4 Cards de Servicios */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((serv, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-brand-gray-dark border border-brand-gray-light hover:border-brand-gold/35 shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="text-left">
                {/* Icono */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-500">
                  {serv.icon}
                </div>
                {/* Título */}
                <h3 className="text-xl font-bold tracking-wide text-white mb-3 group-hover:text-brand-gold transition-colors">
                  {serv.title}
                </h3>
                {/* Descripción */}
                <p className="text-sm text-gray-500 leading-relaxed font-light mb-8">
                  {serv.description}
                </p>
              </div>
              
              {/* Enlace de Acción */}
              <button
                onClick={() => navigate(serv.type === 'tasacion' ? '/contacto' : `/catalogo?tipo=${serv.type}`)}
                className="mt-auto self-start flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold hover:text-white transition-colors duration-300 group/btn cursor-pointer"
              >
                <span>{serv.linkText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          ))}
        </section>

        {/* CTA General */}
        <section className="p-8 sm:p-12 rounded-xl bg-brand-black border border-brand-gold/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white tracking-wide">¿Tienes un requerimiento especial?</h2>
            <p className="text-xs text-gray-500 font-light mt-1 max-w-lg leading-relaxed">
              Dinos qué estás buscando y nuestro equipo matriculado llevará a cabo una búsqueda personalizada fuera del mercado tradicional.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/contacto')}
            className="px-8 py-3.5 text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
          >
            Iniciar Consulta
          </Button>
        </section>

      </div>
    </div>
  );
};
