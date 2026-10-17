'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiUser,
  FiImage,
  FiUploadCloud,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiEye,
  FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function PresidentMessageManagement() {
  const { settings, updateSettings, uploadFile } = useNGO();

  const [title, setTitle] = useState(settings?.presidentMessageTitle || 'President Message');
  const [photoUrl, setPhotoUrl] = useState(settings?.presidentPhotoUrl || '');
  const [presidentName, setPresidentName] = useState(settings?.presidentName || 'Ravi Saini (National President & Trustee)');
  const [content, setContent] = useState(
    settings?.presidentMessageContent ||
      `Dear Friends,

It is with great pride and humility that I address you as the President of Samasya Samadhan Parishadh (SSP). Since our founding 2022, our organization has been driven by a simple yet profound belief: that every individual, regardless of circumstance, deserves the opportunity to thrive.

At Samasya Samadhan Parishadh (SSP), we are not just dreamers; we are doers. We roll up our sleeves and work tirelessly to turn our vision of a better world into reality. From providing access to education and healthcare to championing environmental sustainability and social justice, our efforts are guided by a deep commitment to making a meaningful difference in the lives of others.

But we cannot do it alone. Our success is built on the support of passionate individuals like you—individuals who share our values and our vision for a brighter future. Together, we can amplify our impact and create lasting change that reverberates far beyond our borders.

As we look to the future, I am filled with hope and optimism. The challenges we face are great, but so too is our resolve to overcome them. With your continued support, I am confident that we can build a world where every person has the opportunity to flourish and thrive.

Thank you for your unwavering commitment to our cause. Together, we are truly making a difference.`
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.presidentMessageTitle) setTitle(settings.presidentMessageTitle);
      if (settings.presidentPhotoUrl) setPhotoUrl(settings.presidentPhotoUrl);
      if (settings.presidentName) setPresidentName(settings.presidentName);
      if (settings.presidentMessageContent) setContent(settings.presidentMessageContent);
    }
  }, [settings]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image size exceeds 15MB limit');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadFile(file, 'general');
      if (res?.success && res.url) {
        setPhotoUrl(res.url);
        toast.success('President portrait uploaded successfully!');
      } else {
        toast.error(res?.message || 'Failed to upload photo');
      }
    } catch (err) {
      toast.error('Photo upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSavedSuccess(false);

      const payload = {
        presidentMessageTitle: title.trim(),
        presidentPhotoUrl: photoUrl.trim(),
        presidentName: presidentName.trim(),
        presidentMessageContent: content.trim()
      };

      const res = await updateSettings(payload);
      if (res?.success) {
        setSavedSuccess(true);
        toast.success('President message & portrait updated live on homepage!');
      } else {
        toast.error(res?.message || 'Failed to update settings');
      }
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 text-slate-800 font-sans">
      
      {/* Top Header Row */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0b8026] text-xs font-black mb-2 border border-emerald-200">
            <FiUser className="w-3.5 h-3.5" />
            <span>Executive Leadership Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            President Message &amp; Photo Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update the President&apos;s executive address, formal portrait, and signatory details rendered on the homepage and header.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/#president-message"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>Preview on Home</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b8026] hover:bg-[#09661f] text-white text-xs font-black shadow-md shadow-[#0b8026]/20 transition disabled:opacity-50 cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Live'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Success! President message and portrait updated live across the entire website.</span>
        </div>
      )}

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Input Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1.5">
              Section Title (Pill Badge)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="President Message"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0b8026] text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1.5">
              President Full Name &amp; Designation
            </label>
            <input
              type="text"
              required
              value={presidentName}
              onChange={(e) => setPresidentName(e.target.value)}
              placeholder="Ravi Saini (National President & Trustee)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0b8026] text-slate-900"
            />
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-900">
              President Official Portrait Image
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-2xs shrink-0 flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={getContentImageUrl(photoUrl)}
                    alt="President Portrait"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logo.jpeg';
                    }}
                  />
                ) : (
                  <FiUser className="w-10 h-10 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b8026] hover:bg-[#09661f] text-white text-xs font-bold transition cursor-pointer shadow-xs">
                    <FiUploadCloud className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Recommended size: Square 600x600px or 4:3 high-resolution portrait. Supports JPG, PNG, WEBP up to 15MB.
                </p>

                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Or enter direct image URL..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] font-mono text-slate-700 bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Letter / Message Body */}
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1.5">
              Message Content / Executive Letter (Paragraphs supported)
            </label>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear Friends, write message..."
              className="w-full p-4 rounded-2xl border border-slate-300 text-xs leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-[#0b8026] text-slate-900 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl bg-[#0b8026] hover:bg-[#09661f] text-white text-xs font-black shadow-lg shadow-[#0b8026]/20 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Publishing Updates...' : 'Publish Message to Homepage'}</span>
          </button>
        </form>

        {/* Right: Live Preview Box matching homepage UI */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FiEye className="text-[#0b8026]" />
              <span>Homepage Preview Mockup</span>
            </h3>
            <span className="text-[10px] font-extrabold text-[#d50000] bg-white px-2.5 py-0.5 rounded-full border border-red-200">
              {title || 'President Message'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 rounded-2xl border border-slate-200 p-1 bg-white shadow-xs shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={getContentImageUrl(photoUrl) || '/logo.jpeg'}
                  alt="President Portrait"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/logo.jpeg';
                  }}
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500">Signatory Authority</p>
                <h4 className="text-sm font-black text-[#0b8026] leading-tight mt-0.5">
                  {presidentName}
                </h4>
                <p className="text-[10px] text-slate-600 mt-1">
                  {settings?.ngoName || 'Samasya Samadhan Parishad (SSP)'}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 text-xs text-slate-700 leading-relaxed max-h-96 overflow-y-auto space-y-2 pr-1">
              <p className="font-bold text-slate-900">Dear Friends,</p>
              <div className="whitespace-pre-line text-[11px]">
                {content}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="font-semibold text-slate-800 text-[11px]">Warm regards,</p>
                <p className="font-black text-[#0b8026] text-xs">
                  {settings?.ngoName || 'Samasya Samadhan Parishad (SSP)'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
