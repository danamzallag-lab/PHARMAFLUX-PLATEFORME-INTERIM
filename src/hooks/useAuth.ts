import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    // Fallback: forcer l'arrêt du loading après 1 seconde
    const timeoutId = setTimeout(() => {
      if (mounted) {
        setLoading(false)
      }
    }, 1000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_uid', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error)
        setProfile(null)
        setLoading(false)
        return null
      }

      setProfile(data)
      setLoading(false)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
      setLoading(false)
      return null
    }
  }

  const signUp = async (email: string, password?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || Math.random().toString(36), // Mot de passe temporaire si non fourni
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  const signInWithMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('auth_uid', user.id)
      .select()
      .single()

    if (!error) {
      setProfile(data)
    }

    return { data, error }
  }

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signInWithMagicLink,
    signInWithPassword,
    signOut,
    updateProfile,
    fetchProfile
  }
}