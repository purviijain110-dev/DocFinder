import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SplashScreen from '@/app/components/splash-screen';
import HomePage from '@/app/components/home-page';
import LanguageSelection from '@/app/components/language-selection';
import AuthPage from '@/app/components/auth-page';
import LocationPage from '@/app/components/location-page';
import FindDoctor from '@/app/components/find-doctor';
import FindMedicalStore from '@/app/components/find-medical-store';
import SymptomAssessment from '@/app/components/symptom-assessment';

function AppContent() {
  const navigate = useNavigate();
  // Check if splash has already been shown in this session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splash_shown');
  });
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(() => {
    return localStorage.getItem('selected_language');
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });
  const [hasLocation, setHasLocation] = useState(() => {
    return !!localStorage.getItem('user_location');
  });

  // Splash screen timer - always navigate to language after splash
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_shown', 'true');
        // Simple: always go to language after splash
        navigate('/language');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSplash, navigate]);

  // Handle language selection
  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('selected_language', lang);
  };

  // Handle authentication success
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_authenticated', 'true');
  };

  // Update hasLocation when location is set
  const handleLocationSet = () => {
    setHasLocation(true);
  };

  // Protected route wrapper - only checks, doesn't navigate
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/language" replace />;
    }
    if (!hasLocation) {
      return <Navigate to="/location" replace />;
    }
    return <>{children}</>;
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Initial flow: Language → Auth → Location → Home */}
      <Route path="/language" element={
        <LanguageSelection onLanguageSelect={handleLanguageSelect} />
      } />

      <Route path="/auth" element={
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      } />

      <Route path="/location" element={
        isAuthenticated ? (
          <LocationPage />
        ) : (
          <Navigate to="/language" replace />
        )
      } />

      {/* Main app routes - require auth + location */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />

      <Route path="/find-doctor" element={
        <ProtectedRoute>
          <FindDoctor language={selectedLanguage || 'english'} />
        </ProtectedRoute>
      } />

      <Route path="/medical-stores" element={
        <ProtectedRoute>
          <FindMedicalStore language={selectedLanguage || 'english'} />
        </ProtectedRoute>
      } />

      <Route path="/assessment" element={
        <ProtectedRoute>
          <SymptomAssessment language={selectedLanguage || 'english'} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
