import { useState, useEffect, Suspense, lazy } from 'react';
import { LandingPage } from './components/LandingPage';
import { DebugQuickAccess } from './components/DebugQuickAccess';
import { useAuth } from './contexts/AuthContext';

// Lazy loading des composants
const AuthPage = lazy(() => import('./components/AuthPage').then(module => ({ default: module.AuthPage })));
const CandidatePage = lazy(() => import('./components/CandidatePage').then(module => ({ default: module.CandidatePage })));
const CandidatePreDashboard = lazy(() => import('./components/CandidatePreDashboard').then(module => ({ default: module.CandidatePreDashboard })));
const EmployerPage = lazy(() => import('./components/EmployerPage').then(module => ({ default: module.EmployerPage })));
const CandidateDashboard = lazy(() => import('./components/CandidateDashboard').then(module => ({ default: module.CandidateDashboard })));
const EmployerDashboard = lazy(() => import('./components/EmployerDashboard').then(module => ({ default: module.EmployerDashboard })));
const JobsPage = lazy(() => import('./components/JobsPage').then(module => ({ default: module.JobsPage })));
const JobDetailPage = lazy(() => import('./components/JobDetailPage').then(module => ({ default: module.JobDetailPage })));
const CreateJobPage = lazy(() => import('./components/CreateJobPage').then(module => ({ default: module.CreateJobPage })));
const DebugEnvPage = lazy(() => import('./components/DebugEnvPage').then(module => ({ default: module.DebugEnvPage })));

// Composant de loading
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [authTab, setAuthTab] = useState('login');
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && profile) {
      // Rediriger automatiquement selon le type de profil
      if (profile.type === 'candidat') {
        setCurrentPage('candidate-dashboard');
      } else if (profile.type === 'employeur') {
        setCurrentPage('employer-dashboard');
      }
    } else if (!loading && !user) {
      // Rediriger vers la landing page si pas connecté
      if (currentPage !== 'landing' && currentPage !== 'auth') {
        setCurrentPage('landing');
      }
    }
  }, [user, profile, loading]);

  const navigate = (page: string) => {
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
    if (loading) {
      return <LoadingSpinner />;
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
      case 'candidate-dashboard':
        return <CandidateDashboard onNavigate={navigate} />;
      case 'employer-dashboard':
        return <EmployerDashboard onNavigate={navigate} />;
      case 'jobs':
        return <JobsPage onNavigate={navigate} />;
      case 'job-detail':
        return <JobDetailPage onNavigate={navigate} />;
      case 'create-job':
        return <CreateJobPage onNavigate={navigate} />;
      case 'debug-env':
        return <DebugEnvPage onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="size-full">
      <Suspense fallback={<LoadingSpinner />}>
        {renderPage()}
      </Suspense>
      <DebugQuickAccess onNavigate={navigate} />
    </div>
  );
}