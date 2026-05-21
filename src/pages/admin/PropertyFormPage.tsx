import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building, Info, MapPin, Maximize2, Compass, Droplet, Star } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Spinner } from '../../components/shared/Spinner';
import { ImageUpload } from '../../components/admin/ImageUpload';
import type { TipoPropiedad, EstadoPropiedad } from '../../types';

export const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProperty, editProperty, getPropertyById } = useProperties();

  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados del Formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [tipo, setTipo] = useState<TipoPropiedad>('venta');
  const [estado, setEstado] = useState<EstadoPropiedad>('disponible');
  const [direccion, setDireccion] = useState('');
  const [metrosCuadrados, setMetrosCuadrados] = useState<number | ''>('');
  const [ambientes, setAmbientes] = useState<number | ''>('');
  const [banos, setBanos] = useState<number | ''>('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [destacada, setDestacada] = useState(false);

  // Cargar propiedad si estamos editando
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const prop = await getPropertyById(id);
        if (prop) {
          setTitulo(prop.titulo);
          setDescripcion(prop.descripcion);
          setPrecio(prop.precio);
          setTipo(prop.tipo);
          setEstado(prop.estado);
          setDireccion(prop.direccion);
          setMetrosCuadrados(prop.metros_cuadrados);
          setAmbientes(prop.ambientes);
          setBanos(prop.banos);
          setImagenes(prop.imagenes || []);
          setDestacada(prop.destacada || false);
        } else {
          setErrorMsg('No se encontró la propiedad solicitada.');
        }
      } catch (err) {
        console.error('Error cargando propiedad', err);
        setErrorMsg('Error al cargar los datos de la propiedad.');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, getPropertyById]);

  // Manejador del Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validación Básica
    if (!titulo.trim()) return setErrorMsg('El título es requerido.');
    if (!descripcion.trim()) return setErrorMsg('La descripción es requerida.');
    if (precio === '' || precio <= 0) return setErrorMsg('Ingrese un precio válido mayor a 0.');
    if (!direccion.trim()) return setErrorMsg('La dirección es requerida.');
    if (metrosCuadrados === '' || metrosCuadrados <= 0) return setErrorMsg('Ingrese metros cuadrados válidos mayores a 0.');
    
    setSaving(true);

    const datosPropiedad = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      tipo,
      estado,
      direccion: direccion.trim(),
      metros_cuadrados: Number(metrosCuadrados),
      ambientes: Number(ambientes) || 0,
      banos: Number(banos) || 0,
      imagenes,
      destacada
    };

    try {
      if (isEditing && id) {
        const ok = await editProperty(id, datosPropiedad);
        if (ok) {
          setSuccessMsg('¡Propiedad actualizada con éxito!');
          setTimeout(() => navigate('/admin/propiedades'), 1500);
        } else {
          throw new Error('No se pudo guardar la propiedad.');
        }
      } else {
        const prop = await addProperty(datosPropiedad);
        if (prop) {
          setSuccessMsg('¡Propiedad creada con éxito!');
          setTimeout(() => navigate('/admin/propiedades'), 1500);
        } else {
          throw new Error('No se pudo crear la propiedad.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error inesperado al guardar la propiedad.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:pl-64 pt-20 lg:pt-8 min-h-screen flex items-center justify-center bg-brand-black">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="lg:pl-64 pt-20 lg:pt-8 min-h-screen text-left font-sans bg-brand-black pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Enlace de retroceso */}
        <button
          onClick={() => navigate('/admin/propiedades')}
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-brand-gold transition-colors mb-6 uppercase tracking-wider font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Propiedades
        </button>

        {/* Cabecera */}
        <div className="pb-6 mb-8 border-b border-brand-gold/15">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Building className="w-7 h-7 text-brand-gold" />
            {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isEditing 
              ? 'Modifica los detalles, características y galería de fotos de la propiedad existente.' 
              : 'Agrega una nueva residencia premium al catálogo oficial de Jerez°Espinillo.'}
          </p>
        </div>

        {/* Mensajes de Alerta */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs leading-relaxed font-semibold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs leading-relaxed font-bold">
            {successMsg}
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* SECCIÓN 1: Información Básica */}
          <div className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-5 sm:p-6 shadow-md flex flex-col gap-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2 pb-3.5 border-b border-brand-gold/10">
              <Info className="w-4 h-4" />
              Detalles Generales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Título de la propiedad"
                  placeholder="Ej. Mansión Minimalista con Vista al Lago"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2 text-left">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  placeholder="Escriba aquí los aspectos premium de la propiedad, materiales de construcción, ubicación estratégica, comodidades..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={5}
                  required
                  className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all font-sans leading-relaxed resize-y"
                />
              </div>

              <div>
                <Input
                  type="number"
                  label="Precio de lista"
                  placeholder="Ej. 1250000"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tipo de Operación
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoPropiedad)}
                  className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all cursor-pointer font-semibold"
                >
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                  <option value="terreno">Terreno</option>
                  <option value="tasacion">Tasación</option>
                </select>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Estado de Disponibilidad
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EstadoPropiedad)}
                  className="w-full bg-[#0A0A0A] border border-brand-gray-light rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 transition-all cursor-pointer font-semibold"
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                  <option value="alquilado">Alquilado</option>
                </select>
              </div>

              {/* Interruptor Propiedad Destacada */}
              <div className="flex items-center justify-between border border-brand-gray-light bg-[#0A0A0A] rounded-lg p-3 sm:px-4">
                <div className="flex items-center gap-2.5">
                  <Star className={`w-5 h-5 ${destacada ? 'text-brand-gold fill-brand-gold' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Propiedad Destacada</span>
                    <span className="text-[10px] text-gray-500">Aparecerá en los banners principales de la página pública</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={destacada}
                    onChange={(e) => setDestacada(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-brand-gray-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-gold peer-checked:after:bg-brand-black peer-checked:after:border-brand-black"></div>
                </label>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Ubicación y Métricas */}
          <div className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-5 sm:p-6 shadow-md flex flex-col gap-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2 pb-3.5 border-b border-brand-gold/10">
              <MapPin className="w-4 h-4" />
              Ubicación y Dimensiones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Dirección Completa"
                  placeholder="Ej. Av. del Libertador 4500, Palermo Chico, CABA"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="number"
                  label="Metros Cuadrados Totales"
                  placeholder="Ej. 180"
                  value={metrosCuadrados}
                  onChange={(e) => setMetrosCuadrados(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  icon={<Maximize2 className="w-4 h-4 text-gray-500" />}
                />
              </div>

              <div>
                <Input
                  type="number"
                  label="Cantidad de Ambientes"
                  placeholder="Ej. 3"
                  value={ambientes}
                  onChange={(e) => setAmbientes(e.target.value === '' ? '' : Number(e.target.value))}
                  icon={<Compass className="w-4 h-4 text-gray-500" />}
                />
              </div>

              <div>
                <Input
                  type="number"
                  label="Cantidad de Baños"
                  placeholder="Ej. 2"
                  value={banos}
                  onChange={(e) => setBanos(e.target.value === '' ? '' : Number(e.target.value))}
                  icon={<Droplet className="w-4 h-4 text-gray-500" />}
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Galería de Imágenes (Drag & Drop + Compresión cliente) */}
          <div className="bg-brand-gray-dark border border-brand-gray-light rounded-xl p-5 sm:p-6 shadow-md">
            <ImageUpload 
              images={imagenes}
              onChange={setImagenes}
              propertyId={id}
            />
          </div>

          {/* SECCIÓN 4: Botones de Acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-3.5 border-t border-brand-gold/10 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/propiedades')}
              disabled={saving}
              className="py-3 px-6 text-xs font-bold uppercase tracking-wider"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              className="py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(201,168,76,0.3)]"
            >
              <Save className="w-4 h-4 text-brand-black" />
              {isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
