'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Search, Plus, Edit, Trash2, Building2 } from 'lucide-react';

export default function BrandsPage() {
  const { brands, addBrand, updateBrand, deleteBrand } = useAdmin();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', active: true });

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (form.name) {
      addBrand({ ...form, id: `brand-${Date.now()}`, logo: '/images/brands/default.jpg' });
      setShowAdd(false);
      setForm({ name: '', description: '', active: true });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Brands</h1>
          <p className="text-gray-500 mt-1">Total: {brands.length} brands</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]">
          <Plus className="w-5 h-5" /> Add Brand
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(brand => (
          <div key={brand.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-full h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-bold text-[#2C3E50]">{brand.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{brand.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${brand.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{brand.active ? 'Active' : 'Inactive'}</span>
              <div className="flex gap-2">
                <button onClick={() => { setForm({ name: brand.name, description: brand.description, active: brand.active }); setShowAdd(true); }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => deleteBrand(brand.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Add Brand</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[#E85D04] text-white rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
