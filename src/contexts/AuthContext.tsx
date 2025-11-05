import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { user as mockUser } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Key used in localStorage
const STORAGE_KEY = 'app_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type StoredSession = {
  user: User;
  expiry: number;   // ms since epoch
  isTemp?: boolean; // flag for developer temp session
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Helper: check session validity
  const isSessionValid = (s: StoredSession | null) => {
    if (!s) return false;
    return typeof s.expiry === 'number' && Date.now() < s.expiry;
  };

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const session: StoredSession = JSON.parse(raw);
      if (isSessionValid(session)) {
        setUser(session.user);
        // also update mockData.user so other modules see it
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
    // TEMP DEV CREDENTIALS — only for development convenience
    const TEMP_EMAIL = '1@c.co';
    const TEMP_PASSWORD = '1';
    const TEMP_TTL_MS = 1000 * 60 * 60; // 1 hour

    try {
      // 1) If credentials match the dev temp pair => create a temp session locally
      if (email === TEMP_EMAIL && password === TEMP_PASSWORD) {
        const tempUser: User = {
          id: `dev_user_1`, // or fixed id like 'dev_user_1' if you prefer
          email,
          name: 'Dev User',
        };

        const session: StoredSession = {
          user: tempUser,
          expiry: Date.now() + TEMP_TTL_MS,
          isTemp: true,
        };

        // set React state
        setUser(tempUser);

        // update mockData so rest of app sees real user
        mockUser.id = tempUser.id;
        mockUser.email = tempUser.email;
        mockUser.name = tempUser.name;

        // persist
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return;
      }

      // 2) Otherwise, do the normal n8n login call (your existing flow)
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

      // create session (make expiry longer for real login, e.g., 8 hours)
      const REAL_TTL_MS = 1000 * 60 * 60 * 8;
      const session: StoredSession = {
        user: realUser,
        expiry: Date.now() + REAL_TTL_MS,
        isTemp: false,
      };

      // update React state and mockData mapping
      setUser(realUser);
      mockUser.id = realUser.id;
      mockUser.email = realUser.email;
      mockUser.name = realUser.name;

      // persist
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      // bubble error to caller
      console.error('Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);

    // reset mockUser to demo defaults
    mockUser.id = 'user_1';
    mockUser.email = 'demo@example.com';
    mockUser.name = 'Demo User';

    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}