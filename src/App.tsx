import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  if (!isAuthenticated) {
    if (isSignUpMode) {
      return <SignUpPage onToggleMode={() => setIsSignUpMode(false)} />;
    }
    return <LoginPage onToggleMode={() => setIsSignUpMode(true)} />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
