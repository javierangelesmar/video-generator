import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', fr: 'French', de: 'German', pt: 'Portuguese',
  ar: 'Arabic', zh: 'Mandarin Chinese', ja: 'Japanese', ko: 'Korean',
  hi: 'Hindi', id: 'Indonesian (Bahasa)', vi: 'Vietnamese', th: 'Thai', fil: 'Filipino (Tagalog)',
};

export async function translateMedicalContent(
  content: string,
  targetLanguageCode: string,
  sourceLanguageCode = 'es'
): Promise<string> {
  const targetLanguage = LANGUAGE_NAMES[targetLanguageCode] ?? targetLanguageCode;
  const sourceLanguage = LANGUAGE_NAMES[sourceLanguageCode] ?? sourceLanguageCode;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are a certified medical translator. Translate the following clinical content from ${sourceLanguage} to ${targetLanguage}.

RULES:
- Preserve all medical codes exactly (ICD-10, ICD-11, SNOMED CT, LOINC, RxNorm, CVX)
- Use proper medical terminology in ${targetLanguage} as used by healthcare professionals
- Keep all dates, dosages, measurements, and numeric values unchanged
- Preserve JSON structure if input is JSON
- Do not add explanations or commentary
- Respond ONLY with the translated content

CONTENT:
${content}`,
    }],
  });

  return (message.content[0] as { text: string }).text;
}

export async function structureFromFreeText(
  freeText: string,
  targetSchema: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Extract structured medical data from the following free text and return valid JSON matching this schema:

SCHEMA:
${targetSchema}

FREE TEXT:
${freeText}

Return ONLY valid JSON, no explanations.`,
    }],
  });

  return (message.content[0] as { text: string }).text;
}
