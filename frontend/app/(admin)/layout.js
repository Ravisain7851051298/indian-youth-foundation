'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiCheckSquare, 
  FiLayers, 
  FiMail, 
  FiSettings, 
  FiLogOut, 
  FiGlobe, 
  FiShield, 
  FiMenu, 
  FiX, 
  FiAlertCircle, 
  FiUsers, 
  FiHeart,
  FiFileText,
  FiCalendar,
  FiImage
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings } = useNGO();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const navItems = [
    { label: 'Control Overview', href: '/dashboard', icon: FiHome },
    { label: 'Approvals Center', href: '/dashboard/approvals', icon: FiCheckSquare },
    { label: 'Members Directory', href: '/dashboard/members', icon: FiUsers },
    { label: 'Volunteer Wing', href: '/dashboard/volunteers', icon: FiCheckSquare },
    { label: '80G Donations', href: '/dashboard/donations', icon: FiHeart },
    { label: 'Campaigns CMS', href: '/dashboard/campaigns', icon: FiFileText },
    { label: 'Events Management', href: '/dashboard/events', icon: FiCalendar },
    { label: 'News & Press Releases', href: '/dashboard/blogs', icon: FiFileText },
    { label: 'Photo & Video Gallery', href: '/dashboard/gallery', icon: FiImage },
    { label: 'Executive Team', href: '/dashboard/team-members', icon: FiUsers },
    { label: 'Membership Plans CMS', href: '/dashboard/plans', icon: FiLayers },
    { label: 'Grievance Redressal', href: '/dashboard/complaints', icon: FiAlertCircle },
    { label: 'Email Audit Logs', href: '/dashboard/email-logs', icon: FiMail },
    { label: 'Certificates of Honor', href: '/certificates', icon: FiShield },
    { label: 'NGO Master Settings', href: '/settings', icon: FiSettings }
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl text-center text-black shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
            <FiShield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-black">Restricted Trustee Access</h2>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">
            You must be authenticated with the <strong>Admin</strong> role to access the National Trustee Dashboard and document authorization modules.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md shadow-red-600/20"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-black font-bold text-xs transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-black flex flex-col md:flex-row">
      {/* ----------------- FIXED DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-white border-r border-slate-200 flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30 shadow-xs">
        <div className="p-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center shadow-lg shadow-red-600/20 font-black text-white text-base">
              युवा
            </div>
            <div>
              <h2 className="text-sm font-black text-black leading-tight">
                {settings?.ngoName || 'Indian Youth Foundation'}
              </h2>
              <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase block">
                Trustee Admin Panel
              </span>
            </div>
          </div>

          {/* Admin User Badge */}
          <div className="mt-6 p-3.5 rounded-2xl bg-red-50/60 border border-red-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center shrink-0 text-sm shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-black truncate">{currentUser?.name || 'Trustee Admin'}</div>
              <div className="text-[11px] text-slate-600 truncate">{currentUser?.email}</div>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-red-600 text-white">
                National Trustee
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
              Operations &amp; Governance
            </span>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-700 hover:text-red-700 hover:bg-red-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-200 space-y-2 bg-slate-50/60">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-black hover:text-red-700 hover:bg-red-50 transition"
          >
            <FiShield className="w-4 h-4 text-red-600" />
            <span>Open User Portal View</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-black hover:bg-white transition border border-transparent hover:border-slate-200"
          >
            <FiGlobe className="w-4 h-4 text-slate-500" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MOBILE TOP BAR ----------------- */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-xs">
            युवा
          </div>
          <div>
            <div className="text-xs font-black text-black">Trustee Admin</div>
            <div className="text-[10px] text-slate-600">{currentUser?.name}</div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black transition cursor-pointer"
        >
          {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white/98 z-40 p-6 overflow-y-auto space-y-4 border-b border-slate-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                    active ? 'bg-red-600 text-white shadow-md' : 'text-slate-800 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-black hover:bg-red-50"
            >
              <FiShield className="w-4 h-4 text-red-600" />
              <span>Open User Portal View</span>
            </Link>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 hover:text-black"
            >
              <FiGlobe className="w-4 h-4" />
              <span>View Public Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- MAIN ADMIN WORKSPACE ----------------- */}
      <div className="flex-1 md:pl-72 lg:pl-80 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
