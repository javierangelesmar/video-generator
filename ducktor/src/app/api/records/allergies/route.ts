import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/shared/lib/auth-guard';
import { createServiceClient } from '@/shared/lib/supabase-server';
import { allergySchema } from '@/shared/utils/validators';

export async function GET(req: NextRequest) {
  return withAuth(req, async (_, userId) => {
    const supabase = createServiceClient();
    const { data: patient } = await supabase
      .from('patients').select('id').eq('user_id', userId).single();

    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('patient_allergies')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, userId) => {
    const body = await req.json();
    const parsed = allergySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

    const supabase = createServiceClient();
    const { data: patient } = await supabase
      .from('patients').select('id').eq('user_id', userId).single();

    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('patient_allergies')
      .insert({ ...parsed.data, patient_id: patient.id })
      .select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  });
}
