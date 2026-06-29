'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin-dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const storedLock = localStorage.getItem('adminLockUntil');
    if (storedLock) {
      const lockTime = parseInt(storedLock);
      if (lockTime > Date.now()) {
        setLockUntil(lockTime);
      } else {
        localStorage.removeItem('adminLockUntil');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (lockUntil && lockUntil > Date.now()) {
      const remaining = Math.ceil((lockUntil - Date.now()) / 60000);
      setError(`Too many attempts. Try again in ${remaining} minutes.`);
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = await login(email, password);

    if (success) {
      router.push('/admin-dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        const lockTime = Date.now() + 15 * 60 * 1000; // 15 minutes
        setLockUntil(lockTime);
        localStorage.setItem('adminLockUntil', lockTime.toString());
        setError('Too many failed attempts. Account locked for 15 minutes.');
      } else {
        setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#2C3E50] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-2xl shadow-2xl mb-4">
            <svg viewBox="0 0 48 48" className="w-12 h-12">
              <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="'Barlow Condensed', sans-serif">AT</text>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            ASIF TRADERS
          </h1>
          <p className="text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-[#2C3E50] mb-6 text-center" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Sign In to Admin
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@asiftraders.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none transition-colors text-[#2C3E50]"
                  disabled={isLoading || !!(lockUntil && lockUntil > Date.now())}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none transition-colors text-[#2C3E50]"
                  disabled={isLoading || !!(lockUntil && lockUntil > Date.now())}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#E85D04] border-gray-300 rounded focus:ring-[#E85D04]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!(lockUntil && lockUntil > Date.now())}
              className="w-full py-3 bg-gradient-to-r from-[#E85D04] to-[#D35400] text-white font-bold rounded-xl hover:from-[#D35400] hover:to-[#E85D04] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center mb-2">Test Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Email:</span> admin@asiftraders.com</p>
              <p><span className="font-medium">Password:</span> AsifTraders@2024</p>
            </div>
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
