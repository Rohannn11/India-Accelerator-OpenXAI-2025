import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SymptomAssessment } from './components/Assessment/SymptomAssessment';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { MedicalDisclaimer } from './components/Common/MedicalDisclaimer';

type View = 'dashboard' | 'assessment' | 'profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HealthAI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'assessment':
        return <SymptomAssessment onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Navigation */}
      {currentView === 'dashboard' && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 py-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  currentView === 'dashboard'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('assessment')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 pb-2 border-b-2 border-transparent hover:border-blue-200 transition-colors"
              >
                New Assessment
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-2 border-b-2 border-transparent hover:border-gray-200 transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Medical Disclaimer for non-auth views */}
      {currentView !== 'dashboard' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <MedicalDisclaimer showDetails />
        </div>
      )}

      {/* Main Content */}
      <main className={currentView === 'assessment' ? '' : 'py-8'}>
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>HealthAI</strong> - AI-Powered Health Guidance Platform
            </p>
            <p className="mb-4">
              This platform provides general health information and is not a substitute for professional medical advice.
              Always consult qualified healthcare providers for medical concerns.
            </p>
            <div className="flex justify-center space-x-6 text-xs">
              <span>HIPAA Compliant</span>
              <span>End-to-End Encrypted</span>
              <span>Privacy by Design</span>
              <span>Medical Grade Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;