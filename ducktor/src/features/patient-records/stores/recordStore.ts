import { create } from 'zustand';
import type { PatientProblem, PatientMedication, PatientAllergy, PatientImmunization, PatientProcedure, PatientLabResult } from '@/shared/types/domain';

interface RecordState {
  problems: PatientProblem[];
  medications: PatientMedication[];
  allergies: PatientAllergy[];
  immunizations: PatientImmunization[];
  procedures: PatientProcedure[];
  labResults: PatientLabResult[];
  isLoading: boolean;
  lastFetched: number | null;

  setProblems: (items: PatientProblem[]) => void;
  setMedications: (items: PatientMedication[]) => void;
  setAllergies: (items: PatientAllergy[]) => void;
  setImmunizations: (items: PatientImmunization[]) => void;
  setProcedures: (items: PatientProcedure[]) => void;
  setLabResults: (items: PatientLabResult[]) => void;
  setLoading: (v: boolean) => void;
  markFetched: () => void;
  reset: () => void;
}

export const useRecordStore = create<RecordState>()((set) => ({
  problems: [],
  medications: [],
  allergies: [],
  immunizations: [],
  procedures: [],
  labResults: [],
  isLoading: false,
  lastFetched: null,

  setProblems: (problems) => set({ problems }),
  setMedications: (medications) => set({ medications }),
  setAllergies: (allergies) => set({ allergies }),
  setImmunizations: (immunizations) => set({ immunizations }),
  setProcedures: (procedures) => set({ procedures }),
  setLabResults: (labResults) => set({ labResults }),
  setLoading: (isLoading) => set({ isLoading }),
  markFetched: () => set({ lastFetched: Date.now() }),
  reset: () => set({ problems: [], medications: [], allergies: [], immunizations: [], procedures: [], labResults: [], lastFetched: null }),
}));
