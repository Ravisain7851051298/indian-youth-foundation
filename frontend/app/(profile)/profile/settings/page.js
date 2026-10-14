'use client';

import React, { useState } from 'react';
import { FiUser, FiSave, FiCheckCircle, FiAlertCircle, FiCamera, FiPhone, FiMapPin, FiTrash2 } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ProfileSettingsPage() {
  const { currentUser, setCurrentUser, uploadFile, deleteFile } = useNGO();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bloodGroup: currentUser?.bloodGroup || 'O+',
    dob: currentUser?.dob || '',
    address: currentUser?.address || '',
    district: currentUser?.district || 'Aligarh',
    state: currentUser?.state || 'Uttar Pradesh',
    photoUrl: currentUser?.photoUrl || ''
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const res = await uploadFile(file, 'avatars');
      if (res.success && res.url) {
        setForm(prev => ({ ...prev, photoUrl: res.url }));
        setMessage('Photo uploaded to avatars directory! Click Save Profile to apply changes.');
      } else {
        setError(res.message || 'Failed to upload photo');
      }
    } catch (err) {
      setError('Upload error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (form.photoUrl && (form.photoUrl.includes('/uploads/') || form.photoUrl.startsWith('uploads/'))) {
      if (deleteFile) await deleteFile(form.photoUrl);
      else await api.delete('/upload', { data: { url: form.photoUrl } }).catch(() => {});
    }
    setForm(prev => ({ ...prev, photoUrl: '' }));
    setMessage('Photo removed. Click Save Profile to apply changes.');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const res = await api.put('/auth/profile', form);
      if (res.data.success) {
        setMessage('Profile details updated successfully!');
        if (setCurrentUser) {
          setCurrentUser(prev => ({ ...prev, ...res.data.user }));
        }
      } else {
        setError(res.data.message || 'Update failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
            <FiUser className="w-3.5 h-3.5" />
            <span>Personal Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Account & Identity Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update your registered credentials, contact details, and ID card passport photo.
          </p>
        </div>
      </div>

      <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        {message && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Photo Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative w-24 h-24 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'}
                alt={form.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-red-500 shadow-md"
              />
              <label className="absolute -bottom-2 -right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg cursor-pointer transition">
                <FiCamera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900">Official ID Passport Photograph</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {uploading ? 'Uploading new photo to server...' : 'Upload a clear passport portrait photograph. Appears on your dual-sided ID card.'}
              </p>
              {form.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">District / City</label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="Aligarh"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Uttar Pradesh"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Postal Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="House No, Street, Landmark..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg shadow-red-600/20 cursor-pointer disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
