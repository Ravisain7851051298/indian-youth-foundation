'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiLayers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiCheckCircle,
  FiStar,
  FiShield
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  clearPlanStatus
} from '@/store/planSlice';

export default function MembershipPlansPage() {
  const dispatch = useDispatch();
  const { plans, loading, successMessage, error } = useSelector((state) => state.plans);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fee: 250,
    duration: '1 Year',
    description: '',
    perks: '',
    popular: false
  });

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      fee: 250,
      duration: '1 Year',
      description: '',
      perks: 'Official Digital ID Card\nLetter of Appointment\nVoting Rights in Conclave',
      popular: false
    });
    setModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingId(plan._id);
    setFormData({
      name: plan.name,
      fee: plan.fee,
      duration: plan.duration || '1 Year',
      description: plan.description || '',
      perks: Array.isArray(plan.perks) ? plan.perks.join('\n') : plan.perks,
      popular: !!plan.popular
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.fee === '') return;

    const payload = {
      ...formData,
      fee: Number(formData.fee),
      perks: formData.perks.split('\n').filter(p => p.trim())
    };

    if (editingId) {
      await dispatch(updatePlan({ id: editingId, planData: payload }));
    } else {
      await dispatch(createPlan(payload));
    }

    setModalOpen(false);
    setTimeout(() => dispatch(clearPlanStatus()), 4000);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this membership plan?')) {
      await dispatch(deletePlan(id));
      setTimeout(() => dispatch(clearPlanStatus()), 4000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FiLayers className="text-emerald-700 w-5 h-5" />
            Custom Membership Plans CMS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic plans that applicants select when enrolling. Changes sync immediately with the public portal.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer self-start sm:self-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="mx-3 bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Plans Grid */}
      <div className="mx-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`bg-white rounded-3xl p-6 border shadow-2xs flex flex-col justify-between transition relative ${plan.popular ? 'border-emerald-700 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200 hover:border-emerald-200'
              }`}
          >
            {plan.popular && (
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white flex items-center gap-1 shadow-xs">
                <FiStar className="w-3 h-3 fill-current" />
                <span>Popular</span>
              </span>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <FiShield className="w-3.5 h-3.5" />
                <span>{plan.duration || 'Annual'}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">{plan.name}</h3>
              <p className="text-xs text-slate-600 mt-1 min-h-[36px] line-clamp-2">
                {plan.description || 'Verified membership tier empowering youth welfare initiatives.'}
              </p>

              {/* Price */}
              <div className="my-5 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">₹{Number(plan.fee).toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-500 font-medium">/ {plan.duration}</span>
              </div>

              {/* Perks List */}
              <div className="space-y-2 border-t border-slate-100 pt-4 mb-6">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan Benefits:</p>
                {(Array.isArray(plan.perks) ? plan.perks : []).map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Controls */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openEditModal(plan)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <FiEdit2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Plan</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(plan._id)}
                className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Delete Plan"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-base">
                {editingId ? 'Edit Membership Plan' : 'Add New Custom Membership Plan'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Active Youth Member"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fee Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 1 Year, 2 Years, Lifetime"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Short summary of this membership category..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plan Benefits & Perks (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.perks}
                  onChange={(e) => setFormData(prev => ({ ...prev, perks: e.target.value }))}
                  placeholder="Official Dual-Sided Digital ID Card&#10;Formal Letter of Appointment&#10;Voting Rights in General Body Meeting"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px] text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={formData.popular}
                  onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
                  className="rounded text-emerald-700 focus:ring-emerald-500"
                />
                <label htmlFor="popularCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Mark as &ldquo;Popular / Recommended&rdquo; Plan
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  {editingId ? 'Update Plan' : 'Save New Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
