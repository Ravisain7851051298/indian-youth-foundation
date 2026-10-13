'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUserPlus, 
  FiCheckCircle, 
  FiShield, 
  FiHeart, 
  FiUser, 
  FiPhone, 
  FiMail,
  FiLock,
  FiMapPin,
  FiImage
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

function VolunteerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const { registerUser, settings } = useNGO();

  const [role, setRole] = useState('Volunteer'); // Volunteer or Member
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('Active Volunteer');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dob, setDob] = useState('2000-01-01');
  const [district, setDistrict] = useState('Aligarh');
  const [state, setState] = useState('Uttar Pradesh');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [referredBy, setReferredBy] = useState(refCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await registerUser({
      name,
      email,
      phone,
      password,
      role, // 'Volunteer' or 'Member'
      designation: role === 'Volunteer' ? 'Active Volunteer' : 'Registered Member',
      bloodGroup,
      dob,
      district,
      state,
      address,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      referredBy: referredBy || null
    });

    setLoading(false);

    if (res.success) {
      router.push('/profile');
    } else {
      setError(res.message || 'Error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <FiUserPlus className="w-3.5 h-3.5" />
            <span>Join Our Social Mission</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Membership & Volunteer Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Join Indian Youth Foundation to lead community action in child education, blood donation, healthcare, and nation building.
          </p>
        </div>

        {refCode && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You are joining via verified referral invitation: <strong className="font-mono text-emerald-950 font-bold">{refCode}</strong></span>
            </span>
            <span className="font-bold text-[11px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
              Referral Verified
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Role Selection: Volunteer or Member */}
            <div>
              <label className="font-bold text-slate-800 block mb-2 text-sm">Select Your Role *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition ${
                  role === 'Volunteer' ? 'border-orange-500 bg-orange-50/60 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="rolePicker"
                    className="sr-only"
                    checked={role === 'Volunteer'}
                    onChange={() => setRole('Volunteer')}
                  />
                  <FiHeart className="w-6 h-6 text-orange-600 mb-2" />
                  <span className="font-extrabold text-sm text-slate-900">Volunteer</span>
                  <span className="text-[11px] text-slate-500 mt-1">Field action, social drives, relief distribution & events</span>
                </label>

                <label className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition ${
                  role === 'Member' ? 'border-orange-500 bg-orange-50/60 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="rolePicker"
                    className="sr-only"
                    checked={role === 'Member'}
                    onChange={() => setRole('Member')}
                  />
                  <FiUser className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="font-extrabold text-sm text-slate-900">Member</span>
                  <span className="text-[11px] text-slate-500 mt-1">Official Digital ID Card, appointment letter & annual membership</span>
                </label>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Mobile Phone (WhatsApp) *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Create Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Blood Group, DOB & District */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-bold"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Date of Birth (DOB)</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">District / City</label>
                <input
                  type="text"
                  placeholder="Jaipur"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                />
              </div>
            </div>

            {/* Residential Address */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Residential Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="House No, Street, Colony, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Passport Photo URL (for Digital ID Card)</label>
              <div className="relative">
                <FiImage className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                * This photograph will be printed on your official Digital ID Card with QR verification code.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Registering member...</span>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Submit Registration & Generate Digital ID Card</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VolunteerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading registration form...</div>}>
      <VolunteerContent />
    </Suspense>
  );
}
