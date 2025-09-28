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
import { useAuth } from './contexts/AuthContext';

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
      setCurrentPage('landing');
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
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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