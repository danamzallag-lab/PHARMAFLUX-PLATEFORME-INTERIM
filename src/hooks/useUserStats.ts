import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

interface CandidateStats {
  totalApplications: number
  acceptedApplications: number
  pendingApplications: number
  rejectedApplications: number
  totalHoursWorked: number
  averageHourlyRate: number
  loyaltyPoints: number
  currentLevel: string
  totalEarnings: number
}

interface EmployerStats {
  totalMissions: number
  activeMissions: number
  completedMissions: number
  averageHourlyRate: number
  totalCandidatesMatched: number
  avgResponseTime: string
}

export function useUserStats() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<CandidateStats | EmployerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchCandidateStats = async (candidateId: string): Promise<CandidateStats> => {
    try {
      // Récupérer les candidatures du candidat
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          missions (
            hourly_rate,
            start_date,
            end_date,
            start_time,
            end_time
          )
        `)
        .eq('candidate_id', candidateId)

      if (appError) throw appError

      // Récupérer les points de fidélité
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', candidateId)
        .single()

      // Si pas de données de fidélité, utiliser des valeurs par défaut
      const loyalty = loyaltyData || { total_points: 0, level: 'Bronze' }

      // Calculer les statistiques
      const totalApplications = applications?.length || 0
      const acceptedApplications = applications?.filter(app => app.status === 'accepté').length || 0
      const pendingApplications = applications?.filter(app => app.status === 'proposé').length || 0
      const rejectedApplications = applications?.filter(app => app.status === 'refusé').length || 0

      // Calculer les heures travaillées et gains pour les missions acceptées
      let totalHoursWorked = 0
      let totalEarnings = 0
      let totalRates = 0
      let rateCount = 0

      applications?.forEach(app => {
        if (app.status === 'accepté' && app.missions) {
          const mission = app.missions
          if (mission.start_time && mission.end_time && mission.hourly_rate) {
            // Calculer les heures par jour
            const startTime = new Date(`1970-01-01T${mission.start_time}`)
            const endTime = new Date(`1970-01-01T${mission.end_time}`)
            const hoursPerDay = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

            // Calculer le nombre de jours
            let days = 1
            if (mission.start_date && mission.end_date) {
              const startDate = new Date(mission.start_date)
              const endDate = new Date(mission.end_date)
              days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
            }

            const missionHours = hoursPerDay * days
            totalHoursWorked += missionHours
            totalEarnings += missionHours * mission.hourly_rate
            totalRates += mission.hourly_rate
            rateCount++
          }
        }
      })

      const averageHourlyRate = rateCount > 0 ? totalRates / rateCount : 0

      return {
        totalApplications,
        acceptedApplications,
        pendingApplications,
        rejectedApplications,
        totalHoursWorked,
        averageHourlyRate,
        loyaltyPoints: loyalty.total_points || 0,
        currentLevel: loyalty.level || 'Bronze',
        totalEarnings
      }
    } catch (error) {
      console.error('Error fetching candidate stats:', error)
      throw error
    }
  }

  const fetchEmployerStats = async (employerId: string): Promise<EmployerStats> => {
    try {
      // Récupérer les missions de l'employeur
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('employer_id', employerId)

      if (missionsError) throw missionsError

      // Récupérer les candidatures pour ces missions
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('*')
        .in('mission_id', missions?.map(m => m.id) || [])

      if (appError) throw appError

      const totalMissions = missions?.length || 0
      const activeMissions = missions?.filter(m => m.status === 'ouverte').length || 0
      const completedMissions = missions?.filter(m => m.status === 'terminée').length || 0

      const totalRates = missions?.reduce((sum, m) => sum + (m.hourly_rate || 0), 0) || 0
      const averageHourlyRate = totalMissions > 0 ? totalRates / totalMissions : 0

      const totalCandidatesMatched = applications?.filter(app => app.status === 'accepté').length || 0

      return {
        totalMissions,
        activeMissions,
        completedMissions,
        averageHourlyRate,
        totalCandidatesMatched,
        avgResponseTime: '2.3h' // Placeholder - peut être calculé avec des données de timestamps
      }
    } catch (error) {
      console.error('Error fetching employer stats:', error)
      throw error
    }
  }

  const fetchStats = async () => {
    if (!profile) return

    setLoading(true)
    setError(null)

    try {
      let statsData

      if (profile.type === 'candidat') {
        statsData = await fetchCandidateStats(profile.id)
      } else if (profile.type === 'employeur') {
        statsData = await fetchEmployerStats(profile.id)
      }

      setStats(statsData || null)
    } catch (err) {
      setError(err)
      console.error('Error fetching user stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) {
      fetchStats()
    }
  }, [profile])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}