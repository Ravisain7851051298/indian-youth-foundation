'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiUserCheck,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMail,
  FiShield,
  FiX,
  FiSearch,
  FiUploadCloud,
  FiImage,
  FiRefreshCw,
  FiCheckCircle,
  FiArrowUpRight,
  FiCamera
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

const DEPARTMENTS = [
  'All',
  'Leadership & Board',
  'Youth Empowerment & Training',
  'Child Education Drives',
  'Healthcare & Emergency Relief',
  'Community & Volunteer Force',
  'Administration & Accounts'
];

export default function TeamMembersPage() {
  const { currentUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = currentUser || reduxUser;
  const isAdmin =
    effectiveUser?.role === 'Admin' ||
    effectiveUser?.role === 'admin' ||
    effectiveUser?.role === 'TeamMember';

  // Data states
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
    name: '',
    position: '',
    department: 'Leadership & Board',
    phone: '',
    email: '',
    bio: '',
    image: '',
    order: 0
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  // Fetch real team members from database
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team-members');
      const list = res.data?.data || res.data?.items || [];
      setTeamMembers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Error fetching team members from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchDept = selectedDept === 'All' || m.department === selectedDept;
      if (!searchQuery.trim()) return matchDept;
      const q = searchQuery.toLowerCase();
      const name = (m.name || '').toLowerCase();
      const pos = (m.position || m.role || '').toLowerCase();
      const dept = (m.department || '').toLowerCase();
      const bio = (m.bio || '').toLowerCase();
      return matchDept && (name.includes(q) || pos.includes(q) || dept.includes(q) || bio.includes(q));
    });
  }, [teamMembers, selectedDept, searchQuery]);

  // Open Add Modal
  const openAdd = () => {
    setEditingMember(null);
    setForm({
      name: '',
      position: '',
      department: selectedDept !== 'All' ? selectedDept : 'Leadership & Board',
      phone: '',
      email: '',
      bio: '',
      image: '',
      order: teamMembers.length + 1
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setFeedbackMsg({ type: '', text: '' });
    setModalOpen(true);
  };

  // Open Edit Modal with database member data
  const openEdit = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name || '',
      position: member.position || member.role || '',
      department: member.department || 'Leadership & Board',
      phone: member.phone || '',
      email: member.email || '',
      bio: member.bio || '',
      image: member.image || '',
      order: member.order || 0
    });
    setPhotoFile(null);
    setPhotoPreview(member.image ? getContentImageUrl(member.image) : '');
    setFeedbackMsg({ type: '', text: '' });
    setModalOpen(true);
  };

  // Handle Photo File Select & Immediate/Draft Upload
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));

    // Upload to server immediately
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success && res.data?.url) {
        setForm((prev) => ({ ...prev, image: res.data.url }));
        setPhotoPreview(getContentImageUrl(res.data.url));
      } else if (res.data?.url) {
        setForm((prev) => ({ ...prev, image: res.data.url }));
        setPhotoPreview(getContentImageUrl(res.data.url));
      }
    } catch (uploadErr) {
      console.warn('Direct upload notice:', uploadErr);
      // fallback to uploading on form submit
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setForm((prev) => ({ ...prev, image: '' }));
  };

  // Save Team Member (Create or Update in MongoDB)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.position) {
      setFeedbackMsg({ type: 'error', text: 'Please fill in Name and Official Role/Position.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedbackMsg({ type: '', text: '' });

      let finalImageUrl = form.image;

      // If photoFile selected but not yet uploaded
      if (photoFile && !finalImageUrl.startsWith('/uploads')) {
        try {
          const fd = new FormData();
          fd.append('file', photoFile);
          const upRes = await api.post('/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (upRes.data?.url) {
            finalImageUrl = upRes.data.url;
          }
        } catch (upErr) {
          console.warn('Form submit photo upload error:', upErr);
        }
      }

      const payload = {
        name: form.name.trim(),
        position: form.position.trim(),
        department: form.department,
        phone: form.phone.trim(),
        email: form.email.trim(),
        bio: form.bio.trim(),
        image: finalImageUrl || '',
        order: Number(form.order) || 0,
        status: 'active'
      };

      if (editingMember) {
        const id = editingMember._id || editingMember.id;
        await api.put(`/team-members/${id}`, payload);
      } else {
        await api.post('/team-members', payload);
      }

      setModalOpen(false);
      fetchTeamMembers();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save team member to database.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Team Member from Database
  const handleDelete = async (member) => {
    const id = member._id || member.id;
    if (!id) return;

    if (
      !window.confirm(
        `Are you sure you want to remove "${member.name}" from the official leadership directory?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/team-members/${id}`);
      fetchTeamMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete member from database.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 sm:py-14 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 shadow-2xs">
              <FiUserCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Leadership, Trustees &amp; Executive Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Management &amp; Board of Directors
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
              National trustees, executive officers, program directors, and departmental heads leading Indian Youth Foundation (Bharatiya Yuva Kranti).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchTeamMembers}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
              title="Refresh from Database"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 text-red-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            {isAdmin && (
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            )}

            {isAdmin && (
              <Link
                href="/dashboard/team-members"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
              >
                <span>Admin Table View</span>
                <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar & Department Filter Tabs */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, position, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 font-medium text-slate-900"
              />
            </div>

            {/* Total Count Badge */}
            <div className="text-xs text-slate-500 font-bold self-end sm:self-auto">
              Showing <strong className="text-slate-900">{filteredMembers.length}</strong> of{' '}
              <strong className="text-slate-900">{teamMembers.length}</strong> Board Members
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DEPARTMENTS.map((dept) => {
              const active = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-7 border border-slate-200 animate-pulse space-y-4"
              >
                <div className="w-28 h-28 rounded-full bg-slate-200 mx-auto"></div>
                <div className="h-5 bg-slate-200 rounded-md w-3/4 mx-auto"></div>
                <div className="h-3 bg-slate-200 rounded-md w-1/2 mx-auto"></div>
                <div className="h-12 bg-slate-100 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              <FiUserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Team Members Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery || selectedDept !== 'All'
                ? 'Try clearing search filters to see all board members.'
                : 'No official board members registered in the database yet.'}
            </p>
            {isAdmin && (
              <button
                onClick={openAdd}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add First Member</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((m) => {
              const photoUrl = m.image
                ? getContentImageUrl(m.image)
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';

              return (
                <div
                  key={m._id || m.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Department Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[200px]">
                      {m.department || 'Leadership & Board'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Member Photo & Basic Details */}
                  <div className="text-center">
                    <div className="relative inline-block mx-auto mb-4">
                      <img
                        src={photoUrl}
                        alt={m.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-red-50 shadow-md group-hover:scale-105 group-hover:border-red-100 transition-all duration-300 bg-slate-100"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                        }}
                      />
                      {isAdmin && (
                        <button
                          onClick={() => openEdit(m)}
                          className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white hover:bg-red-600 transition shadow-md cursor-pointer"
                          title="Change Photo / Edit Member"
                        >
                          <FiCamera className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{m.name}</h3>
                    <span className="text-xs font-bold text-red-600 block mt-0.5">
                      {m.position || m.role}
                    </span>

                    {m.bio && (
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed font-normal line-clamp-3">
                        {m.bio}
                      </p>
                    )}
                  </div>

                  {/* Contact Info & Action Buttons Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          className="flex items-center gap-2 hover:text-red-600 transition"
                        >
                          <FiPhone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span className="font-medium truncate">{m.phone}</span>
                        </a>
                      )}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center gap-2 hover:text-red-600 transition"
                        >
                          <FiMail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-medium truncate">{m.email}</span>
                        </a>
                      )}
                    </div>

                    {/* Admin Edit & Delete Actions */}
                    {isAdmin && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(m)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                          title="Edit Member Information & Photo"
                        >
                          <FiEdit2 className="w-3.5 h-3.5 text-slate-600" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(m)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer"
                          title="Delete from Database"
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

        {/* Add / Edit Team Member Modal with Direct Image Upload */}
        {modalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative my-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2.5 rounded-2xl bg-red-50 text-red-600">
                  <FiUserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {editingMember ? 'Edit Board / Team Member' : 'Add Official Team Member'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saves directly to MongoDB database (`/api/team-members`).
                  </p>
                </div>
              </div>

              {feedbackMsg.text && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                    feedbackMsg.type === 'error'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {feedbackMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Image Upload Area */}
                <div>
                  <label className="font-bold text-slate-900 block mb-1.5">
                    Member Photo / Portrait *
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 hover:border-red-300 transition">
                    {/* Thumbnail Preview */}
                    <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiImage className="w-8 h-8 text-slate-300" />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                          <FiRefreshCw className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Upload Buttons */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer">
                          <FiUploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={handlePhotoSelect}
                            className="hidden"
                          />
                        </label>

                        {photoPreview && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold text-xs transition cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supports JPEG, PNG, WebP up to 15MB. Automatically uploaded to NGO storage.
                      </p>
                    </div>
                  </div>

                  {/* Fallback Image URL Input */}
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Or paste external image URL (https://...)"
                      value={form.image}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, image: e.target.value }));
                        setPhotoPreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Name & Position */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Vikram Sharma"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2.5 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1">
                      Official Role / Position *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Founder & National President"
                      value={form.position}
                      onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2.5 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2.5 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 bg-white"
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="team@bharatiyayuvakranti.org"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2.5 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Brief Bio &amp; Profile</label>
                  <textarea
                    rows={3}
                    placeholder="Brief overview of background, social initiatives, and constitutional responsibilities..."
                    value={form.bio}
                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2.5 border rounded-xl border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || isUploading}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingMember ? 'Update Member' : 'Save to Database'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
