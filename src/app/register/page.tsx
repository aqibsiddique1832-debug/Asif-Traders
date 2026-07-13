'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Mail, Lock, Eye, EyeOff, ChevronRight, User, Phone, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, isLoading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Get redirect URL from query params or default to profile
  const redirectUrl = searchParams.get('redirect') || '/profile';

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      window.location.replace(redirectUrl);
    }
  }, [user, isLoading, redirectUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);

    const success = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.replace(/\D/g, ''),
      password: formData.password,
    });

    if (success) {
      showToast('Account created successfully!', 'success');
      // Redirect to the page user was trying to access, or profile
      window.location.replace(redirectUrl);
    } else {
      setError('Registration failed. Email or phone may already be in use.');
    }

    setIsRegistering(false);
  };

  if (isLoading) {
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-terracotta rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Create Your Account
            </h1>
            <p className="text-text-secondary mt-1">
              Join ASIF TRADERS for a better shopping experience
            </p>
          </div>

          {/* Form Card */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input pl-12"
                    autoComplete="name"
                    autoFocus
                  />
                </div>
              </div>

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
                    className="input pl-12"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="input pl-12"
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 chars)"
                    className="input pl-12 pr-12"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-charcoal transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="input pl-12"
                    autoComplete="new-password"
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {formData.password === formData.confirmPassword ? (
                        <Check className="w-5 h-5 text-success" />
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center text-error text-xs">✕</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-sandstone text-terracotta focus:ring-terracotta"
                />
                <label htmlFor="terms" className="text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link href="/terms" className="text-terracotta hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-terracotta font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
