'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, tokenStore } from '@/lib/backendApi';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  gstin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'asif_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Failed to parse user:', e);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authApi.login(email, password);
      if (!data || !(data as any).user) return false;
      const u = (data as any).user;
      const userData: User = {
        id: u.id,
        phone: u.phone || '',
        email: u.email,
        name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.name,
        gstin: u.gstin,
      };
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    try {
      const [firstName, ...rest] = data.name.trim().split(/\s+/);
      const lastName = rest.join(' ');
      const payload = {
        firstName,
        lastName: lastName || undefined,
        email: data.email,
        phone: data.phone.replace(/^\+91\s*/, '').replace(/\D/g, ''),
        password: data.password,
        confirmPassword: data.password,
        agreedToTerms: true,
      };
      const result = await authApi.register(payload);
      if (!result || !(result as any).user) return false;
      const u = (result as any).user;
      const userData: User = {
        id: u.id,
        phone: u.phone || data.phone,
        email: u.email,
        name: data.name,
      };
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return true;
    } catch (e) {
      console.error('Register error:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    authApi.logout();
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
