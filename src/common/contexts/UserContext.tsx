import React, { createContext, useContext, useEffect, useState } from 'react';

import type { User } from '@/common/types/types.ts';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  googleAuth: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string, accessToken: string) => Promise<boolean>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const buildUrl = (endpoint: string) => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
    if (backendUrl === null || backendUrl === undefined) {
      throw new Error('Backend URL not defined in .env file');
    } else {
      return `${backendUrl.replace(/\/$/, '')}${endpoint}`;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    console.log('Token from localStorage:', token);

    try {
      const response = await fetch(buildUrl('/auth/me'), {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Auth check failed');
      }

      const userData: User = await response.json();
      console.log('User data:', userData);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(buildUrl('/auth/login'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const { token }: { token: string } = await response.json();
      console.log('Token received:', token);
      localStorage.setItem('authToken', token);
      await checkAuth();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(buildUrl('/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const googleAuth = async () => {
    try {
      const response = await fetch(buildUrl('/auth/google'), {
        credentials: 'include',
      });
      const { url }: { url: string } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      throw new Error('Failed to initialize Google authentication');
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(buildUrl('/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Password reset request failed');
      }

      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  };

  const updatePassword = async (password: string, accessToken: string) => {
    try {
      const response = await fetch(buildUrl('/auth/reset-password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Password update failed');
      }

      return true;
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue = {
    user,
    setUser,
    isLoading,
    login,
    logout,
    checkAuth,
    googleAuth,
    requestPasswordReset,
    updatePassword,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
