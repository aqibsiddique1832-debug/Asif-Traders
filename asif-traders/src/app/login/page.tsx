'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ChevronRight, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, sendOtp, user, isLoading } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/profile');
    }
  }, [user, isLoading, router]);

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setIsSending(true);

    const success = await sendOtp(`+91${phone}`);

    if (success) {
      setStep('otp');
      setCountdown(30);
      showToast('OTP sent successfully!', 'success');
    } else {
      setError('Failed to send OTP. Please try again.');
    }

    setIsSending(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus on last filled or next empty
      const nextEmpty = newOtp.findIndex((d, i) => i >= index && !d);
      const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
      document.getElementById(`otp-${focusIndex}`)?.focus();
      return;
    }

    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-advance
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setError('');
    setIsVerifying(true);

    const success = await login(`+91${phone}`, otpValue);

    if (success) {
      showToast('Login successful!', 'success');
      router.push('/profile');
    } else {
      setError('Invalid OTP. Please try again.');
    }

    setIsVerifying(false);
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    await handleSendOtp();
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                <path d="M12 2L2 8v12h20V8L12 2zm0 2.5L19 8v2H5V8l7-3.5zM7 12v6h3v-4h4v4h3v-6H7z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Welcome to ASIF TRADERS
            </h1>
            <p className="text-text-secondary mt-1">
              {step === 'phone' ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
            </p>
          </div>

          {/* Form Card */}
          <div className="card p-6">
            {step === 'phone' ? (
              <>
                {/* Phone Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-4 py-3 bg-sandstone/50 rounded-lg text-charcoal font-medium">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setError('');
                      }}
                      placeholder="Enter 10-digit number"
                      className="input flex-1"
                      maxLength={10}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-error text-sm mb-4">{error}</p>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={isSending || phone.length !== 10}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-text-secondary text-center mt-4">
                  OTP sent to +91 {phone}
                </p>
              </>
            ) : (
              <>
                {/* OTP Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-3">Enter 6-digit OTP</label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type={showOtp ? 'text' : 'password'}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold input"
                        maxLength={6}
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOtp}
                        onChange={(e) => setShowOtp(e.target.checked)}
                        className="w-4 h-4 accent-terracotta"
                      />
                      Show OTP
                    </label>
                    <button
                      onClick={handleResendOtp}
                      disabled={countdown > 0}
                      className={`text-sm ${countdown > 0 ? 'text-text-secondary' : 'text-terracotta hover:underline'}`}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-error text-sm mb-4">{error}</p>
                )}

                <button
                  onClick={handleVerify}
                  disabled={isVerifying || otp.join('').length !== 6}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>

                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="w-full mt-3 text-center text-sm text-text-secondary hover:text-terracotta"
                >
                  Change phone number
                </button>
              </>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs text-text-secondary text-center mt-6">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-terracotta hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
