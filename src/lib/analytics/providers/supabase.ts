import { supabase } from '@/integrations/supabase/client';
import { envelopeToDbRow } from '../envelope';
import type { AnalyticsEnvelope } from '../types';

export async function sendToSupabase(envelope: AnalyticsEnvelope): Promise<void> {
  if (envelope.source === 'web' ) return;

  const row = envelopeToDbRow(envelope);
  const { error } = await supabase.from('events').insert(row);
  if (error && error.code !== '23505') {
    console.warn('[analytics] Supabase insert failed:', error.message);
  }
}
