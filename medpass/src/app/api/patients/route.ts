import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/shared/lib/auth-guard';
import { createServiceClient } from '@/shared/lib/supabase-server';
import { patientProfileSchema } from '@/shared/utils/validators';

export async function GET(req: NextRequest) {
  return withAuth(req, async (_, userId) => {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, userId) => {
    const body = await req.json();
    const parsed = patientProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('patients')
      .upsert({ ...parsed.data, user_id: userId })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  });
}
