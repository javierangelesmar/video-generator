'use client';

import { useTranslations } from 'next-intl';
import { Stethoscope, Plus } from 'lucide-react';
import { formatDate } from '@/shared/utils/formatters';
import type { PatientProblem } from '@/shared/types/domain';

interface ProblemListProps {
  problems: PatientProblem[];
  onAdd?: () => void;
}

const STATUS_BADGE: Record<PatientProblem['status'], string> = {
  active: 'badge-active',
  resolved: 'badge-inactive',
  inactive: 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500',
};

export function ProblemList({ problems, onAdd }: ProblemListProps) {
  const t = useTranslations('records');

  return (
    <section className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-medical-purple" />
          <h2 className="font-semibold text-gray-900">{t('problems')}</h2>
          {problems.filter((p) => p.status === 'active').length > 0 && (
            <span className="text-xs bg-purple-50 text-purple-600 rounded-full px-2 py-0.5">
              {problems.filter((p) => p.status === 'active').length} {t('active').toLowerCase()}
            </span>
          )}
        </div>
        {onAdd && (
          <button onClick={onAdd} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            {t('addProblem')}
          </button>
        )}
      </div>

      {problems.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t('noRecords')}</p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {problems.map((p) => (
            <li key={p.id} className="p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{p.description_es}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{p.icd_code}</p>
                {p.onset_date && (
                  <p className="text-xs text-gray-400 mt-1">{formatDate(p.onset_date)}</p>
                )}
              </div>
              <span className={STATUS_BADGE[p.status]}>
                {t(p.status as 'active' | 'resolved' | 'inactive')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
