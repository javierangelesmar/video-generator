'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Copy, Check, Globe, Clock } from 'lucide-react';
import { useShareToken } from '../hooks/useShareToken';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SUPPORTED_LOCALES, LOCALE_DISPLAY_NAMES } from '@/shared/constants/locales';
import { formatTokenExpiry } from '@/shared/utils/formatters';

interface ShareTokenModalProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export function ShareTokenModal({ patientId, patientName, onClose }: ShareTokenModalProps) {
  const t = useTranslations('share');
  const tLang = useTranslations('languages');
  const { user } = useAuth();
  const { tokens, loading, lastCreatedToken, loadTokens, createToken, revokeToken } = useShareToken(
    patientId,
    user?.id ?? ''
  );

  const [selectedLang, setSelectedLang] = useState('en');
  const [expiresInHours, setExpiresInHours] = useState(72);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => { loadTokens(); }, []);

  async function handleCreate() {
    if (!user) return;
    const result = await createToken(selectedLang, expiresInHours, 10, notes);
    if (result) {
      const url = `${window.location.origin}/share/${result.token}`;
      setShareUrl(url);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t('title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Patient name */}
          <p className="text-sm text-gray-600">
            Expediente de: <span className="font-medium">{patientName}</span>
          </p>

          {/* Language selector */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {t('selectLanguage')}
            </label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="input"
            >
              {SUPPORTED_LOCALES.filter((l) => l !== 'es').map((l) => (
                <option key={l} value={l}>
                  {LOCALE_DISPLAY_NAMES[l]}
                </option>
              ))}
            </select>
          </div>

          {/* Expiry */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t('expiresIn')}
            </label>
            <select
              value={expiresInHours}
              onChange={(e) => setExpiresInHours(Number(e.target.value))}
              className="input"
            >
              <option value={24}>{t('24hours')}</option>
              <option value={72}>{t('72hours')}</option>
              <option value={168}>{t('7days')}</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="label">{t('notes')}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              placeholder={t('notes')}
              maxLength={200}
            />
          </div>

          {/* Created URL */}
          {shareUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-medium text-green-800 mb-2">{t('tokenCreated')}</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-gray-600 flex-1 truncate bg-white rounded px-2 py-1 border">
                  {shareUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(shareUrl)}
                  className="text-green-600 hover:text-green-700 flex-shrink-0"
                  title={t('copyLink')}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '...' : t('createToken')}
          </button>
        </div>

        {/* Active tokens */}
        {tokens.length > 0 && (
          <div className="border-t border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('myTokens')}</h3>
            <ul className="space-y-2">
              {tokens.slice(0, 5).map((token) => (
                <li key={token.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium">{LOCALE_DISPLAY_NAMES[token.language_code as keyof typeof LOCALE_DISPLAY_NAMES]}</span>
                    <span className="text-gray-400 ml-2">{formatTokenExpiry(token.expires_at)}</span>
                    <span className="text-gray-400 ml-2">{token.access_count}/{token.max_accesses} accesos</span>
                  </div>
                  <button
                    onClick={() => revokeToken(token.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {t('revokeToken')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
