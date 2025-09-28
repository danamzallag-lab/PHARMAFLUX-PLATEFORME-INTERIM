import { useState } from 'react';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [authTab, setAuthTab] = useState('login');

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