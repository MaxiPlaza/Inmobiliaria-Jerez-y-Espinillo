import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Search, Plus, Edit2, Trash2, 
  RotateCcw, AlertTriangle 
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Spinner } from '../../components/shared/Spinner';
import type { TipoPropiedad, EstadoPropiedad, Propiedad } from '../../types';

export const Propiedades: React.FC = () => {
  const navigate = useNavigate();
  const { properties, loading, editProperty, deleteProperty } = useProperties();

  // Estados de Filtros
  const [buscar, setBuscar] = useState('');
  const [tipo, setTipo] = useState<TipoPropiedad | ''>('');
  const [estado, setEstado] = useState<EstadoPropiedad | ''>('');

  // Modales
  const [propertyToDelete, setPropertyToDelete] = useState<Propiedad | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filtrado de la tabla
  const propiedadesFiltradas = useMemo(() => {
    return properties.filter((prop) => {
      // Búsqueda por palabra clave (título o dirección)
      if (buscar.trim()) {
        const query = buscar.toLowerCase();
        const matchesTitulo = prop.titulo.toLowerCase().includes(query);
        const matchesDireccion = prop.direccion?.toLowerCase().includes(query) || false;
        if (!matchesTitulo && !matchesDireccion) return false;
      }
      
      // Filtro por tipo
      if (tipo && prop.tipo !== tipo) return false;
      
      // Filtro por estado
      if (estado && prop.estado !== estado) return false;

      return true;
    });
  }, [properties, buscar, tipo, estado]);

  // Cambiar estado de forma rápida (Dropdown change)
  const handleCambiarEstadoRapido = async (id: string, nuevoEstado: EstadoPropiedad) => {
    try {
      await editProperty(id, { estado: nuevoEstado });
    } catch (err) {
      console.error('Error al editar estado rápido', err);
    }
  };

  // Abrir confirmación de eliminación
  const handleSolicitarEliminacion = (prop: Propiedad) => {
    setPropertyToDelete(prop);
    setDeleteConfirmOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmarEliminacion = async () => {
    if (!propertyToDelete) return;
    setActionLoading(true);
    try {
      const res = await deleteProperty(propertyToDelete.id);
      if (res) {
        setDeleteConfirmOpen(false);
        setPropertyToDelete(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="lg:pl-64 pt-20 lg:pt-8 min-h-screen text-left font-sans bg-brand-black pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-gold/15">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Inventario de Propiedades</h1>
            <p className="text-xs text-gray-500 mt-1">Crea, edita, cambia estados rápidos o elimina propiedades de MagnusPropiedades</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/propiedades/nueva')}
            className="py-2.5 px-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(201,168,76,0.25)]"
          >
            <Plus className="w-4 h-4 text-brand-black" />
            Nueva Propiedad
          </Button>
        </div>

        {/* BARRA DE FILTRADO ADMIN */}
        <div className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-5 mb-8 shadow-md flex flex-col md:flex-row items-center gap-4">
          
          {/* Buscador */}
          <div className="relative flex-1 w-full text-left">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por título o ubicación..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {/* Filtro Operación */}
          <div className="w-full md:w-48 text-left">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoPropiedad | '')}
              className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="">Todas las Operaciones</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="terreno">Terreno</option>
              <option value="tasacion">Tasación</option>
            </select>
          </div>

          {/* Filtro Estado */}
          <div className="w-full md:w-48 text-left">
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoPropiedad | '')}
              className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="">Todos los Estados</option>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="alquilado">Alquilado</option>
            </select>
          </div>

          {/* Reset */}
          <Button
            variant="secondary"
            onClick={() => { setBuscar(''); setTipo(''); setEstado(''); }}
            className="w-full md:w-auto py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar
          </Button>

        </div>

        {/* TABLA PRINCIPAL RESPONSIVA (Mobile First: Se oculta en móvil para mostrar layout en cards) */}
        {loading ? (
          <div className="py-32">
            <Spinner size="lg" />
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-brand-gray-light rounded-xl bg-brand-gray-dark/50">
            <Building className="w-10 h-10 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white tracking-wide">Sin Propiedades</h3>
            <p className="text-xs text-gray-500 mt-1">No se encontraron propiedades que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-brand-gray-light bg-brand-gray-dark shadow-xl">
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="bg-[#0E0E0E] text-gray-400 border-b border-brand-gold/15 uppercase font-bold tracking-widest text-[9px]">
                    <th className="py-4.5 px-6">Propiedad</th>
                    <th className="py-4.5 px-6">Tipo</th>
                    <th className="py-4.5 px-6">Precio</th>
                    <th className="py-4.5 px-6">Estado Rápido</th>
                    <th className="py-4.5 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/5">
                  {propiedadesFiltradas.map((prop) => (
                    <tr key={prop.id} className="hover:bg-white/2 transition-colors duration-200">
                      
                      {/* Fila Miniatura e Información */}
                      <td className="py-4 px-6 flex items-center gap-4.5">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-brand-gray-light bg-brand-black">
                          <img
                            src={prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80"}
                            alt={prop.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate max-w-xs">{prop.titulo}</h4>
                          <span className="text-[10px] text-gray-500 font-medium truncate block max-w-xs mt-0.5">{prop.direccion}</span>
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="py-4 px-6 font-semibold uppercase tracking-wider text-brand-gold">
                        {prop.tipo}
                      </td>

                      {/* Precio */}
                      <td className="py-4 px-6 font-bold text-white font-sans text-sm">
                        {formatPrice(prop.precio, prop.tipo)}
                      </td>

                      {/* Dropdown de Estado Rápido */}
                      <td className="py-4 px-6 text-left">
                        <select
                          value={prop.estado}
                          onChange={(e) => handleCambiarEstadoRapido(prop.id, e.target.value as EstadoPropiedad)}
                          className="bg-[#0A0A0A] border border-brand-gray-light rounded px-2.5 py-1.5 font-semibold text-[10px] uppercase text-white tracking-wider focus:outline-none focus:border-brand-gold cursor-pointer"
                        >
                          <option value="disponible">Disponible</option>
                          <option value="reservado">Reservado</option>
                          <option value="vendido">Vendido</option>
                          <option value="alquilado">Alquilado</option>
                        </select>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/propiedades/${prop.id}/editar`)}
                            className="p-2 rounded bg-[#0A0A0A] hover:bg-white/5 border border-brand-gray-light text-gray-400 hover:text-white transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSolicitarEliminacion(prop)}
                            className="p-2 rounded bg-rose-950/20 hover:bg-rose-900/25 border border-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Para el 90% de usuarios desde móvil) */}
            <div className="md:hidden flex flex-col gap-4">
              {propiedadesFiltradas.map((prop) => (
                <div 
                  key={prop.id}
                  className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-4 flex flex-col gap-4.5 shadow-md text-left"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-brand-gray-light">
                      <img
                        src={prop.imagenes && prop.imagenes.length > 0 ? prop.imagenes[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80"}
                        alt={prop.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-sm truncate">{prop.titulo}</h4>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{prop.direccion}</p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-xs font-bold text-brand-gold tracking-wide">{formatPrice(prop.precio, prop.tipo)}</span>
                        <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider bg-[#0A0A0A] border border-brand-gray-light px-2 py-0.5 rounded">{prop.tipo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fila Acciones e Interruptor Estado */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-brand-gold/10">
                    <select
                      value={prop.estado}
                      onChange={(e) => handleCambiarEstadoRapido(prop.id, e.target.value as EstadoPropiedad)}
                      className="bg-[#0A0A0A] border border-brand-gray-light rounded px-2.5 py-1.5 font-bold text-[9px] uppercase text-white tracking-wider focus:outline-none focus:border-brand-gold cursor-pointer"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                      <option value="alquilado">Alquilado</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/propiedades/${prop.id}/editar`)}
                        className="px-3 py-1.5 rounded bg-[#0A0A0A] border border-brand-gray-light text-gray-400 hover:text-white flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleSolicitarEliminacion(prop)}
                        className="px-3 py-1.5 rounded bg-rose-950/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Borrar
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

        {/* MODAL DE CONFIRMACION DE BORRADO */}
        <Modal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          title="Confirmar Eliminación"
        >
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-start gap-3 p-3.5 bg-rose-950/15 border border-rose-500/20 rounded-lg text-rose-400 text-xs leading-relaxed">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block mb-1">¡Esta acción no se puede deshacer!</span>
                Estás a punto de eliminar de forma permanente la propiedad <span className="font-semibold text-white">"{propertyToDelete?.titulo}"</span> y todas sus imágenes asociadas de Supabase Storage.
              </div>
            </div>
            
            <p className="text-xs text-gray-400">
              ¿Estás seguro de que deseas proceder con la eliminación?
            </p>

            <div className="flex justify-end gap-3 mt-4 border-t border-brand-gold/10 pt-4">
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={actionLoading}
                className="py-2 font-semibold text-xs uppercase"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmarEliminacion}
                isLoading={actionLoading}
                className="py-2 px-5 font-bold text-xs uppercase shadow-[0_4px_12px_rgba(239,68,68,0.15)]"
              >
                Eliminar Propiedad
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};
