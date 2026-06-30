'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Mail, Lock, Eye, EyeOff, ChevronRight, AlertCircle, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get redirect URL from query params or default to profile
  const redirectUrl = searchParams.get('redirect') || '/profile';

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  // Clear field error when user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setError('');
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      // Focus first error field
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) {
        document.querySelector<HTMLInputElement>(`input[name="${firstError}"]`)?.focus();
      }
      return;
    }

    // Check rate limiting
    if (attemptsRemaining !== null && attemptsRemaining <= 0) {
      setError('Too many failed attempts. Please try again later or use forgot password.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        setShowSuccess(true);
        showToast('Login successful!', 'success');
        // Small delay for success animation before redirect
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      } else {
        // Update attempts remaining (simulate rate limiting)
        const newAttempts = attemptsRemaining !== null ? attemptsRemaining - 1 : 4;
        setAttemptsRemaining(newAttempts);

        if (newAttempts <= 0) {
          setError('Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.');
        } else if (newAttempts <= 2) {
          setError(`Invalid credentials. ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining before lockout.`);
        } else {
          setError('Invalid email or password. Please check your credentials and try again.');
        }
      }
    } catch (err: any) {
      // Handle network errors
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err.response?.status === 401) {
        const newAttempts = attemptsRemaining !== null ? attemptsRemaining - 1 : 4;
        setAttemptsRemaining(newAttempts);
        setError(newAttempts <= 2
          ? `Invalid credentials. ${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining.`
          : 'Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }

    setIsLoggingIn(false);
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Success State */}
          {showSuccess ? (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Login Successful!
              </h1>
              <p className="text-text-secondary mb-6">Redirecting you now...</p>
              <div className="animate-pulse h-2 bg-sandstone rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="h-full bg-success rounded-full animate-progress" />
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-terracotta/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-terracotta/20">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                    <path d="M12 2L2 8v12h20V8L12 2zm0 2.5L19 8v2H5V8l7-3.5zM7 12v6h3v-4h4v4h3v-6H7z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Welcome to ASIF TRADERS
                </h1>
                <p className="text-text-secondary mt-1">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Form Card */}
              <div className="card p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`input pl-12 ${fieldErrors.email ? 'border-error focus:border-error' : ''}`}
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-charcoal">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-terracotta hover:underline font-medium"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={`input pl-12 pr-12 ${fieldErrors.password ? 'border-error focus:border-error' : ''}`}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-charcoal transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-xl animate-shake">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-error font-medium">{error}</p>
                          {attemptsRemaining !== null && attemptsRemaining <= 2 && attemptsRemaining > 0 && (
                            <p className="text-xs text-error/80 mt-1">
                              Tip: Use forgot password if you cannot remember your credentials.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rate Limit Warning */}
                  {attemptsRemaining !== null && attemptsRemaining <= 2 && attemptsRemaining > 0 && !error && (
                    <div className="p-3 bg-amber/10 border border-amber/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber flex-shrink-0" />
                        <p className="text-xs text-amber-dark">
                          {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining before temporary lockout
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoggingIn || (attemptsRemaining !== null && attemptsRemaining <= 0)}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-terracotta/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingIn ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-secondary">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Your login is secure and encrypted</span>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-sandstone" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-text-secondary">Or</span>
                  </div>
                </div>

                {/* Demo Credentials Info */}
                <div className="p-4 bg-sandstone/50 rounded-xl">
                  <p className="text-xs text-text-secondary text-center mb-2 font-medium">Demo Credentials (for testing):</p>
                  <div className="text-xs text-text-secondary space-y-1">
                    <p><span className="font-medium">Email:</span> demo@asiftraders.com</p>
                    <p><span className="font-medium">Password:</span> demo123</p>
                  </div>
                </div>

                {/* Phone Support */}
                <div className="mt-6 p-4 bg-terracotta/5 rounded-xl text-center">
                  <p className="text-sm text-text-secondary mb-2">Need help logging in?</p>
                  <a
                    href="tel:+918879149174"
                    className="inline-flex items-center gap-2 text-terracotta font-medium hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    Call +91 88791 49174
                  </a>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-text-secondary mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-terracotta font-semibold hover:underline">
                  Create Account
                </Link>
              </p>

              {/* Terms */}
              <p className="text-xs text-text-secondary text-center mt-4">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-terracotta hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
