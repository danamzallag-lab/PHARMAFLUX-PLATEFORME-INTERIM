import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types pour TypeScript basés sur le schéma de la base de données
export interface Profile {
  id: string
  auth_uid: string
  type: 'candidat' | 'employeur'
  name: string | null
  email: string
  phone: string | null
  latitude: number | null
  longitude: number | null
  competences: string[] | null
  availabilities: any | null
  // Champs spécifiques employeurs
  company_name: string | null
  legal_name: string | null
  siret: string | null
  address_street: string | null
  address_city: string | null
  address_postal_code: string | null
  hr_contact_name: string | null
  hr_contact_email: string | null
  hr_contact_phone: string | null
  onboarding_completed: boolean
  created_at: string
}

export interface Mission {
  id: string
  employer_id: string
  title: string
  description: string | null
  type: 'officine' | 'hopital'
  location: string | null
  latitude: number | null
  longitude: number | null
  start_date: string | null
  end_date: string | null
  start_time: string | null
  end_time: string | null
  hourly_rate: number | null
  status: 'ouverte' | 'assignée' | 'terminée'
  created_at: string
  profiles?: Profile
}

export interface Application {
  id: string
  candidate_id: string
  mission_id: string
  status: 'proposé' | 'accepté' | 'refusé'
  created_at: string
  missions?: Mission
  profiles?: Profile
}

export interface Contract {
  id: string
  mission_id: string
  contract_pdf_url: string | null
  signed_by_candidate_at: string | null
  signed_by_employer_at: string | null
  created_at: string
}

export interface LoyaltyPoints {
  user_id: string
  total_points: number
  level: string
  rewards: string[] | null
}

export interface Referral {
  id: string
  referrer_id: string
  referred_email: string
  token: string
  status: 'pending' | 'registered' | 'rewarded'
  created_at: string
}

export interface EmployerDocument {
  id: string
  employer_id: string
  document_type: 'kbis' | 'ars' | 'insurance' | 'other'
  file_name: string
  file_url: string
  file_size: number | null
  uploaded_at: string
}

// Fonctions d'aide pour l'authentification
export const auth = {
  signUp: (email: string, password: string, metadata?: any) =>
    supabase.auth.signUp({ email, password, options: { data: metadata } }),

  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  getUser: () => supabase.auth.getUser(),

  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback)
}

// Fonctions d'aide pour les profils
export const profiles = {
  get: (id: string) =>
    supabase.from('profiles').select('*').eq('id', id).single(),

  getByAuthUid: (authUid: string) =>
    supabase.from('profiles').select('*').eq('auth_uid', authUid).single(),

  update: (id: string, updates: Partial<Profile>) =>
    supabase.from('profiles').update(updates).eq('id', id),

  create: (profile: Omit<Profile, 'id' | 'created_at'>) =>
    supabase.from('profiles').insert(profile)
}

// Fonctions d'aide pour les missions
export const missions = {
  getAll: () =>
    supabase.from('missions').select(`
      *,
      profiles!missions_employer_id_fkey(name, email)
    `).eq('status', 'ouverte').order('created_at', { ascending: false }),

  getById: (id: string) =>
    supabase.from('missions').select(`
      *,
      profiles!missions_employer_id_fkey(name, email, phone)
    `).eq('id', id).single(),

  getByEmployer: (employerId: string) =>
    supabase.from('missions').select('*').eq('employer_id', employerId).order('created_at', { ascending: false }),

  create: (mission: Omit<Mission, 'id' | 'created_at' | 'status'>) =>
    supabase.from('missions').insert({ ...mission, status: 'ouverte' }),

  update: (id: string, updates: Partial<Mission>) =>
    supabase.from('missions').update(updates).eq('id', id),

  delete: (id: string) =>
    supabase.from('missions').delete().eq('id', id)
}

// Fonctions d'aide pour les candidatures
export const applications = {
  getByCandidate: (candidateId: string) =>
    supabase.from('applications').select(`
      *,
      missions(*, profiles!missions_employer_id_fkey(name, email))
    `).eq('candidate_id', candidateId).order('created_at', { ascending: false }),

  getByMission: (missionId: string) =>
    supabase.from('applications').select(`
      *,
      profiles!applications_candidate_id_fkey(name, email, phone, competences)
    `).eq('mission_id', missionId).order('created_at', { ascending: false }),

  create: (application: Omit<Application, 'id' | 'created_at' | 'status'>) =>
    supabase.from('applications').insert({ ...application, status: 'proposé' }),

  updateStatus: (id: string, status: Application['status']) =>
    supabase.from('applications').update({ status }).eq('id', id),

  checkExisting: (candidateId: string, missionId: string) =>
    supabase.from('applications').select('id').eq('candidate_id', candidateId).eq('mission_id', missionId).single()
}

// Fonctions d'aide pour les points de fidélité
export const loyaltyPoints = {
  get: (userId: string) =>
    supabase.from('loyalty_points').select('*').eq('user_id', userId).single(),

  upsert: (points: LoyaltyPoints) =>
    supabase.from('loyalty_points').upsert(points),

  addPoints: (userId: string, points: number) =>
    supabase.rpc('add_loyalty_points', { user_id: userId, points_to_add: points })
}

// Fonctions d'aide pour les documents employeurs
export const employerDocuments = {
  getByEmployer: (employerId: string) =>
    supabase.from('employer_documents').select('*').eq('employer_id', employerId).order('uploaded_at', { ascending: false }),

  create: (document: Omit<EmployerDocument, 'id' | 'uploaded_at'>) =>
    supabase.from('employer_documents').insert(document),

  delete: (id: string) =>
    supabase.from('employer_documents').delete().eq('id', id)
}