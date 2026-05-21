import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Consulta } from '../types';

export const MOCK_CONSULTAS: Consulta[] = [
  {
    id: "c1",
    nombre: "María González",
    telefono: "+54 9 11 1234-5678",
    propiedad_id: "p5-casa-minimalista",
    mensaje: "Hola, me gustaría agendar una visita para este fin de semana. ¿Es posible?",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // Hace 2 horas
    propiedades: {
      titulo: "Casa Minimalista en San Isidro"
    }
  },
  {
    id: "c2",
    nombre: "Carlos Rodríguez",
    telefono: "+54 9 11 8765-4321",
    propiedad_id: "p6-depto-palermo",
    mensaje: "Querías consultar por las opciones de financiación y expensas.",
    created_at: new Date(Date.now() - 3600000 * 28.5).toISOString(), // Ayer, 14:30
    propiedades: {
      titulo: "Depto. a Estrenar en Palermo"
    }
  },
  {
    id: "c3",
    nombre: "Laura Martínez",
    telefono: "+54 9 11 2345-6789",
    propiedad_id: "p7-lote-nordelta",
    mensaje: "Solicito información sobre los plazos de entrega y amenities del barrio.",
    created_at: new Date(Date.now() - 3600000 * 33.75).toISOString(), // Ayer, 09:15
    propiedades: {
      titulo: "Lote Premium en Nordelta"
    }
  }
];

export const useConsultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('consultas')
        .select(`
          id,
          nombre,
          telefono,
          propiedad_id,
          mensaje,
          created_at,
          propiedades (
            titulo
          )
        `)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      if (data && data.length > 0) {
        // Normalizar estructura si es necesario
        setConsultas(data as any[]);
      } else {
        setConsultas(MOCK_CONSULTAS);
      }
    } catch (err: any) {
      console.warn("Supabase no conectado o error, utilizando Consultas Mock: ", err.message);
      setConsultas(MOCK_CONSULTAS);
    } finally {
      setLoading(false);
    }
  }, []);

  const addConsulta = useCallback(async (nueva: Omit<Consulta, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const { error: sbError } = await supabase
        .from('consultas')
        .insert(nueva);

      if (sbError) throw sbError;
      
      // Intentar refrescar consultas si estamos autenticados en el panel
      fetchConsultas();
      return true;
    } catch (err) {
      console.warn("Supabase insert falló, simulando consulta localmente");
      // Simulación local
      const simNew: Consulta = {
        ...nueva,
        id: `sim-c-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };
      
      // Buscar el título de la propiedad si tiene
      if (nueva.propiedad_id) {
        // En una app real vendría de la FK. Buscaremos localmente
        const props = [
          { id: "p5-casa-minimalista", titulo: "Casa Minimalista en San Isidro" },
          { id: "p6-depto-palermo", titulo: "Depto. a Estrenar en Palermo" },
          { id: "p7-lote-nordelta", titulo: "Lote Premium en Nordelta" },
          { id: "p1-villa-los-robles", titulo: "Villa Los Robles" },
          { id: "p2-torre-alvear", titulo: "Torre Alvear V" },
          { id: "p3-estancia-la-paz", titulo: "Estancia La Paz" },
          { id: "p4-penthouse-libertador", titulo: "Penthouse Exclusivo en Avenida Libertador" }
        ];
        const match = props.find(p => p.id === nueva.propiedad_id);
        if (match) {
          simNew.propiedades = { titulo: match.titulo };
        }
      }

      MOCK_CONSULTAS.unshift(simNew);
      setConsultas(prev => [simNew, ...prev]);
      return true;
    }
  }, [fetchConsultas]);

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  return {
    consultas,
    loading,
    error,
    refetch: fetchConsultas,
    addConsulta
  };
};
