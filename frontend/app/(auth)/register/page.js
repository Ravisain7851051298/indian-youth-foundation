'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiEye, 
  FiEyeOff, 
  FiMapPin, 
  FiShield, 
  FiArrowRight,
  FiDroplet,
  FiUserPlus
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/profile';
  const { registerUser, settings } = useNGO();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('Aligarh');
  const [state, setState] = useState('Uttar Pradesh');
  const [bloodGroup, setBloodGroup] = useState('O+');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password match & strength calculations
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isPasswordLongEnough = password.length >= 6;

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '' };
    if (password.length < 6) return { text: 'Too Short (Min 6 chars)', color: 'text-rose-400' };
    const hasNum = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && hasNum && hasSpecial) return { text: 'Strong Password', color: 'text-emerald-400' };
    if (password.length >= 6 && (hasNum || hasSpecial)) return { text: 'Medium Password', color: 'text-amber-400' };
    return { text: 'Weak Password', color: 'text-yellow-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      confirmPassword,
      district: district.trim(),
      state: state.trim(),
      bloodGroup
    };

    const res = await registerUser(payload);
    setLoading(false);

    if (res.success) {
      setSuccess('Account created successfully! Directing to your personal portal...');
      setTimeout(() => {
        router.push(redirectTarget);
      }, 700);
    } else {
      setError(res.message || 'Registration failed. An account with this email or phone may already exist.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 text-slate-900">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0b8026]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0b8026] text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#0b8026]/20">
            SSP
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create User Account</h1>
          <p className="text-xs text-slate-600 mt-1">
            {settings?.ngoName || 'Samasya Samadhan Parishad (SSP)'} — Official Citizen &amp; Supporter Registry
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-[#0b8026] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0b8026] animate-pulse"></span>
            12A &amp; 80G Certified Non-Profit • Official Member, Volunteer &amp; Donor Gateway
          </div>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
            <FiAlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5">
            <FiCheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Full Legal Name <span className="text-[#d50000]">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Email Address <span className="text-[#d50000]">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Mobile Number (WhatsApp) <span className="text-[#d50000]">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-800">
                  Password <span className="text-[#d50000]">*</span>
                </label>
                {strength.text && (
                  <span className={`text-[10px] font-semibold ${strength.color}`}>
                    {strength.text}
                  </span>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-800">
                  Confirm Password <span className="text-[#d50000]">*</span>
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                    <FiCheckCircle className="w-3 h-3" /> Match
                  </span>
                )}
                {passwordMismatch && (
                  <span className="text-[10px] font-semibold text-rose-600">
                    Mismatch
                  </span>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border text-slate-900 placeholder-slate-400 focus:outline-none text-xs font-medium transition ${
                    passwordsMatch
                      ? 'border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : passwordMismatch
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* District, State & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">District / City</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Aligarh"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Uttar Pradesh"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                <FiDroplet className="w-3.5 h-3.5 text-[#d50000]" />
                <span>Blood Group</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] font-bold"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                  <option key={b} value={b} className="bg-white">{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || passwordMismatch || !isPasswordLongEnough}
            className="w-full py-3.5 rounded-xl bg-[#0b8026] hover:bg-[#09661f] text-white font-bold text-xs shadow-lg shadow-[#0b8026]/20 transition cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Registering account...</span>
            ) : (
              <>
                <FiUserPlus className="w-4 h-4" />
                <span>Create User Account &amp; Access Portal</span>
              </>
            )}
          </button>

          {/* Navigation Links */}
          <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-200 pt-4">
            <div>
              Already registered with Samasya Samadhan Parishad?{' '}
              <Link href={`/login${redirectTarget !== '/profile' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} className="text-[#0b8026] font-bold hover:underline">
                Sign In to Portal →
              </Link>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-gray-500">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
