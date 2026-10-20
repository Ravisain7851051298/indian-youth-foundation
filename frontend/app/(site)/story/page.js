'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiBookOpen, FiPlus, FiTrash2, FiHeart, FiX } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function StoryPage() {
  const { stories, addStory, deleteStory, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [category, setCategory] = useState('Education Impact');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !summary) return;
    addStory({
      title,
      beneficiary: beneficiary || 'Beneficiary Youth',
      category,
      summary,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600'
    });
    setTitle('');
    setBeneficiary('');
    setSummary('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <FiBookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Real Transformations</span>
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Life Impact &amp; Success Stories
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              Inspiring real stories of children, women, and youth whose lives transformed through your generous support.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Story</span>
            </button>
          )}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-black mb-4">Add Success Story</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Story Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. From Traffic Signals to Board Examination Topper"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Kumar (Age 16)"
                      value={beneficiary}
                      onChange={(e) => setBeneficiary(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Education Impact"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Story Narrative *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe their journey, challenges overcome, and the role of Yuva Kranti Dal..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2.5 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Story
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stories List */}
        <div className="space-y-8">
          {stories.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all grid grid-cols-1 md:grid-cols-12 items-stretch"
            >
              <div className="md:col-span-5 h-64 md:h-auto min-h-[240px] relative overflow-hidden">
                <img
                  src={s.image || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600'}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                  {s.category}
                </span>
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500">
                    Beneficiary: <strong className="text-black">{s.beneficiary}</strong> • {s.date}
                  </span>
                  <h3 className="font-black text-xl text-black mt-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-700 mt-3.5 leading-relaxed font-normal">
                    {s.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href="/donation"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    <FiHeart className="w-3.5 h-3.5 fill-white" />
                    <span>Support Similar Causes</span>
                  </Link>

                  {isAdmin && (
                    <button
                      onClick={() => deleteStory(s.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Delete story"
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
