import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, auth, profiles, Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
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
    return { error: result.error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const result = await auth.signUp(email, password, metadata)

    // Si l'inscription réussit et qu'on a des métadonnées avec un type,
    // on met à jour le profil créé automatiquement
    if (!result.error && result.data.user && metadata?.type) {
      try {
        // Attendre un peu pour que le trigger de création du profil se termine
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Récupérer le profil créé par le trigger et le mettre à jour
        const { data: profile, error: getError } = await profiles.getByAuthUid(result.data.user.id)

        if (!getError && profile) {
          const { error: updateError } = await profiles.update(profile.id, {
            type: metadata.type,
            name: metadata.name || email.split('@')[0]
          })

          if (updateError) {
            console.error('Error updating profile type:', updateError)
          }
        } else {
          console.error('Error fetching created profile:', getError)
        }
      } catch (error) {
        console.error('Error in profile update process:', error)
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