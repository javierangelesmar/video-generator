import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, isRTL } from '@/shared/constants/locales';
import '@/shared/styles/globals.css';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as typeof SUPPORTED_LOCALES[number])) {
    notFound();
  }

  const messages = await getMessages();
  const rtl = isRTL(locale);

  // CJK locales — load Noto Sans SC subset via Google Fonts
  const isCJK = ['zh', 'ja', 'ko'].includes(locale);

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'} data-theme="doctor">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ducktor — Tu expediente clínico internacional</title>
        <meta
          name="description"
          content="Comparte tu historia clínica con médicos de todo el mundo, traducida al instante con IA."
        />
        {/* Inter Variable — Latin */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        {/* Noto Sans SC — CJK subset (only load for CJK locales to avoid 15MB+ hit) */}
        {isCJK && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        )}
        {/* Arabic — Noto Sans Arabic */}
        {rtl && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        )}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
