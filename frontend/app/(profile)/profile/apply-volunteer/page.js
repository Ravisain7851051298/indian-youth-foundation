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
  FiAlertTriangle,
  FiCopy,
  FiCheck,
  FiX,
  FiLock,
  FiKey
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

  // Applicant Photo State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyToClipboard = (text, type) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else if (type === 'pass') {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser && (!guestName.trim() || !guestPhone.trim())) {
      setValidationError('Please provide your Full Legal Name and 10-digit Mobile Number.');
      return;
    }

    if (!photoFile && !currentUser?.photoUrl) {
      setValidationError('Please upload applicant user photo / profile picture.');
      return;
    }

    setValidationError('');

    try {
      const formData = new FormData();
      formData.append('name', currentUser ? currentUser.name : guestName.trim());
      formData.append('email', currentUser ? (currentUser.email || '') : (guestEmail.trim() || ''));
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

      // Append Profile Photo
      if (photoFile) formData.append('photo', photoFile);

      const res = await dispatch(submitVolunteerApplication(formData)).unwrap();

      const creds = res?.credentials || {
        id: res?.application?.assignedVolunteerId || 'BYK-VOL-PENDING',
        password: (currentUser ? currentUser.phone : guestPhone.trim()),
        email: (currentUser ? (currentUser.email || '') : (guestEmail.trim() || ''))
      };

      setCreatedCredentials(creds);
      setShowModal(true);
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
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 text-black space-y-5 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center gap-3 font-black text-lg text-emerald-800">
            <FiCheckCircle className="w-7 h-7 text-[#0b8026] shrink-0" />
            <span>Volunteer Application Received Successfully!</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Thank you, <strong className="text-black">{currentUser?.name || guestName}</strong>! Your volunteer profile has been registered and forwarded to the Trustee Verification Desk.
          </p>

          {createdCredentials && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Your Official Login Credentials</span>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-xs font-bold text-[#0b8026] hover:underline cursor-pointer"
                >
                  View Popup Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Volunteer ID</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-black text-sm text-[#0b8026]">{createdCredentials.id}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdCredentials.id, 'id')}
                      className="text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
                    >
                      {copiedId ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Password (Your Phone Number)</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-black text-sm text-slate-900">{createdCredentials.password}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdCredentials.password, 'pass')}
                      className="text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
                    >
                      {copiedPass ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                You can use this ID or your Email along with your Mobile Number as Password to log in anytime. You can also add or update your email address anytime from your profile settings.
              </p>
            </div>
          )}

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-slate-800 space-y-1.5">
            <p className="font-bold text-[#0b8026]">Next Steps Upon Admin Review:</p>
            <p>1. Your voluntary service profile is now accessible via the portal.</p>
            <p>2. Upon statutory verification, your <strong>Official Volunteer Badge</strong> and <strong>Appointment Letter</strong> will unlock for instant download.</p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/login?role=volunteer"
              className="px-6 py-2.5 rounded-xl bg-[#0b8026] hover:bg-[#08661e] text-white font-bold text-xs transition inline-block shadow-md"
            >
              Sign In to Volunteer Portal
            </Link>
            <Link
              href="/profile"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs hover:bg-slate-100 transition inline-block"
            >
              Go to Profile
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition inline-block"
            >
              Back to Home
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
                <span className="text-xs font-black uppercase tracking-wider text-[#0b8026]">
                  Email is optional. You can also add or update email from your profile.
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-black">Email Address</label>
                    <span className="text-[10px] text-slate-500 font-semibold">(Optional)</span>
                  </div>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. name@domain.com (optional)"
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

          {/* STEP 1: APPLICANT USER PHOTO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-[#0b8026] text-white flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Volunteer Photo &amp; Profile Verification</span>
            </div>

            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-6">

              {/* User Photo Upload */}
              <div>
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
              disabled={loading || (!photoFile && !currentUser?.photoUrl)}
              className="px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-black text-xs shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiUserCheck className="w-4 h-4" />
              <span>
                {loading ? 'Submitting Application...' : 'Submit Volunteer Application'}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* POPUP MODAL DISPLAYING ASSIGNED VOLUNTEER ID & PASSWORD */}
      {showModal && createdCredentials && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0b8026] via-[#08661e] to-[#dc2626]" />

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <FiCheckCircle className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Application Submitted &amp; Account Created
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Your Volunteer ID &amp; Password
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Please note down your official login credentials. You can login right now using your ID or Email and your Phone Number as Password!
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 mb-6">
              {/* Volunteer ID */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Volunteer ID (Username)</span>
                  <span className="text-[#0b8026] font-extrabold text-[10px]">Use this to log in</span>
                </div>
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-xs">
                  <span className="font-mono font-black text-sm sm:text-base text-[#0b8026] tracking-wide">
                    {createdCredentials.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdCredentials.id, 'id')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0b8026] text-xs font-bold transition border border-emerald-200 cursor-pointer"
                  >
                    {copiedId ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-red-600 font-extrabold text-[10px]">Your Mobile Number</span>
                </div>
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-300 shadow-xs">
                  <span className="font-mono font-black text-sm sm:text-base text-slate-900 tracking-wide">
                    {createdCredentials.password}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdCredentials.password, 'pass')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    {copiedPass ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                    <span>{copiedPass ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Registered Email */}
              <div className="pt-1 text-xs">
                <span className="text-slate-500 font-bold">Registered Email: </span>
                <span className="font-medium text-slate-800">
                  {createdCredentials.email || 'None (You can add your email anytime from your profile settings)'}
                </span>
              </div>
            </div>

            {/* Explanatory Info */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-[11px] text-emerald-950 leading-relaxed mb-6">
              💡 <strong>Instant Access:</strong> You can log in immediately using your <strong>Volunteer ID ({createdCredentials.id})</strong> or <strong>Email</strong> and your <strong>Mobile Number ({createdCredentials.password})</strong> as Password. You can also add or update your email address in your profile after signing in.
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/login?role=volunteer"
                className="w-full sm:flex-1 py-3 rounded-xl bg-[#0b8026] hover:bg-[#08661e] text-white text-center font-extrabold text-xs shadow-md transition"
              >
                Sign In to Volunteer Portal
              </Link>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
