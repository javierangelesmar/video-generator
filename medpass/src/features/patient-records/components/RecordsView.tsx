'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { AllergyList } from './AllergyList';
import { MedicationCard } from './MedicationCard';
import { ProblemList } from './ProblemList';
import { usePatientRecord } from '../hooks/usePatientRecord';
import { ShareTokenModal } from '@/features/share/components/ShareTokenModal';
import { useState } from 'react';

interface RecordsViewProps {
  patientId: string | null;
  userId: string;
  locale: string;
  userName: string;
}

export function RecordsView({ patientId, userId, locale, userName }: RecordsViewProps) {
  const t = useTranslations('records');
  const tShare = useTranslations('share');
  const { problems, medications, allergies, isLoading } = usePatientRecord();
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/dashboard/patient`} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="font-semibold text-gray-900">{t('title')}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setShowShareModal(true)}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <Share2 className="h-4 w-4" />
              {tShare('createToken')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Cargando expediente...</div>
        ) : !patientId ? (
          <div className="card p-6 text-center">
            <p className="text-gray-600 mb-4">Aún no tienes un expediente. Crea uno para empezar.</p>
            <button className="btn-primary">Crear expediente</button>
          </div>
        ) : (
          <>
            <AllergyList allergies={allergies} />
            <MedicationCard medications={medications} />
            <ProblemList problems={problems} />
          </>
        )}
      </main>

      {showShareModal && patientId && (
        <ShareTokenModal
          patientId={patientId}
          patientName={userName}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
