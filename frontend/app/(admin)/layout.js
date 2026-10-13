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
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings } = useNGO();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Admin';

  const navItems = [
    { label: 'Control Overview', href: '/dashboard', icon: FiHome },
    { label: 'Approvals Center', href: '/dashboard/approvals', icon: FiCheckSquare },
    { label: 'Membership Plans CMS', href: '/dashboard/plans', icon: FiLayers },
    { label: 'Email Audit Logs', href: '/dashboard/email-logs', icon: FiMail },
    { label: 'NGO Master Settings', href: '/settings', icon: FiSettings },
    { label: 'Members Directory', href: '/members', icon: FiUsers },
    { label: '80G Donations', href: '/donation', icon: FiHeart },
    { label: 'Campaigns CMS', href: '/campaigns', icon: FiFileText },
    { label: 'Events & Conclaves', href: '/event', icon: FiCheckSquare },
    { label: 'News & Press Releases', href: '/blogs', icon: FiFileText },
    { label: 'Certificates of Honor', href: '/certificates', icon: FiShield },
    { label: 'Grievance Redressal', href: '/complaints', icon: FiAlertCircle }
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl text-center text-white shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <FiShield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black">Restricted Trustee Access</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You must be authenticated with the <strong>Admin</strong> role to access the National Trustee Dashboard and document authorization modules.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700/50 text-slate-300 font-bold text-xs transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* ----------------- FIXED DESKTOP SIDEBAR ----------------- */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="p-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-600/30 font-black text-white text-base">
              युवा
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">
                {settings?.ngoName || 'Indian Youth Foundation'}
              </h2>
              <span className="text-[10px] text-orange-400 font-bold tracking-wider uppercase block">
                Trustee Admin Panel
              </span>
            </div>
          </div>

          {/* Current Admin Badge */}
          <div className="mt-6 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-orange-500"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
              Management Modules
            </div>

            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 space-y-2 bg-slate-900/50">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <FiGlobe className="w-4 h-4 text-slate-500" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MOBILE TOP BAR ----------------- */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white text-xs">
            युवा
          </div>
          <div>
            <div className="text-xs font-bold text-white">Trustee Admin</div>
            <div className="text-[10px] text-slate-400">{currentUser.name}</div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300"
        >
          {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-slate-950/95 z-40 p-6 overflow-y-auto space-y-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                    active ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              <FiGlobe className="w-4 h-4" />
              <span>View Public Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400"
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
