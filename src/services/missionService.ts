import { supabase, Mission, Application } from '../lib/supabase'
import { contractService } from './contractService'

export interface CreateMissionData {
  title: string
  description: string
  type: 'officine' | 'hopital'
  location: string
  start_date: string
  end_date?: string
  start_time: string
  end_time: string
  hourly_rate: number
}

export interface MatchedCandidate {
  id: string
  email: string
  name?: string
  latitude?: number
  longitude?: number
}

export const missionService = {
  // Créer une nouvelle mission (Phase 1 - client only avec RLS)
  async createMission(data: CreateMissionData): Promise<{ mission: Mission | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return { mission: null, error: { message: 'Utilisateur non connecté' } }
      }

      // Récupérer le profil de l'employeur
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

      if (!profile || profile.type !== 'employeur') {
        return { mission: null, error: { message: 'Seuls les employeurs peuvent créer des missions' } }
      }

      // Géocodage via RPC (défini dans schema.sql)
      const { data: geocoded } = await supabase
        .rpc('geocode_location', { address: data.location })

      const latitude = geocoded?.[0]?.lat || 48.8566 // Paris par défaut
      const longitude = geocoded?.[0]?.lng || 2.3522

      // Créer la mission (RLS s'applique automatiquement)
      const { data: mission, error } = await supabase
        .from('missions')
        .insert({
          employer_id: profile.id,
          title: data.title,
          description: data.description,
          type: data.type,
          location: data.location,
          latitude,
          longitude,
          start_date: data.start_date,
          end_date: data.end_date,
          start_time: data.start_time,
          end_time: data.end_time,
          hourly_rate: data.hourly_rate,
        })
        .select('*')
        .single()

      if (error) {
        return { mission: null, error }
      }

      // Phase 1: Matching côté client (en Phase 2, ce sera côté serveur)
      this.matchCandidatesClient(mission.id)

      return { mission, error: null }
    } catch (error) {
      return { mission: null, error }
    }
  },

  // Phase 1: Matching côté client avec RLS
  async matchCandidatesClient(missionId: string): Promise<void> {
    try {
      // Utiliser la RPC définie dans schema.sql
      const { data: candidates, error } = await supabase
        .rpc('find_matching_candidates', { mission_id: missionId })

      if (error) {
        console.error('Erreur matching:', error)
        return
      }

      if (candidates && candidates.length > 0) {
        // Créer les applications pour chaque candidat trouvé
        const applications = candidates.map((candidate: MatchedCandidate) => ({
          candidate_id: candidate.id,
          mission_id: missionId,
          status: 'proposé' as const
        }))

        const { error: applyError } = await supabase
          .from('applications')
          .insert(applications)

        if (applyError) {
          console.error('Erreur création applications:', applyError)
        } else {
          console.log(`${applications.length} candidats matchés pour la mission ${missionId}`)
        }
      }
    } catch (error) {
      console.error('Erreur matching candidats:', error)
    }
  },

  // Phase 2: Matching via API serveur (pour référence future)
  async matchCandidatesServer(missionId: string): Promise<{ candidates: MatchedCandidate[]; error: any }> {
    try {
      // Phase 2: Appel à /api/missions/{id}/match avec SERVICE_ROLE_KEY
      const response = await fetch(`/api/missions/${missionId}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const result = await response.json()
      return result
    } catch (error) {
      return { candidates: [], error }
    }
  },

  // Récupérer les missions d'un employeur
  async getEmployerMissions(): Promise<{ missions: Mission[]; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return { missions: [], error: { message: 'Utilisateur non connecté' } }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

      if (!profile) {
        return { missions: [], error: { message: 'Profil non trouvé' } }
      }

      const { data: missions, error } = await supabase
        .from('missions')
        .select('*')
        .eq('employer_id', profile.id)
        .order('created_at', { ascending: false })

      return { missions: missions || [], error }
    } catch (error) {
      return { missions: [], error }
    }
  },

  // Récupérer les candidatures pour un candidat
  async getCandidateApplications(): Promise<{ applications: any[]; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return { applications: [], error: { message: 'Utilisateur non connecté' } }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', user.id)
        .single()

      if (!profile) {
        return { applications: [], error: { message: 'Profil non trouvé' } }
      }

      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          missions (
            *,
            profiles!missions_employer_id_fkey (name, email)
          )
        `)
        .eq('candidate_id', profile.id)
        .order('created_at', { ascending: false })

      return { applications: applications || [], error }
    } catch (error) {
      return { applications: [], error }
    }
  },

  // Accepter ou refuser une candidature
  async updateApplicationStatus(
    applicationId: string,
    status: 'accepté' | 'refusé'
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)

      if (!error && status === 'accepté') {
        // Si accepté, marquer la mission comme assignée
        const { data: application } = await supabase
          .from('applications')
          .select('mission_id')
          .eq('id', applicationId)
          .single()

        if (application) {
          await supabase
            .from('missions')
            .update({ status: 'assignée' })
            .eq('id', application.mission_id)

          // Générer le contrat automatiquement
          setTimeout(async () => {
            try {
              await contractService.generateContract(application.mission_id)
            } catch (error) {
              console.error('Erreur génération contrat:', error)
            }
          }, 2000)
        }
      }

      return { success: !error, error }
    } catch (error) {
      return { success: false, error }
    }
  },

  // Récupérer les missions ouvertes pour un candidat
  async getAvailableMissions(): Promise<{ missions: Mission[]; error: any }> {
    try {
      const { data: missions, error } = await supabase
        .from('missions')
        .select(`
          *,
          profiles!missions_employer_id_fkey (name, email)
        `)
        .eq('status', 'ouverte')
        .order('created_at', { ascending: false })

      return { missions: missions || [], error }
    } catch (error) {
      return { missions: [], error }
    }
  }
}