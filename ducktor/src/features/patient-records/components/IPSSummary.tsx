'use client';

import { useTranslations } from 'next-intl';
import { Shield, AlertTriangle, Pill, Stethoscope, Syringe, FlaskConical } from 'lucide-react';
import type { IPSSummary as IPSSummaryType } from '@/shared/types/domain';
import { formatDate, getAgeFromDOB } from '@/shared/utils/formatters';
import { SeverityBadge } from '@/shared/components/SeverityBadge';

interface IPSSummaryProps {
  ips: IPSSummaryType;
  patientName?: string;
}

export function IPSSummary({ ips, patientName }: IPSSummaryProps) {
  const t = useTranslations('records');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card p-4 bg-[var(--color-primary-bg)] border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-text">International Patient Summary (IPS)</h2>
        </div>
        {patientName && <p className="text-sm font-medium text-text">{patientName}</p>}
        <div className="flex gap-4 mt-2 text-sm text-primary">
          <span>Edad: {getAgeFromDOB(ips.patient.date_of_birth)} años</span>
          <span>Sexo: {ips.patient.sex}</span>
          {ips.patient.blood_type && <span>Grupo: {ips.patient.blood_type}</span>}
        </div>
        <p className="text-xs text-primary mt-2">
          Generado: {formatDate(ips.generatedAt)} · Idioma: {ips.language.toUpperCase()}
        </p>
      </div>

      {/* Allergies — always first (safety critical) */}
      {ips.allergies.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-sm text-amber-900">{t('allergies')}</h3>
          </div>
          <ul className="divide-y divide-gray-50">
            {ips.allergies.map((a) => (
              <li key={a.id} className="p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium text-sm">{a.allergen}</span>
                  {a.reaction_description && (
                    <p className="text-xs text-gray-500">{a.reaction_description}</p>
                  )}
                </div>
                <SeverityBadge severity={a.severity} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active Medications */}
      {ips.medications.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <Pill className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{t('medications')}</h3>
          </div>
          <ul className="divide-y divide-gray-50">
            {ips.medications.map((m) => (
              <li key={m.id} className="p-3">
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-gray-500">{m.dosage} — {m.frequency}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Problems */}
      {ips.problems.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <Stethoscope className="h-4 w-4 text-purple-500" />
            <h3 className="font-semibold text-sm">{t('problems')}</h3>
          </div>
          <ul className="divide-y divide-gray-50">
            {ips.problems.map((p) => (
              <li key={p.id} className="p-3">
                <p className="font-medium text-sm">{p.description_es}</p>
                <p className="text-xs text-gray-400 font-mono">{p.icd_code}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Immunizations */}
      {ips.immunizations.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <Syringe className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold text-sm">{t('immunizations')}</h3>
          </div>
          <ul className="divide-y divide-gray-50">
            {ips.immunizations.map((i) => (
              <li key={i.id} className="p-3 flex justify-between">
                <p className="font-medium text-sm">{i.vaccine_name}</p>
                {i.date_administered && (
                  <p className="text-xs text-gray-400">{formatDate(i.date_administered)}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lab Results */}
      {ips.labResults.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <FlaskConical className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-sm">{t('labResults')}</h3>
          </div>
          <ul className="divide-y divide-gray-50">
            {ips.labResults.map((l) => (
              <li key={l.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{l.observation_name}</p>
                  {l.loinc_code && <p className="text-xs text-gray-400 font-mono">LOINC: {l.loinc_code}</p>}
                  <p className="text-xs text-gray-400">{formatDate(l.date_collected)}</p>
                </div>
                {l.value && (
                  <span className={`text-sm font-medium ${
                    l.interpretation === 'critical' ? 'text-red-600' :
                    l.interpretation === 'abnormal' ? 'text-amber-600' : 'text-gray-700'
                  }`}>
                    {l.value} {l.unit}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
