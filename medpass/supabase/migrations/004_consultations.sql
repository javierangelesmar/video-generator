-- Case Consultations (doctor-to-doctor communication about a patient)
CREATE TYPE consultation_status AS ENUM ('pending', 'active', 'resolved', 'closed');

CREATE TABLE public.case_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  requesting_doctor_id UUID NOT NULL REFERENCES public.doctors(id),
  responding_doctor_id UUID REFERENCES public.doctors(id),
  status consultation_status DEFAULT 'pending',
  subject TEXT NOT NULL,
  clinical_summary TEXT,
  language_requesting TEXT DEFAULT 'es',
  language_responding TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.case_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors see own consultations" ON public.case_consultations
  FOR SELECT USING (
    requesting_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
    OR responding_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors create consultations" ON public.case_consultations
  FOR INSERT WITH CHECK (
    requesting_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors update consultations they are part of" ON public.case_consultations
  FOR UPDATE USING (
    requesting_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
    OR responding_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
  );

-- Consultation Messages (Supabase Realtime enabled)
CREATE TABLE public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID NOT NULL REFERENCES public.case_consultations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  translated_content JSONB DEFAULT '{}',
  file_url TEXT,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors in consultation can read messages" ON public.consultation_messages
  FOR SELECT USING (
    consultation_id IN (
      SELECT id FROM public.case_consultations
      WHERE requesting_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
        OR responding_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Doctors in consultation can send messages" ON public.consultation_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND consultation_id IN (
      SELECT id FROM public.case_consultations
      WHERE requesting_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
        OR responding_doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())
    )
  );

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_messages;

CREATE TRIGGER trg_consultations_updated_at BEFORE UPDATE ON public.case_consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
