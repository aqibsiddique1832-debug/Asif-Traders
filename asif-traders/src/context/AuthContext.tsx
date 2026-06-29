'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (phone: string, otp: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('asif_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (phone: string): Promise<boolean> => {
    // Mock OTP sending - in production, integrate with SMS provider
    // Accept any phone for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('asif_pending_phone', phone);
        resolve(true);
      }, 500);
    });
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Mock OTP verification - accept 123456 for testing
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456') {
          const userData: User = {
            id: Date.now().toString(),
            phone: phone
          };
          setUser(userData);
          localStorage.setItem('asif_user', JSON.stringify(userData));
          localStorage.removeItem('asif_pending_phone');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('asif_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('asif_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      sendOtp,
      logout,
      updateProfile
    }}>
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
