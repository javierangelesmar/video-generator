import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Shield, Globe, Share2, Users } from 'lucide-react';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Ducktor</span>
            <span className="text-xs bg-[var(--color-primary-bg)] text-primary px-2 py-0.5 rounded-full font-medium">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <NavLinks t={t} />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--color-primary-bg)] border border-[var(--color-border)] rounded-full px-4 py-1.5 text-sm text-primary mb-8 font-medium">
          <Globe className="h-4 w-4" />
          14 idiomas · IPS · NOM-004-SSA3
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {t('landing.hero')}
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          {t('landing.sub')}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <HeroButtons t={t} />
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title={t('landing.features.ips')}
              desc={t('landing.features.ipsDesc')}
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-primary" />}
              title={t('landing.features.translate')}
              desc={t('landing.features.translateDesc')}
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6 text-primary" />}
              title={t('landing.features.share')}
              desc={t('landing.features.shareDesc')}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title={t('landing.features.doctors')}
              desc={t('landing.features.doctorsDesc')}
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        Ducktor © 2025 · Estándar IPS · NOM-004-SSA3 · HIPAA ready
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function NavLinks({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <>
      <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">
        {t('landing.features.ips')}
      </Link>
      <Link
        href="auth/login"
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {t('auth.login')}
      </Link>
      <Link href="auth/register" className="btn-primary text-sm px-4 py-2">
        {t('landing.cta')}
      </Link>
    </>
  );
}

function HeroButtons({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <>
      <Link href="auth/register?role=patient" className="btn-primary px-6 py-3 text-base">
        {t('landing.cta')}
      </Link>
      <Link href="auth/register?role=doctor" className="btn-secondary px-6 py-3 text-base">
        {t('landing.ctaDoctor')}
      </Link>
    </>
  );
}
