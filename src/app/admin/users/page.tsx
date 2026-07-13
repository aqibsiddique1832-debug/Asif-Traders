'use client';
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { initialAdminUsers } from '@/data/adminData';
import { UserCog, Plus, Shield, Edit } from 'lucide-react';

const roles = ['super_admin', 'sales_manager', 'inventory_manager', 'delivery_manager', 'content_manager'];

export default function UsersPage() {
  const [users] = useState(initialAdminUsers);

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Admin Users</h1><p className="text-gray-500 mt-1">{users.length} users</p></div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]"><Plus className="w-5 h-5" /> Add User</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#E85D04] rounded-full flex items-center justify-center"><span className="text-white font-bold">{user.name.charAt(0)}</span></div><span className="font-medium text-[#2C3E50]">{user.name}</span></div></td>
                <td className="px-4 py-4 text-gray-600">{user.email}</td>
                <td className="px-4 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">{user.role.replace('_', ' ')}</span></td>
                <td className="px-4 py-4 text-gray-500">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                <td className="px-4 py-4 text-right"><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
