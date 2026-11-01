import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import authApi from '../services/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('overturn_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('overturn_demo_mode') === 'true';
  });

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    localStorage.setItem('overturn_demo_mode', val ? 'true' : 'false');
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('overturn_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('overturn_token');
            setToken(null);
            setUser(null);
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('overturn_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authApi.login(email, pass);
    if (res.success && res.token && res.user) {
      // Purge prior session data so user accounts never leak active claim states
      sessionStorage.clear();
      localStorage.removeItem('overturn_recent_claims');
      localStorage.setItem('overturn_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.error || 'Authentication failed');
    }
  };

  const register = async (name: string, email: string, pass: string, role: string = 'policyholder') => {
    const res = await authApi.register(name, email, pass, role);
    if (res.success && res.token && res.user) {
      // Purge prior session data for new user registration
      sessionStorage.clear();
      localStorage.removeItem('overturn_recent_claims');
      localStorage.setItem('overturn_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } else {
      throw new Error(res.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('overturn_token');
    localStorage.removeItem('overturn_recent_claims');
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isDemoMode,
        setDemoMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

