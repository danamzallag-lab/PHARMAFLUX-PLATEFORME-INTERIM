import { useState, useEffect } from 'react'
import { Mission, Application, supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

// Hook pour récupérer les missions (employeur ou disponibles pour candidat)
export function useRealMissions() {
  const { profile } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchMissions = async () => {
    if (!profile) return

    setLoading(true)
    setError(null)

    try {
      let query

      if (profile.type === 'employeur') {
        // Récupérer les missions de cet employeur
        query = supabase
          .from('missions')
          .select('*')
          .eq('employer_id', profile.id)
          .order('created_at', { ascending: false })
      } else {
        // Récupérer les missions ouvertes pour les candidats
        query = supabase
          .from('missions')
          .select(`
            *,
            profiles!missions_employer_id_fkey(name, email)
          `)
          .eq('status', 'ouverte')
          .order('created_at', { ascending: false })
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setMissions(data || [])
    } catch (err) {
      setError(err)
      console.error('Error fetching missions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) {
      fetchMissions()
    }
  }, [profile])

  return {
    missions,
    loading,
    error,
    refetch: fetchMissions
  }
}

// Hook pour récupérer les candidatures d'un candidat
export function useRealApplications() {
  const { profile } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchApplications = async () => {
    if (!profile || profile.type !== 'candidat') return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select(`
          *,
          missions(*),
          profiles!applications_candidate_id_fkey(name, email)
        `)
        .eq('candidate_id', profile.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setApplications(data || [])
    } catch (err) {
      setError(err)
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyToMission = async (missionId: string) => {
    if (!profile) {
      return { success: false, error: 'Profil non trouvé' }
    }

    try {
      // Vérifier si une candidature existe déjà
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', profile.id)
        .eq('mission_id', missionId)
        .single()

      if (existing) {
        return { success: false, error: 'Vous avez déjà candidaté à cette mission' }
      }

      // Créer la candidature
      const { data, error } = await supabase
        .from('applications')
        .insert({
          candidate_id: profile.id,
          mission_id: missionId,
          status: 'proposé'
        })
        .select()
        .single()

      if (error) throw error

      // Rafraîchir les candidatures
      await fetchApplications()

      return { success: true, data }
    } catch (error) {
      console.error('Error applying to mission:', error)
      return { success: false, error }
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: 'accepté' | 'refusé') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)

      if (error) throw error

      // Rafraîchir les candidatures
      await fetchApplications()

      return { success: true, error: null }
    } catch (error) {
      console.error('Error updating application status:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    if (profile && profile.type === 'candidat') {
      fetchApplications()
    }
  }, [profile])

  return {
    applications,
    loading,
    error,
    applyToMission,
    updateApplicationStatus,
    refetch: fetchApplications
  }
}

// Hook pour récupérer les candidatures d'une mission (pour employeur)
export function useMissionApplications(missionId: string | null) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchApplications = async () => {
    if (!missionId) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_candidate_id_fkey(name, email, phone, competences)
        `)
        .eq('mission_id', missionId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setApplications(data || [])
    } catch (err) {
      setError(err)
      console.error('Error fetching mission applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: 'accepté' | 'refusé') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)

      if (error) throw error

      // Rafraîchir les candidatures
      await fetchApplications()

      return { success: true, error: null }
    } catch (error) {
      console.error('Error updating application status:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    if (missionId) {
      fetchApplications()
    }
  }, [missionId])

  return {
    applications,
    loading,
    error,
    updateApplicationStatus,
    refetch: fetchApplications
  }
}

// Hook pour créer une nouvelle mission (employeur)
export function useCreateMission() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)

  const createMission = async (missionData: Omit<Mission, 'id' | 'created_at' | 'status' | 'employer_id'>) => {
    if (!profile || profile.type !== 'employeur') {
      return { success: false, error: 'Accès non autorisé' }
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('missions')
        .insert({
          ...missionData,
          employer_id: profile.id,
          status: 'ouverte'
        })
        .select()
        .single()

      if (error) throw error

      setLoading(false)
      return { success: true, data }
    } catch (error) {
      console.error('Error creating mission:', error)
      setLoading(false)
      return { success: false, error }
    }
  }

  return {
    createMission,
    loading
  }
}