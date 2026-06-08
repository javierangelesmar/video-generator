import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createServiceClient } from '@/shared/lib/supabase-server';
import { translateMedicalContent } from '@/shared/lib/claude';
import type { IPSSummary, Patient } from '@/shared/types/domain';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const supabase = createServiceClient();

  // Validate token
  const { data: tokenRecord, error } = await supabase
    .from('share_tokens')
    .select('*, patients(*)')
    .eq('token_hash', tokenHash)
    .single();

  if (error || !tokenRecord) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  if (tokenRecord.revoked_at) {
    return NextResponse.json({ error: 'Token revocado' }, { status: 403 });
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expirado' }, { status: 403 });
  }

  if (tokenRecord.access_count >= tokenRecord.max_accesses) {
    return NextResponse.json({ error: 'Límite de accesos alcanzado' }, { status: 403 });
  }

  // Increment access count
  await supabase
    .from('share_tokens')
    .update({ access_count: tokenRecord.access_count + 1 })
    .eq('id', tokenRecord.id);

  // Immutable access log
  await supabase.from('access_logs').insert({
    patient_id: tokenRecord.patient_id,
    accessor_type: 'token',
    action: 'view_ips',
    ip_address: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip'),
    language_requested: tokenRecord.language_code,
    metadata: { token_id: tokenRecord.id },
  });

  const patientId = tokenRecord.patient_id;

  // Fetch IPS sections in parallel
  const [problems, medications, allergies, immunizations, procedures, labResults] = await Promise.all([
    supabase.from('patient_problems').select('*').eq('patient_id', patientId).eq('status', 'active'),
    supabase.from('patient_medications').select('*').eq('patient_id', patientId).eq('is_active', true),
    supabase.from('patient_allergies').select('*').eq('patient_id', patientId).eq('is_active', true),
    supabase.from('patient_immunizations').select('*').eq('patient_id', patientId),
    supabase.from('patient_procedures').select('*').eq('patient_id', patientId),
    supabase.from('patient_lab_results').select('*').eq('patient_id', patientId).order('date_collected', { ascending: false }).limit(10),
  ]);

  const patient = tokenRecord.patients as unknown as Patient;

  const ips: IPSSummary = {
    patient: {
      date_of_birth: patient.date_of_birth,
      sex: patient.sex,
      blood_type: patient.blood_type,
      nationality: patient.nationality,
    },
    problems: (problems.data ?? []) as IPSSummary['problems'],
    medications: (medications.data ?? []) as IPSSummary['medications'],
    allergies: (allergies.data ?? []) as IPSSummary['allergies'],
    immunizations: (immunizations.data ?? []) as IPSSummary['immunizations'],
    procedures: (procedures.data ?? []) as IPSSummary['procedures'],
    labResults: (labResults.data ?? []) as IPSSummary['labResults'],
    generatedAt: new Date().toISOString(),
    language: tokenRecord.language_code,
  };

  const targetLang = tokenRecord.language_code;

  if (targetLang === 'es') {
    return NextResponse.json({ ips, isTranslated: false });
  }

  // Check translation cache
  const sourceHash = createHash('md5').update(JSON.stringify(ips)).digest('hex');
  const { data: cached } = await supabase
    .from('translations')
    .select('translated_content')
    .eq('source_type', 'ips')
    .eq('source_id', patientId)
    .eq('language_code', targetLang)
    .eq('source_hash', sourceHash)
    .single();

  if (cached) {
    const translatedIps = JSON.parse(cached.translated_content) as IPSSummary;
    return NextResponse.json({ ips: translatedIps, isTranslated: true, fromCache: true });
  }

  // Translate with Claude
  const translatedJson = await translateMedicalContent(JSON.stringify(ips), targetLang);

  // Cache the translation
  await supabase.from('translations').upsert({
    source_type: 'ips',
    source_id: patientId,
    source_hash: sourceHash,
    language_code: targetLang,
    translated_content: translatedJson,
  });

  const translatedIps = JSON.parse(translatedJson) as IPSSummary;
  return NextResponse.json({ ips: translatedIps, isTranslated: true });
}
