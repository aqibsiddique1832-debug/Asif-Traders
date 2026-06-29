'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Search, MapPin, Plus, Edit, Trash2, Truck, Clock, DollarSign } from 'lucide-react';

export default function LocationsPage() {
  const { pincodes, addPincode, updatePincode, deletePincode } = useAdmin();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: '', area: '', city: '', state: 'Maharashtra', deliveryCharges: 0, deliveryTime: '24 hours', active: true });

  const filtered = pincodes.filter(p => p.code.includes(search) || p.area.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (form.code && form.area) {
      addPincode({ ...form, id: `pc-${Date.now()}` });
      setShowAdd(false);
      setForm({ code: '', area: '', city: '', state: 'Maharashtra', deliveryCharges: 0, deliveryTime: '24 hours', active: true });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Delivery Locations</h1>
          <p className="text-gray-500 mt-1">{pincodes.filter(p => p.active).length} active pincodes</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]">
          <Plus className="w-5 h-5" /> Add Pincode
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by pincode or area..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pincode</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Area</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">City</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Delivery</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Charges</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(pc => (
              <tr key={pc.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-bold text-[#2C3E50]">{pc.code}</td>
                <td className="px-4 py-4 text-gray-700">{pc.area}</td>
                <td className="px-4 py-4 text-gray-700">{pc.city}</td>
                <td className="px-4 py-4 text-gray-700"><span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pc.deliveryTime}</span></td>
                <td className="px-4 py-4 text-gray-700">{pc.deliveryCharges === 0 ? 'Free' : `₹${pc.deliveryCharges}`}</td>
                <td className="px-4 py-4">
                  <button onClick={() => updatePincode(pc.id, { active: !pc.active })} className={`px-3 py-1 text-xs font-medium rounded-full ${pc.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pc.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => deletePincode(pc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Add Delivery Pincode</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" maxLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                <input type="text" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <select value={form.deliveryTime} onChange={e => setForm({ ...form, deliveryTime: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]">
                    <option>24 hours</option>
                    <option>48 hours</option>
                    <option>3-5 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Charges (₹)</label>
                  <input type="number" value={form.deliveryCharges} onChange={e => setForm({ ...form, deliveryCharges: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[#E85D04] text-white rounded-xl hover:bg-[#D35400]">Add</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
