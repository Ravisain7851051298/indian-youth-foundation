'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiUser, 
  FiCreditCard, 
  FiFileText, 
  FiAward, 
  FiHeart, 
  FiGift, 
  FiAlertCircle, 
  FiSettings, 
  FiLogOut, 
  FiCheckCircle, 
  FiClock, 
  FiShield, 
  FiUserPlus,
  FiChevronRight
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function ProfileLayout({ children }) {
  const { currentUser, logout, settings } = useNGO();
  const pathname = usePathname();
  const router = useRouter();

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            👤
          </div>
          <h2 className="text-xl font-black text-slate-900">Member Portal Login</h2>
          <p className="text-xs text-slate-600 mt-2">
            Please log in with your email and password to access your verified profile, applications, ID card, and receipts.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
            >
              Sign In to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = currentUser.status === 'active';
  const isPending = currentUser.status === 'pending';

  const menuItems = [
    { label: 'Overview & Status', href: '/profile', icon: FiUser },
    { label: 'Apply for Membership', href: '/profile/apply-member', icon: FiCreditCard },
    { label: 'Apply for Volunteer', href: '/profile/apply-volunteer', icon: FiUserPlus },
    { 
      label: 'Official ID Card', 
      href: '/profile/id-card', 
      icon: FiShield,
      locked: !isVerified
    },
    { 
      label: 'Offer / Appointment Letter', 
      href: '/profile/appointment-letter', 
      icon: FiFileText,
      locked: !isVerified
    },
    { label: 'Donations & 80G Receipts', href: '/profile/donations', icon: FiHeart },
    { label: 'Awarded Certificates', href: '/profile/certificates', icon: FiAward },
    { label: 'Birthday Poster', href: '/profile/birthday-poster', icon: FiGift },
    { label: 'Submit Grievance / Inquiry', href: '/profile/grievance', icon: FiAlertCircle },
    { label: 'Account Settings', href: '/profile/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* ----------------- PERSISTENT PROFILE SIDEBAR ----------------- */}
      <aside className="w-full md:w-72 lg:w-80 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between">
        <div className="p-6">
          {/* User Profile Card */}
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="relative inline-block mx-auto mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md mx-auto"
              />
              <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white ${
                isVerified ? 'bg-emerald-500' : 'bg-amber-500'
              }`}>
                {isVerified ? '✓' : '⏳'}
              </span>
            </div>

            <h3 className="font-black text-slate-900 text-base leading-tight">
              {currentUser.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{currentUser.email}</p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">
                {currentUser.role || 'Member'}
              </span>
              
              {isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Verified Active</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 flex items-center gap-1">
                  <FiClock className="w-3 h-3 text-amber-600" />
                  <span>Verification Pending</span>
                </span>
              )}
            </div>

            <div className="mt-2 text-[11px] font-mono text-slate-400">
              ID: {currentUser.memberId || 'Pending Assignment'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-orange-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.locked && !isActive && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-100 text-slate-400">
                      🔒 Locked
                    </span>
                  )}
                  {isActive && <FiChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Trust Stamp & Sign Out */}
        <div className="p-6 border-t border-slate-100 space-y-3">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-center">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
              12A & 80G Certified NGO
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">
              Head Office: Krishna Vihar Pala Road Aligarh
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Sign Out from Profile</span>
          </button>
        </div>
      </aside>

      {/* ----------------- NESTED CONTENT VIEW ----------------- */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
