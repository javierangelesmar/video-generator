-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User roles enum
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');

-- Users (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Patients (NOM-004 required fields)
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  curp TEXT UNIQUE,
  date_of_birth DATE NOT NULL,
  sex TEXT CHECK (sex IN ('M', 'F', 'other')) NOT NULL,
  blood_type TEXT,
  nationality TEXT DEFAULT 'MX',
  address JSONB,
  emergency_contact JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients see own record" ON public.patients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Patients update own record" ON public.patients
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Patients insert own record" ON public.patients
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors see patients in their consultations" ON public.patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.case_consultations cc
      JOIN public.doctors d ON d.id = cc.responding_doctor_id
      WHERE cc.patient_id = patients.id AND d.user_id = auth.uid()
    )
  );

-- Doctors
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  country_code TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_country TEXT NOT NULL,
  spoken_languages TEXT[] DEFAULT '{"es"}',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verified doctors" ON public.doctors
  FOR SELECT USING (verified_at IS NOT NULL);

CREATE POLICY "Doctors manage own profile" ON public.doctors
  USING (user_id = auth.uid());

CREATE POLICY "Doctors insert own profile" ON public.doctors
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Auto-update trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_doctors_updated_at BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
