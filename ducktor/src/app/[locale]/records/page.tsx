import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase-server';
import { RecordsView } from '@/features/patient-records/components/RecordsView';

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: userData } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single();

  return (
    <RecordsView
      patientId={patient?.id ?? null}
      userId={user.id}
      locale={locale}
      userName={userData?.full_name ?? ''}
    />
  );
}
