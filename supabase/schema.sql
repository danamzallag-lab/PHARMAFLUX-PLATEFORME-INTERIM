-- Script d'initialisation de la base de données pour PharmaFlux
-- À exécuter dans l'éditeur SQL de Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Table profiles : profils candidat/employeur (lié à auth Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid UUID REFERENCES auth.users (id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('candidat', 'employeur')),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  -- Localisation (pour matching géographique)
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- Compétences (array des rôles ou spécialités)
  competences TEXT[],
  -- Disponibilités stockées en JSON (ex. liste de créneaux)
  availabilities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table missions : offres d'intérim postées par les employeurs
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES profiles (id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('officine','hopital')),
  location TEXT,
  latitude DOUBLE PRECISION,   -- pour le calcul de distance
  longitude DOUBLE PRECISION,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  hourly_rate NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'ouverte' CHECK(status IN ('ouverte','assignée','terminée')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table applications : candidatures ou propositions pour une mission
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES profiles (id) NOT NULL,
  mission_id UUID REFERENCES missions (id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposé' CHECK(status IN ('proposé','accepté','refusé')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table contracts : contrats générés et signés
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions (id) UNIQUE NOT NULL,
  contract_pdf_url TEXT,
  signed_by_candidate_at TIMESTAMP WITH TIME ZONE,
  signed_by_employer_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table loyalty_points : points fidélité des utilisateurs
CREATE TABLE IF NOT EXISTS loyalty_points (
  user_id UUID REFERENCES profiles (id) PRIMARY KEY,
  total_points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Bronze',
  rewards TEXT[]
);

-- Table referrals : parrainages
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles (id) NOT NULL,
  referred_email TEXT NOT NULL,
  token TEXT NOT NULL,  -- code ou lien unique
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','registered','rewarded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour créer automatiquement un profil après l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_uid, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer un profil après l'inscription
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- Fonction de géocodage simple (à améliorer avec une vraie API)
CREATE OR REPLACE FUNCTION public.geocode_location(address TEXT)
RETURNS TABLE(lat DOUBLE PRECISION, lng DOUBLE PRECISION) AS $$
BEGIN
  -- Version simplifiée : retourne des coordonnées par défaut pour Paris
  -- Dans un vrai projet, intégrer une API de géocodage
  RETURN QUERY SELECT 48.8566::DOUBLE PRECISION, 2.3522::DOUBLE PRECISION;
END;
$$ LANGUAGE plpgsql;

-- Fonction de matching des candidats
CREATE OR REPLACE FUNCTION public.find_matching_candidates(mission_id UUID)
RETURNS TABLE(id UUID, email TEXT, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION) AS $$
DECLARE
  m_record missions%ROWTYPE;
BEGIN
  SELECT * INTO m_record FROM missions WHERE missions.id = mission_id;

  RETURN QUERY
    SELECT p.id, p.email, p.latitude, p.longitude
    FROM profiles p
    WHERE p.type = 'candidat'
      AND p.competences @> ARRAY[m_record.type]  -- compétence correspond au type de mission
      -- Distance approximative (à améliorer avec PostGIS)
      AND ABS(p.latitude - m_record.latitude) < 0.5 -- ~50km approximatif
      AND ABS(p.longitude - m_record.longitude) < 0.5
      -- Disponibilité contient la date (simplifié)
      AND (p.availabilities IS NULL OR
           EXISTS (
             SELECT 1 FROM jsonb_array_elements(p.availabilities) AS avail
             WHERE (avail->>'date')::DATE = m_record.start_date
           ));
END;
$$ LANGUAGE plpgsql;

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Politiques pour profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_uid);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_uid);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_uid);

-- Politiques pour missions
CREATE POLICY "Everyone can view open missions" ON missions
  FOR SELECT USING (status = 'ouverte');

CREATE POLICY "Employers can manage their missions" ON missions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_uid = auth.uid()
      AND profiles.id = missions.employer_id
    )
  );

-- Politiques pour applications
CREATE POLICY "Users can view their applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_uid = auth.uid()
      AND (profiles.id = applications.candidate_id OR
           profiles.id = (SELECT employer_id FROM missions WHERE id = applications.mission_id))
    )
  );

CREATE POLICY "Candidates can create applications" ON applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_uid = auth.uid()
      AND profiles.id = applications.candidate_id
      AND profiles.type = 'candidat'
    )
  );

CREATE POLICY "Users can update their applications" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.auth_uid = auth.uid()
      AND (profiles.id = applications.candidate_id OR
           profiles.id = (SELECT employer_id FROM missions WHERE id = applications.mission_id))
    )
  );

-- Politiques pour contracts
CREATE POLICY "Users can view contracts for their missions/applications" ON contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM missions m
      JOIN profiles p ON p.auth_uid = auth.uid()
      WHERE m.id = contracts.mission_id
      AND (m.employer_id = p.id OR
           EXISTS (SELECT 1 FROM applications a WHERE a.mission_id = m.id AND a.candidate_id = p.id))
    )
  );

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON profiles(auth_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON profiles(type);
CREATE INDEX IF NOT EXISTS idx_missions_employer_id ON missions(employer_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_mission_id ON applications(mission_id);