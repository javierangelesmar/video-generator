export function formatDate(dateString: string, locale = 'es-MX'): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string, locale = 'es-MX'): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(locale);
}

export function formatDosage(dosage: string, frequency: string, route?: string): string {
  let result = `${dosage} — ${frequency}`;
  if (route) result += ` (${route})`;
  return result;
}

export function getAgeFromDOB(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatTokenExpiry(expiresAt: string, locale = 'es-MX'): string {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours <= 0) return 'Expirado';
  if (diffHours < 24) return `${diffHours}h restantes`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d restantes`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
