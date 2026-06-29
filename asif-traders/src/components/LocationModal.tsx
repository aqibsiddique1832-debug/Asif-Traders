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
        <div className="bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="p-6 border-b border-sandstone">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    Select Delivery Location
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Check delivery availability in your area
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 hover:bg-sandstone rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Location Info */}
            {currentLocation && (
              <div className="mb-6 p-4 bg-success/10 rounded-xl border border-success/20">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-semibold text-success">Currently delivering to:</p>
                    <p className="text-sm text-charcoal">{currentLocation.area}, {currentLocation.city} ({currentLocation.pincode})</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pincode Form */}
            <form onSubmit={handlePincodeSubmit} className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Enter your pincode
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPincode(val);
                    setError('');
                  }}
                  placeholder="e.g. 400708"
                  className="flex-1 px-4 py-3 border-2 border-sandstone rounded-xl focus:border-terracotta focus:outline-none transition-colors text-lg tracking-widest"
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={isChecking || pincode.length !== 6}
                  className="px-6 py-3 bg-terracotta text-white font-semibold rounded-xl hover:bg-terracotta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? 'Checking...' : 'Check'}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-error">{error}</p>
              )}
            </form>

            {/* Quick Select */}
            <div>
              <p className="text-sm font-medium text-charcoal mb-3">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {quickPincodes.map((pc) => (
                  <button
                    key={pc.pincode}
                    onClick={() => handleQuickSelect(pc.pincode)}
                    disabled={isChecking}
                    className="px-4 py-2 bg-sandstone rounded-full text-sm font-medium hover:bg-sandstone/80 transition-colors disabled:opacity-50"
                  >
                    {pc.area} ({pc.pincode})
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-4 bg-amber/10 rounded-xl">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-amber-dark flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-charcoal">Delivery Information</p>
                  <p className="text-text-secondary">
                    We deliver to Navi Mumbai, Thane, and nearby areas within 24-48 hours for in-stock items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sandstone bg-sandstone/30 rounded-b-2xl">
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-3 text-center font-semibold text-charcoal hover:text-terracotta transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
