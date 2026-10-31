'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertTriangle,
  FiLogIn,
  FiShield,
  FiUsers,
  FiUserCheck,
  FiArrowRight,
  FiHome,
  FiBriefcase
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role')?.toLowerCase() || '';
  const redirectTarget = searchParams.get('redirect');
  const isExpired = searchParams.get('expired');
  const { login, logout, currentUser, settings } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const validRoles = ['coordinator', 'volunteer', 'member', 'admin', 'donor'];
  const activeRole = validRoles.includes(roleParam) ? roleParam : 'general';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session expired. Please sign in again.' : '');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      const loggedUser = res.user;
      const roleLabel = loggedUser.isCoordinator ? 'Coordinator' : (loggedUser.role || 'Member');
      setSuccess(`Authentication verified! Welcome back, ${loggedUser.name} (${roleLabel}).`);
      setTimeout(() => {
        // Direct based on actual authenticated role and target
        if (loggedUser.role === 'Admin' || loggedUser.role === 'admin' || activeRole === 'admin') {
          router.push(redirectTarget || '/dashboard');
        } else if (loggedUser.isCoordinator || loggedUser.role === 'coordinator' || activeRole === 'coordinator') {
          router.push(redirectTarget || '/profile/coordinator');
        } else if (loggedUser.role === 'Volunteer' || loggedUser.isVolunteer || activeRole === 'volunteer') {
          router.push(redirectTarget || '/profile/volunteer');
        } else if (loggedUser.role === 'Donor' || activeRole === 'donor') {
          router.push(redirectTarget || '/profile/donations');
        } else {
          router.push(redirectTarget || '/profile');
        }
      }, 500);
    } else {
      setError(res.message || 'Invalid credentials. Please verify your registered email/phone and password.');
    }
  };

  const roleConfig = {
    coordinator: {
      title: 'Coordinator Portal Login',
      badge: 'Field Coordinator Desk',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: FiBriefcase,
      btnText: 'Sign In as Coordinator',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      subText: 'Official access for assigned field coordinators to manage local members & community drives.'
    },
    volunteer: {
      title: 'Volunteer Portal Login',
      badge: 'Grassroots Volunteer Wing',
      badgeColor: 'bg-emerald-50 text-[#0b8026] border-emerald-200',
      icon: FiUsers,
      btnText: 'Sign In as Volunteer',
      btnColor: 'bg-[#0b8026] hover:bg-[#08661e]',
      subText: 'Access field tasks, attendance logs, and volunteer certificates.'
    },
    member: {
      title: 'Member Portal Login',
      badge: 'Verified Foundation Member',
      badgeColor: 'bg-emerald-50 text-[#0b8026] border-emerald-200',
      icon: FiUserCheck,
      btnText: 'Sign In as Member',
      btnColor: 'bg-[#0b8026] hover:bg-[#08661e]',
      subText: 'Access membership card, appointment letter, and welfare benefits.'
    },
    admin: {
      title: 'Admin Portal Login',
      badge: 'Official Administrator Desk',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      icon: FiShield,
      btnText: 'Sign In to Admin Dashboard',
      btnColor: 'bg-[#0b8026] hover:bg-[#08661e]',
      subText: 'Central governance, approval desk, and content operations.'
    },
    donor: {
      title: 'Donor Portal Login',
      badge: 'Generous Contributor Wing',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: FiUser,
      btnText: 'Sign In as Donor',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      subText: 'Access official 80G tax receipts and cumulative donation records.'
    },
    general: {
      title: 'Official Portal Login',
      badge: 'Unified Access Gateway',
      badgeColor: 'bg-emerald-50 text-[#0b8026] border-emerald-200',
      icon: FiLogIn,
      btnText: 'Secure Sign In',
      btnColor: 'bg-[#0b8026] hover:bg-[#08661e]',
      subText: 'Single secure sign-in for Coordinators, Members, Volunteers, Donors & Admins.'
    }
  };

  const currentConfig = roleConfig[activeRole] || roleConfig.general;
  const ActiveIcon = currentConfig.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">

        {/* Decorative Top Accent Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${activeRole === 'admin' ? 'bg-red-500/10' : activeRole === 'coordinator' ? 'bg-blue-500/10' : 'bg-[#0b8026]/10'}`}></div>

        {/* Brand Banner */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-full border-2 border-[#0b8026] ring-2 ring-red-500/20 p-1 flex items-center justify-center mx-auto mb-3 shadow-md bg-white overflow-hidden">
            <img
              src={getContentImageUrl(settings?.logoUrl) || '/logo.jpeg'}
              alt={settings?.ngoName || 'Yuva Kranti Dal'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.jpeg';
              }}
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {currentConfig.title}
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            {currentConfig.subText}
          </p>

          {/* Active Role Indicator Badge */}
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${currentConfig.badgeColor}`}>
            <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="uppercase tracking-wider">{currentConfig.badge}</span>
          </div>
        </div>

        {/* DISPLAY WHO IS CURRENTLY LOGGED IN (If Active Session Exists) */}
        {mounted && effectiveUser && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Currently Logged In As</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-extrabold text-[10px] bg-emerald-100/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Session
              </span>
            </div>
            <div className="flex items-center gap-3">
              {effectiveUser.photoUrl ? (
                <img
                  src={getContentImageUrl(effectiveUser.photoUrl)}
                  alt={effectiveUser.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-300 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#0b8026] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {(effectiveUser.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-black text-slate-900 text-sm truncate">
                  {effectiveUser.name}
                </div>
                <div className="text-xs text-slate-600 truncate">
                  {effectiveUser.email || effectiveUser.phone}
                </div>
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#0b8026]/10 text-[#0b8026] border border-[#0b8026]/20">
                    {effectiveUser.role || 'Member'}
                  </span>
                  {effectiveUser.isCoordinator && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                      Field Coordinator
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (effectiveUser.role === 'Admin' || effectiveUser.role === 'admin') {
                    router.push(redirectTarget || '/dashboard');
                  } else if (effectiveUser.isCoordinator || effectiveUser.role === 'coordinator') {
                    router.push(redirectTarget || '/profile/coordinator');
                  } else if (effectiveUser.role === 'Volunteer' || effectiveUser.isVolunteer) {
                    router.push(redirectTarget || '/profile/volunteer');
                  } else if (effectiveUser.role === 'Donor') {
                    router.push(redirectTarget || '/profile/donations');
                  } else {
                    router.push(redirectTarget || '/profile');
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0b8026] hover:bg-[#08661e] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Continue to Profile</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setError('');
                  setSuccess('Signed out successfully. You can now log into another account.');
                }}
                className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

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

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 block">
                Official ID or Email
              </label>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Email Optional
              </span>
            </div>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Enter 10-digit ID, Email, or Mobile..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 block">Password</label>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter 4-digit PIN or password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Can&apos;t remember?</span>
            <Link href="/forgot-password" className="text-[#0b8026] hover:text-[#09661f] font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl ${currentConfig.btnColor} text-white font-bold text-xs shadow-lg shadow-black/10 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <FiLogIn className="w-4 h-4" />
                <span>{currentConfig.btnText}</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className={`w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-black/10 transition cursor-pointer flex items-center justify-center gap-2`}
          >
            <FiHome className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Contextual Register / Apply Links */}
          <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-200 pt-4 space-y-2">
            {activeRole === 'coordinator' && (
              <div className="text-[11px] text-blue-800 bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/60 flex items-center justify-center gap-1.5">
                <FiBriefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Field Coordinator Access: Managed and appointed by Foundation Admin</span>
              </div>
            )}
            {activeRole === 'volunteer' && (
              <div>
                Not an active volunteer yet?{' '}
                <Link href="/apply-volunteer" className="text-[#0b8026] font-bold hover:underline">
                  Apply as Volunteer →
                </Link>
              </div>
            )}
            {activeRole === 'member' && (
              <div>
                Don&apos;t have a verified membership?{' '}
                <Link href="/apply-member" className="text-[#0b8026] font-bold hover:underline">
                  Apply for Membership →
                </Link>
              </div>
            )}
            {activeRole === 'admin' && (
              <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <FiShield className="w-3.5 h-3.5 text-red-500" />
                <span>Restricted Access: Authorized Trustee Administrators Only</span>
              </div>
            )}
            <div>
              New user?{' '}
              <Link
                href={`/register${redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
                className="text-[#dc2626] font-bold hover:underline"
              >
                Create Account →
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
