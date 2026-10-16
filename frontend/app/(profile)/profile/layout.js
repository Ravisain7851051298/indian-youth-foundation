'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiUser,
  FiCreditCard,
  FiFileText,
  FiAward,
  FiHeart,
  FiAlertCircle,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiUserPlus,
  FiUserCheck,
  FiChevronRight,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { GoVerified } from "react-icons/go";
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import { getContentImageUrl } from '@/lib/authApi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfileLayout({ children }) {
  const { currentUser, logout } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-50">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!effectiveUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-[75vh] flex items-center justify-center p-6 bg-slate-100">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-red-200">
              <FiUserPlus />
            </div>
            <h2 className="text-xl font-black text-black">Member Portal Login</h2>
            <p className="text-xs text-black mt-2 font-medium">
              Please log in with your email and password to access your verified profile, applications, ID card, and receipts.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
              >
                Sign In to Profile
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isVerified = effectiveUser.status === 'active';
  const isMember = effectiveUser.role === 'Member' || effectiveUser.role === 'Admin' || (!!effectiveUser.memberId && !effectiveUser.memberId.startsWith('BYK-DON-')) || effectiveUser.isMember;
  const isVolunteer = effectiveUser.role === 'Volunteer' || effectiveUser.isVolunteer || effectiveUser.volunteerApplication?.status === 'approved' || effectiveUser.volunteerApplication?.status === 'pending' || (!!effectiveUser.volunteerId && !effectiveUser.volunteerId.startsWith('BYK-DON-'));

  const menuItems = [
    { label: 'Overview & Status', href: '/profile', icon: FiUser },
    { label: 'My Certificates', href: '/profile/certificates', icon: FiAward },
    { label: 'My Awards & Badges', href: '/profile/my-awards', icon: FiAward },
    {
      label: 'Membership Profile',
      href: '/profile/member',
      icon: FiCreditCard
    },
    {
      label: 'Volunteer Profile',
      href: '/profile/volunteer',
      icon: FiUserCheck
    },
    {
      label: 'Official ID Card',
      href: isVolunteer && !isMember ? '/profile/id-card?type=volunteer' : '/profile/id-card',
      icon: FiShield,
      locked: !isVerified
    },
    {
      label: 'Offer / Appointment Letter',
      href: isVolunteer && !isMember ? '/profile/appointment-letter?type=volunteer' : '/profile/appointment-letter',
      icon: FiFileText,
      locked: !isVerified
    },
    { label: 'Donations & 80G Receipts', href: '/profile/donations', icon: FiHeart },
    { label: 'Submit Grievance / Inquiry', href: '/profile/grievance', icon: FiAlertCircle },
    { label: 'Account Settings', href: '/profile/settings', icon: FiSettings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

        {/* ----------------- MOBILE TOP NAVIGATION BAR ----------------- */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getContentImageUrl(effectiveUser.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={effectiveUser.name}
              className="w-9 h-9 rounded-full object-cover border border-red-500 shadow-2xs"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
              }}
            />
            <div>
              <div className='flex items-center'>
                <h3 className="font-black text-black text-xs truncate max-w-[170px]">{effectiveUser.name}</h3>
                {effectiveUser.status === 'active' ? (
                  <GoVerified className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <FiClock className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <p className="text-xs text-black font-medium">{effectiveUser.email}</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5 text-red-600" /> : <FiMenu className="w-5 h-5 text-black" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-5 space-y-3 z-30 shadow-lg">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-black hover:bg-red-50 hover:text-red-700'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.locked && !isActive && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        🔒 Locked
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {currentUser.role === 'Admin' && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black text-red-600 hover:underline flex items-center gap-1"
                >
                  <FiShield className="w-3.5 h-3.5" />
                  <span>Admin View →</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer flex items-center gap-1 ml-auto"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------- DESKTOP SIDEBAR ----------------- */}
        <aside className="hidden md:flex w-72 lg:w-80 bg-white border-r border-slate-200 shrink-0 flex-col justify-between">
          <div className="p-6">
            {/* User Profile Card */}
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="relative inline-block mx-auto mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getContentImageUrl(effectiveUser.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'}
                  alt={effectiveUser.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-red-500 shadow-md mx-auto"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80';
                  }}
                />
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white shadow-xs ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                  {isVerified ? <FiCheckCircle className="w-3.5 h-3.5 text-white" /> : <FiClock className="w-3 h-3 text-white" />}
                </span>
              </div>

              <h3 className="font-black text-black text-base leading-tight">
                {effectiveUser.name}
              </h3>
              <p className="text-[11px] text-black font-medium mt-0.5">{effectiveUser.email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                  {effectiveUser.role || 'Member'}
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

              <div className="mt-2 text-[11px] font-mono text-black font-semibold">
                ID: {effectiveUser.memberId || 'Pending Assignment'}
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-black hover:bg-red-50 hover:text-red-700'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.locked && !isActive && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        🔒 Locked
                      </span>
                    )}
                    {isActive && <FiChevronRight className="w-3.5 h-3.5 text-white" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer with Trust Stamp & Sign Out */}
          <div className="p-6 border-t border-slate-100 space-y-2.5">
            {effectiveUser.role === 'Admin' && (
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs shadow-md transition"
              >
                <FiShield className="w-3.5 h-3.5 text-red-500" />
                <span>Switch to Admin Dashboard →</span>
              </Link>
            )}

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-center">
              <span className="text-[10px] font-black text-black uppercase tracking-wider block">
                12A &amp; 80G Certified NGO
              </span>
              <span className="text-[9px] text-black font-medium block mt-0.5">
                Head Office: Krishna Vihar Pala Road Aligarh
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition cursor-pointer"
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
      <Footer />
    </>
  );
}
