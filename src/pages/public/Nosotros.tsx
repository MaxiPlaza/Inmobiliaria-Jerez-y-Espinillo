import React from 'react';
import { Award, Target, Eye, Users } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { useNavigate } from 'react-router-dom';

export const Nosotros: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 font-sans text-gray-200 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Nuestra Firma</span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2 mb-4">Bienvenidos a MagnusPropiedades</h1>
          <p className="max-w-xl mx-auto text-sm text-gray-500 leading-relaxed font-light">
            Una empresa salteña que surge de la fusión de dos visiones complementarias.
          </p>
        </div>

        {/* Sección Historia e Imagen */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Texto Historia */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Corredor Inmobiliario y Martillero Publico <br />
              & <span className="text-brand-gold text-gold-gradient">Oscar Daniel Espinillo Cifuentes y la Dra. Claudia Jerez, Abogada</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Comprometidos con brindar soluciones inmobilirias confiables, profesionales y personalizadas.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Nos especializamos en la compra, venta, alquiler, administración y tasación de propiedades, acompañando a nuestros clientes en cada etapa del proceso con transparencia, responsabilidad y atención cercana.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-brand-black bg-brand-gold flex items-center justify-center font-bold text-brand-black text-xs">JE</div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-black bg-brand-gray-light flex items-center justify-center font-bold text-white text-xs">ME</div>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Asesorado por <span className="text-white font-semibold">Oscar Daniel Espinillo</span> y la Dra. Claudia Jerez.
              </p>
            </div>
          </div>

          {/* Placeholder para foto de equipo (Moderno render de oficina premium) */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-brand-gold/15 bg-brand-gray-dark group">
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" 
              alt="Oficina Jerez Espinillo" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
            
            {/* Sello de Calidad / Matriculado */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 bg-brand-black/85 backdrop-blur border border-brand-gold/20 p-4 rounded-lg">
              <Award className="w-8 h-8 text-brand-gold shrink-0 animate-pulse" />
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-widest text-gray-500">Profesionales Habilitados</span>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">Matrícula C.C.I. Salta</span>
              </div>
            </div>
          </div>

        </section>

        {/* Sección Misión / Visión */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* Misión */}
          <div className="p-8 rounded-xl bg-brand-gray-dark border border-brand-gray-light text-left">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold mb-6">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-3">Nuestra Misión</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Brindar soluciones inmobiliarias de alto nivel técnico y comercial, resguardando en todo momento el capital de nuestros clientes y garantizando el marco legal en transacciones de compraventa, alquiler y loteo.
            </p>
          </div>

          {/* Objetivo */}
          <div className="p-8 rounded-xl bg-brand-gray-dark border border-brand-gray-light text-left">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold mb-6">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-wide mb-3">Nuestro Objetivo</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              Nuestro objetivo es ayudar a familias, emprendedores e inversores a encontrar las mejores oportunidades inmobiliarias en la provincia de Salta, ofreciendo un servicio basado en la confianza, el compromiso y la excelencia profesional. En MagnusPropiedades entendemos que cada propiedad es mucho más que una operación comercial: es un proyecto de vida.
            </p>
          </div>

        </section>

        {/* CTA a contacto */}
        <section className="text-center bg-[#111] border border-brand-gold/15 rounded-xl p-8 sm:p-12 shadow-2xl flex flex-col items-center">
          <Users className="w-8 h-8 text-brand-gold mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">¿Listo para dar el siguiente paso?</h2>
          <p className="text-sm text-gray-500 leading-relaxed font-light max-w-lg mb-8">
            Coordinemos una entrevista en nuestras oficinas para diagramar la mejor estrategia comercial para tu propiedad.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/contacto')}
            className="px-8 py-3.5 font-bold uppercase tracking-wider text-xs cursor-pointer"
          >
            Contactar Equipo
          </Button>
        </section>

      </div>
    </div>
  );
};
