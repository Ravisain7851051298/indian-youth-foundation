'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiActivity, FiPlus, FiTrash2, FiCheckCircle, FiHeart, FiX, FiBriefcase, FiBookOpen, FiShield, FiGift } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function ServicesPage() {
  const { services, addService, deleteService, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    addService({
      title,
      titleEn: title,
      description,
      category,
      icon: 'Activity'
    });
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiActivity className="w-3.5 h-3.5" />
              <span>Core Welfare Programs</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Social Services
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dedicated welfare initiatives in child education, youth livelihood, healthcare relief, and environmental action.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          )}
        </div>

        {/* Add Modal for Admin */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Add New Social Service</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Eye Checkup & Spectacle Distribution"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  >
                    <option value="Education">Education & Child Welfare</option>
                    <option value="Healthcare">Healthcare & Emergency Relief</option>
                    <option value="Livelihood">Youth Skill & Employment</option>
                    <option value="Environment">Environment & Plantation</option>
                    <option value="Women">Women Empowerment</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the mission, beneficiaries, and ground impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl mb-5 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-xs">
                  <FiActivity className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                  {srv.titleEn || srv.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  {srv.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Active Initiative</span>
                </span>

                <div className="flex items-center gap-3">
                  <Link
                    href="/donation"
                    className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1 transition"
                  >
                    <span>Support</span>
                    <span>→</span>
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => deleteService(srv.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition cursor-pointer"
                      title="Delete service"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
