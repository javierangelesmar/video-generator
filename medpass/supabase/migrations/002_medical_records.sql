-- IPS REQUIRED: Problem List (ICD-10/ICD-11 + SNOMED CT)
CREATE TABLE public.patient_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  icd_code TEXT NOT NULL,
  snomed_code TEXT,
  description_es TEXT NOT NULL,
  onset_date DATE,
  status TEXT CHECK (status IN ('active', 'resolved', 'inactive')) DEFAULT 'active',
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  recorded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own problems" ON public.patient_problems
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert problems" ON public.patient_problems
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- IPS REQUIRED: Medications
CREATE TABLE public.patient_medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  generic_name TEXT,
  rxnorm_code TEXT,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  route TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  prescriber_id UUID REFERENCES public.doctors(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own medications" ON public.patient_medications
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert medications" ON public.patient_medications
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- IPS REQUIRED: Allergies and Intolerances
CREATE TABLE public.patient_allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  allergen TEXT NOT NULL,
  allergen_type TEXT CHECK (allergen_type IN ('medication', 'food', 'environment', 'other')),
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')) NOT NULL,
  reaction_description TEXT,
  snomed_code TEXT,
  onset_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own allergies" ON public.patient_allergies
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert allergies" ON public.patient_allergies
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- IPS RECOMMENDED: Immunizations
CREATE TABLE public.patient_immunizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  cvx_code TEXT,
  date_administered DATE,
  lot_number TEXT,
  administered_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_immunizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own immunizations" ON public.patient_immunizations
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert immunizations" ON public.patient_immunizations
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- IPS RECOMMENDED: Procedures
CREATE TABLE public.patient_procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  procedure_name TEXT NOT NULL,
  snomed_code TEXT,
  date_performed DATE,
  performed_by TEXT,
  hospital TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own procedures" ON public.patient_procedures
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert procedures" ON public.patient_procedures
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- IPS RECOMMENDED: Lab Results
CREATE TABLE public.patient_lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  loinc_code TEXT,
  observation_name TEXT NOT NULL,
  value TEXT,
  unit TEXT,
  reference_range TEXT,
  interpretation TEXT CHECK (interpretation IN ('normal', 'abnormal', 'critical')),
  date_collected DATE NOT NULL,
  lab_name TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patient_lab_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own lab results" ON public.patient_lab_results
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert lab results" ON public.patient_lab_results
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- Medical Documents (PDFs, DICOM, images)
CREATE TABLE public.medical_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('pdf', 'dicom', 'image', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  description TEXT,
  uploader_id UUID REFERENCES public.users(id),
  is_encrypted BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients own documents" ON public.medical_documents
  USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));
CREATE POLICY "Patients insert documents" ON public.medical_documents
  FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- Triggers
CREATE TRIGGER trg_problems_updated_at BEFORE UPDATE ON public.patient_problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_medications_updated_at BEFORE UPDATE ON public.patient_medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
