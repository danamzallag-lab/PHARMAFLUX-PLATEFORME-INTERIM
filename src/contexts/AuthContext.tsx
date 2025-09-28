import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, profiles, Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session initiale
    const getInitialSession = async () => {
      const { data: { session }, error } = await auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadProfile(session.user.id)
        }
      }
      setLoading(false)
    }

    getInitialSession()

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (authUid: string) => {
    try {
      const { data, error } = await profiles.getByAuthUid(authUid)
      if (error) {
        console.error('Error loading profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password)

    if (result.error) {
      return { error: result.error, data: null }
    }

    if (result.data?.user) {
      // Charger le profil immédiatement après connexion
      await loadProfile(result.data.user.id)
    }

    return { error: null, data: result.data }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const result = await auth.signUp(email, password, metadata)

    // Si l'inscription réussit, créer le profil directement
    if (!result.error && result.data.user) {
      try {
        // Créer le profil utilisateur
        const profileData = {
          auth_uid: result.data.user.id,
          email: email,
          type: metadata?.type || 'candidat',
          name: metadata?.name || email.split('@')[0],
          phone: null,
          latitude: null,
          longitude: null,
          competences: null,
          availabilities: null
        }

        const { error: createError } = await profiles.create(profileData)

        if (createError) {
          console.error('Error creating profile:', createError)
        } else {
          console.log('Profile created successfully for user:', result.data.user.id)
        }
      } catch (error) {
        console.error('Error in profile creation process:', error)
      }
    }

    return { error: result.error }
  }

  const signOut = async () => {
    await auth.signOut()
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) {
      return { error: new Error('No profile found') }
    }

    const { error } = await profiles.update(profile.id, updates)
    if (!error) {
      setProfile({ ...profile, ...updates })
    }
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}