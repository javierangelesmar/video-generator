import { createClient } from '@/shared/lib/supabase';
import type { AllergyInput, MedicationInput, ProblemInput, ImmunizationInput, ProcedureInput, LabResultInput } from '@/shared/utils/validators';

export const recordService = {
  async getPatientId(userId: string): Promise<string | null> {
    const supabase = createClient();
    const { data } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single();
    return data?.id ?? null;
  },

  async fetchAll(patientId: string) {
    const supabase = createClient();
    const [problems, medications, allergies, immunizations, procedures, labResults] = await Promise.all([
      supabase.from('patient_problems').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }),
      supabase.from('patient_medications').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }),
      supabase.from('patient_allergies').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }),
      supabase.from('patient_immunizations').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }),
      supabase.from('patient_procedures').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }),
      supabase.from('patient_lab_results').select('*').eq('patient_id', patientId).order('date_collected', { ascending: false }),
    ]);
    return {
      problems: (problems.data ?? []) as ReturnType<typeof problems.data>,
      medications: (medications.data ?? []) as ReturnType<typeof medications.data>,
      allergies: (allergies.data ?? []) as ReturnType<typeof allergies.data>,
      immunizations: (immunizations.data ?? []) as ReturnType<typeof immunizations.data>,
      procedures: (procedures.data ?? []) as ReturnType<typeof procedures.data>,
      labResults: (labResults.data ?? []) as ReturnType<typeof labResults.data>,
    };
  },

  async addAllergy(patientId: string, data: AllergyInput) {
    const supabase = createClient();
    return supabase.from('patient_allergies').insert({ ...data, patient_id: patientId }).select().single();
  },

  async addMedication(patientId: string, data: MedicationInput) {
    const supabase = createClient();
    return supabase.from('patient_medications').insert({ ...data, patient_id: patientId }).select().single();
  },

  async addProblem(patientId: string, data: ProblemInput) {
    const supabase = createClient();
    return supabase.from('patient_problems').insert({ ...data, patient_id: patientId }).select().single();
  },

  async addImmunization(patientId: string, data: ImmunizationInput) {
    const supabase = createClient();
    return supabase.from('patient_immunizations').insert({ ...data, patient_id: patientId }).select().single();
  },

  async addProcedure(patientId: string, data: ProcedureInput) {
    const supabase = createClient();
    return supabase.from('patient_procedures').insert({ ...data, patient_id: patientId }).select().single();
  },

  async addLabResult(patientId: string, data: LabResultInput) {
    const supabase = createClient();
    return supabase.from('patient_lab_results').insert({ ...data, patient_id: patientId }).select().single();
  },

  async deleteRecord(table: string, id: string) {
    const supabase = createClient();
    return supabase.from(table as 'patient_allergies').delete().eq('id', id);
  },
};
