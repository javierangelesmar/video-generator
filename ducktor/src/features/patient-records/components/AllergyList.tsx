'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, Plus } from 'lucide-react';
import { SeverityBadge } from '@/shared/components/SeverityBadge';
import { formatDate } from '@/shared/utils/formatters';
import type { PatientAllergy } from '@/shared/types/domain';

interface AllergyListProps {
  allergies: PatientAllergy[];
  onAdd?: () => void;
}

export function AllergyList({ allergies, onAdd }: AllergyListProps) {
  const t = useTranslations('records');

  return (
    <section className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h2 className="font-semibold text-gray-900">{t('allergies')}</h2>
          {allergies.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
              {allergies.length}
            </span>
          )}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            {t('addAllergy')}
          </button>
        )}
      </div>

      {allergies.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t('noRecords')}</p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {allergies.map((allergy) => (
            <li key={allergy.id} className="p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{allergy.allergen}</p>
                {allergy.reaction_description && (
                  <p className="text-sm text-gray-500 mt-0.5">{allergy.reaction_description}</p>
                )}
                {allergy.onset_date && (
                  <p className="text-xs text-gray-400 mt-1">{formatDate(allergy.onset_date)}</p>
                )}
              </div>
              <SeverityBadge severity={allergy.severity} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
