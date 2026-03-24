'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient } from '@/lib/api/client';
import type { AuthResponse, UserProfile, ApiResponse } from '@/types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'mocampaign_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    apiClient<ApiResponse<UserProfile>>('/api/users/profile', { token: stored })
      .then((res) => {
        setState({ user: res.data ?? null, token: stored, isLoading: false });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ user: null, token: null, isLoading: false });
      });
  }, []);

  const handleAuthResponse = useCallback((res: ApiResponse<AuthResponse>) => {
    const auth = res.data;
    if (!auth) throw new Error('Invalid response');
    localStorage.setItem(TOKEN_KEY, auth.token);
    setState({ user: auth.user, token: auth.token, isLoading: false });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiClient<ApiResponse<AuthResponse>>('/api/users/login', {
        method: 'POST',
        body: { email, password },
      });
      handleAuthResponse(res);
    },
    [handleAuthResponse]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await apiClient<ApiResponse<AuthResponse>>('/api/users/register', {
        method: 'POST',
        body: { name, email, password },
      });
      handleAuthResponse(res);
    },
    [handleAuthResponse]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, token: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
