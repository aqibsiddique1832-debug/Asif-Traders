'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, X, Check, Truck } from 'lucide-react';

export default function LocationModal() {
  const { showLocationModal, setShowLocationModal, setLocation, checkPincode, location: currentLocation } = useLocation();
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleClose = useCallback(() => {
    setShowLocationModal(false);
  }, [setShowLocationModal]);

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLocationModal) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showLocationModal, handleClose]);

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
        onClick={handleClose}
      />

      {/* Modal - Responsive for mobile */}
      <div className="fixed inset-x-0 bottom-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-lg z-50 max-h-[85vh] flex flex-col">
        <div className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full">
          {/* Gradient Header with Illustration */}
          <div className="location-gradient p-4 sm:p-6 pb-6 relative overflow-hidden flex-shrink-0">
            {/* Close Button - Fixed position */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 lg:top-4 lg:right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header Text */}
            <div className="relative z-10 pr-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Select Delivery Location
              </h2>
              <p className="text-white/80 text-xs sm:text-sm">
                Check delivery availability in your area
              </p>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {/* Current Location Info */}
            {currentLocation && (
              <div className="mb-4 p-3 sm:p-4 bg-[#27AE60]/10 rounded-xl border border-[#27AE60]/20">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#27AE60] text-sm">Currently delivering to:</p>
                    <p className="text-sm text-[#2C3E50] truncate">{currentLocation.area}, {currentLocation.city} ({currentLocation.pincode})</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pincode Form - Mobile Optimized */}
            <form onSubmit={handlePincodeSubmit} className="mb-4">
              <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Enter your pincode
              </label>
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1 min-w-0">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#E85D04]" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPincode(val);
                      setError('');
                    }}
                    placeholder="e.g. 400708"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-[#E5E5E5] rounded-xl sm:rounded-2xl focus:border-[#E85D04] focus:outline-none transition-all text-base sm:text-lg tracking-widest shadow-sm"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChecking || pincode.length !== 6}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-[#E85D04] text-white font-bold rounded-xl sm:rounded-2xl hover:bg-[#D35400] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-shrink-0"
                >
                  {isChecking ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </span>
                  ) : (
                    'Check'
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  <span className="truncate">{error}</span>
                </p>
              )}
            </form>

            {/* Quick Select - Mobile Optimized */}
            <div>
              <p className="text-sm font-semibold text-[#2C3E50] mb-2 sm:mb-3">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {quickPincodes.map((pc) => (
                  <button
                    key={pc.pincode}
                    onClick={() => handleQuickSelect(pc.pincode)}
                    disabled={isChecking}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-lg border-2 transition-all ${
                      pincode === pc.pincode
                        ? 'bg-[#E85D04] text-white border-[#E85D04]'
                        : 'bg-white text-[#2C3E50] border-[#E5E5E5] hover:border-[#E85D04]'
                    }`}
                  >
                    {pc.area} ({pc.pincode})
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 p-3 sm:p-4 bg-[#F5F5F5] rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#E85D04]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#E85D04]" />
                </div>
                <div className="text-xs sm:text-sm">
                  <p className="font-semibold text-[#2C3E50]">Delivery Information</p>
                  <p className="text-[#6B6B70]">
                    We deliver to Navi Mumbai, Thane, and nearby areas within 24-48 hours for in-stock items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Skip Button */}
          <div className="px-4 pb-4 sm:px-6 sm:pb-6 flex-shrink-0 border-t border-gray-100 pt-3 sm:pt-4">
            <button
              onClick={handleClose}
              className="w-full py-2.5 sm:py-3 text-center font-medium text-[#6B6B70] hover:text-[#E85D04] transition-colors relative group"
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
