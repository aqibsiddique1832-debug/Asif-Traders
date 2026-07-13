'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Search, MessageSquare, Phone, Clock, User, Trash2 } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  followed_up: { label: 'Followed Up', color: 'bg-blue-100 text-blue-700' },
  quoted: { label: 'Quoted', color: 'bg-purple-100 text-purple-700' },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700' },
};

export default function QuotesPage() {
  const { quotes, updateQuote, deleteQuote } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = quotes.filter(q => {
    const matchSearch = !search || q.customerName.toLowerCase().includes(search.toLowerCase()) || q.customerPhone.includes(search);
    const matchStatus = !statusFilter || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Quotes & Enquiries</h1>
        <p className="text-gray-500 mt-1">Total: {quotes.length} quote requests</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search quotes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none">
            <option value="">All Status</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(quote => {
          const status = statusConfig[quote.status];
          return (
            <div key={quote.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#E85D04]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C3E50]">{quote.id}</p>
                    <p className="text-sm text-gray-500">{new Date(quote.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${status.color}`}>{status.label}</span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-400" />{quote.customerName}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" />{quote.customerPhone}</div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{quote.items}</p>
                {quote.description && <p className="text-xs text-gray-500 mt-2">{quote.description}</p>}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <select value={quote.status} onChange={e => updateQuote(quote.id, { status: e.target.value as any })} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04]">
                  {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <a href={`tel:${quote.customerPhone}`} className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100">Call</a>
                <button onClick={() => deleteQuote(quote.id)} className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
