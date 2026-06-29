'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import {
  Package, ShoppingCart, DollarSign, Users, Truck, AlertTriangle,
  TrendingUp, BarChart3, PackagePlus, FileText, MessageSquare, Settings,
  ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Products', value: '55', change: '+3', trend: 'up', icon: Package, color: 'bg-blue-500' },
  { label: "Today's Orders", value: '12', change: '+25%', trend: 'up', icon: ShoppingCart, color: 'bg-green-500' },
  { label: "Today's Revenue", value: '₹1.25L', change: '+18%', trend: 'up', icon: DollarSign, color: 'bg-[#E85D04]' },
  { label: 'Total Customers', value: '156', change: '+8', trend: 'up', icon: Users, color: 'bg-purple-500' },
  { label: 'Pending Deliveries', value: '8', change: '-2', trend: 'down', icon: Truck, color: 'bg-amber-500' },
  { label: 'Low Stock Alerts', value: '5', change: '+3', trend: 'up', icon: AlertTriangle, color: 'bg-red-500' },
  { label: 'Monthly Sales', value: '₹25L', change: '+12%', trend: 'up', icon: TrendingUp, color: 'bg-teal-500' },
  { label: 'Return Requests', value: '2', change: '0', trend: 'neutral', icon: BarChart3, color: 'bg-gray-500' },
];

const quickActions = [
  { label: 'Add Product', href: '/admin/products/add', icon: PackagePlus, color: 'bg-[#E85D04]' },
  { label: 'New Orders', href: '/admin/orders?status=new', icon: FileText, color: 'bg-blue-500' },
  { label: 'New Quotes', href: '/admin/quotes?status=pending', icon: MessageSquare, color: 'bg-green-500' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, color: 'bg-purple-500' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Rajesh Kumar', amount: 35000, status: 'New', time: '10 min ago' },
  { id: 'ORD-002', customer: 'Suresh Patel', amount: 156000, status: 'Confirmed', time: '1 hour ago' },
  { id: 'ORD-003', customer: 'Amit Sharma', amount: 45000, status: 'Processing', time: '2 hours ago' },
];

const recentQuotes = [
  { id: 'QT-001', customer: 'Amit Sharma', items: 'OPC Cement - 200 bags...', status: 'Pending', time: '30 min ago' },
  { id: 'QT-002', customer: 'Vikram Singh', items: 'TMT Bars - 500 pieces...', status: 'Followed Up', time: '2 hours ago' },
];

export default function AdminDashboard() {
  const { orders, quotes, products } = useAdmin();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-purple-100 text-purple-700';
      case 'Followed Up': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> :
                 stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#2C3E50]">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-[#2C3E50] mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-[#E85D04] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.id} • ₹{order.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {order.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Recent Quote Requests
            </h2>
            <Link href="/admin/quotes" className="text-sm text-[#E85D04] hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentQuotes.map((quote, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E85D04]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#E85D04]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{quote.customer}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{quote.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {quote.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-800" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Low Stock Alerts
            </h2>
            <p className="text-sm text-red-600">5 products are running low on stock</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {['OPC 53 Cement', 'TMT 8mm Bars', 'GI Round Pipe 2"', 'AAC Block 100mm', 'Vitrified Tiles'].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
              <p className="font-medium text-gray-900 text-sm truncate">{item}</p>
              <p className="text-xs text-red-600 mt-1">Stock: {Math.floor(Math.random() * 20) + 5} units</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
