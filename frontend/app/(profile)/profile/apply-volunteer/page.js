'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiUserCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiCopy,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { submitVolunteerApplication } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';

export default function ApplyVolunteerPage() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  // Applicant fields - Always blank for fresh applicant entry (no autofill)
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantBloodGroup, setApplicantBloodGroup] = useState('O+');
  const [applicantDistrict, setApplicantDistrict] = useState('Aligarh');
  const [applicantState, setApplicantState] = useState('Uttar Pradesh');

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

  const isFormValid = applicantName.trim().length > 0 && applicantPhone.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim() || applicantPhone.trim().length < 10) {
      setValidationError('Please provide your Full Legal Name and a valid 10-digit Mobile Number.');
      return;
    }

    setValidationError('');

    try {
      const formData = new FormData();
      formData.append('name', applicantName.trim());
      formData.append('email', applicantEmail.trim());
      formData.append('phone', applicantPhone.trim());
      formData.append('bloodGroup', applicantBloodGroup);
      formData.append('district', applicantDistrict);
      formData.append('state', applicantState);
      formData.append('skills', 'Social Work & Community Outreach');
      formData.append('availability', 'Weekends & Evenings');
      formData.append('interests', 'Social Welfare & Field Work');
      formData.append('motivation', 'Community Service');
      formData.append('whyJoin', 'Community Service');
      formData.append('category', 'applications');

      const res = await dispatch(submitVolunteerApplication(formData)).unwrap();

      const creds = res?.credentials || {
        id: res?.application?.assignedVolunteerId || 'Pending Assignment',
        password: applicantPhone.trim(),
        email: applicantEmail.trim(),
        name: applicantName.trim()
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
            Thank you, <strong className="text-black">{createdCredentials?.name || applicantName}</strong>! Your volunteer profile has been registered and forwarded to the Trustee Verification Desk.
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
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Password (4-Digit PIN)</span>
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
                You can use this 10-Digit Volunteer ID or your Email along with your 4-Digit Password to log in anytime. You can also add or update your email address anytime from your profile settings.
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

          {/* Applicant Details Section - Always blank for fresh applicant entry */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0b8026]">
                Applicant Personal Information (Email is optional)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Enter applicant details below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-black mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
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
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="e.g. name@domain.com (optional)"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-black mb-1">Blood Group</label>
                <select
                  value={applicantBloodGroup}
                  onChange={(e) => setApplicantBloodGroup(e.target.value)}
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
                  value={applicantDistrict}
                  onChange={(e) => setApplicantDistrict(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                />
              </div>
              <div>
                <label className="block font-bold text-black mb-1">State</label>
                <input
                  type="text"
                  value={applicantState}
                  onChange={(e) => setApplicantState(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT VOLUNTEER ENROLMENT */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              💡 <strong>Instant Volunteer Registration:</strong> Profile photo, volunteer interests, and skills can be updated anytime from your <strong>Profile Settings</strong> after logging in.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-black font-semibold">
                Official Volunteer ID &amp; Password will be generated immediately upon submission.
              </span>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-black text-xs shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiUserCheck className="w-4 h-4" />
                <span>
                  {loading ? 'Submitting Application...' : 'Apply as Volunteer & Get Volunteer ID'}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* POPUP MODAL DISPLAYING ASSIGNED VOLUNTEER ID & PASSWORD */}
      {showModal && createdCredentials && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#0b8026] via-[#08661e] to-[#dc2626]" />

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
                Please note down your official login credentials. You can login right now using your 10-Digit ID or Email and your 4-Digit Password!
              </p>
            </div>

            {/* Credentials Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 mb-6">
              {/* Volunteer ID */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Official Volunteer ID (10-Digit ID)</span>
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
                  <span className="text-red-600 font-extrabold text-[10px]">Your 4-Digit Password</span>
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
              💡 <strong>Instant Access:</strong> You can log in immediately using your <strong>10-Digit Volunteer ID ({createdCredentials.id})</strong> or <strong>Email/Phone</strong> and your <strong>4-Digit Password ({createdCredentials.password})</strong>. You can also add or update your email address in your profile after signing in.
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
