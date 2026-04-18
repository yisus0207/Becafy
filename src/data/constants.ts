/** Centralized career fields used across filters, profile, and matching */
export const CAREER_FIELDS = [
  'Contaduría',
  'Ingeniería',
  'Tecnología',
  'Educación',
  'Salud',
  'Artes',
  'Derecho',
] as const;

export type CareerField = typeof CAREER_FIELDS[number];

/** Centralized location options */
export const LOCATIONS = [
  'Bogotá',
  'Medellín',
  'Remoto',
  'Extranjero',
] as const;

export type LocationOption = typeof LOCATIONS[number];
