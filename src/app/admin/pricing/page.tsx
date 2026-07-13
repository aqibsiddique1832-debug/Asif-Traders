'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Search, Plus, Tag, Percent, Trash2, Edit, Clock } from 'lucide-react';

export default function PricingPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'flat', value: 0, minOrderValue: 0, maxDiscount: 0, validFrom: '', validTo: '', usageLimit: 0, active: true });

  const handleSave = () => {
    if (form.code) {
      addCoupon({ ...form, id: `cp-${Date.now()}`, usedCount: 0 });
      setShowAdd(false);
      setForm({ code: '', type: 'percentage', value: 0, minOrderValue: 0, maxDiscount: 0, validFrom: '', validTo: '', usageLimit: 0, active: true });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Pricing & Offers</h1>
          <p className="text-gray-500 mt-1">Manage coupons and discounts</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]">
          <Plus className="w-5 h-5" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#E85D04]" />
                <span className="font-bold text-lg text-[#2C3E50]">{coupon.code}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{coupon.active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex items-center gap-1 text-2xl font-bold text-[#E85D04]">
              <Percent className="w-6 h-6" />
              {coupon.value}{coupon.type === 'percentage' ? '%' : ' Flat'}
            </div>
            <p className="text-sm text-gray-500 mt-2">Min order: ₹{coupon.minOrderValue.toLocaleString()}</p>
            {coupon.maxDiscount && coupon.maxDiscount > 0 && <p className="text-xs text-gray-400">Max discount: ₹{coupon.maxDiscount.toLocaleString()}</p>}
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2"><Clock className="w-3 h-3" />{coupon.validFrom} - {coupon.validTo}</div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500">{coupon.usedCount}/{coupon.usageLimit} used</span>
              <button onClick={() => deleteCoupon(coupon.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Add Coupon</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label><input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"><option value="percentage">Percentage</option><option value="flat">Flat</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Value</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Order</label><input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Discount</label><input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label><input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label><input type="date" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label><input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[#E85D04] text-white rounded-xl">Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
