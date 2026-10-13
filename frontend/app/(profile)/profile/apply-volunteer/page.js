'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiUserCheck, 
  FiUploadCloud, 
  FiCheckCircle, 
  FiShield, 
  FiClock, 
  FiHeart,
  FiMapPin
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { submitVolunteerApplication } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ApplyVolunteerPage() {
  const dispatch = useDispatch();
  const { loading, successMessage } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [skills, setSkills] = useState('Teaching & Social Work');
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [interests, setInterests] = useState('Child Education & Emergency Blood Donation');
  const [whyJoin, setWhyJoin] = useState('');
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofUrl, setIdProofUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setIdProofUrl(res.data.url);
        setIdProofFile(file.name);
      } else {
        alert(res.data.message || 'Upload failed');
      }
    } catch (err) {
      alert('Failed to upload ID proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(submitVolunteerApplication({
        skills,
        availability,
        interests,
        idProofUrl,
        whyJoin
      })).unwrap();

      setSubmitted(true);
    } catch (err) {
      alert(err || 'Failed to submit application');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <FiUserCheck className="text-emerald-600 w-5 h-5" />
          <span>Volunteer Service Enrolment</span>
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Join our grassroots volunteer movement. Applications are vetted by field coordinators before official offer letters are dispatched.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-emerald-900 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-black text-base text-emerald-800">
            <FiCheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Volunteer Application Received!</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Thank you, <strong>{currentUser?.name}</strong>. Your voluntary interest has been forwarded to our district youth coordination team.
            Upon review, your <strong>Volunteer Offer Letter</strong> and <strong>Official Volunteer Badge</strong> will be emailed to <code>{currentUser?.email}</code>.
          </p>
          <div className="pt-2">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition inline-block"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Key Skills &amp; Capabilities *</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Teaching, First Aid, Event Management..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Availability *</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Weekends & Evenings">Weekends &amp; Evenings</option>
                <option value="Full-time Volunteer (Daily)">Full-time Volunteer (Daily)</option>
                <option value="Emergency Relief On-Call">Emergency Relief On-Call</option>
                <option value="Online / Remote Assistance">Online / Remote Assistance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Areas of Humanitarian Interest *</label>
            <input
              type="text"
              required
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Slum Child Education, 24x7 Blood Helpline, Women Self-Defense..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Why do you want to volunteer with Indian Youth Foundation?
            </label>
            <textarea
              rows={3}
              value={whyJoin}
              onChange={(e) => setWhyJoin(e.target.value)}
              placeholder="Tell us about your motivation to serve society..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Upload Identity Document / Student Card (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center transition bg-slate-50">
              <input
                type="file"
                id="volProof"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="volProof" className="cursor-pointer space-y-1 block">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  {uploading ? '⏳' : <FiUploadCloud />}
                </div>
                <span className="text-xs font-bold text-emerald-600 hover:underline block">
                  {uploading ? 'Uploading...' : 'Attach ID Proof / Aadhaar / College ID'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {idProofFile ? `File: ${idProofFile}` : 'JPG, PNG up to 5MB'}
                </span>
              </label>

              {idProofUrl && (
                <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-lg inline-block border border-emerald-200">
                  ✓ Document attached
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
            >
              {loading ? 'Submitting...' : 'Submit Volunteer Application'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
