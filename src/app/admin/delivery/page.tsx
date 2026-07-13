'use client';
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Truck, Phone, MapPin, Plus } from 'lucide-react';

export default function DeliveryPage() {
  const { deliveryBoys } = useAdmin();
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Delivery Management</h1><p className="text-gray-500 mt-1">{deliveryBoys.length} delivery boys</p></div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]"><Plus className="w-5 h-5" /> Add Delivery Boy</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveryBoys.map(boy => (
          <div key={boy.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Truck className="w-6 h-6 text-blue-600" /></div>
              <div><h3 className="font-bold text-[#2C3E50]">{boy.name}</h3><p className="text-xs text-gray-500">{boy.vehicle}</p></div>
            </div>
            <div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" />{boy.phone}</div><div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" />{boy.area}</div></div>
            <div className="mt-4 pt-4 border-t border-gray-100"><span className={`px-3 py-1 text-xs font-medium rounded-full ${boy.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{boy.active ? 'Active' : 'Inactive'}</span></div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
