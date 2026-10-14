'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiKey, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiBriefcase, 
  FiMapPin, 
  FiEye, 
  FiEyeOff, 
  FiShield, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiArrowLeft
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function AdminRegisterPage() {
  const router = useRouter();
  const { createAdminAccount, settings } = useNGO();

  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [designation, setDesignation] = useState('National Trustee & Director');
  const [district, setDistrict] = useState('Aligarh');
  const [state, setState] = useState('Uttar Pradesh');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side quick check
    const cleanSecret = adminSecretKey.trim();
    if (!cleanSecret) {
      setLoading(false);
      setError('Please provide your X-ADMIN-SECRET-KEY.');
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError('Password and Confirm Password do not match.');
      return;
    }

    const disallowedPasswords = ['admin123', 'admin', 'password', '12345678', 'byk123', 'iyf123'];
    if (disallowedPasswords.includes(password.toLowerCase()) || password.length < 8) {
      setLoading(false);
      setError('Security Rule: Default or weak passwords (such as "admin123") are strictly forbidden. Please specify a strong, unique password with at least 8 characters.');
      return;
    }

    const adminPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      confirmPassword,
      designation: designation.trim(),
      district: district.trim(),
      state: state.trim(),
      adminSecretKey: cleanSecret
    };

    const res = await createAdminAccount(adminPayload, cleanSecret);
    setLoading(false);

    if (res.success) {
      setSuccess('Administrator account created and verified! Redirecting to Trustee Control Panel...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } else {
      setError(res.message || 'Administrator registration failed. Please ensure X-ADMIN-SECRET-KEY is correct and credentials are unique.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 text-black">
      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back Link */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black font-semibold transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            Back to Portal Login
          </Link>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold uppercase tracking-wider">
            Trustee Bootstrap
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/20">
            <FiShield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-black">Trustee & Admin Registration</h1>
          <p className="text-xs text-black/70 mt-1">
            {settings?.ngoName || 'Indian Youth Foundation'} — Official Administrative Onboarding
          </p>
        </div>

        {/* Notifications */}
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Secret Key Field */}
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-red-700 text-xs flex items-center gap-1.5">
                <FiKey className="w-3.5 h-3.5" />
                X-ADMIN-SECRET-KEY <span className="text-red-600">*</span>
              </label>
              <span className="text-[10px] text-red-600 font-mono">
                Secret in .env: <strong>ravi123</strong>
              </span>
            </div>
            <div className="relative">
              <input
                type={showSecretKey ? 'text' : 'password'}
                required
                placeholder="Enter authorized X-ADMIN-SECRET-KEY (e.g. ravi123)"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white border border-red-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-3 top-3 text-red-500 hover:text-red-700"
              >
                {showSecretKey ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Name & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-black block mb-1">
                Full Legal Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-black block mb-1">
                Designation / Position in Trust
              </label>
              <div className="relative">
                <FiBriefcase className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  required
                  placeholder="National Trustee & Director"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-black block mb-1">
                Official Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="trustee@domain.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-black block mb-1">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-black text-xs">
                  Password <span className="text-red-600">*</span>
                </label>
                <span className="text-[10px] text-gray-400">Min 8 chars</span>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-black"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-black text-xs">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                {passwordsMatch && (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                    <FiCheckCircle className="w-3 h-3" /> Match
                  </span>
                )}
                {passwordMismatch && (
                  <span className="text-[10px] text-rose-600">Mismatch</span>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border text-black placeholder-gray-400 focus:outline-none text-xs ${
                    passwordsMatch
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : passwordMismatch
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-gray-300 focus:border-red-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-black"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* District & State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-black block mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-black text-xs focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="font-bold text-black block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-black text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? 'Authorizing & Creating Administrator...' : 'Create Admin Account (with Secret Key)'}
          </button>
        </form>

        {/* Small Navigation Links */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs space-y-2">
          <div>
            <span className="text-gray-500">Already have an authorized Admin account? </span>
            <Link href="/login" className="text-red-600 hover:text-red-700 font-bold hover:underline">
              Sign In to Portal →
            </Link>
          </div>
          <div>
            <span className="text-gray-500 text-[11px]">Looking to register as a Member or Volunteer? </span>
            <Link href="/volunteer" className="text-gray-600 hover:text-black text-[11px] font-semibold hover:underline">
              Public Application →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
