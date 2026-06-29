'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Search, Users, Phone, Mail, Building, CreditCard } from 'lucide-react';

export default function CustomersPage() {
  const { customers } = useAdmin();
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchGroup = !groupFilter || c.group === groupFilter;
    return matchSearch && matchGroup;
  });

  const groupColors: Record<string, string> = {
    contractor: 'bg-blue-100 text-blue-700',
    builder: 'bg-green-100 text-green-700',
    homeowner: 'bg-purple-100 text-purple-700',
    mason: 'bg-amber-100 text-amber-700',
    architect: 'bg-teal-100 text-teal-700',
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Customers</h1>
        <p className="text-gray-500 mt-1">Total: {customers.length} customers</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
          </div>
          <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none">
            <option value="">All Groups</option>
            <option value="contractor">Contractor</option>
            <option value="builder">Builder</option>
            <option value="homeowner">Homeowner</option>
            <option value="mason">Mason</option>
            <option value="architect">Architect</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => (
          <div key={cust.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#E85D04] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{cust.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-bold text-[#2C3E50]">{cust.name}</h3>
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${groupColors[cust.group]}`}>{cust.group}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" />{cust.phone}</div>
              {cust.email && <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" />{cust.email}</div>}
              <div className="flex items-center gap-2 text-gray-600"><Building className="w-4 h-4" />{cust.pincode}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <div>
                <p className="text-xs text-gray-500">Orders</p>
                <p className="font-bold text-[#2C3E50]">{cust.totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="font-bold text-[#2C3E50]">₹{cust.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Credit</p>
                <p className="font-bold text-green-600">₹{cust.creditBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
