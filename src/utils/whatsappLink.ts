// Utilidades para enlaces de WhatsApp utilizando la variable de entorno VITE_WHATSAPP_NUMBER

export const getWhatsappNumber = (): string => {
  // Limpiar cualquier carácter no numérico del número de WhatsApp en producción o fallback
  const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5493871234567';
  return rawNumber.replace(/\D/g, '');
};

// Enlace de WhatsApp flotante (contacto directo)
export const getWhatsappFloatingLink = (): string => {
  const phone = getWhatsappNumber();
  return `https://wa.me/${phone}`;
};

// Enlace de consulta por propiedad específica
export const getWhatsappPropertyLink = (titulo: string, id: string): string => {
  const phone = getWhatsappNumber();
  const propertyUrl = `${window.location.origin}/propiedad/${id}`;
  const text = `Hola, me interesa la propiedad: ${titulo} - ${propertyUrl}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// Enlace de consulta de contacto general
export const getWhatsappContactLink = (nombre?: string, mensaje?: string): string => {
  const phone = getWhatsappNumber();
  let text = 'Hola, me gustaría contactarme con la inmobiliaria MagnusPropiedades.';
  if (nombre) {
    text = `Hola, mi nombre es ${nombre}. Quisiera realizar una consulta. ${mensaje ? `Mensaje: ${mensaje}` : ''}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
