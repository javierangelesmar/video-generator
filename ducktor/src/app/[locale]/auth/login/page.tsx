import { useTranslations } from 'next-intl';
import { LoginForm } from '@/features/auth/components/LoginForm';
import Link from 'next/link';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export default function LoginPage() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Link href="." className="text-xl font-bold text-primary">Ducktor</Link>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.login')}</h1>
          <p className="text-sm text-gray-500 mb-6">
            {t('auth.noAccount')}{' '}
            <Link href="../auth/register" className="text-primary hover:underline font-medium">
              {t('auth.signUp')}
            </Link>
          </p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
