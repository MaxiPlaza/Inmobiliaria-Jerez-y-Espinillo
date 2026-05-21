import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, HeartHandshake, ArrowRight, MessageSquare } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { PropertyCard } from '../../components/public/PropertyCard';
import { Button } from '../../components/shared/Button';
import { getWhatsappFloatingLink } from '../../utils/whatsappLink';
import { Spinner } from '../../components/shared/Spinner';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { properties, loading } = useProperties();
  const [tipoFiltro, setTipoFiltro] = useState<string>('');

  // Filtrar las propiedades destacadas (destacada = true, max 6)
  const destacadas = properties
    .filter(p => p.destacada === true)
    .slice(0, 6);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalogo?tipo=${tipoFiltro}`);
  };

  return (
    <div className="pt-20 font-sans text-gray-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center bg-black overflow-hidden">
        {/* Imagen de Fondo de Lujo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-10000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80')` }}
        />
        {/* Overlay degradado elegante */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
        
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/20 rounded-full animate-pulse">
            Residencias Exclusivas
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Tu propiedad ideal <br className="hidden sm:inline" />
            en <span className="text-brand-gold text-gold-gradient">Salta y Argentina</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-10 leading-relaxed font-light">
            Descubre nuestra selección curada de propiedades exclusivas. Ofrecemos asesoramiento profesional de alta gama con martilleros matriculados.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="primary" 
              onClick={() => navigate('/catalogo')}
              className="px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              Ver Propiedades
            </Button>
            <a 
              href={getWhatsappFloatingLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-transparent border border-white/20 hover:border-brand-gold rounded transition-all duration-300 hover:bg-white/5 cursor-pointer"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 2. BUSCADOR INTEGRADO */}
      <section className="relative -mt-16 z-20 max-w-4xl mx-auto px-4">
        <form 
          onSubmit={handleBuscar}
          className="p-6 sm:p-8 rounded-xl bg-brand-gray-dark border border-brand-gold/15 shadow-2xl flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-full text-left flex-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
              ¿Qué tipo de propiedad buscas?
            </label>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors duration-300 text-sm font-medium cursor-pointer"
            >
              <option value="">Todas las Operaciones</option>
              <option value="venta">Venta de Propiedades</option>
              <option value="alquiler">Alquileres</option>
              <option value="terreno">Terrenos / Lotes</option>
              <option value="tasacion">Tasaciones Profesionales</option>
            </select>
          </div>
          <Button 
            type="submit" 
            variant="primary"
            className="w-full md:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider md:self-end cursor-pointer"
          >
            Buscar Propiedad
          </Button>
        </form>
      </section>

      {/* 3. PROPIEDADES DESTACADAS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 text-left">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Selección VIP</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">Propiedades Destacadas</h2>
          </div>
          <button 
            onClick={() => navigate('/catalogo')}
            className="flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-hover transition-colors font-semibold mt-4 sm:mt-0 group cursor-pointer"
          >
            Ver catálogo completo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {loading ? (
          <div className="py-20">
            <Spinner size="lg" />
          </div>
        ) : destacadas.length === 0 ? (
          <p className="text-gray-500 py-10">No hay propiedades destacadas disponibles en este momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destacadas.map((propiedad) => (
              <PropertyCard key={propiedad.id} propiedad={propiedad} />
            ))}
          </div>
        )}
      </section>

      {/* 4. ¿POR QUÉ ELEGIRNOS? */}
      <section className="py-24 bg-[#111] border-y border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Diferenciales</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">¿Por qué elegir Jerez°Espinillo?</h2>
            <p className="max-w-xl mx-auto text-sm text-gray-500 mt-4 leading-relaxed font-light">
              Nuestra reputación se basa en la excelencia, transparencia y una visión de negocios moderna para proteger y hacer crecer tu patrimonio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-8 rounded-xl bg-brand-black border border-brand-gray-light hover:border-brand-gold/25 transition-all duration-300 text-left group">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-500">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide mb-3">Martillero Matriculado</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Garantizamos operaciones 100% seguras y legales bajo la tutela de profesionales matriculados en los colegios de corretaje correspondientes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-xl bg-brand-black border border-brand-gray-light hover:border-brand-gold/25 transition-all duration-300 text-left group">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-500">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide mb-3">Atención VIP Personalizada</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                No somos un portal masivo. Nos enfocamos en darte una atención uno a uno, guiándote de principio a fin según tus requisitos específicos.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-xl bg-brand-black border border-brand-gray-light hover:border-brand-gold/25 transition-all duration-300 text-left group">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-black transition-all duration-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white tracking-wide mb-3">Seguridad y Confianza</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                Tu patrimonio es sagrado. Llevamos a cabo auditorías y verificaciones exhaustivas de todos los títulos y estados crediticios de las propiedades.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Experiencias</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">Nuestros Clientes Opinan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Testimonio 1 */}
          <div className="p-8 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between text-left">
            <p className="text-sm text-gray-400 italic leading-relaxed font-light">
              "El profesionalismo de Jerez°Espinillo es inigualable. Me consiguieron un comprador para mi casa de San Isidro en tiempo récord y toda la papelería fue impecable. Recomiendo totalmente su asesoría personalizada."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center font-bold text-brand-gold text-sm">
                ED
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Eduardo Di Cola</h4>
                <p className="text-xs text-gray-500">Propietario en San Isidro</p>
              </div>
            </div>
          </div>

          {/* Testimonio 2 */}
          <div className="p-8 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between text-left">
            <p className="text-sm text-gray-400 italic leading-relaxed font-light">
              "Excelente atención en el alquiler temporario en CABA. El departamento estaba impecable tal cual las fotos y el servicio de WhatsApp para coordinar dudas fue veloz. Profesionalismo puro."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center font-bold text-brand-gold text-sm">
                SO
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Sofía Oneto</h4>
                <p className="text-xs text-gray-500">Inquilina en Recoleta</p>
              </div>
            </div>
          </div>

          {/* Testimonio 3 */}
          <div className="p-8 rounded-xl bg-brand-gray-dark border border-brand-gray-light flex flex-col justify-between text-left">
            <p className="text-sm text-gray-400 italic leading-relaxed font-light">
              "Buscaba un lote en Nordelta con requerimientos muy puntuales de orientación y costa. Se tomaron el trabajo de buscar fuera de catálogo hasta encontrar exactamente mi lote ideal. Invalorable servicio."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center font-bold text-brand-gold text-sm">
                HR
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Horacio Rodríguez</h4>
                <p className="text-xs text-gray-500">Inversor de Lotes</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-20 bg-brand-gold text-brand-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 z-10 flex flex-col items-center">
          <MessageSquare className="w-8 h-8 mb-4 animate-bounce" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            ¿Quieres vender, alquilar o tasar tu propiedad?
          </h2>
          <p className="max-w-xl text-brand-black/80 mb-8 font-medium">
            Contacta ahora mismo a Jerez°Espinillo vía WhatsApp y recibe asesoramiento inmediato de parte de nuestros profesionales.
          </p>
          <a
            href={getWhatsappFloatingLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-black hover:bg-brand-black/90 text-white font-bold rounded-lg shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer text-sm uppercase tracking-wider"
          >
            Hablemos por WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};
