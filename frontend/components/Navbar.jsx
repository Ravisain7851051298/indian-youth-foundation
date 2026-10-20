'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiPhone,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHome,
  FiChevronRight,
  FiHeart,
  FiUser,
  FiCreditCard,
  FiAward,
  FiFileText,
  FiShield,
  FiSettings,
  FiActivity,
  FiUsers,
  FiBookOpen,
  FiImage,
  FiLogIn,
  FiUserPlus,
  FiMail,
  FiLayers
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter
} from 'react-icons/fa6';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import GoogleTranslate from '@/components/common/GoogleTranslate';

export default function Navbar() {
  const pathname = usePathname();
  const { settings, currentUser, logout } = useNGO();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Mark client mount to avoid SSR hydration differences
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const activeUser = isMounted ? currentUser : null;

  const isMember = Boolean(
    activeUser?.role === 'Member' ||
    activeUser?.role === 'Admin' ||
    (activeUser?.isMember && !activeUser?.memberId?.startsWith('BYK-DON-')) ||
    (activeUser?.membershipApplication?.status === 'approved') ||
    (activeUser?.memberId && (activeUser.memberId.startsWith('BYK-MEM-') || activeUser.memberId.startsWith('MEM-')))
  );

  const isVolunteer = Boolean(
    activeUser?.role === 'Volunteer' ||
    activeUser?.isVolunteer ||
    activeUser?.volunteerApplication?.status === 'approved' ||
    activeUser?.volunteerApplication?.status === 'pending' ||
    (activeUser?.volunteerId && !activeUser?.volunteerId?.startsWith('BYK-DON-'))
  );

  const isAdmin = Boolean(
    activeUser?.role === 'Admin' ||
    activeUser?.role === 'admin'
  );

  const navMenuItems = [
    {
      label: 'About Us',
      id: 'about',
      hasDropdown: true,
      links: [
        { label: 'President Message', href: '/#president-message', icon: FiUser },
        { label: 'Who We Are', href: '/who-we-are', icon: FiBookOpen },
        { label: 'About Foundation', href: '/about', icon: FiBookOpen },
        { label: 'Mission & Vision', href: '/mission-vision', icon: FiActivity },
        { label: 'Story', href: '/story', icon: FiFileText },
      ]
    },
    { label: 'Services', href: '/services' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Events', href: '/event' },
    { label: 'Certifications', href: '/certificates' },
    { label: 'Team', href: '/team-members' },
    {
      label: isMember ? 'Member Profile' : 'Apply Member',
      href: isMember ? '/profile/member' : '/apply-member'
    },
    {
      label: isVolunteer ? 'Volunteer Profile' : 'Volunteer Apply',
      href: isVolunteer ? '/profile/volunteer' : '/apply-volunteer'
    },
    {
      label: 'Media',
      id: 'media',
      hasDropdown: true,
      links: [
        { label: 'Blogs', href: '/blogs', icon: FiFileText },
        { label: 'YouTube Videos', href: '/#youtube-videos', icon: FaYoutube },
        { label: 'Photo Gallery', href: '/gallery', icon: FiImage },
      ]
    },
    { label: 'Complains & Enquries', href: '/complaints' },
    { label: 'Feedback', href: '/feedback' },
    activeUser ? {
      label: activeUser.name ? `${activeUser.name.split(' ')[0]}` : 'My Profile',
      id: 'user_profile',
      hasDropdown: true,
      links: [
        { label: 'Profile Overview', href: '/profile', icon: FiUser },
        { label: isMember ? 'Member Profile' : 'Apply for Membership', href: isMember ? '/profile/member' : '/apply-member', icon: FiCreditCard },
        { label: isVolunteer ? 'Volunteer Profile' : 'Apply as Volunteer', href: isVolunteer ? '/profile/volunteer' : '/apply-volunteer', icon: FiUsers },
        { label: 'Official ID Card', href: '/profile/id-card', icon: FiShield },
        { label: 'Appointment Letter', href: '/profile/appointment-letter', icon: FiFileText },
        { label: 'My Certificates', href: '/profile/certificates', icon: FiAward },
        ...(activeUser.role === 'Admin' || activeUser.role === 'admin' ? [{ label: 'Admin Dashboard', href: '/dashboard', icon: FiLayers }] : []),
        { label: 'Account Settings', href: '/profile/settings', icon: FiSettings },
      ]
    } : {
      label: 'Login',
      id: 'login',
      hasDropdown: true,
      links: [
        { label: 'Member / Volunteer Login', href: '/login', icon: FiLogIn },
        { label: 'Apply for Membership', href: '/apply-member', icon: FiUserPlus },
        { label: 'Apply as Volunteer', href: '/apply-volunteer', icon: FiUserPlus },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md font-sans bg-white">
      {/* ---------------- 1. TOP GREEN & RED THEMED BAR ---------------- */}
      <div className="bg-gradient-to-r from-[#0b8026] via-[#08611c] to-[#dc2626] text-white py-2 px-2 sm:px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

          {/* Left Social Icons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href={settings?.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] hover:text-[#dc2626] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-rose-50 shrink-0"
              aria-label="Facebook"
              title="Facebook"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings?.instagram || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] hover:text-[#dc2626] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-rose-50 shrink-0"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings?.youtube || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#dc2626] hover:text-[#0b8026] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-emerald-50 shrink-0"
              aria-label="YouTube"
              title="YouTube"
            >
              <FaYoutube className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings?.twitter || 'https://x.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] hover:text-[#dc2626] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-rose-50 shrink-0"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <FaXTwitter className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Middle: News & Updates Red Button + White Ticker Bar */}
          <div className="flex-1 flex items-center min-w-50 max-w-xl lg:max-w-3xl mx-2 sm:mx-3 overflow-hidden shadow-xs rounded-md">
            <div className="hidden sm:flex bg-red-600 text-white px-3 py-1.5 rounded-l-md font-black text-xs whitespace-nowrap items-center gap-1.5 shadow-sm shrink-0 border-r border-red-700">
              <FiActivity className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>News &amp; Updates</span>
            </div>
            <div className="flex-1 bg-white h-7 flex items-center px-3 rounded-md sm:rounded-l-none sm:rounded-r-md overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-xs font-semibold text-slate-800">
                {settings?.newsTickerText || 'Welcome to Yuva Kranti Dal • Free Membership & Social Welfare Mission • 24/7 Helpline: +919319698759'}
              </div>
            </div>
          </div>

          {/* Right: Phone Helpline */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold shrink-0 bg-red-700/90 hover:bg-red-800 text-white border border-white/60 rounded-full px-3 py-1 shadow-2xs transition">
            <FiPhone className="w-3.5 h-3.5 text-amber-300" />
            <a
              href={`tel:${settings?.phone || '+919319698759'}`}
              className="hover:underline tracking-wide"
            >
              {settings?.phone || '+91 93196 98759'}
            </a>
          </div>

        </div>
      </div>

      {/* ---------------- 2. MIDDLE BRANDING ROW ---------------- */}
      <div className="bg-white py-2 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo & Dual Green & Red Typography */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#0b8026] ring-2 ring-red-500/30 p-0.5 flex items-center justify-center bg-white shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
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
            <div className="hidden md:flex flex-col">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase flex items-center gap-2">
                <span className="text-[#0b8026]">YUVA KRANTI</span>
                <span className="text-[#dc2626]">DAL</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b8026]"></span>
                Empowering Youth
                <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]"></span>
                Transforming Society
              </span>
            </div>
          </Link>

          {/* Right Actions: Admin Dashboard + Green & Red Donate Us + Google Translate */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isAdmin && (
              <Link
                href="/dashboard"
                id="header-admin-dashboard-btn"
                className="hidden relative md:inline-flex items-center justify-center p-0.5 rounded-full group overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 active:scale-95"
                title="Go to Admin Dashboard"
              >
                {/* 100% Guaranteed Visible Rotating Conic Gradient Border */}
                <span
                  className="absolute inset-[-150%] animate-[spin_3s_linear_infinite]"
                  style={{
                    background: 'conic-gradient(from 0deg, #0b8026 0%, #dc2626 25%, #0b8026 50%, #dc2626 75%, #0b8026 100%)'
                  }}
                />

                {/* Inner Button Content */}
                <span className="relative z-10 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white group-hover:bg-emerald-50/60 font-extrabold text-xs sm:text-sm text-[#0b8026] group-hover:text-[#075018] transition-colors duration-200">
                  <FiLayers className="w-4 h-4 text-[#0b8026] shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Dashboard</span>
                </span>
              </Link>
            )}

            <Link
              href="/donation"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-500/25 hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse"
            >
              <FiHeart className="w-4 h-4 text-white fill-white shrink-0 animate-bounce" />
              <span>Donate Us</span>
            </Link>

            <GoogleTranslate />

          </div>

        </div>
      </div>

      {/* ---------------- 3. GREEN MAIN NAVIGATION BAR WITH RED ACCENTS ---------------- */}
      <nav className="bg-[#0b8026] text-white border-b-2 border-red-600 shadow-md" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-0.5 font-bold text-xs h-full">
              {/* Home Icon button */}
              <Link
                href="/"
                className={`flex items-center justify-center w-11 h-11 transition ${pathname === '/'
                  ? 'bg-red-600 text-white shadow-inner font-black'
                  : 'bg-[#09661f] text-white hover:bg-red-600/90'
                  }`}
                title="Home"
              >
                <FiHome className="w-5 h-5" />
              </Link>

              {navMenuItems.map((item) => {
                if (item.hasDropdown) {
                  const isOpen = activeDropdown === item.id;
                  const isDropdownActive = item.links?.some((l) => {
                    const cleanHref = l.href.split('#')[0];
                    return cleanHref && cleanHref !== '/' ? pathname.startsWith(cleanHref) : false;
                  });

                  return (
                    <div key={item.id} className="relative h-full flex items-center">
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`flex items-center gap-1 px-3 py-2.5 transition cursor-pointer rounded-sm ${isDropdownActive
                          ? 'bg-red-600 text-white font-black shadow-inner'
                          : 'hover:bg-[#075018] text-white'
                          }`}
                      >
                        <span>{item.label}</span>
                        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div
                          onMouseLeave={() => setActiveDropdown(null)}
                          className="absolute left-0 top-full mt-0 w-52 bg-white text-slate-800 rounded-b-xl shadow-xl border-t-2 border-red-600 border-x border-b border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        >
                          {item.links.map((link) => {
                            const IconComponent = link.icon;
                            const cleanHref = link.href.split('#')[0];
                            const isSubActive = cleanHref && cleanHref !== '/' ? pathname === cleanHref : false;

                            return (
                              <Link
                                key={link.href + link.label}
                                href={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition ${isSubActive
                                  ? 'bg-emerald-50 text-red-600 font-black'
                                  : 'hover:bg-emerald-50/60 hover:text-emerald-800 text-slate-700'
                                  }`}
                              >
                                {IconComponent && <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-red-600' : 'text-emerald-700'}`} />}
                                <span>{link.label}</span>
                              </Link>
                            );
                          })}
                          {item.id === 'user_profile' && (
                            <div className="pt-1 mt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={async () => {
                                  setActiveDropdown(null);
                                  await logout();
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <FiX className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`px-3 py-2.5 transition rounded-sm whitespace-nowrap ${isActive
                      ? 'bg-red-600 text-white font-black shadow-inner'
                      : 'hover:bg-[#075018] text-white'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center justify-between w-full">
              <Link
                href="/"
                className={`flex items-center gap-1 font-bold text-xs py-1.5 px-2.5 rounded-md transition ${pathname === '/' ? 'bg-red-600 text-white font-black' : 'hover:bg-[#09661f]'
                  }`}
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:bg-red-600 rounded-lg cursor-pointer transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-slate-900 border-b-4 border-red-600 py-3 px-4 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-1 text-xs font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition ${pathname === '/'
                ? 'bg-red-50 text-red-600 font-black border-l-4 border-red-600'
                : 'hover:bg-emerald-50/60 text-slate-800 hover:text-[#0b8026]'
                }`}
            >
              <FiHome className={`w-4 h-4 ${pathname === '/' ? 'text-red-600' : 'text-emerald-700'}`} />
              <span>Home</span>
            </Link>
            {navMenuItems.map((item) => {
              const isDirectActive = item.href && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));
              const isChildActive = item.links?.some((l) => {
                const cleanHref = l.href.split('#')[0];
                return cleanHref && cleanHref !== '/' ? pathname.startsWith(cleanHref) : false;
              });

              return (
                <div key={item.label} className="border-b border-slate-100 last:border-none pb-1">
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2 px-3 rounded-lg transition ${isDirectActive || isChildActive
                        ? 'bg-emerald-50 text-[#0b8026] font-black'
                        : 'hover:bg-emerald-50/60 text-slate-800 hover:text-[#0b8026]'
                        }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div className="py-2 px-3 text-slate-900 font-extrabold flex items-center justify-between">
                      <span>{item.label}</span>
                    </div>
                  )}

                  {item.links && (
                    <div className="pl-4 space-y-1 pt-0.5">
                      {item.links.map((sub) => {
                        const SubIcon = sub.icon;
                        const cleanHref = sub.href.split('#')[0];
                        const isSubActive = cleanHref && cleanHref !== '/' ? pathname === cleanHref : false;

                        return (
                          <Link
                            key={sub.href + sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-[11px] transition ${isSubActive
                              ? 'bg-emerald-50 text-[#0b8026] font-black'
                              : 'text-slate-600 hover:text-[#0b8026] hover:bg-slate-50'
                              }`}
                          >
                            {SubIcon ? (
                              <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#0b8026]' : 'text-emerald-700'}`} />
                            ) : (
                              <span>•</span>
                            )}
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {activeUser && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <FiX className="w-4 h-4" />
                  <span>Sign Out ({activeUser.name})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyframe animation for marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </header>
  );
}
