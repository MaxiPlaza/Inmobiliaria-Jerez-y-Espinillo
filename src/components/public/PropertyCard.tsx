import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Ruler } from 'lucide-react';
import type { Propiedad } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { Badge } from '../shared/Badge';

interface PropertyCardProps {
  propiedad: Propiedad;
}

// Imagen por defecto en caso de que no tenga fotos cargadas
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

export const PropertyCard: React.FC<PropertyCardProps> = ({ propiedad }) => {
  const {
    id,
    titulo,
    precio,
    tipo,
    estado,
    direccion,
    metros_cuadrados,
    ambientes,
    banos,
    imagenes
  } = propiedad;

  // Obtener la imagen principal o usar placeholder
  const imagenPrincipal = imagenes && imagenes.length > 0 ? imagenes[0] : PLACEHOLDER_IMAGE;

  return (
    <div className="group flex flex-col bg-brand-gray-dark border border-brand-gray-light hover:border-brand-gold/30 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1">
      
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imagenPrincipal}
          alt={titulo}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay gradiente oscuro inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Badge de Estado */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant={estado}>
            {estado === 'disponible' ? 'Disponible' : estado === 'reservado' ? 'Reservado' : estado === 'vendido' ? 'Vendido' : 'Alquilado'}
          </Badge>
        </div>

        {/* Badge de Operación */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/85 text-brand-gold border border-brand-gold/25">
            {tipo === 'venta' ? 'Venta' : tipo === 'alquiler' ? 'Alquiler' : tipo === 'terreno' ? 'Terreno' : 'Tasación'}
          </span>
        </div>
      </div>

      {/* Contenido Técnico */}
      <div className="flex-1 flex flex-col p-5">
        
        {/* Título y Dirección */}
        <div className="text-left mb-3">
          <h3 className="text-lg font-semibold text-white tracking-wide group-hover:text-brand-gold transition-colors duration-200 line-clamp-1">
            {titulo}
          </h3>
          <p className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="line-clamp-1">{direccion || 'Salta, Argentina'}</span>
          </p>
        </div>

        {/* Precio Formateado */}
        <div className="text-left pb-4 border-b border-brand-gold/10 mb-4">
          <span className="text-xl font-bold text-brand-gold font-sans tracking-wide">
            {formatPrice(precio, tipo)}
          </span>
        </div>

        {/* Características Técnicas */}
        <div className="flex items-center justify-between text-gray-400 text-xs font-medium mt-auto">
          {ambientes !== undefined && (
            <div className="flex items-center gap-1.5" title="Dormitorios / Ambientes">
              <BedDouble className="w-4 h-4 text-brand-gold/80" />
              <span>{ambientes} {ambientes === 1 ? 'Amb.' : 'Amb.'}</span>
            </div>
          )}
          {banos !== undefined && (
            <div className="flex items-center gap-1.5" title="Baños">
              <Bath className="w-4 h-4 text-brand-gold/80" />
              <span>{banos} {banos === 1 ? 'Baño' : 'Baños'}</span>
            </div>
          )}
          {metros_cuadrados !== undefined && (
            <div className="flex items-center gap-1.5" title="Metros Cuadrados">
              <Ruler className="w-4 h-4 text-brand-gold/80" />
              <span>{metros_cuadrados} m²</span>
            </div>
          )}
        </div>

        {/* Acción CTA */}
        <Link
          to={`/propiedad/${id}`}
          className="mt-5 w-full py-2.5 inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wider text-white bg-transparent border border-brand-gold/20 hover:border-brand-gold/60 rounded-lg hover:bg-brand-gold/5 transition-all duration-300 cursor-pointer"
        >
          Ver Detalle
        </Link>
      </div>

    </div>
  );
};
