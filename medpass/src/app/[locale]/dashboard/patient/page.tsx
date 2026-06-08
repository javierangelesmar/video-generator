import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase-server';
import { Shield, Share2, Users, FileText, ChevronRight, LogOut } from 'lucide-react';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export default async function PatientDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: userData } = await supabase
    .from('users')
    .select('full_name, preferred_language')
    .eq('id', user.id)
    .single();

  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">MedPass</span>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">{userData?.full_name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hola, {userData?.full_name?.split(' ')[0]}
          </h1>
          {!patient && (
            <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Completa tu perfil para usar MedPass.{' '}
              <Link href={`/${locale}/records`} className="font-medium underline">
                Agregar datos
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <DashCard
            href={`/${locale}/records`}
            icon={<FileText className="h-6 w-6 text-brand-600" />}
            title="Mi Expediente"
            desc="Diagnósticos, medicamentos, alergias, vacunas y más"
            color="blue"
          />
          <DashCard
            href={`/${locale}/records#share`}
            icon={<Share2 className="h-6 w-6 text-green-600" />}
            title="Compartir IPS"
            desc="Genera un enlace o QR para tu médico en el extranjero"
            color="green"
          />
          <DashCard
            href={`/${locale}/doctors`}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            title="Directorio de Médicos"
            desc="Encuentra especialistas verificados en todo el mundo"
            color="purple"
          />
          <DashCard
            href={`/${locale}/consultations`}
            icon={<Shield className="h-6 w-6 text-amber-600" />}
            title="Mis Consultas"
            desc="Seguimiento de consultas con médicos internacionales"
            color="amber"
          />
        </div>
      </main>
    </div>
  );
}

function DashCard({
  href, icon, title, desc, color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const bg: Record<string, string> = {
    blue: 'hover:border-brand-300',
    green: 'hover:border-green-300',
    purple: 'hover:border-purple-300',
    amber: 'hover:border-amber-300',
  };

  return (
    <Link
      href={href}
      className={`card p-5 flex items-start gap-4 hover:shadow-md transition-all border ${bg[color]}`}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
    </Link>
  );
}
