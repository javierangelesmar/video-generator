'use client';

import { useTranslations } from 'next-intl';
import { Pill, Plus } from 'lucide-react';
import { formatDate, formatDosage } from '@/shared/utils/formatters';
import type { PatientMedication } from '@/shared/types/domain';

interface MedicationCardProps {
  medications: PatientMedication[];
  onAdd?: () => void;
}

export function MedicationCard({ medications, onAdd }: MedicationCardProps) {
  const t = useTranslations('records');
  const active = medications.filter((m) => m.is_active);

  return (
    <section className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-gray-900">{t('medications')}</h2>
          {active.length > 0 && (
            <span className="text-xs bg-[var(--color-primary-bg)] text-primary rounded-full px-2 py-0.5">
              {active.length} {t('active').toLowerCase()}
            </span>
          )}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            {t('addMedication')}
          </button>
        )}
      </div>

      {medications.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t('noRecords')}</p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {medications.map((med) => (
            <li key={med.id} className="p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{med.name}</p>
                  {med.generic_name && (
                    <span className="text-xs text-gray-400">({med.generic_name})</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  {formatDosage(med.dosage, med.frequency, med.route)}
                </p>
                {med.start_date && (
                  <p className="text-xs text-gray-400 mt-1">Desde {formatDate(med.start_date)}</p>
                )}
              </div>
              <span className={med.is_active ? 'badge-active' : 'badge-inactive'}>
                {med.is_active ? t('active') : t('inactive')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
