'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import { SUPPORTED_LOCALES, LOCALE_DISPLAY_NAMES } from '@/shared/constants/locales';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    // Replace current locale segment
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-gray-400" aria-hidden />
      <select
        value={locale}
        onChange={handleChange}
        className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer text-gray-700"
        aria-label="Select language"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_DISPLAY_NAMES[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
