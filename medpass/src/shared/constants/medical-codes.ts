// Common ICD-10 code prefixes for reference
export const ICD10_COMMON_PREFIXES = {
  diabetes: 'E11',
  hypertension: 'I10',
  asthma: 'J45',
  depression: 'F32',
  anxiety: 'F41',
  hypothyroid: 'E03',
  obesity: 'E66',
  anemia: 'D50',
} as const;

// Common LOINC codes for lab observations
export const LOINC_COMMON = {
  glucose: '2339-0',
  hemoglobin: '718-7',
  hba1c: '4548-4',
  creatinine: '2160-0',
  cholesterol_total: '2093-3',
  cholesterol_ldl: '18262-6',
  cholesterol_hdl: '2085-9',
  triglycerides: '2571-8',
  tsh: '3016-3',
  sodium: '2951-2',
  potassium: '2823-3',
} as const;

// Blood types
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// Mexican states for NOM-004
export const MX_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
  'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
] as const;
