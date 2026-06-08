import { createClient } from '@/shared/lib/supabase';
import { createHash, randomBytes } from 'crypto';
import type { ShareToken } from '@/shared/types/domain';

export const shareService = {
  async createToken(
    patientId: string,
    createdBy: string,
    languageCode: string,
    expiresInHours: number,
    maxAccesses: number,
    notes?: string
  ): Promise<{ token: string; record: ShareToken }> {
    const supabase = createClient();

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('share_tokens')
      .insert({
        token_hash: tokenHash,
        patient_id: patientId,
        created_by: createdBy,
        language_code: languageCode,
        expires_at: expiresAt,
        max_accesses: maxAccesses,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message ?? 'Error creando token');
    return { token: rawToken, record: data as ShareToken };
  },

  async revokeToken(tokenId: string) {
    const supabase = createClient();
    return supabase
      .from('share_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', tokenId);
  },

  async getActiveTokens(patientId: string): Promise<ShareToken[]> {
    const supabase = createClient();
    const { data } = await supabase
      .from('share_tokens')
      .select('*')
      .eq('patient_id', patientId)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    return (data ?? []) as ShareToken[];
  },
};
