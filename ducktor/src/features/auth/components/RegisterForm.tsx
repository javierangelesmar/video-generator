'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase';

export function RegisterForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const defaultRole = (searchParams.get('role') as 'patient' | 'doctor') ?? 'patient';

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: defaultRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError || !data.user) {
        setError(authError?.message ?? 'Error al crear cuenta');
        return;
      }

      await supabase.from('users').insert({
        id: data.user.id,
        full_name: form.full_name,
        email: form.email,
        role: form.role,
        preferred_language: locale,
      });

      router.push(`/${locale}/dashboard/${form.role}`);
    } catch {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="label">{t('fullName')}</label>
        <input
          id="full_name"
          type="text"
          value={form.full_name}
          onChange={(e) => update('full_name', e.target.value)}
          required
          className="input"
          placeholder="Dr. Ana García"
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="email" className="label">{t('email')}</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
          className="input"
          placeholder="tu@correo.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="password" className="label">{t('password')}</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
          minLength={8}
          className="input"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="label">{t('role')}</label>
        <div className="flex gap-3">
          {(['patient', 'doctor'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update('role', r)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                form.role === r
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {r === 'patient' ? t('rolePatient') : t('roleDoctor')}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? '...' : t('signUp')}
      </button>
    </form>
  );
}
