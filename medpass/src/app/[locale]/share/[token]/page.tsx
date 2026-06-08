import { notFound } from 'next/navigation';
import { IPSSummary } from '@/features/patient-records/components/IPSSummary';
import { Shield, Globe } from 'lucide-react';
import type { IPSSummary as IPSSummaryType } from '@/shared/types/domain';

interface SharePageProps {
  params: Promise<{ locale: string; token: string }>;
}

async function fetchIPS(token: string, appUrl: string) {
  const res = await fetch(`${appUrl}/api/share/${token}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json() as Promise<{ ips: IPSSummaryType; isTranslated: boolean; fromCache?: boolean }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const result = await fetchIPS(token, appUrl);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="card p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="font-bold text-gray-900 mb-2">Acceso no disponible</h1>
          <p className="text-sm text-gray-500">
            Este enlace expiró, fue revocado, o el límite de accesos fue alcanzado.
          </p>
        </div>
      </div>
    );
  }

  const { ips, isTranslated } = result;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-600" />
            <span className="font-bold text-brand-700">MedPass</span>
          </div>
          {isTranslated && (
            <div className="flex items-center gap-1.5 text-xs text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              <Globe className="h-3.5 w-3.5" />
              Translated by Claude AI
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          Read-only access · For medical professional use · Shared via MedPass secure link
        </div>
        <IPSSummary ips={ips} />
      </main>
    </div>
  );
}
