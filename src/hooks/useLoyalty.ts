import { useState, useEffect } from 'react'
import { supabase, LoyaltyPoints } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useLoyalty() {
  const { profile } = useAuth()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyPoints | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchLoyaltyData = async () => {
    if (!profile || profile.type !== 'candidat') return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', profile.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      // Si pas de données de fidélité, créer un enregistrement par défaut
      if (!data) {
        const defaultLoyalty = {
          user_id: profile.id,
          total_points: 0,
          level: 'Bronze',
          rewards: []
        }

        const { data: newData, error: insertError } = await supabase
          .from('loyalty_points')
          .insert(defaultLoyalty)
          .select()
          .single()

        if (insertError) throw insertError

        setLoyaltyData(newData)
      } else {
        setLoyaltyData(data)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching loyalty data:', err)
    } finally {
      setLoading(false)
    }
  }

  const addPoints = async (points: number, reason: string = 'Mission completée') => {
    if (!profile || !loyaltyData) {
      return { success: false, error: 'Données de fidélité non disponibles' }
    }

    try {
      const newTotalPoints = loyaltyData.total_points + points

      // Calculer le nouveau niveau basé sur les points
      let newLevel = 'Bronze'
      if (newTotalPoints >= 5000) newLevel = 'Platine'
      else if (newTotalPoints >= 2500) newLevel = 'Or'
      else if (newTotalPoints >= 1000) newLevel = 'Argent'

      const { data, error } = await supabase
        .from('loyalty_points')
        .update({
          total_points: newTotalPoints,
          level: newLevel
        })
        .eq('user_id', profile.id)
        .select()
        .single()

      if (error) throw error

      setLoyaltyData(data)
      return { success: true, data }
    } catch (error) {
      console.error('Error adding loyalty points:', error)
      return { success: false, error }
    }
  }

  const redeemReward = async (rewardName: string, pointsCost: number) => {
    if (!profile || !loyaltyData) {
      return { success: false, error: 'Données de fidélité non disponibles' }
    }

    if (loyaltyData.total_points < pointsCost) {
      return { success: false, error: 'Points insuffisants' }
    }

    try {
      const newTotalPoints = loyaltyData.total_points - pointsCost
      const currentRewards = loyaltyData.rewards || []
      const newRewards = [...currentRewards, rewardName]

      // Recalculer le niveau
      let newLevel = 'Bronze'
      if (newTotalPoints >= 5000) newLevel = 'Platine'
      else if (newTotalPoints >= 2500) newLevel = 'Or'
      else if (newTotalPoints >= 1000) newLevel = 'Argent'

      const { data, error } = await supabase
        .from('loyalty_points')
        .update({
          total_points: newTotalPoints,
          level: newLevel,
          rewards: newRewards
        })
        .eq('user_id', profile.id)
        .select()
        .single()

      if (error) throw error

      setLoyaltyData(data)
      return { success: true, data }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    if (profile && profile.type === 'candidat') {
      fetchLoyaltyData()
    }
  }, [profile])

  return {
    loyaltyData,
    loading,
    error,
    addPoints,
    redeemReward,
    refetch: fetchLoyaltyData
  }
}

// Récompenses disponibles par niveau
export const AVAILABLE_REWARDS = {
  Bronze: [
    { name: 'Badge Bronze', points: 100, description: 'Badge de début' }
  ],
  Argent: [
    { name: 'Badge Bronze', points: 100, description: 'Badge de début' },
    { name: 'Réduction 5%', points: 500, description: '5% de réduction sur les frais' },
    { name: 'Badge Argent', points: 750, description: 'Badge niveau argent' }
  ],
  Or: [
    { name: 'Badge Bronze', points: 100, description: 'Badge de début' },
    { name: 'Réduction 5%', points: 500, description: '5% de réduction sur les frais' },
    { name: 'Badge Argent', points: 750, description: 'Badge niveau argent' },
    { name: 'Réduction 10%', points: 1200, description: '10% de réduction sur les frais' },
    { name: 'Badge Or', points: 1500, description: 'Badge niveau or' }
  ],
  Platine: [
    { name: 'Badge Bronze', points: 100, description: 'Badge de début' },
    { name: 'Réduction 5%', points: 500, description: '5% de réduction sur les frais' },
    { name: 'Badge Argent', points: 750, description: 'Badge niveau argent' },
    { name: 'Réduction 10%', points: 1200, description: '10% de réduction sur les frais' },
    { name: 'Badge Or', points: 1500, description: 'Badge niveau or' },
    { name: 'Accès VIP', points: 2000, description: 'Accès aux missions VIP' },
    { name: 'Badge Platine', points: 2500, description: 'Badge niveau platine' }
  ]
}