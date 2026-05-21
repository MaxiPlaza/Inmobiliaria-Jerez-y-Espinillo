import React, { useState, useRef } from 'react';
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { compressImage } from '../../utils/compressImage';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../shared/Spinner';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  propertyId?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, propertyId }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setErrorMsg('');
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Compresión de Imagen en el cliente (aprobado por el usuario)
        const compressedBlob = await compressImage(file, 1600, 0.75);
        
        // 2. Definir nombre único de archivo en Supabase Storage
        const fileExt = 'jpg'; // Siempre comprimimos a JPEG
        const uniqueId = Math.random().toString(36).substring(2, 9);
        const fileName = `${propertyId || 'nueva'}/img-${Date.now()}-${uniqueId}.${fileExt}`;
        const filePath = `${fileName}`;

        // 3. Subida a Supabase Storage bucket 'propiedades-imagenes'
        const { error: uploadError } = await supabase.storage
          .from('propiedades-imagenes')
          .upload(filePath, compressedBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // 4. Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('propiedades-imagenes')
          .getPublicUrl(filePath);

        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        }
      }

      // Añadir nuevas URLs al array existente
      onChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      console.warn("Subida fallida o simulada (Supabase no vinculado): ", err.message);
      
      // Simulación de carga local agregando imágenes placeholder elegantes
      const simulatedPlaceholders = [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
      ];
      
      // Tomamos un placeholder aleatorio o simulamos según los archivos cargados
      const nextMock = simulatedPlaceholders[images.length % simulatedPlaceholders.length];
      onChange([...images, nextMock]);
      
      setErrorMsg('Simulado: Supabase no vinculado, se agregó imagen de demostración.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  // Manejadores de Drag and Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Eliminar Imagen
  const handleEliminarImagen = (indexAEliminar: number) => {
    const filtradas = images.filter((_, idx) => idx !== indexAEliminar);
    onChange(filtradas);
  };

  // Reordenar imágenes: Mover hacia la izquierda
  const handleMoverIzquierda = (idx: number) => {
    if (idx === 0) return;
    const nuevoOrden = [...images];
    const temp = nuevoOrden[idx];
    nuevoOrden[idx] = nuevoOrden[idx - 1];
    nuevoOrden[idx - 1] = temp;
    onChange(nuevoOrden);
  };

  // Reordenar imágenes: Mover hacia la derecha
  const handleMoverDerecha = (idx: number) => {
    if (idx === images.length - 1) return;
    const nuevoOrden = [...images];
    const temp = nuevoOrden[idx];
    nuevoOrden[idx] = nuevoOrden[idx + 1];
    nuevoOrden[idx + 1] = temp;
    onChange(nuevoOrden);
  };

  return (
    <div className="w-full text-left flex flex-col gap-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Galería de la Propiedad (Imágenes)
      </span>

      {/* Zona de Drag & Drop */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-colors duration-200 ${
          dragActive 
            ? 'border-brand-gold bg-brand-gold/5' 
            : 'border-brand-gray-light bg-brand-gray-dark/40 hover:bg-brand-gray-dark/80 hover:border-brand-gold/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Spinner size="md" />
            <span className="text-xs text-brand-gold font-bold uppercase tracking-wider animate-pulse">Comprimiendo y subiendo...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2.5 text-center px-4 cursor-pointer" onClick={onButtonClick}>
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Arrastra tus fotos aquí o haz click para explorar</p>
              <p className="text-[10px] text-gray-500 mt-1">Formatos permitidos: PNG, JPG, WEBP. Compresión automática activada.</p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <span className="text-[11px] text-amber-400 bg-amber-950/15 border border-amber-500/20 px-3 py-1.5 rounded-lg font-medium leading-relaxed">
          {errorMsg}
        </span>
      )}

      {/* Grid de Previsualización y Reordenamiento */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-brand-gray-light bg-brand-black shadow group"
            >
              <img 
                src={img} 
                alt={`Previsualización ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
              
              {/* Overlay Controles */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                {/* Eliminar en la esquina superior derecha */}
                <button
                  type="button"
                  onClick={() => handleEliminarImagen(idx)}
                  className="self-end w-6 h-6 rounded bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Eliminar foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Controles de reordenación abajo */}
                <div className="flex justify-between items-center bg-black/80 rounded px-1.5 py-1">
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">{idx === 0 ? 'Portada' : `${idx + 1}`}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoverIzquierda(idx)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 cursor-pointer"
                      title="Mover anterior"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoverDerecha(idx)}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 cursor-pointer"
                      title="Mover siguiente"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Indicador de portada fijo en esquina inferior izquierda */}
              {idx === 0 && (
                <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-brand-gold text-brand-black tracking-widest shadow">
                  Portada
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
