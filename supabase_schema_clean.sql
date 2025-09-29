-- Script SQL consolidé et nettoyé pour PharmaFlux
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- 2. NETTOYAGE (supprimer les conflits)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_mission_completed ON missions;
DROP TRIGGER IF EXISTS on_referral_rewarded ON referrals;
DROP FUNCTION IF EXISTS public.handle_new_auth_user();
DROP FUNCTION IF EXISTS public.find_matching_candidates(uuid);
DROP FUNCTION IF EXISTS public.add_loyalty_points_on_mission_completed();
DROP FUNCTION IF EXISTS public.reward_referrer_on_registration();

-- Supprimer les policies existantes pour éviter les conflits
DROP POLICY IF EXISTS "read_own_profile" ON profiles;
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Missions policies
DROP POLICY IF EXISTS "read_missions_all" ON missions;
DROP POLICY IF EXISTS "employer_insert_own" ON missions;
DROP POLICY IF EXISTS "employer_update_own" ON missions;
DROP POLICY IF EXISTS "employer_delete_own" ON missions;
DROP POLICY IF EXISTS "Everyone can view open missions" ON missions;
DROP POLICY IF EXISTS "Employers can manage their missions" ON missions;

-- Applications policies
DROP POLICY IF EXISTS "candidate_read_own_apps" ON applications;
DROP POLICY IF EXISTS "candidate_insert_own" ON applications;
DROP POLICY IF EXISTS "candidate_update_own_status" ON applications;
DROP POLICY IF EXISTS "employer_read_apps_for_own_missions" ON applications;
DROP POLICY IF EXISTS "Users can view their applications" ON applications;
DROP POLICY IF EXISTS "Candidates can create applications" ON applications;
DROP POLICY IF EXISTS "Users can update their applications" ON applications;

-- Contracts policies
DROP POLICY IF EXISTS "read_contracts_by_parties" ON contracts;
DROP POLICY IF EXISTS "Users can view contracts for their missions/applications" ON contracts;

-- Loyalty points policies
DROP POLICY IF EXISTS "manage_own_loyalty_points" ON loyalty_points;

-- Referrals policies
DROP POLICY IF EXISTS "manage_own_referrals" ON referrals;

-- 3. TABLES PRINCIPALES

-- Table des profils (candidats/employeurs)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('candidat','employeur')),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  competences TEXT[],
  availabilities JSONB,
  -- Champs spécifiques employeurs
  company_name TEXT,
  legal_name TEXT,
  siret TEXT,
  address_street TEXT,
  address_city TEXT,
  address_postal_code TEXT,
  hr_contact_name TEXT,
  hr_contact_email TEXT,
  hr_contact_phone TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('officine','hopital')),
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  hourly_rate NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'ouverte' CHECK(status IN ('ouverte','assignée','terminée')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table candidatures
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES profiles(id) NOT NULL,
  mission_id UUID REFERENCES missions(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposé' CHECK(status IN ('proposé','accepté','refusé')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(candidate_id, mission_id)
);

-- Table contrats
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) UNIQUE NOT NULL,
  contract_pdf_url TEXT,
  signed_by_candidate_at TIMESTAMPTZ,
  signed_by_employer_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table points de fidélité
CREATE TABLE IF NOT EXISTS loyalty_points (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  total_points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Bronze',
  rewards TEXT[]
);

-- Table parrainages
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles(id) NOT NULL,
  referred_email TEXT NOT NULL,
  token TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','registered','rewarded')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table documents employeurs
CREATE TABLE IF NOT EXISTS employer_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES profiles(id) NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('kbis','ars','insurance','other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 4. FONCTIONS UTILITAIRES

-- Fonction helper pour obtenir l'UID
CREATE OR REPLACE FUNCTION public.uid() RETURNS UUID
LANGUAGE SQL STABLE AS $$
  SELECT auth.uid()
$$;

-- Fonction de création automatique de profil (détecte le type depuis metadata)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_uid, email, type, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'type', 'candidat')::TEXT,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (auth_uid) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction de matching des candidats
CREATE OR REPLACE FUNCTION public.find_matching_candidates(mission_id UUID)
RETURNS TABLE(id UUID, email TEXT) AS $$
DECLARE
  m missions%ROWTYPE;
BEGIN
  SELECT * INTO m FROM missions WHERE missions.id = find_matching_candidates.mission_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY
    SELECT p.id, p.email
    FROM profiles p
    WHERE p.type = 'candidat'
      AND (p.competences IS NULL OR p.competences @> ARRAY[m.type]::TEXT[])
      AND (
        m.latitude IS NULL OR m.longitude IS NULL
        OR p.latitude IS NULL OR p.longitude IS NULL
        OR earth_distance(
             ll_to_earth(p.latitude, p.longitude),
             ll_to_earth(m.latitude, m.longitude)
           ) < 30000
      )
      AND (
        p.availabilities IS NULL OR EXISTS (
          SELECT 1 FROM jsonb_array_elements(p.availabilities) a
          WHERE (a->>'date')::DATE = m.start_date
        )
      );
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. TRIGGERS

-- Trigger création automatique de profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- Trigger attribution automatique de points après mission terminée
CREATE OR REPLACE FUNCTION public.add_loyalty_points_on_mission_completed()
RETURNS TRIGGER AS $$
DECLARE
  candidate_profile_id UUID;
BEGIN
  -- Vérifier que la mission passe de 'assignée' à 'terminée'
  IF NEW.status = 'terminée' AND OLD.status != 'terminée' THEN
    -- Trouver le candidat qui a été accepté pour cette mission
    SELECT candidate_id INTO candidate_profile_id
    FROM applications
    WHERE mission_id = NEW.id AND status = 'accepté'
    LIMIT 1;

    IF candidate_profile_id IS NOT NULL THEN
      -- Ajouter 100 points au candidat
      INSERT INTO loyalty_points (user_id, total_points, level)
      VALUES (candidate_profile_id, 100, 'Bronze')
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_points = loyalty_points.total_points + 100,
        level = CASE
          WHEN loyalty_points.total_points + 100 >= 5000 THEN 'Platine'
          WHEN loyalty_points.total_points + 100 >= 2500 THEN 'Or'
          WHEN loyalty_points.total_points + 100 >= 1000 THEN 'Argent'
          ELSE 'Bronze'
        END;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_mission_completed
  AFTER UPDATE ON missions
  FOR EACH ROW
  WHEN (NEW.status = 'terminée' AND OLD.status != 'terminée')
  EXECUTE PROCEDURE public.add_loyalty_points_on_mission_completed();

-- Trigger attribution automatique de points après parrainage réussi
CREATE OR REPLACE FUNCTION public.reward_referrer_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que le statut passe à 'rewarded'
  IF NEW.status = 'rewarded' AND OLD.status != 'rewarded' THEN
    -- Ajouter 50 points au parrain
    INSERT INTO loyalty_points (user_id, total_points, level)
    VALUES (NEW.referrer_id, 50, 'Bronze')
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_points = loyalty_points.total_points + 50,
      level = CASE
        WHEN loyalty_points.total_points + 50 >= 5000 THEN 'Platine'
        WHEN loyalty_points.total_points + 50 >= 2500 THEN 'Or'
        WHEN loyalty_points.total_points + 50 >= 1000 THEN 'Argent'
        ELSE 'Bronze'
      END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_referral_rewarded
  AFTER UPDATE ON referrals
  FOR EACH ROW
  WHEN (NEW.status = 'rewarded' AND OLD.status != 'rewarded')
  EXECUTE PROCEDURE public.reward_referrer_on_registration();

-- 6. SÉCURITÉ RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_documents ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES RLS

-- Profiles: chacun gère son profil
CREATE POLICY "read_own_profile" ON profiles
  FOR SELECT USING (auth_uid = uid());

CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE USING (auth_uid = uid());

CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth_uid = uid());

-- Missions: lecture ouverte, écriture pour employeurs propriétaires
CREATE POLICY "read_missions_all" ON missions
  FOR SELECT USING (true);

CREATE POLICY "employer_insert_own" ON missions
  FOR INSERT WITH CHECK (
    employer_id IN (SELECT id FROM profiles WHERE auth_uid = uid() AND type = 'employeur')
  );

CREATE POLICY "employer_update_own" ON missions
  FOR UPDATE USING (
    employer_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
  );

CREATE POLICY "employer_delete_own" ON missions
  FOR DELETE USING (
    employer_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
  );

-- Applications: candidats voient leurs candidatures, employeurs voient celles de leurs missions
CREATE POLICY "candidate_read_own_apps" ON applications
  FOR SELECT USING (
    candidate_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
    OR
    mission_id IN (
      SELECT m.id FROM missions m
      JOIN profiles p ON p.id = m.employer_id
      WHERE p.auth_uid = uid()
    )
  );

CREATE POLICY "candidate_insert_own" ON applications
  FOR INSERT WITH CHECK (
    candidate_id IN (SELECT id FROM profiles WHERE auth_uid = uid() AND type = 'candidat')
  );

CREATE POLICY "candidate_update_own_status" ON applications
  FOR UPDATE USING (
    candidate_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
  );

-- Contracts: lecture par les parties impliquées
CREATE POLICY "read_contracts_by_parties" ON contracts
  FOR SELECT USING (
    mission_id IN (
      SELECT m.id FROM missions m
      JOIN profiles p ON p.id = m.employer_id
      WHERE p.auth_uid = uid()
    )
    OR
    EXISTS (
      SELECT 1
      FROM applications a
      JOIN profiles pc ON pc.id = a.candidate_id
      WHERE a.mission_id = contracts.mission_id
        AND pc.auth_uid = uid()
        AND a.status = 'accepté'
    )
  );

-- Loyalty points: chacun gère ses points
CREATE POLICY "manage_own_loyalty_points" ON loyalty_points
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
  );

-- Referrals: chacun gère ses parrainages
CREATE POLICY "manage_own_referrals" ON referrals
  FOR ALL USING (
    referrer_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
  );

-- Employer documents: seul l'employeur propriétaire peut gérer ses documents
CREATE POLICY "employer_manage_own_documents" ON employer_documents
  FOR ALL USING (
    employer_id IN (SELECT id FROM profiles WHERE auth_uid = uid())
  );

-- 8. INDEX POUR PERFORMANCES
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON profiles(auth_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_missions_employer_id ON missions(employer_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_type ON missions(type);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_mission_id ON applications(mission_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_employer_documents_employer_id ON employer_documents(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_documents_type ON employer_documents(document_type);