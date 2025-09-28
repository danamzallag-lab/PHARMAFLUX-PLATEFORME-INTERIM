import { useState, useEffect } from 'react'
import { Mission, Application } from '../lib/supabase'
import { missionService } from '../services/missionService'
import { mockDataService, isDevelopmentMode } from '../services/mockData'
import { useAuth } from './useAuth'

export function useMissions() {
  const { profile } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchMissions = async () => {
    if (!profile) return

    setLoading(true)
    setError(null)

    try {
      let result

      if (profile.type === 'employeur') {
        // Mode développement avec mock data ou vraies données
        if (isDevelopmentMode()) {
          result = mockDataService.getEmployerMissions(profile.id)
        } else {
          result = await missionService.getEmployerMissions()
        }
      } else {
        // Pour les candidats, récupérer les missions disponibles
        if (isDevelopmentMode()) {
          result = mockDataService.getAvailableMissions()
        } else {
          result = await missionService.getAvailableMissions()
        }
      }

      if (result.error) {
        setError(result.error)
      } else {
        setMissions(result.missions || [])
      }
    } catch (err) {
      setError(err)
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

export function useApplications() {
  const { profile } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchApplications = async () => {
    if (!profile || profile.type !== 'candidat') return

    setLoading(true)
    setError(null)

    try {
      let result

      if (isDevelopmentMode()) {
        result = mockDataService.getCandidateApplications(profile.id)
      } else {
        result = await missionService.getCandidateApplications()
      }

      if (result.error) {
        setError(result.error)
      } else {
        setApplications(result.applications || [])
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, status: 'accepté' | 'refusé') => {
    try {
      if (isDevelopmentMode()) {
        // En mode mock, simuler la mise à jour
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status }
              : app
          )
        )
        return { success: true, error: null }
      } else {
        const result = await missionService.updateApplicationStatus(applicationId, status)
        if (result.success) {
          await fetchApplications() // Refresh les données
        }
        return result
      }
    } catch (error) {
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
    updateApplicationStatus,
    refetch: fetchApplications
  }
}

export function useMissionStats() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    setLoading(true)

    // Simuler le chargement des statistiques
    setTimeout(() => {
      if (profile.type === 'employeur') {
        setStats(mockDataService.getEmployerStats())
      } else {
        setStats(mockDataService.getCandidateStats())
      }
      setLoading(false)
    }, 500)
  }, [profile])

  return { stats, loading }
}