import { Mission, Application, Profile } from '../lib/supabase'

// Données de test pour développer l'interface (Phase 1)
export const mockProfiles: Profile[] = [
  {
    id: 'employer-1',
    auth_uid: 'auth-employer-1',
    type: 'employeur',
    name: 'Pharmacie du Centre',
    email: 'pharmacie.centre@email.com',
    phone: '01 23 45 67 89',
    latitude: 48.8566,
    longitude: 2.3522,
    competences: null,
    availabilities: null,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'candidate-1',
    auth_uid: 'auth-candidate-1',
    type: 'candidat',
    name: 'Dr. Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    latitude: 48.8580,
    longitude: 2.3510,
    competences: ['officine', 'pharmacien'],
    availabilities: [
      { date: '2024-02-15', startTime: '09:00', endTime: '19:00' },
      { date: '2024-02-16', startTime: '09:00', endTime: '17:00' }
    ],
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: 'candidate-2',
    auth_uid: 'auth-candidate-2',
    type: 'candidat',
    name: 'Thomas Martin',
    email: 'thomas.martin@email.com',
    phone: '06 98 76 54 32',
    latitude: 48.8520,
    longitude: 2.3540,
    competences: ['officine', 'preparateur'],
    availabilities: [
      { date: '2024-02-15', startTime: '08:30', endTime: '18:30' },
      { date: '2024-02-17', startTime: '09:00', endTime: '16:00' }
    ],
    created_at: '2024-01-12T10:00:00Z'
  }
]

export const mockMissions: Mission[] = [
  {
    id: 'mission-1',
    employer_id: 'employer-1',
    title: 'Remplacement Pharmacien Adjoint',
    description: 'Recherche pharmacien adjoint pour remplacement du 15 au 16 février. Expérience officine requise. Préparations magistrales courantes.',
    type: 'officine',
    location: '123 Rue de Rivoli, 75001 Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    start_date: '2024-02-15',
    end_date: '2024-02-16',
    start_time: '09:00',
    end_time: '19:00',
    hourly_rate: 28.50,
    status: 'ouverte',
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'mission-2',
    employer_id: 'employer-1',
    title: 'Préparateur Week-end',
    description: 'Remplacement préparateur pour garde week-end. Connaissance des protocoles hospitaliers souhaitée.',
    type: 'hopital',
    location: 'Hôpital Saint-Louis, 75010 Paris',
    latitude: 48.8740,
    longitude: 2.3662,
    start_date: '2024-02-17',
    end_date: '2024-02-18',
    start_time: '08:30',
    end_time: '18:30',
    hourly_rate: 22.00,
    status: 'ouverte',
    created_at: '2024-02-02T14:30:00Z'
  },
  {
    id: 'mission-3',
    employer_id: 'employer-1',
    title: 'Étudiant Pharmacie - Renfort',
    description: 'Mission de renfort pour étudiant en 5ème année. Accueil clientèle et préparations simples.',
    type: 'officine',
    location: '45 Avenue des Champs-Élysées, 75008 Paris',
    latitude: 48.8698,
    longitude: 2.3080,
    start_date: '2024-02-20',
    end_date: null,
    start_time: '14:00',
    end_time: '19:00',
    hourly_rate: 15.50,
    status: 'assignée',
    created_at: '2024-01-28T09:15:00Z'
  }
]

export const mockApplications = [
  {
    id: 'app-1',
    candidate_id: 'candidate-1',
    mission_id: 'mission-1',
    status: 'proposé' as const,
    created_at: '2024-02-01T10:30:00Z',
    missions: mockMissions[0],
    profiles: mockProfiles[0] // employer profile
  },
  {
    id: 'app-2',
    candidate_id: 'candidate-2',
    mission_id: 'mission-2',
    status: 'accepté' as const,
    created_at: '2024-02-02T15:00:00Z',
    missions: mockMissions[1],
    profiles: mockProfiles[0]
  },
  {
    id: 'app-3',
    candidate_id: 'candidate-1',
    mission_id: 'mission-3',
    status: 'refusé' as const,
    created_at: '2024-01-28T10:00:00Z',
    missions: mockMissions[2],
    profiles: mockProfiles[0]
  }
]

// Helper functions for mock data
export const mockDataService = {
  // Simuler les missions d'un employeur
  getEmployerMissions: (employerId: string = 'employer-1') => {
    return {
      missions: mockMissions.filter(m => m.employer_id === employerId),
      error: null
    }
  },

  // Simuler les candidatures d'un candidat
  getCandidateApplications: (candidateId: string = 'candidate-1') => {
    return {
      applications: mockApplications.filter(a => a.candidate_id === candidateId),
      error: null
    }
  },

  // Simuler les missions disponibles
  getAvailableMissions: () => {
    return {
      missions: mockMissions.filter(m => m.status === 'ouverte'),
      error: null
    }
  },

  // Statistiques mock pour dashboard employeur
  getEmployerStats: () => {
    return {
      totalMissions: mockMissions.length,
      activeMissions: mockMissions.filter(m => m.status === 'ouverte').length,
      completedMissions: mockMissions.filter(m => m.status === 'terminée').length,
      averageHourlyRate: mockMissions.reduce((sum, m) => sum + m.hourly_rate, 0) / mockMissions.length,
      totalCandidatesMatched: mockApplications.length,
      avgResponseTime: '2.3h' // heures
    }
  },

  // Statistiques mock pour dashboard candidat
  getCandidateStats: () => {
    return {
      totalApplications: mockApplications.length,
      acceptedApplications: mockApplications.filter(a => a.status === 'accepté').length,
      pendingApplications: mockApplications.filter(a => a.status === 'proposé').length,
      averageHourlyRate: 23.50,
      totalHoursWorked: 156,
      loyaltyPoints: 1240,
      currentLevel: 'Argent'
    }
  }
}

// Fonction pour vérifier si on est en mode développement
export const isDevelopmentMode = () => {
  return import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.DEV
}

// Fonction pour basculer entre vraies données et mock
export const getDataService = () => {
  return isDevelopmentMode() ? mockDataService : null
}