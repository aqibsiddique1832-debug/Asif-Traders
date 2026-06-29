'use client';
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Bell, MessageSquare, Mail, Send, Plus } from 'lucide-react';

export default function NotificationsPage() {
  const { settings } = useAdmin();
  const [template, setTemplate] = useState({ type: 'whatsapp', name: '', message: '' });
  return (
    <AdminLayout>
      <div className="mb-6"><h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Notifications</h1><p className="text-gray-500 mt-1">Manage notification templates</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Send Bulk Notification</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]">
                <option>WhatsApp</option><option>SMS</option><option>Email</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04]" placeholder="Enter your message..."></textarea>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]">
              <Send className="w-4 h-4" /> Send to All Customers
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Templates</h2>
          <div className="space-y-3">
            {['Order Confirmation', 'Delivery Update', 'Payment Received', 'New Offer'].map((t, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-[#E85D04]" /><span className="text-sm font-medium">{t}</span></div>
                <button className="text-sm text-[#E85D04] hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
