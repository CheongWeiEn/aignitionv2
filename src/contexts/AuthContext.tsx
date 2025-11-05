import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { user as mockUser } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;  // Add signup
}

const STORAGE_KEY = 'app_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type StoredSession = {
  user: User;
  expiry: number;
  isTemp?: boolean;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isSessionValid = (s: StoredSession | null) => {
    if (!s) return false;
    return typeof s.expiry === 'number' && Date.now() < s.expiry;
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const session: StoredSession = JSON.parse(raw);
      if (isSessionValid(session)) {
        setUser(session.user);
        mockUser.id = session.user.id;
        mockUser.email = session.user.email;
        mockUser.name = session.user.name;
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const TEMP_EMAIL = '1@c.co';
    const TEMP_PASSWORD = '1';
    const TEMP_TTL_MS = 1000 * 60 * 60; // 1 hour

    try {
      if (email === TEMP_EMAIL && password === TEMP_PASSWORD) {
        const tempUser: User = {
          id: `dev_user_1`,
          email,
          name: 'Dev User',
        };

        const session: StoredSession = {
          user: tempUser,
          expiry: Date.now() + TEMP_TTL_MS,
          isTemp: true,
        };

        setUser(tempUser);
        mockUser.id = tempUser.id;
        mockUser.email = tempUser.email;
        mockUser.name = tempUser.name;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return;
      }

      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.username || data.username === '0') {
        throw new Error('Invalid credentials');
      }

      const realUser: User = {
        id: data.userId,
        email,
        name: data.username,
      };

      const REAL_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
      const session: StoredSession = {
        user: realUser,
        expiry: Date.now() + REAL_TTL_MS,
        isTemp: false,
      };

      setUser(realUser);
      mockUser.id = realUser.id;
      mockUser.email = realUser.email;
      mockUser.name = realUser.name;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Send signup data to the n8n webhook
      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL_SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });
  
      const data = await res.json();
  
      if (data.success === 1) {
        // User credentials were validated and added to the database
        const newUser: User = {
          id: data.userId || 'new_user_id', // adjust if your backend sends userId
          email,
          name,
        };
  
        const session: StoredSession = {
          user: newUser,
          expiry: Date.now() + 1000 * 60 * 60 * 8, // 8 hours
        };
  
        // Update React state and mockUser
        setUser(newUser);
        mockUser.id = newUser.id;
        mockUser.email = newUser.email;
        mockUser.name = newUser.name;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  
        // Indicate success to caller
        return true;
      } else if (data.success === 0) {
        // n8n returned 0, signup failed
        return false;
      } else {
        throw new Error('Unexpected response from signup workflow');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      throw err; // propagate error to component
    }
  };
  

  const logout = () => {
    setUser(null);
    mockUser.id = 'user_1';
    mockUser.email = 'demo@example.com';
    mockUser.name = 'Demo User';
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}