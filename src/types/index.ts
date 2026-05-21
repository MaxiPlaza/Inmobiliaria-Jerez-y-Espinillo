// Tipos TypeScript para el sistema de Inmobiliaria Jerez°Espinillo

export type TipoPropiedad = 'venta' | 'alquiler' | 'terreno' | 'tasacion';
export type EstadoPropiedad = 'disponible' | 'reservado' | 'vendido' | 'alquilado';

export interface Propiedad {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo: TipoPropiedad;
  estado: EstadoPropiedad;
  direccion: string;
  metros_cuadrados: number;
  ambientes: number;
  banos: number;
  imagenes: string[];
  destacada: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consulta {
  id: string;
  nombre: string;
  telefono: string;
  propiedad_id: string | null;
  mensaje: string;
  created_at: string;
  // Relación cargada opcionalmente
  propiedades?: {
    titulo: string;
  } | null;
}

export interface MetricaVisita {
  id: string;
  propiedad_id: string;
  fecha: string;
  visitas: number;
  propiedades?: Propiedad;
}

// Filtros para la búsqueda en catálogo
export interface FiltrosCatalogo {
  tipo: TipoPropiedad | '';
  estado: EstadoPropiedad | '';
  precioMin: number | '';
  precioMax: number | '';
  buscar: string;
}
