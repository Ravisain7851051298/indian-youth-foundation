'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiLayers, FiPlus, FiTrash2, FiUsers, FiCheckCircle, FiX } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function ProgramsPage() {
  const { programs, addProgram, deleteProgram, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('New Initiative');
  const [description, setDescription] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('500+ Beneficiaries');
  const [image, setImage] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    addProgram({
      title,
      badge,
      description,
      beneficiaries,
      status: 'Active',
      image: image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'
    });
    setTitle('');
    setDescription('');
    setImage('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
              <FiLayers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sustainable Impact Drives</span>
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Our Flagship Programs
            </h1>
            <p className="text-xs sm:text-sm text-black/80 mt-1">
              Continuous, high-impact community campaigns run by youth volunteers and partners nationwide.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Program</span>
            </button>
          )}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-200 shadow-2xl relative">
              <button 
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-black mb-4">Add Flagship Program</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Program Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Mission - 10,000 Trees"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-emerald-600 font-medium text-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Badge / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Active Project"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-emerald-600 font-medium text-black"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Target Beneficiaries</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,000+ Students"
                      value={beneficiaries}
                      onChange={(e) => setBeneficiaries(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-emerald-600 font-medium text-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-emerald-600 font-medium text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Key highlights and scope of the program..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-emerald-600 font-medium text-black"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Program
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {p.badge}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-extrabold text-base text-black">{p.title}</h3>
                  <p className="text-xs text-black/80 mt-2 leading-relaxed">{p.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-black font-semibold">
                    <FiUsers className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{p.beneficiaries}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <Link href="/donation" className="text-emerald-700 font-bold hover:text-emerald-800 transition">
                      Support →
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => deleteProgram(p.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition cursor-pointer"
                        title="Delete program"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
