import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await fetch("https://hongyiii.app.n8n.cloud/webhook/login-credentials", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(`n8n login returned ${res.status}`);
      const data = await res.json();
      console.log('Login webhook response:', data);

      if (data.username === '0' || data.userId === '0') {
        setUser(null);
        setIsAuthenticated(false);
        throw new Error('Invalid credentials');
      }

      const loggedInUser: User = {
        id: data.userId,
        name: data.username,
        email,
      };

      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      return loggedInUser;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userPosts');
    localStorage.removeItem('userBrands');
    window.location.href = '/';
  };

  // inside AuthContext.tsx or wherever your signup function is defined
  const signup = async (email: string, password: string, name: string) => {
    try {
      const res = await fetch("https://hongyiii.app.n8n.cloud/webhook/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        console.error('❌ n8n signup request failed with status', res.status);
        return false;
      }

      const data = await res.json();
      console.log('🪄 n8n signup response:', data);

      // Check for "success": "1"
      if (data.success === "1") {
        return true; // signup succeeded
      } else {
        console.warn('⚠️ Signup failed, n8n returned success:', data.success);
        return false;
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      return false;
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
