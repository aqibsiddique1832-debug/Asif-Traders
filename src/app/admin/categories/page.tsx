'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import { Plus, Edit, Trash2, Image, Tag, Search } from 'lucide-react';

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', image: '' });

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = () => {
    if (editId) {
      updateCategory(editId, form);
    } else {
      addCategory({ ...form, id: `cat-${Date.now()}`, productCount: 0, active: true });
    }
    setShowAdd(false);
    setEditId(null);
    setForm({ name: '', slug: '', description: '', icon: '', image: '' });
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, image: cat.image });
    setShowAdd(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Categories</h1>
          <p className="text-gray-500 mt-1">Total: {categories.length} categories</p>
        </div>
        <button onClick={() => { setShowAdd(true); setEditId(null); setForm({ name: '', slug: '', description: '', icon: '', image: '' }); }} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400]">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-bold text-[#2C3E50]">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
            <p className="text-xs text-gray-400 mt-2">{cat.productCount} products</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(cat)} className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Edit</button>
              <button onClick={() => deleteCategory(cat.id)} className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#2C3E50] mb-4">{editId ? 'Edit' : 'Add'} Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-[#E85D04] text-white rounded-xl hover:bg-[#D35400]">Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
