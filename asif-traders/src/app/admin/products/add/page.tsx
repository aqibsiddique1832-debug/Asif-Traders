'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Package, Image } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct, categories, brands } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    subcategory: '',
    brand: '',
    description: '',
    unit: 'piece',
    minOrderQty: 1,
    inStock: true,
    variants: [{ id: 'v1', size: '', grade: '', mrp: 0, sellingPrice: 0, discountPercent: 0, stock: 0 }],
    images: [],
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name') {
      setFormData(prev => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    }
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    if (field === 'mrp' || field === 'sellingPrice') {
      const mrp = field === 'mrp' ? value : newVariants[index].mrp;
      const sp = field === 'sellingPrice' ? value : newVariants[index].sellingPrice;
      if (mrp > 0 && sp > 0) {
        newVariants[index].discountPercent = Math.round(((mrp - sp) / mrp) * 100);
      }
    }
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: `v${Date.now()}`, size: '', grade: '', mrp: 0, sellingPrice: 0, discountPercent: 0, stock: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(newProduct);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/admin/products');
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E85D04] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Add New Product
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <select
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
                required
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              >
                <option value="piece">Piece</option>
                <option value="bag">Bag</option>
                <option value="ton">Ton</option>
                <option value="kg">Kilogram</option>
                <option value="sqft">Square Feet</option>
                <option value="running ft">Running Feet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Qty</label>
              <input
                type="number"
                value={formData.minOrderQty}
                onChange={(e) => handleChange('minOrderQty', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <label className="flex items-center gap-2 mt-2">
                <input
type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => handleChange('inStock', e.target.checked)}
                  className="w-5 h-5 text-[#E85D04] rounded"
                />
                <span className="text-sm">In Stock</span>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2C3E50]">Product Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E85D04]/10 text-[#E85D04] text-sm font-medium rounded-lg hover:bg-[#E85D04]/20"
            >
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {formData.variants.map((variant, index) => (
              <div key={variant.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Variant {index + 1}</span>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Size</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      placeholder="e.g., 12mm"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Grade</label>
                    <input
                      type="text"
                      value={variant.grade}
                      onChange={(e) => handleVariantChange(index, 'grade', e.target.value)}
                      placeholder="e.g., Fe 500"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={variant.mrp || ''}
                      onChange={(e) => handleVariantChange(index, 'mrp', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={variant.sellingPrice || ''}
                      onChange={(e) => handleVariantChange(index, 'sellingPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Stock</label>
                    <input
                      type="number"
                      value={variant.stock || ''}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                    />
                  </div>
                </div>
                {variant.discountPercent > 0 && (
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    Discount: {variant.discountPercent}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
            <Image className="w-5 h-5" /> Product Images
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">Drag and drop images here or click to upload</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB each (max 5 images)</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
            >
              Browse Files
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400] transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
