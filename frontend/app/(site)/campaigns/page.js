'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  FiTarget, 
  FiPlus, 
  FiHeart, 
  FiUsers, 
  FiX, 
  FiCheckCircle, 
  FiEdit2, 
  FiTrash2, 
  FiUploadCloud, 
  FiImage, 
  FiAlertTriangle,
  FiCheck,
  FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

const CATEGORIES = [
  'All Drives',
  'Child Education',
  'Emergency Healthcare',
  'Disaster Relief',
  'Youth Empowerment',
  'Winter Relief',
  'Hunger & Nutrition'
];

export default function CampaignsPage() {
  const { 
    campaigns = [], 
    addCampaign, 
    updateCampaign, 
    deleteCampaign, 
    uploadFile,
    currentUser 
  } = useNGO();

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('All Drives');

  // Launch / Create Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addTitleHi, setAddTitleHi] = useState('');
  const [addCategory, setAddCategory] = useState('Child Education');
  const [addGoalAmount, setAddGoalAmount] = useState(250000);
  const [addRaisedAmount, setAddRaisedAmount] = useState(0);
  const [addDescription, setAddDescription] = useState('');
  const [addUrgent, setAddUrgent] = useState(false);
  const [addBannerUrl, setAddBannerUrl] = useState('');
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState('');
  const [addingSubmitting, setAddingSubmitting] = useState(false);
  const addFileInputRef = useRef(null);

  // Edit Modal State
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleHi, setEditTitleHi] = useState('');
  const [editCategory, setEditCategory] = useState('Child Education');
  const [editGoalAmount, setEditGoalAmount] = useState(100000);
  const [editRaisedAmount, setEditRaisedAmount] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [editUrgent, setEditUrgent] = useState(false);
  const [editBannerUrl, setEditBannerUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editingSubmitting, setEditingSubmitting] = useState(false);
  const editFileInputRef = useRef(null);

  // Delete Confirmation Modal State
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  // Handle Add Image Selection
  const handleAddImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size must be under 15MB');
      return;
    }
    setAddImageFile(file);
    const preview = URL.createObjectURL(file);
    setAddImagePreview(preview);
  };

  const clearAddImage = () => {
    if (addImagePreview && addImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(addImagePreview);
    }
    setAddImageFile(null);
    setAddImagePreview('');
    if (addFileInputRef.current) addFileInputRef.current.value = '';
  };

  // Handle Edit Image Selection
  const handleEditImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size must be under 15MB');
      return;
    }
    setEditImageFile(file);
    const preview = URL.createObjectURL(file);
    setEditImagePreview(preview);
  };

  const clearEditImage = () => {
    if (editImagePreview && editImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditImageFile(null);
    setEditImagePreview('');
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  // Open Edit Modal
  const openEditModal = (camp) => {
    setEditingCampaign(camp);
    setEditTitle(camp.title || '');
    setEditTitleHi(camp.titleHi || camp.title || '');
    setEditCategory(camp.category || 'Child Education');
    setEditGoalAmount(camp.goalAmount || 100000);
    setEditRaisedAmount(camp.raisedAmount || 0);
    setEditDescription(camp.description || '');
    setEditUrgent(Boolean(camp.urgent));
    setEditBannerUrl(camp.bannerImage || '');
    setEditImageFile(null);
    setEditImagePreview(camp.bannerImage ? getContentImageUrl(camp.bannerImage) : '');
  };

  // Close Edit Modal
  const closeEditModal = () => {
    if (editImagePreview && editImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditingCampaign(null);
    setEditImageFile(null);
    setEditImagePreview('');
  };

  // Submit New Campaign
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!addTitle.trim() || !addDescription.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    if (!addGoalAmount || Number(addGoalAmount) <= 0) {
      toast.error('Please specify a valid funding goal.');
      return;
    }

    try {
      setAddingSubmitting(true);
      let bannerImage = addBannerUrl.trim();

      // If user selected an image file, upload it directly
      if (addImageFile && uploadFile) {
        const uploadRes = await uploadFile(addImageFile, 'campaigns');
        if (uploadRes?.success && uploadRes?.url) {
          bannerImage = uploadRes.url;
        }
      }

      const payload = {
        title: addTitle.trim(),
        titleHi: addTitleHi.trim() || addTitle.trim(),
        description: addDescription.trim(),
        descriptionHi: addDescription.trim(),
        category: addCategory,
        goalAmount: Number(addGoalAmount),
        raisedAmount: Number(addRaisedAmount) || 0,
        urgent: addUrgent,
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        status: 'active'
      };

      const res = await addCampaign(payload);
      if (res?.success) {
        toast.success('Campaign launched successfully!');
        // Reset form
        setAddTitle('');
        setAddTitleHi('');
        setAddDescription('');
        setAddGoalAmount(250000);
        setAddRaisedAmount(0);
        setAddUrgent(false);
        setAddBannerUrl('');
        clearAddImage();
        setShowAddModal(false);
      } else {
        toast.error(res?.message || 'Failed to create campaign');
      }
    } catch (err) {
      toast.error(err.message || 'Error creating campaign');
    } finally {
      setAddingSubmitting(false);
    }
  };

  // Submit Edited Campaign
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCampaign) return;
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error('Title and description are required.');
      return;
    }

    try {
      setEditingSubmitting(true);
      let bannerImage = editBannerUrl.trim();

      // If user selected a new file, upload it
      if (editImageFile && uploadFile) {
        const uploadRes = await uploadFile(editImageFile, 'campaigns');
        if (uploadRes?.success && uploadRes?.url) {
          bannerImage = uploadRes.url;
        }
      }

      const campaignId = editingCampaign._id || editingCampaign.id;
      const payload = {
        title: editTitle.trim(),
        titleHi: editTitleHi.trim() || editTitle.trim(),
        description: editDescription.trim(),
        descriptionHi: editDescription.trim(),
        category: editCategory,
        goalAmount: Number(editGoalAmount),
        raisedAmount: Number(editRaisedAmount) || 0,
        urgent: editUrgent,
        bannerImage: bannerImage || editingCampaign.bannerImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'
      };

      const res = await updateCampaign(campaignId, payload);
      if (res?.success) {
        toast.success('Campaign updated successfully!');
        closeEditModal();
      } else {
        toast.error(res?.message || 'Failed to update campaign');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating campaign');
    } finally {
      setEditingSubmitting(false);
    }
  };

  // Delete Campaign
  const handleDeleteConfirm = async () => {
    if (!deletingCampaign) return;
    try {
      setDeletingLoading(true);
      const campaignId = deletingCampaign._id || deletingCampaign.id;
      const res = await deleteCampaign(campaignId);
      if (res?.success) {
        toast.success('Campaign deleted successfully!');
        setDeletingCampaign(null);
      } else {
        toast.error(res?.message || 'Failed to delete campaign');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting campaign');
    } finally {
      setDeletingLoading(false);
    }
  };

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    if (selectedCategory === 'All Drives') return true;
    if (selectedCategory === 'Urgent') return camp.urgent;
    return camp.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <FiTarget className="w-3.5 h-3.5 text-emerald-700" />
              <span>Crowdfunding & Welfare Drives</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Active Crowdfunding Campaigns
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl">
              100% verified grassroots campaigns with complete transparency. 50% Tax Exemption under Section 80G available on all Indian donations.
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Launch New Campaign</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-2 flex-shrink-0">
            <FiFilter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter:</span>
          </div>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-black border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
          <button
            onClick={() => setSelectedCategory('Urgent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              selectedCategory === 'Urgent'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-black border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            🔥 Urgent Only
          </button>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <FiTarget className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-black">No Campaigns in This Category</h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Try switching your filter or check back later for newly launched welfare initiatives.
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
              >
                Launch First Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((camp) => {
              const id = camp._id || camp.id;
              const raised = Number(camp.raisedAmount) || 0;
              const goal = Number(camp.goalAmount) || 100000;
              const percent = Math.min(100, Math.round((raised / goal) * 100));
              const displayImage = camp.bannerImage 
                ? getContentImageUrl(camp.bannerImage) 
                : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Campaign Image Container */}
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img
                        src={displayImage}
                        alt={camp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                        }}
                      />
                      
                      {/* Category Badge */}
                      <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                        {camp.category || 'General Drive'}
                      </span>

                      {/* Urgent Badge */}
                      {camp.urgent && (
                        <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                          Urgent Cause
                        </span>
                      )}

                      {/* Admin Quick Action Floating Buttons */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                          <button
                            onClick={() => openEditModal(camp)}
                            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-800 hover:text-black border border-slate-200 shadow-md backdrop-blur-xs transition cursor-pointer"
                            title="Edit Campaign"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCampaign(camp)}
                            className="p-2 rounded-xl bg-white/90 hover:bg-rose-50 text-rose-600 border border-rose-200 shadow-md backdrop-blur-xs transition cursor-pointer"
                            title="Delete Campaign"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Campaign Body Details */}
                    <div className="p-6">
                      <h3 className="font-extrabold text-base text-black line-clamp-2 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed line-clamp-3">
                        {camp.description}
                      </p>

                      {/* Progress Bar & Financials */}
                      <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs mt-3">
                          <span className="font-black text-black text-sm">
                            ₹{raised.toLocaleString('en-IN')}{' '}
                            <span className="text-[11px] font-normal text-slate-600">raised</span>
                          </span>
                          <span className="font-bold text-emerald-700">{percent}%</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1.5 flex items-center justify-between">
                          <span>Target: ₹{goal.toLocaleString('en-IN')}</span>
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3 text-slate-500" />
                            {camp.donorCount || 0} donors
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="p-6 pt-0 space-y-2">
                    <Link
                      href={`/donation?campaign=${id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer"
                    >
                      <FiHeart className="w-4 h-4 fill-white" />
                      <span>Donate to This Campaign (80G)</span>
                    </Link>

                    {isAdmin && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => openEditModal(camp)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-[11px] transition cursor-pointer"
                        >
                          <FiEdit2 className="w-3.5 h-3.5 text-slate-700" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingCampaign(camp)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- LAUNCH / CREATE CAMPAIGN MODAL ---------------- */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative my-8">
              <button 
                onClick={() => {
                  clearAddImage();
                  setShowAddModal(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <FiTarget className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-xl text-black">Launch Crowdfunding Campaign</h3>
                  <p className="text-xs text-slate-600">Publish a public donation drive with photo and goal.</p>
                </div>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs mt-4">
                <div>
                  <label className="font-bold text-black block mb-1">Campaign Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free School Bags & Study Kits for 500 Slum Children"
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Campaign Title (Hindi / Local)</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 जरूरतमंद बच्चों के लिए मुफ्त स्कूल बैग और अध्ययन सामग्री"
                    value={addTitleHi}
                    onChange={(e) => setAddTitleHi(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Category</label>
                    <select
                      value={addCategory}
                      onChange={(e) => setAddCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-bold text-black bg-white"
                    >
                      <option value="Child Education">Child Education</option>
                      <option value="Emergency Healthcare">Emergency Healthcare</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                      <option value="Youth Empowerment">Youth Empowerment</option>
                      <option value="Winter Relief">Winter Relief</option>
                      <option value="Hunger & Nutrition">Hunger & Nutrition</option>
                      <option value="Community Development">Community Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Funding Goal (INR) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={addGoalAmount}
                      onChange={(e) => setAddGoalAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-bold text-black bg-white"
                    />
                  </div>
                </div>

                {/* IMAGE UPLOAD OPTION */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-black flex items-center gap-1.5">
                      <FiImage className="w-4 h-4 text-emerald-700" />
                      <span>Campaign Banner Image</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Upload file or enter URL</span>
                  </div>

                  {/* Local File Picker */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={addFileInputRef}
                      accept="image/*"
                      onChange={handleAddImageSelect}
                      className="hidden"
                      id="addCampaignFileInput"
                    />
                    <label
                      htmlFor="addCampaignFileInput"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-600 text-black font-bold cursor-pointer transition shadow-xs text-xs"
                    >
                      <FiUploadCloud className="w-4 h-4 text-emerald-700" />
                      <span>{addImageFile ? 'Change Image File' : 'Upload Image from Device'}</span>
                    </label>

                    {addImageFile && (
                      <button
                        type="button"
                        onClick={clearAddImage}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Image Preview Box */}
                  {addImagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 bg-white">
                      <img
                        src={addImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-semibold">
                        Preview: {addImageFile ? addImageFile.name : 'Web URL Image'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500">
                      Or paste an online image URL below:
                    </div>
                  )}

                  {/* Alternate URL Input */}
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={addBannerUrl}
                    onChange={(e) => {
                      setAddBannerUrl(e.target.value);
                      if (!addImageFile) setAddImagePreview(e.target.value);
                    }}
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Campaign Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the background, urgency, direct beneficiaries, and how the donations will be used..."
                    value={addDescription}
                    onChange={(e) => setAddDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 font-bold text-black cursor-pointer bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                  <input
                    type="checkbox"
                    checked={addUrgent}
                    onChange={(e) => setAddUrgent(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as High-Priority Urgent Relief (Displays warning banner)</span>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      clearAddImage();
                      setShowAddModal(false);
                    }}
                    className="px-4 py-2.5 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    {addingSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        <span>Launch Campaign</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- EDIT CAMPAIGN MODAL ---------------- */}
        {editingCampaign && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative my-8">
              <button 
                onClick={closeEditModal}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <FiEdit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-xl text-black">Edit Crowdfunding Campaign</h3>
                  <p className="text-xs text-slate-600">Update goals, title, description, or upload a new banner.</p>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs mt-4">
                <div>
                  <label className="font-bold text-black block mb-1">Campaign Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Campaign Title (Hindi / Local)</label>
                  <input
                    type="text"
                    value={editTitleHi}
                    onChange={(e) => setEditTitleHi(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-bold text-black bg-white"
                    >
                      <option value="Child Education">Child Education</option>
                      <option value="Emergency Healthcare">Emergency Healthcare</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                      <option value="Youth Empowerment">Youth Empowerment</option>
                      <option value="Winter Relief">Winter Relief</option>
                      <option value="Hunger & Nutrition">Hunger & Nutrition</option>
                      <option value="Community Development">Community Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Funding Goal (INR) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={editGoalAmount}
                      onChange={(e) => setEditGoalAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-bold text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Raised (INR)</label>
                    <input
                      type="number"
                      min={0}
                      value={editRaisedAmount}
                      onChange={(e) => setEditRaisedAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-bold text-black bg-white"
                    />
                  </div>
                </div>

                {/* IMAGE UPLOAD OPTION IN EDIT */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-black flex items-center gap-1.5">
                      <FiImage className="w-4 h-4 text-emerald-700" />
                      <span>Update Banner Image</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Pick from device or change link</span>
                  </div>

                  {/* Local File Picker */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className="hidden"
                      id="editCampaignFileInput"
                    />
                    <label
                      htmlFor="editCampaignFileInput"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-600 text-black font-bold cursor-pointer transition shadow-xs text-xs"
                    >
                      <FiUploadCloud className="w-4 h-4 text-emerald-700" />
                      <span>{editImageFile ? 'Select Different Image' : 'Upload New Photo'}</span>
                    </label>

                    {editImageFile && (
                      <button
                        type="button"
                        onClick={clearEditImage}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Reset to Original
                      </button>
                    )}
                  </div>

                  {/* Preview of current or newly selected photo */}
                  {editImagePreview && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 bg-white">
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[10px] font-semibold">
                        {editImageFile ? `New File: ${editImageFile.name}` : 'Current Image Preview'}
                      </div>
                    </div>
                  )}

                  {/* Banner Image URL input */}
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Banner Image URL / Path:</label>
                    <input
                      type="text"
                      value={editBannerUrl}
                      onChange={(e) => {
                        setEditBannerUrl(e.target.value);
                        if (!editImageFile) setEditImagePreview(e.target.value);
                      }}
                      className="w-full px-3.5 py-2 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Campaign Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 font-bold text-black cursor-pointer bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                  <input
                    type="checkbox"
                    checked={editUrgent}
                    onChange={(e) => setEditUrgent(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as High-Priority Urgent Relief</span>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2.5 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editingSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    {editingSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- DELETE CAMPAIGN CONFIRMATION MODAL ---------------- */}
        {deletingCampaign && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-black">Delete Campaign?</h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                Are you sure you want to delete the campaign <strong className="text-black">"{deletingCampaign.title}"</strong>? This will permanently remove the fundraising drive and its attached banner photo.
              </p>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={deletingLoading}
                  onClick={() => setDeletingCampaign(null)}
                  className="px-4 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deletingLoading}
                  onClick={handleDeleteConfirm}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition cursor-pointer text-xs"
                >
                  {deletingLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
