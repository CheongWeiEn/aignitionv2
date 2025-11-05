import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { user as mockUser } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.username || data.username === '0') {
        throw new Error('Invalid credentials');
      }

      const loggedInUser: User = {
        id: data.userId,
        email,
        name: data.username,
      };

      // 1️⃣ Update React state
      setUser(loggedInUser);

      // 2️⃣ Update mockData.user dynamically
      mockUser.id = data.userId;
      mockUser.email = email;
      mockUser.name = data.username;

      // 3️⃣ Optional: store globally
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);

    // Reset mockUser to default demo
    mockUser.id = 'user_1';
    mockUser.email = 'demo@example.com';
    mockUser.name = 'Demo User';

    localStorage.removeItem('user');
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
