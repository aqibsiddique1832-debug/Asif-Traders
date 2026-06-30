'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/context/AdminContext';
import {
  Settings as SettingsIcon, Upload, Image, Type, Eye, Save,
  Globe, Share2, CreditCard, Palette, Sliders, Trash2
} from 'lucide-react';

const tabs = [
  { id: 'logo', label: 'Logo & Favicon', icon: Palette },
  { id: 'slider', label: 'Hero Slider', icon: Sliders },
  { id: 'categories', label: 'Category Images', icon: Image },
  { id: 'contact', label: 'Contact Info', icon: Globe },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'seo', label: 'SEO Settings', icon: Type },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

export default function SettingsPage() {
  const { settings, updateSettings, heroSliders, updateHeroSlider, addHeroSlider, deleteHeroSlider, categories, updateCategory } = useAdmin();
  const s = settings || { phone: '', whatsapp: '', email: '', address: '', socialLinks: { facebook: '', instagram: '', linkedin: '', youtube: '' }, metaTitle: '', metaDescription: '', metaKeywords: '' };
  const [activeTab, setActiveTab] = useState('logo');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (section: string) => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setMessage(`${section} saved successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Website Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your website appearance and settings</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-[#E85D04] border-[#E85D04] bg-[#E85D04]/5'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo & Favicon */}
      {activeTab === 'logo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Logo Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Logo (Light Background)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-2">Upload PNG or SVG (recommended: 200x50px)</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                    Choose File
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Logo Preview</label>
                <div className="bg-[#2C3E50] rounded-xl p-8 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-xl flex items-center justify-center">
                      <svg viewBox="0 0 48 48" className="w-8 h-8">
                        <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none"/>
                        <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none"/>
                        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AT</text>
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                      ASIF TRADERS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Favicon</h2>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E85D04] to-[#D35400] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-10 h-10">
                  <path d="M24 4 A20 20 0 0 1 44 24" stroke="#2C3E50" strokeWidth="4" fill="none"/>
                  <path d="M4 24 A20 20 0 0 1 24 44" stroke="#27AE60" strokeWidth="4" fill="none"/>
                  <text x="24" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AT</text>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Recommended: 32x32px or 16x16px PNG</p>
                <button className="px-4 py-2 bg-[#E85D04] text-white text-sm font-medium rounded-lg hover:bg-[#D35400]">
                  Upload Favicon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider */}
      {activeTab === 'slider' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#2C3E50]">Hero Slider Images</h2>
              <button
                onClick={() => addHeroSlider({
                  id: `slider-${Date.now()}`,
                  image: '/images/slider-new.jpg',
                  heading: 'New Slide',
                  subtext: 'Add your text here',
                  buttonText: 'Shop Now',
                  buttonLink: '/categories',
                  order: heroSliders.length + 1,
                  active: true,
                })}
                className="px-4 py-2 bg-[#E85D04] text-white text-sm font-medium rounded-lg hover:bg-[#D35400]"
              >
                Add New Slide
              </button>
            </div>
            <div className="space-y-4">
              {heroSliders.sort((a, b) => a.order - b.order).map((slide, index) => (
                <div key={slide.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-4">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Heading</label>
                        <input
                          type="text"
                          value={slide.heading}
                          onChange={(e) => updateHeroSlider(slide.id, { heading: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Subtext</label>
                        <input
                          type="text"
                          value={slide.subtext}
                          onChange={(e) => updateHeroSlider(slide.id, { subtext: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={slide.buttonText}
                          onChange={(e) => updateHeroSlider(slide.id, { buttonText: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Button Link</label>
                        <input
                          type="text"
                          value={slide.buttonLink}
                          onChange={(e) => updateHeroSlider(slide.id, { buttonLink: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#E85D04] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={slide.active}
                          onChange={(e) => updateHeroSlider(slide.id, { active: e.target.checked })}
                          className="w-4 h-4 text-[#E85D04] rounded"
                        />
                        <span className="text-xs">Active</span>
                      </label>
                      <button
                        onClick={() => deleteHeroSlider(slide.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Images */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Category Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.productCount} products</p>
                  </div>
                </div>
                <button className="w-full px-3 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Upload Image
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={s.phone}
                onChange={(e) => updateSettings({ phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={s.whatsapp}
                onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={s.email}
                onChange={(e) =>updateSettings({ email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
              <input
                type="text"
                value={s.address}
                onChange={(e) => updateSettings({ address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave('Contact Information')}
            disabled={saving}
            className="mt-6 px-6 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Contact Info'}
          </button>
        </div>
      )}

      {/* Social Media */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Social Media Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="url"
                value={s.socialLinks.facebook}
                onChange={(e) => updateSettings({ socialLinks: { ...s.socialLinks, facebook: e.target.value } })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                value={s.socialLinks.instagram}
                onChange={(e) => updateSettings({ socialLinks: { ...s.socialLinks, instagram: e.target.value } })}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={s.socialLinks.linkedin}
                onChange={(e) => updateSettings({ socialLinks: { ...s.socialLinks, linkedin: e.target.value } })}
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input
                type="url"
                value={s.socialLinks.youtube}
                onChange={(e) => updateSettings({ socialLinks: { ...s.socialLinks, youtube: e.target.value } })}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave('Social Media Links')}
            disabled={saving}
            className="mt-6 px-6 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      )}

      {/* SEO */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={s.metaTitle}
                onChange={(e) => updateSettings({ metaTitle: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">{s.metaTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={s.metaDescription}
                onChange={(e) => updateSettings({ metaDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">{s.metaDescription.length}/160 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
              <input
                type="text"
                value={s.metaKeywords}
                onChange={(e) => updateSettings({ metaKeywords: e.target.value })}
                placeholder="cement, TMT bars, steel, pipes..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#E85D04] focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => handleSave('SEO Settings')}
            disabled={saving}
            className="mt-6 px-6 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      )}

      {/* Payment */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#2C3E50] mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#E85D04] rounded" />
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                <p className="text-sm text-gray-500">Allow customers to pay upon delivery</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#E85D04] rounded" />
              <div>
                <p className="font-medium text-gray-900">UPI Payments</p>
                <p className="text-sm text-gray-500">Accept payments via GPay, PhonePe, Paytm</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-[#E85D04] rounded" />
              <div>
                <p className="font-medium text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-500">Accept NEFT/RTGS transfers</p>
              </div>
            </label>
          </div>
          <button
            onClick={() => handleSave('Payment Settings')}
            disabled={saving}
            className="mt-6 px-6 py-2.5 bg-[#E85D04] text-white font-medium rounded-xl hover:bg-[#D35400] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
