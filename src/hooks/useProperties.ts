import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Propiedad } from '../types';

// Mock data realista para respaldar la experiencia de usuario si Supabase no está configurado aún
export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: "p1-villa-los-robles",
    titulo: "Villa Los Robles",
    descripcion: "Una residencia de ensueño que combina el encanto de la naturaleza con el confort moderno. Ubicada en uno de los barrios más exclusivos de San Isidro, esta propiedad destaca por sus ambientes luminosos, acabados de altísima gama, y un diseño arquitectónico premiado. Posee una gran piscina climatizada, quincho totalmente equipado y paisajismo diseñado por profesionales.",
    precio: 1250000,
    tipo: "venta",
    estado: "disponible",
    direccion: "San Isidro, Buenos Aires",
    metros_cuadrados: 450,
    ambientes: 4,
    banos: 3,
    imagenes: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p2-torre-alvear",
    titulo: "Torre Alvear V",
    descripcion: "Espectacular piso a estrenar con vistas panorámicas al río y la ciudad. Ubicado en la emblemática Torre Alvear de Recoleta, cuenta con palier privado, gran living comedor, mármoles importados en cocina y baños, y sistemas de domótica instalados. El edificio ofrece amenities de nivel internacional: helipuerto, spa premium, microcine y seguridad armada 24hs.",
    precio: 850000,
    tipo: "venta",
    estado: "reservado",
    direccion: "Recoleta, Buenos Aires",
    metros_cuadrados: 180,
    ambientes: 2,
    banos: 2,
    imagenes: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p3-estancia-la-paz",
    titulo: "Estancia La Paz",
    descripcion: "Exclusiva estancia de campo que redefine la sofisticación rural. Extenso parque arbolado de 800m² construidos sobre una hectárea propia de terreno. La casa de estilo colonial-francés ofrece techos altos, suites presidenciales y galerías espectaculares orientadas hacia las canchas de polo privadas. Perfecta para quienes buscan máxima privacidad y contacto con la naturaleza.",
    precio: 2100000,
    tipo: "venta",
    estado: "vendido",
    direccion: "Pilar, Buenos Aires",
    metros_cuadrados: 800,
    ambientes: 5,
    banos: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p4-penthouse-libertador",
    titulo: "Penthouse Exclusivo en Avenida Libertador",
    descripcion: "Una obra maestra de la arquitectura contemporánea. Este penthouse triplex redefine el concepto de lujo urbano, ofreciendo vistas panorámicas ininterrumpidas de la ciudad y el río. Diseñado bajo la premisa del 'Silencio Arquitectónico', cada espacio fluye con una precisión meticulosa. Los interiores cuentan con pisos de mármol de Carrara, aberturas de piso a techo con doble vidriado hermético y un sistema de domótica integral. La terraza privada incluye una piscina desbordante y sector de parrilla revestido en materiales nobles, ideal para un estilo de vida de alta exigencia.",
    precio: 1850000,
    tipo: "venta",
    estado: "disponible",
    direccion: "Avenida del Libertador 4500, Palermo Chico, CABA",
    metros_cuadrados: 450,
    ambientes: 4,
    banos: 4,
    imagenes: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: true,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p5-casa-minimalista",
    titulo: "Casa Minimalista en San Isidro",
    descripcion: "Hogar de diseño puro y moderno con gran integración interior/exterior. Amplias aberturas de aluminio, calefacción por losa radiante, cocina integrada con isla de cuarzo y piscina con deck de madera. Excelente acceso en zona residencial consolidada y súper segura.",
    precio: 950000,
    tipo: "venta",
    estado: "disponible",
    direccion: "San Isidro, Buenos Aires",
    metros_cuadrados: 320,
    ambientes: 3,
    banos: 3,
    imagenes: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: false,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p6-depto-palermo",
    titulo: "Depto. a Estrenar en Palermo",
    descripcion: "Precioso loft monoambiente divisible de gran categoría en pleno Palermo Soho. Full amenities en edificio: solárium, piscina infinita, laundry, gimnasio y seguridad 24hs. Bajísimas expensas, ideal para inversión o renta temporaria.",
    precio: 180000,
    tipo: "alquiler",
    estado: "disponible",
    direccion: "Palermo, CABA",
    metros_cuadrados: 65,
    ambientes: 2,
    banos: 1,
    imagenes: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: false,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "p7-lote-nordelta",
    titulo: "Lote Premium en Nordelta",
    descripcion: "Excepcional lote al agua en la mejor orientación de Nordelta (Barrio Castaños). Listo para construir la residencia de tus sueños en una ubicación totalmente consolidada, rodeada de lagos y seguridad total.",
    precio: 450000,
    tipo: "terreno",
    estado: "disponible",
    direccion: "Nordelta, Buenos Aires",
    metros_cuadrados: 1200,
    ambientes: 0,
    banos: 0,
    imagenes: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    destacada: false,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useProperties = () => {
  const [properties, setProperties] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    const configured = isSupabaseConfigured();
    try {
      // Intentar consultar a Supabase
      const { data, error: sbError } = await supabase
        .from('propiedades')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        throw sbError;
      }

      if (data && data.length > 0) {
        setProperties(data as Propiedad[]);
      } else {
        // Si la tabla está vacía y está en producción, mostramos vacío. De lo contrario, mock
        setProperties(configured ? [] : MOCK_PROPIEDADES);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (configured) {
        console.error("Error al obtener propiedades de Supabase:", errMsg);
        setError("Error al cargar propiedades de la base de datos.");
        setProperties([]);
      } else {
        console.warn("Supabase no conectado o error, utilizando Mock data en su lugar: ", errMsg);
        setProperties(MOCK_PROPIEDADES);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyById = useCallback(async (id: string): Promise<Propiedad | null> => {
    const configured = isSupabaseConfigured();
    try {
      const { data, error: sbError } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();

      if (sbError) throw sbError;
      return data as Propiedad;
    } catch (err) {
      if (configured) {
        console.error("Error al obtener propiedad por ID:", err);
        return null;
      }
      // Fallback a mock data
      const localMock = MOCK_PROPIEDADES.find(p => p.id === id);
      return localMock || null;
    }
  }, []);

  const incrementVisits = useCallback(async (propiedadId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Intentar leer si ya existe una métrica hoy
      const { data } = await supabase
        .from('metricas_visitas')
        .select('id, visitas')
        .eq('propiedad_id', propiedadId)
        .eq('fecha', today)
        .single();

      if (data) {
        await supabase
          .from('metricas_visitas')
          .update({ visitas: data.visitas + 1 })
          .eq('id', data.id);
      } else {
        await supabase
          .from('metricas_visitas')
          .insert({ propiedad_id: propiedadId, fecha: today, visitas: 1 });
      }
    } catch (err) {
      if (isSupabaseConfigured()) {
        console.error('Error al registrar visitas:', err);
      } else {
        console.log('Metrica visitas simulada');
      }
    }
  }, []);

  // Agregar propiedad
  const addProperty = useCallback(async (nueva: Omit<Propiedad, 'id' | 'created_at' | 'updated_at'>): Promise<Propiedad | null> => {
    const configured = isSupabaseConfigured();
    try {
      const { data, error: sbError } = await supabase
        .from('propiedades')
        .insert(nueva)
        .select()
        .single();

      if (sbError) throw sbError;
      
      // Actualizar estado local
      const propConId = data as Propiedad;
      setProperties(prev => [propConId, ...prev]);
      return propConId;
    } catch (err) {
      if (configured) {
        console.error("Error al agregar propiedad:", err);
        throw err;
      }
      // Simulación local para el panel admin
      const simNew: Propiedad = {
        ...nueva,
        id: `sim-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Guardar en mock data array
      MOCK_PROPIEDADES.unshift(simNew);
      setProperties(prev => [simNew, ...prev]);
      return simNew;
    }
  }, []);

  // Editar propiedad
  const editProperty = useCallback(async (id: string, editada: Partial<Propiedad>): Promise<boolean> => {
    const configured = isSupabaseConfigured();
    try {
      const { error: sbError } = await supabase
        .from('propiedades')
        .update({ ...editada, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (sbError) throw sbError;
      
      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...editada, updated_at: new Date().toISOString() } : p));
      return true;
    } catch (err) {
      if (configured) {
        console.error("Error al editar propiedad:", err);
        throw err;
      }
      // Simulación local
      const index = MOCK_PROPIEDADES.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PROPIEDADES[index] = { ...MOCK_PROPIEDADES[index], ...editada, updated_at: new Date().toISOString() };
        setProperties(prev => prev.map(p => p.id === id ? { ...p, ...editada, updated_at: new Date().toISOString() } : p));
        return true;
      }
      return false;
    }
  }, []);

  // Eliminar propiedad
  const deleteProperty = useCallback(async (id: string): Promise<boolean> => {
    const configured = isSupabaseConfigured();
    try {
      const { error: sbError } = await supabase
        .from('propiedades')
        .delete()
        .eq('id', id);

      if (sbError) throw sbError;
      
      setProperties(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      if (configured) {
        console.error("Error al eliminar propiedad:", err);
        throw err;
      }
      // Simulación local
      const index = MOCK_PROPIEDADES.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PROPIEDADES.splice(index, 1);
        setProperties(prev => prev.filter(p => p.id !== id));
        return true;
      }
      return false;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    getPropertyById,
    incrementVisits,
    addProperty,
    editProperty,
    deleteProperty
  };
};
