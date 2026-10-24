'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiUserCheck,
  FiUploadCloud,
  FiCheckCircle,
  FiTrash2,
  FiClock,
  FiHeart,
  FiCamera,
  FiUser,
  FiFileText,
  FiShield,
  FiAlertTriangle
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

  // Guest applicant fields (active when user is not signed in)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestBloodGroup, setGuestBloodGroup] = useState('O+');
  const [guestDistrict, setGuestDistrict] = useState('Aligarh');
  const [guestState, setGuestState] = useState('Uttar Pradesh');

  // KYC Verification Documents & User Photo State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [docFrontFile, setDocFrontFile] = useState(null);
  const [docFrontPreview, setDocFrontPreview] = useState('');
  const [docBackFile, setDocBackFile] = useState(null);
  const [docBackPreview, setDocBackPreview] = useState('');

  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // File Handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Applicant photo size must be under 10MB.');
      return;
    }
    setValidationError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoPreview('');
    setPhotoFile(null);
    const input = document.getElementById('volPhotoInput');
    if (input) input.value = '';
  };

  const handleDocFrontSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Document Front image must be under 15MB.');
      return;
    }
    setValidationError('');
    setDocFrontFile(file);
    setDocFrontPreview(URL.createObjectURL(file));
  };

  const handleRemoveDocFront = () => {
    if (docFrontPreview && docFrontPreview.startsWith('blob:')) URL.revokeObjectURL(docFrontPreview);
    setDocFrontPreview('');
    setDocFrontFile(null);
    const input = document.getElementById('volDocFrontInput');
    if (input) input.value = '';
  };

  const handleDocBackSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('Document Back image must be under 15MB.');
      return;
    }
    setValidationError('');
    setDocBackFile(file);
    setDocBackPreview(URL.createObjectURL(file));
  };

  const handleRemoveDocBack = () => {
    if (docBackPreview && docBackPreview.startsWith('blob:')) URL.revokeObjectURL(docBackPreview);
    setDocBackPreview('');
    setDocBackFile(null);
    const input = document.getElementById('volDocBackInput');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser && (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim())) {
      setValidationError('Please provide your Full Legal Name, Email Address, and 10-digit Mobile Number.');
      return;
    }

    if (!photoFile && !currentUser?.photoUrl) {
      setValidationError('Please upload applicant user photo / profile picture.');
      return;
    }

    if (!docFrontFile) {
      setValidationError(`Please upload the FRONT side scan/photo of your ${documentType}.`);
      return;
    }

    if (!docBackFile) {
      setValidationError(`Please upload the BACK side scan/photo of your ${documentType}.`);
      return;
    }

    setValidationError('');

    try {
      const formData = new FormData();
      formData.append('name', currentUser ? currentUser.name : guestName.trim());
      formData.append('email', currentUser ? currentUser.email : guestEmail.trim());
      formData.append('phone', currentUser ? currentUser.phone : guestPhone.trim());
      formData.append('bloodGroup', currentUser?.bloodGroup || guestBloodGroup);
      formData.append('district', currentUser?.district || guestDistrict);
      formData.append('state', currentUser?.state || guestState);
      formData.append('skills', skills);
      formData.append('availability', availability);
      formData.append('interests', interests);
      formData.append('motivation', whyJoin);
      formData.append('whyJoin', whyJoin);
      formData.append('category', 'applications');

      // Append Verification Documents
      formData.append('documentType', documentType);
      if (photoFile) formData.append('photo', photoFile);
      if (docFrontFile) {
        formData.append('documentFront', docFrontFile);
      }
      if (docBackFile) formData.append('documentBack', docBackFile);

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
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 text-black space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 font-black text-base text-red-800">
            <FiCheckCircle className="w-5 h-5 text-red-600" />
            <span>Volunteer Application Received Successfully!</span>
          </div>
          <p className="text-xs text-black leading-relaxed font-medium">
            Thank you, <strong className="text-black">{currentUser?.name || guestName}</strong>! Your voluntary application and verification documents have been forwarded to the Trustee Verification Desk.
          </p>
          <div className="bg-white p-4 rounded-2xl border border-red-200 text-xs text-slate-800 space-y-1.5">
            <p className="font-bold text-red-700">📧 Next Steps Upon Admin Approval:</p>
            <p>1. When the Admin approves your application, your <strong>Official Portal Login Credentials (Email &amp; Temporary Password)</strong> will be emailed to <code className="text-black font-bold">{currentUser?.email || guestEmail}</code>.</p>
            <p>2. Your <strong>Official Volunteer Offer Letter</strong> and <strong>Verifiable Digital Badge</strong> will be attached to the email for immediate download.</p>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition inline-block shadow-md"
            >
              Back to Home
            </Link>
            <Link
              href="/login?role=volunteer"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs hover:bg-slate-100 transition inline-block"
            >
              Go to Volunteer Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-start gap-3 shadow-sm">
              <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-black text-sm text-rose-950">कृपया आवश्यक जानकारी पूर्ण करें</p>
                <p className="mt-0.5 text-xs text-rose-800 font-medium">{validationError}</p>
              </div>
            </div>
          )}

          {/* Guest User Information Inputs */}
          {!currentUser && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-red-700">
                  This Email ID is used for sending offer letter and id verification mails
                </span>
                <Link href="/login?role=volunteer&redirect=/apply-volunteer" className="text-xs font-bold text-blue-600 hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-black mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Legal full name"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Credentials will be sent here"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-black mb-1">Blood Group</label>
                  <select
                    value={guestBloodGroup}
                    onChange={(e) => setGuestBloodGroup(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">District / City</label>
                  <input
                    type="text"
                    value={guestDistrict}
                    onChange={(e) => setGuestDistrict(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">State</label>
                  <input
                    type="text"
                    value={guestState}
                    onChange={(e) => setGuestState(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: APPLICANT USER PHOTO & KYC DUAL-SIDED DOCUMENT UPLOADS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-[#0b8026] text-white flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Volunteer Photo &amp; Government ID Verification (KYC)</span>
            </div>

            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-6">

              {/* Row A: User Photo Upload */}
              <div className="border-b border-slate-200 pb-5">
                <label className="text-xs font-bold text-black mb-2 flex items-center gap-1.5">
                  <FiCamera className="text-[#0b8026] w-4 h-4" />
                  <span>Applicant Passport Size Photo / Profile Picture *</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Photo Preview Circle */}
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#0b8026] p-1 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Applicant Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="volPhotoInput"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label
                        htmlFor="volPhotoInput"
                        className="px-4 py-2 rounded-xl bg-[#0b8026] hover:bg-[#075018] text-white font-bold text-xs cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <FiUploadCloud className="w-4 h-4" />
                        <span>{photoFile ? 'Change Photo' : 'Upload Volunteer Photo'}</span>
                      </label>
                      {photoFile && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs transition cursor-pointer border border-slate-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Clear frontal passport photograph (JPG, PNG, WEBP up to 10MB). Used for issuing your volunteer appointment badge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row B: Document Type Selection */}
              <div>
                <label className="text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                  <FiShield className="text-[#0b8026] w-4 h-4" />
                  <span>Select Government Verification Document Type *</span>
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full sm:max-w-md p-3 text-xs border border-slate-300 rounded-xl bg-white font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#0b8026]"
                >
                  <option value="Aadhaar Card">Aadhaar Card (आधार कार्ड)</option>
                  <option value="PAN Card">PAN Card (पैन कार्ड)</option>
                  <option value="Voter ID Card">Voter ID Card (मतदाता पहचान पत्र)</option>
                  <option value="Driving License">Driving License (ड्राइविंग लाइसेंस)</option>
                  <option value="Passport">Passport (पासपोर्ट)</option>
                  <option value="College / Student ID">College / Student ID (छात्र पहचान पत्र)</option>
                  <option value="Other Government ID">Other Government Recognized Photo ID</option>
                </select>
              </div>

              {/* Row C: Dual-Sided Document Uploads (Front & Back) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">

                {/* 1. FRONT SIDE UPLOAD */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black flex items-center gap-1.5">
                      <FiFileText className="text-[#0b8026] w-3.5 h-3.5" />
                      <span>{documentType} - FRONT Side *</span>
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-100 text-[#0b8026]">
                      Front Side (सामने)
                    </span>
                  </div>

                  {!docFrontFile ? (
                    <div className="border-2 border-dashed border-slate-300 hover:border-[#0b8026] rounded-xl p-5 text-center transition bg-slate-50 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        id="volDocFrontInput"
                        onChange={handleDocFrontSelect}
                        className="hidden"
                      />
                      <label htmlFor="volDocFrontInput" className="cursor-pointer space-y-2 block">
                        <FiUploadCloud className="w-8 h-8 text-[#0b8026] mx-auto" />
                        <div>
                          <span className="text-xs font-bold text-[#0b8026] hover:underline block">
                            Click to upload Front Side Scan
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Clear photo or scan (JPG, PNG up to 15MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 truncate max-w-50">{docFrontFile.name}</span>
                        <button
                          type="button"
                          onClick={handleRemoveDocFront}
                          className="text-rose-600 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                      {docFrontPreview && (
                        <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50 max-h-40 flex items-center justify-center">
                          <img src={docFrontPreview} alt="Document Front Preview" className="max-h-40 w-auto object-contain" />
                        </div>
                      )}
                      <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Front Side Attached Successfully</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. BACK SIDE UPLOAD */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black flex items-center gap-1.5">
                      <FiFileText className="text-[#dc2626] w-3.5 h-3.5" />
                      <span>{documentType} - BACK Side *</span>
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-red-100 text-red-700">
                      Back Side (पीछे)
                    </span>
                  </div>

                  {!docBackFile ? (
                    <div className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-5 text-center transition bg-slate-50 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        id="volDocBackInput"
                        onChange={handleDocBackSelect}
                        className="hidden"
                      />
                      <label htmlFor="volDocBackInput" className="cursor-pointer space-y-2 block">
                        <FiUploadCloud className="w-8 h-8 text-red-600 mx-auto" />
                        <div>
                          <span className="text-xs font-bold text-red-600 hover:underline block">
                            Click to upload Back Side Scan
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Clear photo or scan (JPG, PNG up to 15MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-red-200 bg-white p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 truncate max-w-50">{docBackFile.name}</span>
                        <button
                          type="button"
                          onClick={handleRemoveDocBack}
                          className="text-rose-600 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                      {docBackPreview && (
                        <div className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50 max-h-40 flex items-center justify-center">
                          <img src={docBackPreview} alt="Document Back Preview" className="max-h-40 w-auto object-contain" />
                        </div>
                      )}
                      <div className="text-[10px] text-red-700 font-bold flex items-center gap-1">
                        <FiCheckCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Back Side Attached Successfully</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* STEP 2: VOLUNTEER SKILLS & PREFERENCES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Volunteer Skills &amp; Preferences</span>
            </div>

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
                Why do you want to volunteer with {settings?.ngoName || 'Yuva Kranti Dal'}? *
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
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-black font-semibold">
              All credentials and identity records are cryptographically stamped upon committee audit.
            </span>
            <button
              type="submit"
              disabled={loading || (!photoFile && !currentUser?.photoUrl) || !docFrontFile || !docBackFile}
              className="px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-black text-xs shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiUserCheck className="w-4 h-4" />
              <span>
                {loading
                  ? 'Submitting Application & Documents...'
                  : (!docFrontFile || !docBackFile
                    ? 'Attach Verification Documents to Submit'
                    : 'Submit Volunteer Application')}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
