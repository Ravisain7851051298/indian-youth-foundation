'use client';

import React, { useState, Suspense, useEffect } from 'react';
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
  FiUsers,
  FiUserCheck,
  FiArrowRight,
  FiHome
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role')?.toLowerCase() || 'member';
  const redirectTarget = searchParams.get('redirect');
  const isExpired = searchParams.get('expired');
  const { login, settings } = useNGO();

  const validRoles = ['volunteer', 'member', 'admin', 'donor'];
  const initialRole = validRoles.includes(roleParam) ? roleParam : 'member';
  const [activeRole, setActiveRole] = useState(initialRole);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isExpired ? 'Your session expired. Please sign in again.' : '');
  const [success, setSuccess] = useState('');

  // Synchronize when URL role query param changes
  useEffect(() => {
    if (validRoles.includes(roleParam) && roleParam !== activeRole) {
      setActiveRole(roleParam);
    }
  }, [roleParam]);

  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    setError('');
    setSuccess('');
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', newRole);
    router.replace(`/login?${params.toString()}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await login(identifier.trim(), password);
    setLoading(false);

    if (res.success) {
      const loggedUser = res.user;
      setSuccess(`Authentication verified! Welcome back, ${loggedUser.name}.`);
      setTimeout(() => {
        // Direct based on actual authenticated role and target
        if (loggedUser.role === 'Admin' || activeRole === 'admin') {
          router.push(redirectTarget || '/dashboard');
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
      btnColor: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800',
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
    }
  };

  const currentConfig = roleConfig[activeRole] || roleConfig.member;
  const ActiveIcon = currentConfig.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">

        {/* Decorative Top Accent Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${activeRole === 'admin' ? 'bg-red-500/10' : 'bg-[#0b8026]/10'}`}></div>

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
            {settings?.ngoName || 'Yuva Kranti Dal'} — Official Central Gateway
          </p>

          {/* Active Role Indicator Badge */}
          <div className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${currentConfig.badgeColor}`}>
            <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="uppercase tracking-wider">{currentConfig.badge}</span>
          </div>
        </div>

        {/* ROLE SWITCHER BUTTONS (Volunteer | Member | Admin | Donor) */}
        <div className="mb-6 p-1 bg-slate-100 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1 border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleChange('volunteer')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'volunteer'
              ? 'bg-white text-[#0b8026] shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FiUsers className="w-3.5 h-3.5 shrink-0" />
            <span>Volunteer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('member')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'member'
              ? 'bg-white text-[#0b8026] shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FiUserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Member</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('donor')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'donor'
              ? 'bg-white text-amber-700 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FiUser className="w-3.5 h-3.5 shrink-0" />
            <span>Donor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeRole === 'admin'
              ? 'bg-white text-red-600 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <FiShield className="w-3.5 h-3.5 shrink-0" />
            <span>Admin</span>
          </button>
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

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Registered Email or Mobile Number
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="name@domain.org or 98XXXXXXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0b8026] focus:ring-1 focus:ring-[#0b8026] text-xs font-medium transition"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
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
            className={`w-full py-3.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg shadow-black/10 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            <FiHome className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Contextual Register / Apply Links */}
          <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-200 pt-4 space-y-2">
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
