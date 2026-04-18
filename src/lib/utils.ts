export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Sin fecha';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long', // "abril"
    year: 'numeric'
  }).format(date);
};
