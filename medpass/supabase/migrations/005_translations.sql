-- Translation Cache (avoid repeated Claude API calls)
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  source_hash TEXT NOT NULL,
  language_code TEXT NOT NULL,
  translated_content TEXT NOT NULL,
  model_used TEXT DEFAULT 'claude-sonnet-4-6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (source_type, source_id, language_code, source_hash)
);

-- No RLS needed — translations are non-PHI cached outputs
-- Service role used for reads/writes from API routes
