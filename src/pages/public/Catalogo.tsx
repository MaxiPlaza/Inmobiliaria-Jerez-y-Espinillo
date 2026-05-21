import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw, X } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { PropertyCard } from '../../components/public/PropertyCard';
import { Button } from '../../components/shared/Button';
import { Spinner } from '../../components/shared/Spinner';
import type { TipoPropiedad, EstadoPropiedad } from '../../types';

export const Catalogo: React.FC = () => {
  const { properties, loading } = useProperties();
  const location = useLocation();

  // Estados de filtros
  const [buscar, setBuscar] = useState('');
  const [tipo, setTipo] = useState<TipoPropiedad | ''>('');
  const [estado, setEstado] = useState<EstadoPropiedad | ''>('');
  const [precioMin, setPrecioMin] = useState<number | ''>('');
  const [precioMax, setPrecioMax] = useState<number | ''>('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Cantidad visible de propiedades para paginación (Cargar Más)
  const [visibleCount, setVisibleCount] = useState(6);

  // Cargar filtro inicial desde la query string (por ejemplo: si viene del home)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipoParam = params.get('tipo') as TipoPropiedad;
    if (tipoParam) {
      setTipo(tipoParam);
    }
  }, [location]);

  // Limpiar filtros
  const handleLimpiarFiltros = () => {
    setBuscar('');
    setTipo('');
    setEstado('');
    setPrecioMin('');
    setPrecioMax('');
  };

  // Filtrado de propiedades memorizado
  const propiedadesFiltradas = useMemo(() => {
    return properties.filter((prop) => {
      // 1. Filtro por buscador (título o dirección)
      if (buscar.trim()) {
        const query = buscar.toLowerCase();
        const matchesTitulo = prop.titulo.toLowerCase().includes(query);
        const matchesDireccion = prop.direccion?.toLowerCase().includes(query) || false;
        if (!matchesTitulo && !matchesDireccion) return false;
      }

      // 2. Filtro por tipo de operación
      if (tipo && prop.tipo !== tipo) return false;

      // 3. Filtro por estado
      if (estado && prop.estado !== estado) return false;

      // 4. Filtro por precio mínimo
      if (precioMin !== '' && prop.precio !== null && prop.precio < precioMin) return false;

      // 5. Filtro por precio máximo
      if (precioMax !== '' && prop.precio !== null && prop.precio > precioMax) return false;

      return true;
    });
  }, [properties, buscar, tipo, estado, precioMin, precioMax]);

  const handleCargarMas = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const propiedadesVisibles = propiedadesFiltradas.slice(0, visibleCount);

  return (
    <div className="pt-24 pb-20 font-sans text-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-left mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
            Catálogo de Propiedades
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1.5 mb-3">
            Explora Nuestra Selección Curada
          </h1>
          <p className="text-sm text-gray-500 font-light max-w-2xl leading-relaxed">
            Residencias exclusivas y oportunidades de inversión inmobiliaria de alta gama en Argentina. Utiliza los filtros a continuación para refinar tu búsqueda.
          </p>
        </div>

        {/* BARRA DE FILTROS DESKTOP */}
        <div className="hidden lg:block bg-brand-gray-dark border border-brand-gray-light rounded-xl p-6 mb-8 shadow-md">
          <div className="grid grid-cols-5 gap-4 items-end">
            
            {/* Buscador por texto */}
            <div className="col-span-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Buscar por palabra clave
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Ej: San Isidro, Alvear, Terreno..."
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors duration-200"
                />
              </div>
            </div>

            {/* Tipo de Operación */}
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Operación
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoPropiedad | '')}
                className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors duration-200 cursor-pointer"
              >
                <option value="">Cualquiera</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
                <option value="terreno">Terreno</option>
                <option value="tasacion">Tasación</option>
              </select>
            </div>

            {/* Estado */}
            <div className="text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoPropiedad | '')}
                className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors duration-200 cursor-pointer"
              >
                <option value="">Cualquiera</option>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
                <option value="alquilado">Alquilado</option>
              </select>
            </div>

            {/* Limpiar Filtros */}
            <div className="text-left">
              <Button
                variant="secondary"
                onClick={handleLimpiarFiltros}
                className="w-full py-2.5 flex items-center justify-center gap-2 cursor-pointer font-bold uppercase tracking-wider text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar
              </Button>
            </div>

            {/* Rango de Precios */}
            <div className="col-span-2 text-left mt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
                Rango de Precio
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
                <span className="text-gray-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ACCIONES MÓVILES (Filtros y Búsqueda Rápida) */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="relative flex-1 text-left">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors duration-200"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center justify-center p-3 rounded-lg bg-brand-gray-dark border border-brand-gold/25 hover:border-brand-gold text-brand-gold transition-all duration-300 cursor-pointer"
            aria-label="Filtros"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* DRAWER DE FILTROS MÓVILES */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-[#0E0E0E] h-full p-6 border-l border-brand-gold/15 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="text-left">
                <div className="flex items-center justify-between pb-4 border-b border-brand-gold/10 mb-6">
                  <h3 className="text-lg font-bold text-white tracking-wide">Filtros Avanzados</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-brand-gold cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Operación */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Operación</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as TipoPropiedad | '')}
                      className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    >
                      <option value="">Todas</option>
                      <option value="venta">Venta</option>
                      <option value="alquiler">Alquiler</option>
                      <option value="terreno">Terreno</option>
                      <option value="tasacion">Tasación</option>
                    </select>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Estado</label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value as EstadoPropiedad | '')}
                      className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    >
                      <option value="">Todos</option>
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                      <option value="alquilado">Alquilado</option>
                    </select>
                  </div>

                  {/* Rango Precios */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Precio Rango</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        value={precioMin}
                        onChange={(e) => setPrecioMin(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        value={precioMax}
                        onChange={(e) => setPrecioMax(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <Button
                  variant="primary"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-2.5 font-bold uppercase text-xs"
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleLimpiarFiltros();
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2 font-bold uppercase text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpiar Todo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CANTIDAD ENCONTRADA */}
        <div className="text-left mb-6 text-xs text-gray-500 font-medium tracking-wide">
          Se encontraron <span className="text-brand-gold font-bold">{propiedadesFiltradas.length}</span> propiedades en base a tu búsqueda.
        </div>

        {/* LOADING & PROP GRID */}
        {loading ? (
          <div className="py-32">
            <Spinner size="lg" />
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-brand-gray-light rounded-xl bg-brand-gray-dark/50">
            <SlidersHorizontal className="w-10 h-10 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white tracking-wide">Sin resultados</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
              No hemos encontrado propiedades que coincidan con los criterios seleccionados. Prueba a flexibilizar tus filtros o a limpiar la búsqueda.
            </p>
            <Button
              variant="secondary"
              onClick={handleLimpiarFiltros}
              className="mt-6 font-bold uppercase text-xs"
            >
              Limpiar Todos los Filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {propiedadesVisibles.map((propiedad) => (
                <PropertyCard key={propiedad.id} propiedad={propiedad} />
              ))}
            </div>

            {/* BOTÓN CARGAR MÁS */}
            {propiedadesVisibles.length < propiedadesFiltradas.length && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={handleCargarMas}
                  className="px-8 py-3.5 border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(201,168,76,0.05)]"
                >
                  Cargar Más Propiedades
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
