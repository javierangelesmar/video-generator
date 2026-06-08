export const SUPPORTED_LOCALES = [
  'es', 'en', 'fr', 'de', 'pt', 'ar', 'zh', 'ja', 'ko', 'hi', 'id', 'vi', 'th', 'fil',
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'es';

export const RTL_LOCALES: SupportedLocale[] = ['ar'];

export function isRTL(locale: string): boolean {
  return RTL_LOCALES.includes(locale as SupportedLocale);
}

export const LOCALE_DISPLAY_NAMES: Record<SupportedLocale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ar: 'العربية',
  zh: '中文（普通话）',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  th: 'ภาษาไทย',
  fil: 'Filipino',
};
