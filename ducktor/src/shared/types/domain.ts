export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AppUser {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  preferred_language: string;
  created_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  curp?: string;
  date_of_birth: string;
  sex: 'M' | 'F' | 'other';
  blood_type?: string;
  nationality: string;
  address?: PatientAddress;
  emergency_contact?: EmergencyContact;
  created_at: string;
  updated_at: string;
}

export interface PatientAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  country_code: string;
  license_number: string;
  license_country: string;
  spoken_languages: string[];
  verified_at?: string;
  bio?: string;
  created_at: string;
  full_name?: string;
  avatar_url?: string;
}

export interface PatientProblem {
  id: string;
  patient_id: string;
  icd_code: string;
  snomed_code?: string;
  description_es: string;
  onset_date?: string;
  status: 'active' | 'resolved' | 'inactive';
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  created_at: string;
}

export interface PatientMedication {
  id: string;
  patient_id: string;
  name: string;
  generic_name?: string;
  rxnorm_code?: string;
  dosage: string;
  frequency: string;
  route?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  prescriber_id?: string;
  notes?: string;
  created_at: string;
}

export interface PatientAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  allergen_type?: 'medication' | 'food' | 'environment' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction_description?: string;
  snomed_code?: string;
  onset_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface PatientImmunization {
  id: string;
  patient_id: string;
  vaccine_name: string;
  cvx_code?: string;
  date_administered?: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

export interface PatientProcedure {
  id: string;
  patient_id: string;
  procedure_name: string;
  snomed_code?: string;
  date_performed?: string;
  performed_by?: string;
  hospital?: string;
  notes?: string;
  created_at: string;
}

export interface PatientLabResult {
  id: string;
  patient_id: string;
  loinc_code?: string;
  observation_name: string;
  value?: string;
  unit?: string;
  reference_range?: string;
  interpretation?: 'normal' | 'abnormal' | 'critical';
  date_collected: string;
  lab_name?: string;
  file_url?: string;
  created_at: string;
}

export interface ShareToken {
  id: string;
  token_hash: string;
  patient_id: string;
  created_by: string;
  language_code: string;
  expires_at: string;
  access_count: number;
  max_accesses: number;
  revoked_at?: string;
  notes?: string;
  created_at: string;
}

export interface IPSSummary {
  patient: Pick<Patient, 'date_of_birth' | 'sex' | 'blood_type' | 'nationality'>;
  problems: PatientProblem[];
  medications: PatientMedication[];
  allergies: PatientAllergy[];
  immunizations: PatientImmunization[];
  procedures: PatientProcedure[];
  labResults: PatientLabResult[];
  generatedAt: string;
  language: string;
}

export interface CaseConsultation {
  id: string;
  patient_id: string;
  requesting_doctor_id: string;
  responding_doctor_id?: string;
  status: 'pending' | 'active' | 'resolved' | 'closed';
  subject: string;
  clinical_summary?: string;
  language_requesting: string;
  language_responding?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  content: string;
  translated_content: Record<string, string>;
  file_url?: string;
  is_system_message: boolean;
  created_at: string;
}
