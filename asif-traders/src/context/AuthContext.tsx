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
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users - in production, this would be handled by backend
const DEMO_USERS = [
  {
    id: '1',
    email: 'demo@asiftraders.com',
    password: 'demo123',
    phone: '+91 79775 72727',
    name: 'Demo User',
  },
  {
    id: '2',
    email: 'contractor@example.com',
    password: 'contractor123',
    phone: '+91 98765 43210',
    name: 'Rajesh Contractor',
  },
];

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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept demo credentials
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (foundUser) {
          const userData: User = {
            id: foundUser.id,
            phone: foundUser.phone,
            email: foundUser.email,
            name: foundUser.name,
          };
          setUser(userData);
          localStorage.setItem('asif_user', JSON.stringify(userData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    // Mock registration - in production, this would call backend API
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData: User = {
          id: Date.now().toString(),
          phone: data.phone,
          email: data.email,
          name: data.name,
        };
        setUser(userData);
        localStorage.setItem('asif_user', JSON.stringify(userData));
        resolve(true);
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
      register,
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
