import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/shared/lib/auth-guard';
import { translateMedicalContent } from '@/shared/lib/claude';
import { z } from 'zod';

const bodySchema = z.object({
  content: z.string().min(1).max(50000),
  targetLanguage: z.string().min(2).max(5),
  sourceLanguage: z.string().min(2).max(5).optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, _userId) => {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { content, targetLanguage, sourceLanguage = 'es' } = parsed.data;

    const translated = await translateMedicalContent(content, targetLanguage, sourceLanguage);
    return NextResponse.json({ translated, targetLanguage });
  });
}
