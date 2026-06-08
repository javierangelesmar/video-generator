'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRecordStore } from '../stores/recordStore';
import { recordService } from '../services/recordService';

export function usePatientRecord() {
  const { user } = useAuth();
  const store = useRecordStore();

  useEffect(() => {
    if (!user || store.lastFetched) return;

    async function load() {
      if (!user) return;
      store.setLoading(true);
      try {
        const patientId = await recordService.getPatientId(user.id);
        if (!patientId) return;

        const data = await recordService.fetchAll(patientId);
        store.setProblems(data.problems as Parameters<typeof store.setProblems>[0]);
        store.setMedications(data.medications as Parameters<typeof store.setMedications>[0]);
        store.setAllergies(data.allergies as Parameters<typeof store.setAllergies>[0]);
        store.setImmunizations(data.immunizations as Parameters<typeof store.setImmunizations>[0]);
        store.setProcedures(data.procedures as Parameters<typeof store.setProcedures>[0]);
        store.setLabResults(data.labResults as Parameters<typeof store.setLabResults>[0]);
        store.markFetched();
      } finally {
        store.setLoading(false);
      }
    }

    load();
  }, [user, store]);

  return {
    ...store,
    activeProblems: store.problems.filter((p) => p.status === 'active'),
    activeMedications: store.medications.filter((m) => m.is_active),
    activeAllergies: store.allergies.filter((a) => a.is_active),
  };
}
