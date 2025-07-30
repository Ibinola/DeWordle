'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import * as authApi from '../service/api/auth';
interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const restoreSession = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);

        const response = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setState({
            accessToken: token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.authApi.login({ email, password });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setState({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const data = await authApi.authApi.signup({ email, password, username });
      // Store in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setState({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    setState({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
