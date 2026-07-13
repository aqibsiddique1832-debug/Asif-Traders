'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { serviceablePincodes } from '@/data/products';

interface LocationData {
  pincode: string;
  area: string;
  city: string;
  deliveryDays: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLocationSet: boolean;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  setLocation: (location: LocationData) => void;
  clearLocation: () => void;
  checkPincode: (pincode: string) => LocationData | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocation = localStorage.getItem('asif_location');
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setLocationState(parsed);
          setIsLocationSet(true);
        } catch (e) {
          console.error('Failed to parse location:', e);
        }
      } else {
        // Show modal on first visit
        setShowLocationModal(true);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && location && typeof window !== 'undefined') {
      localStorage.setItem('asif_location', JSON.stringify(location));
      setIsLocationSet(true);
    }
  }, [location, isLoaded]);

  const setLocation = (loc: LocationData) => {
    setLocationState(loc);
    setShowLocationModal(false);
  };

  const clearLocation = () => {
    setLocationState(null);
    setIsLocationSet(false);
    localStorage.removeItem('asif_location');
  };

  const checkPincode = (pincode: string): LocationData | null => {
    const found = serviceablePincodes.find(p => p.pincode === pincode);
    return found || null;
  };

  return (
    <LocationContext.Provider value={{
      location,
      isLocationSet,
      showLocationModal,
      setShowLocationModal,
      setLocation,
      clearLocation,
      checkPincode
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
