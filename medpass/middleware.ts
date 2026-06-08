import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en', 'fr', 'de', 'pt', 'ar', 'zh', 'ja', 'ko', 'hi', 'id', 'vi', 'th', 'fil'],
  defaultLocale: 'es',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
