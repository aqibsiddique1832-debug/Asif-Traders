'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  User,
  Phone,
  Mail,
  Building2,
  LogOut,
  ChevronRight,
  MapPin,
  Edit2,
  Save,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    gstin: user?.gstin || '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        gstin: user.gstin || '',
      });
    }
  }, [user]);

  const handleSave = () => {
    updateProfile(profile);
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      showToast('Logged out successfully', 'info');
      router.push('/');
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal text-white py-8">
        <div className="container">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            My Account
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Profile Card */}
            <div className="card p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-terracotta" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      {profile.name || 'User'}
                    </h2>
                    <p className="text-text-secondary">{user.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-ghost flex items-center gap-1"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="input"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="input"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={profile.gstin}
                      onChange={(e) => setProfile({ ...profile, gstin: e.target.value.toUpperCase() })}
                      className="input"
                      placeholder="e.g., 27XXXXX1234X1ZX"
                      maxLength={15}
                    />
                  </div>
                  <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Phone className="w-5 h-5" />
                    <span>{user.phone}</span>
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Mail className="w-5 h-5" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.gstin && (
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Building2 className="w-5 h-5" />
                      <span>GSTIN: {profile.gstin}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="card overflow-hidden">
              <Link
                href="/orders"
                className="flex items-center justify-between p-4 hover:bg-sandstone/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-medium text-charcoal">My Orders & Quotes</span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </Link>

              <div className="h-px bg-sandstone" />

              <Link
                href="/addresses"
                className="flex items-center justify-between p-4 hover:bg-sandstone/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-terracotta" />
                  </div>
                  <span className="font-medium text-charcoal">Saved Addresses</span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </Link>

              <div className="h-px bg-sandstone" />

              <Link
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="flex items-center justify-between p-4 hover:bg-error/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-error" />
                  </div>
                  <span className="font-medium text-error">Logout</span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
