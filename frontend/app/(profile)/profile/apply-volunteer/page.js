'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiUserCheck, 
  FiUploadCloud, 
  FiCheckCircle, 
  FiTrash2,
  FiClock, 
  FiHeart
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { submitVolunteerApplication } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';

export default function ApplyVolunteerPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [skills, setSkills] = useState('Teaching & Social Work');
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [interests, setInterests] = useState('Child Education & Emergency Blood Donation');
  const [whyJoin, setWhyJoin] = useState('');
  
  // Single-API upload state: raw file stored locally until form submission
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('File size must be under 15MB.');
      return;
    }

    setValidationError('');
    setSelectedFile(file);
    setFileName(file.name);

    // Instant local preview without separate network request
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
    setFileName('');
    setValidationError('');
    const fileInput = document.getElementById('volProof');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select an ID proof document or photo before submitting your volunteer application.');
      return;
    }

    setValidationError('');

    try {
      // Single-API call: send form fields and file together in one FormData payload
      const formData = new FormData();
      formData.append('skills', skills);
      formData.append('availability', availability);
      formData.append('interests', interests);
      formData.append('motivation', whyJoin);
      formData.append('whyJoin', whyJoin);
      formData.append('category', 'applications');
      formData.append('file', selectedFile);

      await dispatch(submitVolunteerApplication(formData)).unwrap();
      setSubmitted(true);
    } catch (err) {
      setValidationError(typeof err === 'string' ? err : (err?.message || 'Failed to submit volunteer application'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-black text-black flex items-center gap-2">
          <FiUserCheck className="text-red-600 w-5 h-5" />
          <span>Volunteer Service Enrolment</span>
        </h2>
        <p className="text-xs text-black mt-1 font-medium">
          Join our grassroots volunteer movement. Applications are vetted by field coordinators before official offer letters and badges are dispatched.
        </p>
      </div>

      {submitted ? (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 text-black space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-black text-base text-red-800">
            <FiCheckCircle className="w-5 h-5 text-red-600" />
            <span>Volunteer Application Received!</span>
          </div>
          <p className="text-xs text-black leading-relaxed font-medium">
            Thank you, <strong className="text-black">{currentUser?.name}</strong>. Your voluntary application has been forwarded to our district youth coordination team.
            Upon verification, your <strong>Volunteer Offer Letter</strong> and <strong>Official Volunteer Badge</strong> will be unlocked in your portal and emailed to <code className="text-black font-bold">{currentUser?.email}</code>.
          </p>
          <div className="pt-2">
            <Link
              href="/profile"
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition inline-block shadow-md"
            >
              Back to Profile Overview
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-black mb-1">Key Skills &amp; Capabilities *</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Teaching, First Aid, Event Management..."
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-black bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Availability *</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-black bg-white"
              >
                <option value="Weekends & Evenings">Weekends &amp; Evenings</option>
                <option value="Full-time Volunteer (Daily)">Full-time Volunteer (Daily)</option>
                <option value="Emergency Relief On-Call">Emergency Relief On-Call</option>
                <option value="Online / Remote Assistance">Online / Remote Assistance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Areas of Humanitarian Interest *</label>
            <input
              type="text"
              required
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Slum Child Education, 24x7 Blood Helpline, Women Self-Defense..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-black bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Why do you want to volunteer with {settings?.ngoName || 'Indian Youth Foundation'}? *
            </label>
            <textarea
              rows={3}
              required
              value={whyJoin}
              onChange={(e) => setWhyJoin(e.target.value)}
              placeholder="Tell us about your motivation to serve society..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-black bg-white"
            />
          </div>

          {/* ID Proof File Selection Section with Single-API Architecture */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Upload Identity Document / Student Card / Aadhaar *
            </label>

            {validationError && (
              <div className="mb-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {validationError}
              </div>
            )}

            {!selectedFile ? (
              <div className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center transition bg-slate-50">
                <input
                  type="file"
                  id="volProof"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="volProof" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl shadow-xs">
                    <FiUploadCloud className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-red-600 hover:underline block">
                      Click to Select Identity Document / Photo
                    </span>
                    <span className="text-[11px] text-black font-medium block mt-1">
                      Supported: JPG, PNG, WebP, PDF (Max 15MB) • Uploaded in single application request
                    </span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black">Selected File:</span>
                    <span className="text-xs font-mono text-red-700 font-bold">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Change File</span>
                  </button>
                </div>

                {previewUrl && (
                  <div className="relative max-w-sm mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="ID Proof Preview"
                      className="w-full max-h-56 object-contain rounded-lg mx-auto"
                    />
                    <div className="mt-2 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5">
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>File ready to be submitted with application</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-black font-semibold">
              All credentials are cryptographically stamped upon committee audit.
            </span>
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-black text-xs shadow-md shadow-red-600/25 transition flex items-center gap-2 cursor-pointer"
            >
              <FiUserCheck className="w-4 h-4" />
              <span>
                {loading 
                  ? 'Submitting Application...' 
                  : (!selectedFile 
                      ? 'Select ID Proof to Submit' 
                      : 'Submit Volunteer Application')}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
