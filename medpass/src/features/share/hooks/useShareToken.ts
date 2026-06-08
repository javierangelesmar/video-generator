'use client';

import { useState } from 'react';
import { shareService } from '../services/shareService';
import type { ShareToken } from '@/shared/types/domain';

export function useShareToken(patientId: string, userId: string) {
  const [tokens, setTokens] = useState<ShareToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreatedToken, setLastCreatedToken] = useState<string | null>(null);

  async function loadTokens() {
    setLoading(true);
    try {
      const data = await shareService.getActiveTokens(patientId);
      setTokens(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function createToken(
    languageCode: string,
    expiresInHours: number,
    maxAccesses: number,
    notes?: string
  ) {
    setLoading(true);
    setError(null);
    try {
      const { token, record } = await shareService.createToken(
        patientId, userId, languageCode, expiresInHours, maxAccesses, notes
      );
      setTokens((prev) => [record, ...prev]);
      setLastCreatedToken(token);
      return { token, record };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function revokeToken(tokenId: string) {
    await shareService.revokeToken(tokenId);
    setTokens((prev) => prev.filter((t) => t.id !== tokenId));
  }

  return { tokens, loading, error, lastCreatedToken, loadTokens, createToken, revokeToken };
}
