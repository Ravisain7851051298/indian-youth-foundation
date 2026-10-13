'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiTarget, FiPlus, FiHeart, FiClock, FiUsers, FiShield, FiX, FiCheckCircle } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function CampaignsPage() {
  const { campaigns, addCampaign, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Child Education');
  const [goalAmount, setGoalAmount] = useState(250000);
  const [bannerImage, setBannerImage] = useState('');
  const [urgent, setUrgent] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    await addCampaign({
      title,
      titleHi: title,
      description,
      descriptionHi: description,
      category,
      goalAmount: Number(goalAmount),
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      urgent
    });
    setTitle('');
    setDescription('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiTarget className="w-3.5 h-3.5" />
              <span>Crowdfunding Drives</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Active Crowdfunding Campaigns
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              50% Tax Exemption under Section 80G available on all contributions. Instant digital receipt issued.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Launch New Campaign</span>
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
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Launch New Crowdfunding Campaign</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free School Bags & Study Kits for 500 Slum Children"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Child Education"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Funding Goal (INR) *</label>
                    <input
                      type="number"
                      required
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain the urgency, beneficiaries and usage of funds..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                  />
                  <span>Mark as High-Priority Urgent Relief</span>
                </label>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Launch Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => {
            const raised = camp.raisedAmount || 0;
            const goal = camp.goalAmount || 100000;
            const percent = Math.min(100, Math.round((raised / goal) * 100));

            return (
              <div
                key={camp._id || camp.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={camp.bannerImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {camp.urgent && (
                      <span className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                        Urgent Cause
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-orange-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {camp.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {camp.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs mt-2.5">
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{Number(raised).toLocaleString('en-IN')}{' '}
                          <span className="text-[11px] font-normal text-slate-500">raised</span>
                        </span>
                        <span className="font-bold text-orange-600">{percent}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Goal: ₹{Number(goal).toLocaleString('en-IN')}</span>
                        <span>{camp.donorCount || 0} donors</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/donation?campaign=${camp._id || camp.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer"
                  >
                    <FiHeart className="w-4 h-4 fill-white" />
                    <span>Donate to This Campaign (80G)</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
