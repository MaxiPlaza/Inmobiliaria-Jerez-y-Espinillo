// Formateador de fechas para el estándar de Argentina
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Si la fecha es inválida, retornar string vacío
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formatea el tiempo transcurrido de forma amigable (Ej. Hace 2 horas, Ayer, etc.)
export const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Hace instantes';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  
  // Si es del mismo día
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  // Si fue ayer
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer, ${date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
