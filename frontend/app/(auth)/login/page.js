'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiUser, FiLock, FiShield, FiUsers, FiHeart, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, settings } = useNGO();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/profile');
      }
    } else {
      setError(res.message || 'Invalid email or password. Please verify your credentials.');
    }
  };

  // 1-Click quick role logins for demo / evaluation
  const quickLogin = async (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setLoading(true);
    setError('');
    const res = await login(roleEmail, rolePass);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/profile');
      }
    } else {
      setError(res.message || 'Unable to sign in with demo credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/25">
            IYF
          </div>
          <h1 className="text-2xl font-black text-slate-900">Member & Admin Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            {settings?.ngoName || 'Indian Youth Foundation'} — Official Authentication Gateway
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Email or Mobile Number</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="admin@bharatiyayuvakranti.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Need help accessing?</span>
            <Link href="/forgot-password" className="text-orange-600 hover:text-orange-700 font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {loading ? 'Authenticating credentials...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* 4 EXACT ROLES ONE-CLICK LOGIN BUTTONS */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase text-center mb-3">
            Quick 1-Click Role Access (Instant Evaluation)
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => quickLogin('admin@bharatiyayuvakranti.org', 'admin123')}
              className="p-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold flex flex-col items-center text-center transition cursor-pointer"
            >
              <FiShield className="w-4 h-4 mb-1 text-orange-600" />
              <span>1. Admin</span>
              <span className="text-[9px] text-orange-600/80">Full Master Panel</span>
            </button>

            <button
              onClick={() => quickLogin('team@bharatiyayuvakranti.org', 'team123')}
              className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold flex flex-col items-center text-center transition cursor-pointer"
            >
              <FiUsers className="w-4 h-4 mb-1 text-purple-600" />
              <span>2. TeamMember</span>
              <span className="text-[9px] text-purple-600/80">Operations & Roster</span>
            </button>

            <button
              onClick={() => quickLogin('volunteer@bharatiyayuvakranti.org', 'vol123')}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold flex flex-col items-center text-center transition cursor-pointer"
            >
              <FiHeart className="w-4 h-4 mb-1 text-blue-600" />
              <span>3. Volunteer</span>
              <span className="text-[9px] text-blue-600/80">Field Identity & Tasks</span>
            </button>

            <button
              onClick={() => quickLogin('member@bharatiyayuvakranti.org', 'member123')}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex flex-col items-center text-center transition cursor-pointer"
            >
              <FiUser className="w-4 h-4 mb-1 text-emerald-600" />
              <span>4. Member</span>
              <span className="text-[9px] text-emerald-600/80">ID Card & 80G Receipts</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Want to register as a new member?{' '}
          <Link href="/volunteer" className="text-orange-600 font-bold hover:underline">
            Complete Registration Form →
          </Link>
        </div>
      </div>
    </div>
  );
}
