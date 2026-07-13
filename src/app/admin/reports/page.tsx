'use client';
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AdminLayout>
      <div className="mb-6"><h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Reports & Analytics</h1><p className="text-gray-500 mt-1">Download sales and inventory reports</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Sales Report', desc: 'Daily, weekly, monthly sales', icon: TrendingUp, color: 'bg-green-500' },
          { title: 'Product Report', desc: 'Product-wise sales analysis', icon: BarChart3, color: 'bg-blue-500' },
          { title: 'Customer Report', desc: 'Customer-wise purchases', icon: FileText, color: 'bg-purple-500' },
          { title: 'Profit & Loss', desc: 'Financial overview', icon: TrendingUp, color: 'bg-amber-500' },
          { title: 'GST Report', desc: 'Tax compliance report', icon: FileText, color: 'bg-teal-500' },
          { title: 'Stock Report', desc: 'Inventory movement', icon: BarChart3, color: 'bg-red-500' },
        ].map((report, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center`}><report.icon className="w-6 h-6 text-white" /></div>
              <div><h3 className="font-bold text-[#2C3E50]">{report.title}</h3><p className="text-sm text-gray-500">{report.desc}</p></div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
