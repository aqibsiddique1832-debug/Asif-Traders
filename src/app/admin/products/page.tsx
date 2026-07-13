'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Product } from '@/data/adminData';
import Link from 'next/link';
import {
  Search, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight,
  Filter, MoreVertical, Package, Image, AlertTriangle
} from 'lucide-react';

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesStock = !stockFilter || 
                        (stockFilter === 'in_stock' && p.inStock) ||
                        (stockFilter === 'out_of_stock' && !p.inStock) ||
                        (stockFilter === 'low_stock' && p.variants.some(v => v.stock < 50));
    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const toggleStock = (product: Product) => {
    updateProduct(product.id, { inStock: !product.inStock });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">Total: {products.length} products</p>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400] transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
          >
            <option value="">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="low_stock">Low Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const defaultVariant = product.variants[0];
                const isLowStock = product.variants.some(v => v.stock < 50);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-[#2C3E50]">₹{defaultVariant?.sellingPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 line-through">₹{defaultVariant?.mrp.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          {product.variants.reduce((sum, v) => sum + v.stock, 0)} units
                        </span>
                      ) : (
                        <span className="text-gray-700">{product.variants.reduce((sum, v) => sum + v.stock, 0)} units</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStock(product)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                          product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.inStock ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {product.inStock ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-gray-500 hover:text-[#E85D04] hover:bg-[#E85D04]/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
