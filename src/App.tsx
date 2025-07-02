
import React, { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import FeaturesPage from '@/pages/FeaturesPage';
import CandidateDashboard from '@/components/CandidateDashboard';
import CorrectorDashboard from '@/components/CorrectorDashboard';
import EvaluationGrid from '@/components/EvaluationGrid';
import AdminDashboard from '@/components/AdminDashboard';
import LoginModal from '@/components/LoginModal';

export type UserRole = 'candidate' | 'corrector' | 'admin';
export type PageType = 'home' | 'features' | 'candidate' | 'corrector' | 'evaluation' | 'admin';

export interface User {
  name: string;
  role: UserRole;
}

export interface Copy {
  id: string;
  anonymousId: string;
  filename: string;
  uploadDate: string;
  status: 'pending' | 'in_progress' | 'corrected';
  score?: number;
  comments?: string;
  subject?: 'maths' | 'physique-chimie' | 'francais' | 'anglais';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [submissions, setSubmissions] = useState<Copy[]>([]);
  const [selectedCopy, setSelectedCopy] = useState<Copy | null>(null);

  const handleLogin = (username: string, role: UserRole) => {
    setCurrentUser({ name: username, role });
    setShowLoginModal(false);
    if (role === 'candidate') {
      setCurrentPage('candidate');
    } else if (role === 'corrector') {
      setCurrentPage('corrector');
    } else if (role === 'admin') {
      setCurrentPage('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    setSubmissions([]);
    setSelectedCopy(null);
  };

  const handleReturnHome = () => {
    setCurrentPage('home');
  };

  const handleShowFeatures = () => {
    setCurrentPage('features');
  };

  const handleOpenEvaluation = (copy: Copy) => {
    setSelectedCopy(copy);
    setCurrentPage('evaluation');
  };

  const handleSaveEvaluation = (score: number, comments: string) => {
    if (selectedCopy) {
      const updatedCopy = { ...selectedCopy, score, comments, status: 'corrected' as const };
      setSubmissions(prev => prev.map(s => s.id === selectedCopy.id ? updatedCopy : s));
      setCurrentPage('corrector');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'features':
        return (
          <FeaturesPage onBackToHome={handleReturnHome} />
        );
      case 'candidate':
        return (
          <CandidateDashboard 
            submissions={submissions}
            setSubmissions={setSubmissions}
            onReturn={handleReturnHome}
          />
        );
      case 'corrector':
        return (
          <CorrectorDashboard 
            copies={submissions}
            onReturn={handleReturnHome}
            onOpenEvaluation={handleOpenEvaluation}
            currentUser={currentUser}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            onReturn={handleReturnHome}
          />
        );
      case 'evaluation':
        return selectedCopy ? (
          <EvaluationGrid
            copyInfo={selectedCopy}
            onSave={handleSaveEvaluation}
            onCancel={() => setCurrentPage('corrector')}
            initialScore={selectedCopy.score}
            initialComments={selectedCopy.comments}
          />
        ) : null;
      default:
        return <HomePage onShowLogin={() => setShowLoginModal(true)} onShowFeatures={handleShowFeatures} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'features' && (
        <Header 
          currentUser={currentUser}
          onLogin={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />
      )}
      
      {renderCurrentPage()}
      
      <LoginModal 
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
      
      <Toaster />
    </div>
  );
}

export default App;
