'use client';

import React, { useState, Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { useSearchParams } from 'next/navigation';
import {
  Search, ShoppingCart, Clock, CheckCircle, Truck,
  XCircle, RotateCcw, User, Phone, MapPin, Eye
} from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  new: { label: 'New', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  processing: { label: 'Processing', icon: ShoppingCart, color: 'bg-purple-100 text-purple-700' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' },
  returned: { label: 'Returned', icon: RotateCcw, color: 'bg-gray-100 text-gray-700' },
};

function OrdersContent() {
  const { orders, updateOrder } = useAdmin();
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') || '';
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const matchesSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrder(orderId, { status: newStatus as any });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Orders Management
        </h1>
        <p className="text-gray-500 mt-1">Total: {orders.length} orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
          >
            <option value="">All Status</option>
            {Object.entries(statusConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${!statusFilter ? 'bg-[#E85D04] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All ({orders.length})
          </button>
          {Object.entries(statusConfig).map(([key, val]) => {
            const count = orders.filter(o => o.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${statusFilter === key ? 'bg-[#E85D04] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {val.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C3E50]">{order.id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#2C3E50]">₹{order.totalAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.items.length} items</p>
                  </div>
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      {order.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {order.customerPhone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                    >
                      {Object.entries(statusConfig).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-500 hover:text-[#E85D04] hover:bg-[#E85D04]/10 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  {order.deliveryAddress} ({order.deliveryPincode})
                </div>
              </div>
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#2C3E50]">Order {selectedOrder.id}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pincode</p>
                  <p className="font-medium">{selectedOrder.deliveryPincode}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                    <span>{item.productName} ({item.variant}) x {item.quantity}</span>
                    <span className="font-medium">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function OrdersLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin w-8 h-8 border-4 border-[#E85D04] border-t-transparent rounded-full"></div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<OrdersLoading />}>
        <OrdersContent />
      </Suspense>
    </AdminLayout>
  );
}
