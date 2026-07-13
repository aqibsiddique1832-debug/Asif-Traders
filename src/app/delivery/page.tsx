'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';
import { serviceablePincodes } from '@/data/products';
import { ChevronRight, MapPin, Check, Truck, Clock } from 'lucide-react';

export default function DeliveryPage() {
  const { location, isLocationSet, setLocation, checkPincode } = useLocation();
  const [searchPincode, setSearchPincode] = useState('');
  const [result, setResult] = useState<{ found: boolean; area?: string; city?: string; deliveryDays?: string } | null>(null);

  const handleCheck = () => {
    if (searchPincode.length === 6) {
      const found = checkPincode(searchPincode);
      if (found) {
        setResult({ found: true, area: found.area, city: found.city, deliveryDays: found.deliveryDays });
      } else {
        setResult({ found: false });
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal text-white py-8">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Delivery Areas</span>
          </nav>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Delivery Information
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Current Location */}
            {isLocationSet && location && (
              <div className="card p-6 mb-8 bg-success/5 border border-success/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-success">We deliver to your area!</p>
                    <p className="text-charcoal">{location.area}, {location.city} ({location.pincode})</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      Delivery in {location.deliveryDays}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Check Delivery */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Check Delivery to Your Location
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchPincode}
                  onChange={(e) => {
                    setSearchPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setResult(null);
                  }}
                  placeholder="Enter 6-digit pincode"
                  className="input flex-1"
                  maxLength={6}
                />
                <button onClick={handleCheck} className="btn-primary">
                  Check
                </button>
              </div>

              {result && (
                <div className={`mt-4 p-4 rounded-lg ${result.found ? 'bg-success/10' : 'bg-error/10'}`}>
                  {result.found ? (
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-success" />
                      <div>
                        <p className="font-semibold text-success">Delivery available!</p>
                        <p className="text-charcoal">{result.area}, {result.city}</p>
                        <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                          <Truck className="w-4 h-4" />
                          Estimated delivery: {result.deliveryDays}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-error" />
                      <div>
                        <p className="font-semibold text-error">Delivery not available</p>
                        <p className="text-charcoal text-sm">We do not deliver to this pincode yet.</p>
                        <p className="text-sm text-text-secondary mt-1">Please contact us for bulk orders.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Serviceable Areas */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-charcoal mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Serviceable Areas
              </h2>
              <p className="text-text-secondary mb-4">
                We deliver to the following areas in Navi Mumbai and Thane:
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {serviceablePincodes.map((area) => (
                  <div key={area.pincode} className="flex items-center gap-2 p-3 bg-sandstone/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-terracotta flex-shrink-0" />
                    <div>
                      <p className="font-medium text-charcoal">{area.area}</p>
                      <p className="text-xs text-text-secondary">{area.city} - {area.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 card p-6 bg-sandstone/30">
              <h3 className="font-bold text-charcoal mb-3">Delivery Information</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5" />
                  <span>Free delivery for orders above ₹5,000</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5" />
                  <span>Same-day delivery for orders placed before 12 PM (in select areas)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5" />
                  <span>Next-day delivery for most serviceable areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success mt-0.5" />
                  <span>Delivery charges may apply for orders below ₹5,000</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="mt-6 text-center">
              <p className="text-text-secondary mb-2">Need help with delivery?</p>
              <a href="tel:+917977572727" className="text-terracotta font-semibold hover:underline">
                Call +91 79775 72727
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
