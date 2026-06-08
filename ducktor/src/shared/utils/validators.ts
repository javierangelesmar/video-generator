import { z } from 'zod';

export const allergySchema = z.object({
  allergen: z.string().min(1),
  allergen_type: z.enum(['medication', 'food', 'environment', 'other']).optional(),
  severity: z.enum(['mild', 'moderate', 'severe', 'life-threatening']),
  reaction_description: z.string().optional(),
  snomed_code: z.string().optional(),
  onset_date: z.string().optional(),
});

export const medicationSchema = z.object({
  name: z.string().min(1),
  generic_name: z.string().optional(),
  rxnorm_code: z.string().optional(),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  route: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});

export const problemSchema = z.object({
  icd_code: z.string().min(1),
  snomed_code: z.string().optional(),
  description_es: z.string().min(1),
  onset_date: z.string().optional(),
  status: z.enum(['active', 'resolved', 'inactive']).default('active'),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  notes: z.string().optional(),
});

export const immunizationSchema = z.object({
  vaccine_name: z.string().min(1),
  cvx_code: z.string().optional(),
  date_administered: z.string().optional(),
  lot_number: z.string().optional(),
  administered_by: z.string().optional(),
  notes: z.string().optional(),
});

export const procedureSchema = z.object({
  procedure_name: z.string().min(1),
  snomed_code: z.string().optional(),
  date_performed: z.string().optional(),
  performed_by: z.string().optional(),
  hospital: z.string().optional(),
  notes: z.string().optional(),
});

export const labResultSchema = z.object({
  loinc_code: z.string().optional(),
  observation_name: z.string().min(1),
  value: z.string().optional(),
  unit: z.string().optional(),
  reference_range: z.string().optional(),
  interpretation: z.enum(['normal', 'abnormal', 'critical']).optional(),
  date_collected: z.string().min(1),
  lab_name: z.string().optional(),
});

export const shareTokenSchema = z.object({
  language_code: z.string().min(2).max(5),
  expires_in_hours: z.number().int().min(1).max(168).default(72),
  max_accesses: z.number().int().min(1).max(100).default(10),
  notes: z.string().max(200).optional(),
});

export const patientProfileSchema = z.object({
  date_of_birth: z.string().min(1),
  sex: z.enum(['M', 'F', 'other']),
  blood_type: z.string().optional(),
  curp: z.string().length(18).optional().or(z.literal('')),
  nationality: z.string().default('MX'),
});

export type AllergyInput = z.infer<typeof allergySchema>;
export type MedicationInput = z.infer<typeof medicationSchema>;
export type ProblemInput = z.infer<typeof problemSchema>;
export type ImmunizationInput = z.infer<typeof immunizationSchema>;
export type ProcedureInput = z.infer<typeof procedureSchema>;
export type LabResultInput = z.infer<typeof labResultSchema>;
export type ShareTokenInput = z.infer<typeof shareTokenSchema>;
export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
