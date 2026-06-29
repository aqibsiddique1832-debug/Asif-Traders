'use client';

import React, { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, X, Check, Truck } from 'lucide-react';

export default function LocationModal() {
  const { showLocationModal, setShowLocationModal, setLocation, checkPincode, location: currentLocation } = useLocation();
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (showLocationModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLocationModal]);

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsChecking(true);

    // Simulate checking delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = checkPincode(pincode);

    if (result) {
      setLocation(result);
      setPincode('');
    } else {
      setError('Sorry, we do not deliver to this pincode yet. Please contact us for bulk orders.');
    }

    setIsChecking(false);
  };

  const quickPincodes = [
    { pincode: '400708', area: 'Digha' },
    { pincode: '400080', area: 'Airoli' },
    { pincode: '400701', area: 'Rabale' },
    { pincode: '400710', area: 'Ghansoli' },
    { pincode: '400705', area: 'Vashi' },
    { pincode: '400601', area: 'Thane' },
  ];

  const handleQuickSelect = async (pc: string) => {
    setPincode(pc);
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = checkPincode(pc);
    if (result) {
      setLocation(result);
    }
    setIsChecking(false);
  };

  if (!showLocationModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setShowLocationModal(false)}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 bottom-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-md z-50">
        <div className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Gradient Header with Illustration */}
          <div className="location-gradient p-6 pb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <circle cx="20" cy="80" r="30" fill="white"/>
                <circle cx="180" cy="20" r="40" fill="white"/>
                <rect x="100" y="50" width="60" height="40" rx="5" fill="white"/>
              </svg>
            </div>

            {/* Animated Truck Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="truck-bounce">
                  <Truck className="w-10 h-10 text-white" />
                </div>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Header Text */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Select Delivery Location
              </h2>
              <p className="text-white/80 text-sm">
                Check delivery availability in your area
              </p>
            </div>

            {/* Illustration */}
            <div className="absolute right-0 bottom-0 opacity-20">
              <svg viewBox="0 0 150 100" className="w-32 h-24">
                {/* Delivery Truck Illustration */}
                <rect x="10" y="40" width="80" height="40" rx="5" fill="white"/>
                <rect x="90" y="50" width="50" height="30" rx="3" fill="white"/>
                <circle cx="35" cy="85" r="12" fill="white"/>
                <circle cx="115" cy="85" r="12" fill="white"/>
                <rect x="95" y="55" width="20" height="15" rx="2" fill="white"/>
                {/* Construction Materials */}
                <rect x="20" y="45" width="15" height="30" fill="#E85D04"/>
                <rect x="40" y="50" width="15" height="25" fill="#D35400"/>
                <rect x="60" y="48" width="12" height="27" fill="#27AE60"/>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Location Info */}
            {currentLocation && (
              <div className="mb-6 p-4 bg-[#27AE60]/10 rounded-2xl border border-[#27AE60]/20">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#27AE60]" />
                  <div>
                    <p className="font-semibold text-[#27AE60]">Currently delivering to:</p>
                    <p className="text-sm text-[#2C3E50]">{currentLocation.area}, {currentLocation.city} ({currentLocation.pincode})</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pincode Form - Modern Design */}
            <form onSubmit={handlePincodeSubmit} className="mb-6">
              <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Enter your pincode
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E85D04]" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPincode(val);
                      setError('');
                    }}
                    placeholder="e.g. 400708"
                    className="w-full pl-12 pr-4 py-4 border-2 border-[#E5E5E5] rounded-2xl focus:border-[#E85D04] focus:outline-none transition-all text-lg tracking-widest shadow-sm"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChecking || pincode.length !== 6}
                  className="px-6 py-4 bg-[#E85D04] text-white font-bold rounded-2xl hover:bg-[#D35400] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isChecking ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Check
                    </span>
                  ) : (
                    'Check'
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </p>
              )}
            </form>

            {/* Quick Select - Modern Pill Design */}
            <div>
              <p className="text-sm font-semibold text-[#2C3E50] mb-3">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {quickPincodes.map((pc) => (
                  <button
                    key={pc.pincode}
                    onClick={() => handleQuickSelect(pc.pincode)}
                    disabled={isChecking}
                    className={`pill ${pincode === pc.pincode ? 'pill-active' : ''}`}
                  >
                    {pc.area} ({pc.pincode})
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-[#F5F5F5] rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#E85D04]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[#E85D04]" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[#2C3E50]">Delivery Information</p>
                  <p className="text-[#6B6B70]">
                    We deliver to Navi Mumbai, Thane, and nearby areas within 24-48 hours for in-stock items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Skip Button */}
          <div className="px-6 pb-6">
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-3 text-center font-medium text-[#6B6B70] hover:text-[#E85D04] transition-colors relative group"
            >
              Skip for now
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E85D04] transition-all group-hover:w-full"></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
