import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { CandidatePage } from './components/CandidatePage';
import { CandidatePreDashboard } from './components/CandidatePreDashboard';
import { EmployerPage } from './components/EmployerPage';
import { CandidateDashboard } from './components/CandidateDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { JobsPage } from './components/JobsPage';
import { JobDetailPage } from './components/JobDetailPage';
import { CreateJobPage } from './components/CreateJobPage';
import { ProfileSetup } from './components/ProfileSetup';
import { Onboarding } from './components/Onboarding';
import { EmployerOnboarding } from './components/EmployerOnboarding';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [authTab, setAuthTab] = useState('login');

  // Routing automatique basé sur l'authentification et le profil
  useEffect(() => {
    if (loading) return;

    // Si utilisateur non connecté et tentative d'accès à une page protégée
    const protectedPages = [
      'candidate-dashboard',
      'employer-dashboard',
      'onboarding-employer',
      'profile-setup',
      'create-job',
      'jobs',
      'job-detail'
    ];

    if (!user && protectedPages.includes(currentPage)) {
      setCurrentPage('auth');
      return;
    }

    // Si utilisateur connecté
    if (user && profile) {
      // Redirection automatique après login
      if (currentPage === 'auth') {
        if (profile.type === 'candidat') {
          setCurrentPage('candidate-dashboard');
        } else if (profile.type === 'employeur') {
          if (!profile.onboarding_completed) {
            setCurrentPage('onboarding-employer');
          } else {
            setCurrentPage('employer-dashboard');
          }
        }
        return;
      }

      // Empêcher accès croisé : candidat ne peut pas accéder au dashboard employeur et vice-versa
      if (profile.type === 'candidat' && currentPage === 'employer-dashboard') {
        setCurrentPage('candidate-dashboard');
        return;
      }

      if (profile.type === 'employeur' && currentPage === 'candidate-dashboard') {
        if (!profile.onboarding_completed) {
          setCurrentPage('onboarding-employer');
        } else {
          setCurrentPage('employer-dashboard');
        }
        return;
      }

      // Forcer onboarding employeur si pas complété
      if (
        profile.type === 'employeur' &&
        !profile.onboarding_completed &&
        currentPage !== 'onboarding-employer' &&
        currentPage !== 'landing' &&
        currentPage !== 'auth'
      ) {
        setCurrentPage('onboarding-employer');
        return;
      }
    }
  }, [user, profile, loading, currentPage]);

  const navigate = (page: string) => {
    // Validation de navigation selon le type d'utilisateur
    if (user && profile) {
      const candidateOnlyPages = ['candidate-dashboard', 'profile-setup'];
      const employerOnlyPages = ['employer-dashboard', 'create-job', 'onboarding-employer'];

      if (profile.type === 'candidat' && employerOnlyPages.includes(page)) {
        console.warn('Accès refusé : page réservée aux employeurs');
        return;
      }

      if (profile.type === 'employeur' && candidateOnlyPages.includes(page)) {
        console.warn('Accès refusé : page réservée aux candidats');
        return;
      }

      // Empêcher employeur d'accéder aux pages protégées sans onboarding
      if (profile.type === 'employeur' && !profile.onboarding_completed && page !== 'onboarding-employer' && page !== 'landing') {
        console.warn('Veuillez compléter votre onboarding d\'abord');
        setCurrentPage('onboarding-employer');
        return;
      }
    }

    if (page === 'auth-register') {
      setCurrentPage('auth');
      setAuthTab('register');
    } else if (page === 'auth') {
      setCurrentPage('auth');
      setAuthTab('login');
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    // Afficher écran de chargement pendant vérification auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'auth':
        return <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      case 'candidate-page':
        return <CandidatePage onNavigate={navigate} />;
      case 'candidate-pre-dashboard':
        return <CandidatePreDashboard onNavigate={navigate} />;
      case 'employer-page':
        return <EmployerPage onNavigate={navigate} />;
      case 'profile-setup':
        return user && profile?.type === 'candidat' ? <ProfileSetup onNavigate={navigate} /> : <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      case 'onboarding-candidate':
        return user && profile?.type === 'candidat' ? <Onboarding onNavigate={navigate} userType="candidate" userName={profile.name || 'Utilisateur'} /> : <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      case 'onboarding-employer':
        return user && profile?.type === 'employeur' ? <EmployerOnboarding onNavigate={navigate} employerName={profile.name || 'Employeur'} /> : <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      case 'candidate-dashboard':
        return user && profile?.type === 'candidat' ? <CandidateDashboard onNavigate={navigate} /> : <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      case 'employer-dashboard':
        return user && profile?.type === 'employeur' && profile.onboarding_completed ? <EmployerDashboard onNavigate={navigate} /> : <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      case 'jobs':
        return <JobsPage onNavigate={navigate} />;
      case 'job-detail':
        return <JobDetailPage onNavigate={navigate} />;
      case 'create-job':
        return user && profile?.type === 'employeur' && profile.onboarding_completed ? <CreateJobPage onNavigate={navigate} /> : <AuthPage onNavigate={navigate} defaultTab={authTab} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="size-full">
      {renderPage()}
    </div>
  );
}