-- Share Tokens (time-limited access to IPS)
CREATE TABLE public.share_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_hash TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.users(id),
  language_code TEXT NOT NULL DEFAULT 'es',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '72 hours'),
  access_count INTEGER DEFAULT 0,
  max_accesses INTEGER DEFAULT 10,
  revoked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.share_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own tokens" ON public.share_tokens
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

CREATE POLICY "Patients insert own tokens" ON public.share_tokens
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- Access Logs — IMMUTABLE (no UPDATE, no DELETE policy)
CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id),
  accessor_id UUID REFERENCES public.users(id),
  accessor_type TEXT CHECK (accessor_type IN ('patient', 'doctor', 'token', 'system')),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  country_code TEXT,
  user_agent TEXT,
  language_requested TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own access logs" ON public.access_logs
  FOR SELECT USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

CREATE POLICY "System can insert logs" ON public.access_logs
  FOR INSERT WITH CHECK (TRUE);
-- NO update/delete policies = immutable audit trail

-- Consents
CREATE TABLE public.consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  consent_type TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT
);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own consents" ON public.consents
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

CREATE POLICY "Patients insert own consents" ON public.consents
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
