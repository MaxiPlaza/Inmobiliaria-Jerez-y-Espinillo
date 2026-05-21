import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, BedDouble, Bath, Ruler, ArrowLeft, Check, Share2, 
  ChevronLeft, ChevronRight, MessageCircle, Map 
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import type { Propiedad as PropiedadType } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { Badge } from '../../components/shared/Badge';
import { Spinner } from '../../components/shared/Spinner';
import { getWhatsappPropertyLink } from '../../utils/whatsappLink';

// Imagen por defecto
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

export const Propiedad: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, incrementVisits } = useProperties();
  
  const [propiedad, setPropiedad] = useState<PropiedadType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [compartido, setCompartido] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getPropertyById(id);
      if (data) {
        setPropiedad(data);
        // Incrementar métrica de visitas en segundo plano
        incrementVisits(data.id);
      } else {
        setPropiedad(null);
      }
      setLoading(false);
    };

    fetchDetalle();
  }, [id, getPropertyById, incrementVisits]);

  const handleCompartir = () => {
    navigator.clipboard.writeText(window.location.href);
    setCompartido(true);
    setTimeout(() => setCompartido(false), 2500);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white tracking-wide">Propiedad no encontrada</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">La propiedad que estás buscando no existe o fue dada de baja recientemente.</p>
        <Link to="/catalogo" className="mt-8 inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-hover font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Desestructuración
  const {
    titulo,
    descripcion,
    precio,
    tipo,
    estado,
    direccion,
    metros_cuadrados,
    ambientes,
    banos,
    imagenes
  } = propiedad;

  const listImagenes = imagenes && imagenes.length > 0 ? imagenes : [PLACEHOLDER_IMAGE];

  // Características destacadas estáticas (reflejan el mockup)
  const caracteristicasDestacadas = [
    "Seguridad 24hs", "Piscina Privada", "Losa Radiante",
    "Ascensor Privado", "Gimnasio", "Dependencia de Servicio"
  ];

  return (
    <div className="pt-24 pb-20 font-sans text-gray-200 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & VOLVER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide">
            <Link to="/" className="hover:text-brand-gold transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-brand-gold transition-colors">Propiedades</Link>
            <span>/</span>
            <span className="text-gray-300 font-semibold truncate max-w-xs">{titulo}</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-hover font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver Atrás
          </button>
        </div>

        {/* GALERÍA DE IMÁGENES PREMIUM (ASIMÉTRICA COMO EL MOCKUP) */}
        <section className="mb-12">
          {listImagenes.length >= 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[500px]">
              {/* Imagen Principal (Grande, ocupa 2/3 en desktop) */}
              <div className="relative md:col-span-2 rounded-xl overflow-hidden group shadow-lg bg-brand-gray-dark border border-brand-gray-light">
                <img
                  src={listImagenes[activeImageIndex]}
                  alt={`${titulo} principal`}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                
                {/* Badge de Estado sobre la foto principal */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant={estado}>
                    {estado === 'disponible' ? 'Disponible' : estado === 'reservado' ? 'Reservado' : estado === 'vendido' ? 'Vendido' : 'Alquilado'}
                  </Badge>
                </div>

                {/* Controles de Slider si hay múltiples fotos */}
                {listImagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(prev => prev === 0 ? listImagenes.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-brand-gold hover:text-brand-black transition-all cursor-pointer"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-5 h-5 text-white hover:text-inherit" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(prev => prev === listImagenes.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-brand-gold hover:text-brand-black transition-all cursor-pointer"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-5 h-5 text-white hover:text-inherit" />
                    </button>
                  </>
                )}
              </div>

              {/* Columna lateral de miniaturas (2 fotos apiladas) */}
              <div className="hidden md:flex flex-col gap-4">
                {listImagenes.slice(1, 3).map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImageIndex(index + 1)}
                    className="relative flex-1 rounded-xl overflow-hidden border border-brand-gray-light hover:border-brand-gold/40 cursor-pointer shadow-md group"
                  >
                    <img
                      src={img}
                      alt={`${titulo} miniatura ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Galería clásica simple
            <div className="relative aspect-[16/9] max-h-[500px] rounded-xl overflow-hidden shadow-lg border border-brand-gray-light">
              <img
                src={listImagenes[0]}
                alt={titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10">
                <Badge variant={estado}>
                  {estado}
                </Badge>
              </div>
            </div>
          )}

          {/* Carrusel de miniaturas (Mobile / Desktop completo) */}
          {listImagenes.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-3 mt-4">
              {listImagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-brand-gold scale-102 shadow-md' : 'border-brand-gray-light opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* DETALLE PRINCIPAL: GRID 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN (2/3 de ancho) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Título y Dirección */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                {tipo === 'venta' ? 'Propiedad en Venta' : tipo === 'alquiler' ? 'Propiedad en Alquiler' : tipo === 'terreno' ? 'Terreno Exclusivo' : 'Tasación Especial'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                {titulo}
              </h2>
              <p className="flex items-center gap-1.5 mt-3 text-sm text-gray-500 font-medium">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{direccion || 'Salta, Argentina'}</span>
              </p>
            </div>

            {/* Fila de características técnicas en píldoras */}
            <div className="grid grid-cols-3 gap-4 border-y border-brand-gold/10 py-6 text-gray-300">
              <div className="flex flex-col sm:flex-row items-center gap-2 justify-center py-2 bg-brand-gray-dark/45 border border-brand-gray-light/30 rounded-lg">
                <Ruler className="w-4.5 h-4.5 text-brand-gold" />
                <div className="text-center sm:text-left">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold">Área Total</span>
                  <span className="text-sm font-semibold text-white">{metros_cuadrados} m²</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 justify-center py-2 bg-brand-gray-dark/45 border border-brand-gray-light/30 rounded-lg">
                <BedDouble className="w-4.5 h-4.5 text-brand-gold" />
                <div className="text-center sm:text-left">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold">Dormitorios</span>
                  <span className="text-sm font-semibold text-white">{ambientes}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 justify-center py-2 bg-brand-gray-dark/45 border border-brand-gray-light/30 rounded-lg">
                <Bath className="w-4.5 h-4.5 text-brand-gold" />
                <div className="text-center sm:text-left">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold">Baños</span>
                  <span className="text-sm font-semibold text-white">{banos}</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide mb-4 pb-2 border-b border-brand-gold/10">
                Descripción
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light whitespace-pre-line">
                {descripcion || 'No se ha provisto una descripción para esta propiedad.'}
              </p>
            </div>

            {/* Características Adicionales */}
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide mb-5 pb-2 border-b border-brand-gold/10">
                Características Principales
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caracteristicasDestacadas.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-1 text-sm text-gray-300">
                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-light">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ubicación en Google Maps (Enlace interactivo estético) */}
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide mb-4 pb-2 border-b border-brand-gold/10">
                Ubicación
              </h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center h-48 rounded-xl overflow-hidden border border-brand-gray-light bg-brand-gray-dark shadow-inner cursor-pointer"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                <div className="relative z-10 flex flex-col items-center gap-2.5">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold group-hover:scale-110 transition-transform duration-300">
                    <Map className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">Ver Mapa Interactivo</span>
                  <span className="text-[10px] text-gray-500 font-medium px-4 text-center">{direccion}</span>
                </div>
              </a>
            </div>

          </div>

          {/* COLUMNA DERECHA: TARJETA DE PRECIO Y CONTACTO STICKY (1/3 de ancho) */}
          <div className="lg:sticky lg:top-28 bg-[#101010] border border-brand-gold/20 rounded-xl p-6 shadow-2xl flex flex-col gap-6 text-left">
            
            {/* Cabecera Precio */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Precio de Venta</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-gold mt-1 font-sans tracking-wide">
                {formatPrice(precio, tipo)}
              </div>
            </div>

            {/* Perfil del Agente (Martín Espinillo) */}
            <div className="flex items-center gap-4 py-4 border-y border-brand-gold/10">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-gold/20 bg-brand-gray-dark flex items-center justify-center text-brand-gold font-bold">
                ME
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Martín Espinillo</h4>
                <p className="text-xs text-gray-500 font-medium">Director Comercial Jerez°Espinillo</p>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="flex flex-col gap-3">
              <a
                href={getWhatsappPropertyLink(titulo, id || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-wider text-xs rounded-lg transition-all duration-300 hover:scale-[1.01] shadow-[0_4px_14px_rgba(201,168,76,0.25)] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar por WhatsApp
              </a>

              <button
                onClick={handleCompartir}
                className="w-full py-3 inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-white border border-brand-gold/30 hover:border-brand-gold/60 font-semibold uppercase tracking-wider text-xs rounded-lg transition-all duration-300 cursor-pointer"
              >
                {compartido ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Enlace Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-brand-gold" />
                    <span>Compartir Propiedad</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-gray-500 leading-relaxed text-center italic mt-2">
              Se coordinan visitas privadas únicamente bajo reserva telefónica previa de parte de nuestros martilleros matriculados.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
