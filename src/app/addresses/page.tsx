'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addressesApi, tokenStore } from '@/lib/backendApi';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ChevronLeft,
  Home,
  Building2,
  Ruler,
} from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  addressType: 'home' | 'office' | 'other';
}

export default function AddressesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
    addressType: 'home',
  });

  // Load addresses from backend (with localStorage fallback)
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/addresses');
      return;
    }

    if (!user) return;
    const load = async () => {
      // Load from backend first if logged in
      if (tokenStore.getToken()) {
        try {
          const list: any = await addressesApi.list();
          const arr: any[] = Array.isArray(list) ? list : (list?.addresses || []);
          if (arr.length > 0) {
            setAddresses(arr.map((a: any) => ({
              id: a.id,
              name: a.fullName || a.name || '',
              phone: a.phone || '',
              addressLine1: a.addressLine1 || a.address || '',
              addressLine2: a.addressLine2 || a.landmark || '',
              city: a.city || '',
              state: a.state || 'Maharashtra',
              pincode: a.pincode || '',
              isDefault: !!a.isDefault,
              addressType: (a.addressType || 'home').toLowerCase(),
            })));
            return;
          }
        } catch (e) {
          console.warn('[Addresses] Failed to load from backend, using local:', e);
        }
      }
      // Fallback to localStorage
      const saved = localStorage.getItem(`asif_addresses_${user.id}`);
      if (saved) {
        try {
          setAddresses(JSON.parse(saved));
        } catch {
          setAddresses([]);
        }
      }
    };
    load();
  }, [user, isLoading, router]);

  // Save addresses to backend (with localStorage fallback)
  const saveAddresses = (newAddresses: Address[]) => {
    if (user) {
      localStorage.setItem(`asif_addresses_${user.id}`, JSON.stringify(newAddresses));
    }
    setAddresses(newAddresses);
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      isDefault: addresses.length === 0,
      addressType: 'home',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate pincode format
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      showToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }

    // Validate phone
    if (!/^[6-9][0-9]{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    if (editingId) {
      // Update existing address — try backend first
      if (tokenStore.getToken()) {
        try {
          await addressesApi.update(editingId, {
            fullName: formData.name,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: formData.isDefault,
            addressType: (formData.addressType || 'home').toUpperCase(),
          });
        } catch (e) {
          console.warn('[Addresses] Backend update failed, saving locally:', e);
        }
      }
      const updated = addresses.map(addr =>
        addr.id === editingId ? { ...formData, id: editingId } : addr
      );
      saveAddresses(updated);
      showToast('Address updated successfully', 'success');
    } else {
      // Create new address — try backend first
      let newId = Date.now().toString();
      if (tokenStore.getToken()) {
        try {
          const created: any = await addressesApi.create({
            fullName: formData.name,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            isDefault: formData.isDefault,
            addressType: (formData.addressType || 'home').toUpperCase(),
          });
          if (created && created.id) newId = created.id;
        } catch (e) {
          console.warn('[Addresses] Backend create failed, saving locally:', e);
        }
      }
      const newAddress: Address = {
        ...formData,
        id: newId,
      };

      // If this is set as default, unset others
      let updated = addresses;
      if (formData.isDefault) {
        updated = addresses.map(addr => ({ ...addr, isDefault: false }));
      }

      saveAddresses([...updated, newAddress]);
      showToast('Address added successfully', 'success');
    }

    resetForm();
  };

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
      addressType: address.addressType,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      if (tokenStore.getToken()) {
        try {
          await addressesApi.remove(id);
        } catch (e) {
          console.warn('[Addresses] Backend delete failed:', e);
        }
      }
      const filtered = addresses.filter(addr => addr.id !== id);

      // If deleted was default, set first as default
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }

      saveAddresses(filtered);
      showToast('Address deleted', 'success');
    }
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddresses(updated);
    showToast('Default address updated', 'success');
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
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-white/70 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Manage Addresses
            </h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Address List */}
          {!showForm && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-secondary">
                  {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'} saved
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-sandstone rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">No addresses saved</h3>
                  <p className="text-text-secondary mb-6">
                    Add your delivery address to make checkout faster
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      className={`card p-5 relative transition-all ${
                        address.isDefault
                          ? 'ring-2 ring-terracotta'
                          : 'hover:shadow-md'
                      }`}
                    >
                      {/* Default Badge */}
                      {address.isDefault && (
                        <div className="absolute -top-2 -right-2 bg-terracotta text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Default
                        </div>
                      )}

                      {/* Address Type */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-sandstone rounded-lg flex items-center justify-center">
                          {address.addressType === 'home' ? (
                            <Home className="w-4 h-4 text-charcoal" />
                          ) : address.addressType === 'office' ? (
                            <Building2 className="w-4 h-4 text-charcoal" />
                          ) : (
                            <Ruler className="w-4 h-4 text-charcoal" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-charcoal capitalize">
                          {address.addressType === 'home'
                            ? 'Home'
                            : address.addressType === 'office'
                            ? 'Office'
                            : 'Other'}
                        </span>
                      </div>

                      {/* Name & Phone */}
                      <h4 className="font-bold text-charcoal mb-1">{address.name}</h4>
                      <p className="text-sm text-text-secondary mb-2">{address.phone}</p>

                      {/* Address */}
                      <p className="text-sm text-text-secondary mb-3">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-sandstone">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="btn-ghost text-sm flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Set as Default
                          </button>
                        )}
                        <div className="flex-1" />
                        <button
                          onClick={() => handleEdit(address)}
                          className="btn-ghost p-2"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="btn-ghost p-2 text-error hover:bg-error/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="max-w-xl mx-auto">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-charcoal" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {editingId ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button onClick={resetForm} className="btn-ghost p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Address Type */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Address Type
                    </label>
                    <div className="flex gap-3">
                      {(['home', 'office', 'other'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, addressType: type })}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            formData.addressType === type
                              ? 'border-terracotta bg-terracotta/5 text-charcoal'
                              : 'border-sandstone hover:border-charcoal/30 text-text-secondary'
                          }`}
                        >
                          {type === 'home' && <Home className="w-4 h-4" />}
                          {type === 'office' && <Building2 className="w-4 h-4" />}
                          {type === 'other' && <Ruler className="w-4 h-4" />}
                          <span className="capitalize text-sm font-medium">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="input"
                        placeholder="10-digit number"
                        required
                      />
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine1}
                      onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="input"
                      placeholder="House/Flat No., Building, Street"
                      required
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="input"
                      placeholder="Landmark, Area (optional)"
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="input"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        className="input"
                        placeholder="400708"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Default Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-5 h-5 rounded border-sandstone text-terracotta focus:ring-terracotta"
                    />
                    <label htmlFor="isDefault" className="text-sm text-charcoal">
                      Set as default delivery address
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-ghost flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      {editingId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
