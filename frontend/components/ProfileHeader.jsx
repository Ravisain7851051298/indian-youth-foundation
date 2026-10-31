'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiUser,
  FiCreditCard,
  FiAward,
  FiFileText,
  FiHeart,
  FiShield,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiGlobe,
  FiMenu,
  FiX,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronDown,
  FiImage
} from 'react-icons/fi';
import { GoVerified } from 'react-icons/go';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';
import { getContentImageUrl } from '@/lib/authApi';

export default function ProfileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  if (!effectiveUser) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#0b8026] p-0.5 bg-white flex items-center justify-center overflow-hidden shadow-xs">
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
            <div>
              <span className="font-black text-sm text-slate-900 block leading-tight">{settings?.ngoName || 'Yuva Kranti Dal'}</span>
              <span className="text-[10px] text-[#0b8026] font-bold tracking-wider uppercase">Official Portal</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-slate-600 hover:text-black flex items-center gap-1.5">
              <FiGlobe className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-[#0b8026] hover:bg-[#08661e] text-white text-xs font-bold transition shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Determine user status and role specialization
  const isVerified = effectiveUser.status === 'active';
  const isAdmin = effectiveUser.role === 'Admin';
  const isCoordinator = effectiveUser.role === 'Coordinator' || effectiveUser.isCoordinator;
  const isVolunteerOnly = (effectiveUser.role === 'Volunteer' || effectiveUser.isVolunteer) && !isCoordinator && !isAdmin;
  const isMember = isCoordinator || isAdmin || effectiveUser.role === 'Member' || effectiveUser.isMember || !isVolunteerOnly;

  // Active Role badge styling & display text
  let roleBadge = {
    title: 'Registered Member',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20'
  };

  if (isAdmin) {
    roleBadge = {
      title: 'Trustee Administrator',
      color: 'bg-red-50 text-red-800 border-red-200 ring-red-500/20'
    };
  } else if (isCoordinator) {
    roleBadge = {
      title: 'District Coordinator',
      color: 'bg-purple-50 text-purple-800 border-purple-200 ring-purple-500/20'
    };
  } else if (isVolunteerOnly) {
    roleBadge = {
      title: 'Active Volunteer',
      color: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20'
    };
  }

  // Role-tailored navigation items
  let navLinks = [];

  if (isCoordinator) {
    navLinks = [
      { label: 'Overview', href: '/profile', icon: FiUser },
      { label: 'Coordinator Desk', href: '/profile/coordinator', icon: FiAward, highlight: true },
      { label: 'Add Member', href: '/profile/add-member', icon: FiUserPlus },
      { label: 'My Members', href: '/profile/my-members', icon: FiUsers },
      { label: 'Official ID Card', href: '/profile/id-card?type=coordinator', icon: FiShield },
      { label: 'Appointment Letter', href: '/profile/appointment-letter?type=coordinator', icon: FiFileText },
      { label: 'Certificates', href: '/profile/certificates', icon: FiAward },
      { label: '80G Donations', href: '/profile/donations', icon: FiHeart },
    ];
  } else if (isVolunteerOnly) {
    navLinks = [
      { label: 'Overview', href: '/profile', icon: FiUser },
      { label: 'Volunteer ID Card', href: '/profile/id-card?type=volunteer', icon: FiShield, highlight: true },
      { label: 'Offer Letter', href: '/profile/appointment-letter?type=volunteer', icon: FiFileText },
      { label: 'Certificates', href: '/profile/certificates', icon: FiAward },
      { label: 'Apply Membership', href: '/apply-member', icon: FiCreditCard },
      { label: 'Birthday Poster', href: '/profile/birthday-poster', icon: FiImage },
      { label: 'Helpdesk', href: '/profile/grievance', icon: FiAlertCircle },
    ];
  } else {
    // Regular Member (or Admin in profile mode)
    navLinks = [
      { label: 'Overview', href: '/profile', icon: FiUser },
      { label: 'Digital ID Card', href: '/profile/id-card', icon: FiShield, highlight: true },
      { label: 'Appointment Letter', href: '/profile/appointment-letter', icon: FiFileText },
      { label: 'Certificates', href: '/profile/certificates', icon: FiAward },
      { label: '80G Donations', href: '/profile/donations', icon: FiHeart },
      { label: 'Birthday Poster', href: '/profile/birthday-poster', icon: FiImage },
      { label: 'Apply Volunteer', href: '/apply-volunteer', icon: FiUserCheck },
      { label: 'Grievance / Help', href: '/profile/grievance', icon: FiAlertCircle },
    ];
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userIdentifier = effectiveUser.coordinatorId || effectiveUser.memberId || effectiveUser.volunteerId || (effectiveUser.phone ? `ID: ${effectiveUser.phone}` : 'ID: Verified');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">

          {/* LEFT: Organization Logo & Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/profile" className="flex items-center gap-3 group" title="User Profile Dashboard">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0b8026] ring-2 ring-emerald-500/20 p-0.5 bg-white flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-200">
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
              <div className="hidden xs:block sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                    {settings?.ngoName || 'Yuva Kranti Dal'}
                  </span>
                  {isVerified && <GoVerified className="w-4 h-4 text-[#0b8026] shrink-0" title="Verified Active Account" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full border ${roleBadge.color}`}>
                    {roleBadge.title}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* MIDDLE: Role-Tailored Desktop Navigation Tabs (Scrollable on tablet) */}
          {/* <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {navLinks.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/profile' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0b8026] text-white shadow-xs'
                      : item.highlight
                      ? 'text-[#0b8026] bg-emerald-50/80 hover:bg-emerald-100 hover:text-[#08661e]'
                      : 'text-slate-700 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav> */}

          {/* RIGHT: Quick Actions & User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Live Public Website Link */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
              title="Navigate to Public Website"
            >
              <FiGlobe className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Site</span>
            </Link>

            {/* Admin Switch Shortcut (If Admin) */}
            {isAdmin && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition shadow-xs"
                title="Go to Admin Dashboard"
              >
                <FiShield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Control</span>
              </Link>
            )}

            {/* Coordinator Desk Shortcut (If Coordinator and not on desk) */}
            {isCoordinator && pathname !== '/profile/coordinator' && (
              <Link
                href="/profile/coordinator"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs"
              >
                <FiAward className="w-3.5 h-3.5" />
                <span>Desk</span>
              </Link>
            )}

            {/* User Profile Avatar & Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full border-2 border-[#0b8026] p-0.5 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {effectiveUser.photoUrl ? (
                    <img
                      src={getContentImageUrl(effectiveUser.photoUrl)}
                      alt={effectiveUser.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                      }}
                    />
                  ) : (
                    <span className="font-extrabold text-[#0b8026] text-xs">
                      {effectiveUser.name ? effectiveUser.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-xs font-black text-slate-900 leading-tight max-w-28 truncate">
                    {effectiveUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-28">
                    {userIdentifier}
                  </div>
                </div>

                <FiChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <p className="text-xs font-black text-slate-900 truncate">{effectiveUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{effectiveUser.email || effectiveUser.phone}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${roleBadge.color}`}>
                        {roleBadge.title}
                      </span>
                      {isVerified ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#0b8026] transition"
                    >
                      <FiUser className="w-4 h-4 text-slate-400" />
                      <span>My Profile Overview</span>
                    </Link>

                    {/* Role specific desk shortcuts */}
                    {isCoordinator && (
                      <>
                        <Link
                          href="/profile/coordinator"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition"
                        >
                          <FiAward className="w-4 h-4 text-purple-600" />
                          <span>Coordinator Desk</span>
                        </Link>
                        <Link
                          href="/profile/add-member"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition"
                        >
                          <FiUserPlus className="w-4 h-4 text-purple-600" />
                          <span>Add New Member</span>
                        </Link>
                        <Link
                          href="/profile/my-members"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition"
                        >
                          <FiUsers className="w-4 h-4 text-purple-600" />
                          <span>My Enrolled Members</span>
                        </Link>
                      </>
                    )}

                    {isVolunteerOnly && (
                      <Link
                        href="/apply-member"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 transition"
                      >
                        <FiCreditCard className="w-4 h-4 text-amber-600" />
                        <span>Apply Regular Membership</span>
                      </Link>
                    )}

                    <Link
                      href={isCoordinator ? '/profile/id-card?type=coordinator' : (isVolunteerOnly ? '/profile/id-card?type=volunteer' : '/profile/id-card')}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#0b8026] transition"
                    >
                      <FiShield className="w-4 h-4 text-slate-400" />
                      <span>Official Digital ID Card</span>
                    </Link>

                    <Link
                      href={isCoordinator ? '/profile/appointment-letter?type=coordinator' : (isVolunteerOnly ? '/profile/appointment-letter?type=volunteer' : '/profile/appointment-letter')}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#0b8026] transition"
                    >
                      <FiFileText className="w-4 h-4 text-slate-400" />
                      <span>Appointment Letter</span>
                    </Link>

                    <Link
                      href="/profile/certificates"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#0b8026] transition"
                    >
                      <FiAward className="w-4 h-4 text-slate-400" />
                      <span>My Certificates</span>
                    </Link>

                    {!isVolunteerOnly && (
                      <Link
                        href="/profile/donations"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#0b8026] transition"
                      >
                        <FiHeart className="w-4 h-4 text-slate-400" />
                        <span>80G Donations & Receipts</span>
                      </Link>
                    )}

                    <Link
                      href="/profile/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#0b8026] transition"
                    >
                      <FiSettings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      href="/"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition border-t border-slate-100"
                    >
                      <FiGlobe className="w-4 h-4 text-slate-400" />
                      <span>Visit Public Website</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                    >
                      <FiLogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out from Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
              aria-label="Toggle Portal Menu"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5 text-red-600" /> : <FiMenu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER WITH FULL ROLE LINKS */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-3 animate-in slide-in-from-top duration-200">
            {/* User Quick Bar in Mobile */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-full border-2 border-[#0b8026] p-0.5 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {effectiveUser.photoUrl ? (
                    <img
                      src={getContentImageUrl(effectiveUser.photoUrl)}
                      alt={effectiveUser.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="font-extrabold text-[#0b8026] text-xs">
                      {effectiveUser.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-black text-slate-900 truncate">{effectiveUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{userIdentifier}</div>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${roleBadge.color}`}>
                {roleBadge.title}
              </span>
            </div>

            {/* Role-Specific Mobile Navigation Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1">
                {roleBadge.title} Navigation
              </span>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${isActive
                        ? 'bg-[#0b8026] text-white shadow-xs'
                        : 'text-slate-800 hover:bg-emerald-50 hover:text-[#0b8026]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions Footer */}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                <FiGlobe className="w-3.5 h-3.5 text-slate-600" />
                <span>Visit Public Website</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition cursor-pointer"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign Out from Profile</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
