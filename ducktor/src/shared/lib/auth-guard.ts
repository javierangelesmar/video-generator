import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from './supabase-server';

type Handler = (req: NextRequest, userId: string, role: string) => Promise<NextResponse>;

export async function withAuth(req: NextRequest, handler: Handler): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createServiceClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return handler(req, user.id, userData?.role ?? 'patient');
}
