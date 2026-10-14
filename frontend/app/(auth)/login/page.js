'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiLogIn,
  FiShield,
  FiKey,
  FiArrowRight
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const isExpired = searchParams.get('expired');
  const { login, settings } = useNGO();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session expired. Please sign in again.' : '');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccess(`Authentication verified! Welcome back, ${res.user.name}.`);
      setTimeout(() => {
        // If an Admin logs in, direct to Admin Dashboard (unless explicit redirect specified)
        if (res.user.role === 'Admin') {
          router.push(redirectTarget || '/dashboard');
        } else {
          router.push(redirectTarget || '/profile');
        }
      }, 500);
    } else {
      setError(res.message || 'Invalid credentials. Please verify your registered email/phone and password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 text-black">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl relative overflow-hidden">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/20">
            IYF
          </div>
          <h1 className="text-2xl font-black text-black">Sign In to Portal</h1>
          <p className="text-xs text-black/70 mt-1">
            {settings?.ngoName || 'Indian Youth Foundation'} — Official Central Gateway
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] text-red-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            Unified Member &amp; Trustee Secure Gateway
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

        {/* UNIFIED LOGIN FORM FOR USERS & ADMINS */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-black block mb-1.5">
              Registered Email or Mobile Number
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="name@domain.org or 98XXXXXXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs font-medium transition"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-black block mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 text-xs font-medium transition"
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

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-gray-500">Can&apos;t remember?</span>
            <Link href="/forgot-password" className="text-red-600 hover:text-red-700 font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <FiLogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </>
            )}
          </button>

          {/* Navigation to User Register & Admin Creation */}
          <div className="mt-6 text-center text-xs text-black/70 border-t border-gray-200 pt-4 space-y-2.5">
            <div>
              Don&apos;t have an account yet?{' '}
              <Link 
                href={`/register${redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`} 
                className="text-red-600 font-bold hover:underline"
              >
                Create User Account →
              </Link>
            </div>

            <div className="pt-1.5 border-t border-gray-100">
              <span className="text-gray-500 text-[11px]">Trust Executive or Official? </span>
              <Link 
                href="/admin-register" 
                className="text-red-600 hover:text-red-700 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <FiKey className="w-3 h-3" />
                Create Admin Account (Secret Key Required) →
              </Link>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-gray-500">Loading sign in gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}
