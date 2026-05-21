// Formateador de precios de propiedades
import type { TipoPropiedad } from '../types';

export const formatPrice = (price: number | null | undefined, tipo?: TipoPropiedad): string => {
  if (price === null || price === undefined) return '$ 0 ARS';

  // Determinamos si es en dólares (las ventas y tasaciones suelen ser en USD, los alquileres en ARS)
  const esUSD = tipo === 'venta' || tipo === 'tasacion';

  // Usamos el formato local en español para separar miles por puntos
  const formattedNumber = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);

  if (esUSD) {
    // Retorna en formato USD para ventas (ej. USD 1.250.000)
    return `USD ${formattedNumber}`;
  } else {
    // Retorna en formato ARS para alquileres (ej. $ 750.000 ARS)
    return `$ ${formattedNumber} ARS`;
  }
};
