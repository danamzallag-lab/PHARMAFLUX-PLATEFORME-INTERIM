import { useState, useEffect } from 'react'
import { supabase, Referral } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useReferrals() {
  const { profile } = useAuth()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchReferrals = async () => {
    if (!profile) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', profile.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setReferrals(data || [])
    } catch (err) {
      setError(err)
      console.error('Error fetching referrals:', err)
    } finally {
      setLoading(false)
    }
  }

  const sendReferral = async (email: string) => {
    if (!profile) {
      return { success: false, error: 'Profil non trouvé' }
    }

    // Vérifier si l'email n'est pas déjà parrainé
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', profile.id)
      .eq('referred_email', email)
      .single()

    if (existing) {
      return { success: false, error: 'Cet email a déjà été parrainé' }
    }

    try {
      // Générer un token unique
      const token = crypto.randomUUID()

      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: profile.id,
          referred_email: email,
          token,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // Rafraîchir la liste
      await fetchReferrals()

      // TODO: Envoyer l'email de parrainage avec le token
      // const referralLink = `${window.location.origin}/signup?ref=${token}`

      return { success: true, data }
    } catch (error) {
      console.error('Error sending referral:', error)
      return { success: false, error }
    }
  }

  const checkReferralToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (error) throw error

      return { success: true, referral: data }
    } catch (error) {
      console.error('Error checking referral token:', error)
      return { success: false, error }
    }
  }

  const markReferralAsRegistered = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .update({ status: 'registered' })
        .eq('token', token)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error marking referral as registered:', error)
      return { success: false, error }
    }
  }

  const markReferralAsRewarded = async (referralId: string) => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .update({ status: 'rewarded' })
        .eq('id', referralId)
        .select()
        .single()

      if (error) throw error

      // Rafraîchir la liste
      await fetchReferrals()

      return { success: true, data }
    } catch (error) {
      console.error('Error marking referral as rewarded:', error)
      return { success: false, error }
    }
  }

  const getReferralStats = () => {
    const pending = referrals.filter(r => r.status === 'pending').length
    const registered = referrals.filter(r => r.status === 'registered').length
    const rewarded = referrals.filter(r => r.status === 'rewarded').length

    return {
      total: referrals.length,
      pending,
      registered,
      rewarded,
      // Points potentiels (ex: 100 points par parrainage réussi)
      potentialPoints: registered * 100,
      earnedPoints: rewarded * 100
    }
  }

  useEffect(() => {
    if (profile) {
      fetchReferrals()
    }
  }, [profile])

  return {
    referrals,
    loading,
    error,
    sendReferral,
    checkReferralToken,
    markReferralAsRegistered,
    markReferralAsRewarded,
    getReferralStats,
    refetch: fetchReferrals
  }
}