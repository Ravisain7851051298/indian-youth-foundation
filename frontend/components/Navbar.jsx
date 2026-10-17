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
  const dropdownRef = useRef(null);

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

  const isMember = Boolean(
    currentUser?.role === 'Member' ||
    currentUser?.role === 'Admin' ||
    (currentUser?.isMember && !currentUser?.memberId?.startsWith('BYK-DON-')) ||
    (currentUser?.membershipApplication?.status === 'approved') ||
    (currentUser?.memberId && (currentUser.memberId.startsWith('BYK-MEM-') || currentUser.memberId.startsWith('MEM-')))
  );

  const isVolunteer = Boolean(
    currentUser?.role === 'Volunteer' ||
    currentUser?.isVolunteer ||
    currentUser?.volunteerApplication?.status === 'approved' ||
    currentUser?.volunteerApplication?.status === 'pending' ||
    (currentUser?.volunteerId && !currentUser?.volunteerId?.startsWith('BYK-DON-'))
  );

  const isAdmin = Boolean(
    currentUser?.role === 'Admin' ||
    currentUser?.role === 'admin'
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
    ...(isAdmin ? [{ label: 'Admin Panel', href: '/dashboard' }] : []),
    currentUser ? {
      label: currentUser.name ? `${currentUser.name.split(' ')[0]}` : 'My Profile',
      id: 'user_profile',
      hasDropdown: true,
      links: [
        { label: 'Profile Overview', href: '/profile', icon: FiUser },
        { label: isMember ? 'Member Profile' : 'Apply for Membership', href: isMember ? '/profile/member' : '/apply-member', icon: FiCreditCard },
        { label: isVolunteer ? 'Volunteer Profile' : 'Apply as Volunteer', href: isVolunteer ? '/profile/volunteer' : '/apply-volunteer', icon: FiUsers },
        { label: 'Official ID Card', href: '/profile/id-card', icon: FiShield },
        { label: 'Appointment Letter', href: '/profile/appointment-letter', icon: FiFileText },
        { label: 'My Certificates', href: '/profile/certificates', icon: FiAward },
        ...(currentUser.role === 'Admin' ? [{ label: 'Admin Dashboard', href: '/dashboard', icon: FiLayers }] : []),
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
      {/* ---------------- 1. TOP GREEN BAR ---------------- */}
      <div className="bg-[#0b8026] text-white py-2 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

          {/* Left Social Icons (Hidden on small mobile devices to give space to ticker and helpline, always visible on tablet & desktop) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href={settings?.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-emerald-50 shrink-0"
              aria-label="Facebook"
              title="Facebook"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings?.instagram || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-emerald-50 shrink-0"
              aria-label="Instagram"
              title="Instagram"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings?.youtube || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-emerald-50 shrink-0"
              aria-label="YouTube"
              title="YouTube"
            >
              <FaYoutube className="w-3.5 h-3.5" />
            </a>

            <a
              href={settings?.twitter || 'https://x.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-white text-[#0b8026] flex items-center justify-center hover:scale-110 transition shadow-2xs hover:bg-emerald-50 shrink-0"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <FaXTwitter className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Middle: News & Updates Red Button + White Ticker Bar */}
          <div className="flex-1 flex items-center min-w-50 max-w-xl lg:max-w-3xl mx-2 sm:mx-3 overflow-hidden">
            <div className="hidden sm:flex bg-[#d50000] text-white px-3 py-1.5 rounded-l-md font-black text-xs whitespace-nowrap items-center gap-1 shadow-sm shrink-0">
              <FiActivity className="w-3.5 h-3.5" />
              <span>News &amp; Updates</span>
            </div>
            <div className="flex-1 bg-white h-7 flex items-center px-3 rounded-md sm:rounded-l-none sm:rounded-r-md overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-xs font-semibold text-slate-800">
                {settings?.newsTickerText || 'Welcome to Samasya Samadhan Parishad (SSP) • Free Membership & Social Welfare Mission • Helpline: +919319698759'}
              </div>
            </div>
          </div>

          {/* Right: Phone Helpline */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold shrink-0 border border-white rounded-full p-2">
            <FiPhone className="w-3.5 h-3.5" />
            <a
              href={`tel:${settings?.phone}`}
              className="hover:underline"
            >
              {settings?.phone}
            </a>
          </div>

        </div>
      </div>

      {/* ---------------- 2. MIDDLE WHITE BRANDING ROW ---------------- */}
      <div className="bg-white py-0 px-4 sm:px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo & Big Bold English Name (Hindi name removed for cleaner layout) */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 p-0 flex items-center justify-center bg-white shrink-0 overflow-hidden shadow-sm">
              <img
                src={getContentImageUrl(settings?.logoUrl) || '/logo.jpeg'}
                alt={settings?.ngoName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo.jpeg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#d50000] tracking-tight leading-tight uppercase">
                {settings?.ngoName || 'YUVA KRANTI DAL'}
              </span>
            </div>
          </Link>

          {/* Right: Red Donate Us Button with Bouncing Heart + Google Translate */}
          <div className="flex items-center gap-3">
            <Link
              href="/donation"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d50000] hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition transform hover:scale-105 animate-bounce"
            >
              <FiHeart className="w-4 h-4 text-white fill-white shrink-0" />
              <span>Donate Us</span>
            </Link>

            <div className="hidden sm:block">
              <GoogleTranslate />
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- 3. GREEN MAIN NAVIGATION BAR ---------------- */}
      <nav className="bg-[#0b8026] text-white border-t border-[#09661f]" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-0.5 font-bold text-xs h-full">
              {/* Home Icon button */}
              <Link
                href="/"
                className={`flex items-center justify-center w-11 h-11 transition ${pathname === '/'
                  ? 'bg-[#d50000] text-white shadow-inner font-black'
                  : 'bg-[#09661f] text-white hover:bg-[#075018]'
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
                          ? 'bg-[#d50000] text-white font-black shadow-inner'
                          : 'hover:bg-[#09661f] text-white'
                          }`}
                      >
                        <span>{item.label}</span>
                        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div
                          onMouseLeave={() => setActiveDropdown(null)}
                          className="absolute left-0 top-full mt-0 w-52 bg-white text-slate-800 rounded-b-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
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
                                  ? 'bg-red-50 text-[#d50000] font-black'
                                  : 'hover:bg-green-50 hover:text-[#0b8026] text-slate-700'
                                  }`}
                              >
                                {IconComponent && <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-[#d50000]' : 'text-[#0b8026]'}`} />}
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
                      ? 'bg-[#d50000] text-white font-black shadow-inner'
                      : 'hover:bg-[#09661f] text-white'
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
                className={`flex items-center gap-1 font-bold text-xs py-1.5 px-2.5 rounded-md transition ${pathname === '/' ? 'bg-[#d50000] text-white' : 'hover:bg-[#09661f]'
                  }`}
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:bg-[#09661f] rounded-lg cursor-pointer"
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
        <div className="lg:hidden bg-white text-slate-900 border-b-2 border-[#0b8026] py-3 px-4 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-1 text-xs font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg transition ${pathname === '/'
                ? 'bg-red-50 text-[#d50000] font-black'
                : 'hover:bg-green-50 text-slate-800 hover:text-[#0b8026]'
                }`}
            >
              <FiHome className={`w-4 h-4 ${pathname === '/' ? 'text-[#d50000]' : 'text-[#0b8026]'}`} />
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
                        ? 'bg-red-50 text-[#d50000] font-black'
                        : 'hover:bg-green-50 text-slate-800 hover:text-[#0b8026]'
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
                              ? 'bg-red-50 text-[#d50000] font-black'
                              : 'text-slate-600 hover:text-[#0b8026] hover:bg-slate-50'
                              }`}
                          >
                            {SubIcon ? (
                              <SubIcon className={`w-3.5 h-3.5 ${isSubActive ? 'text-[#d50000]' : 'text-[#0b8026]'}`} />
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
            {currentUser && (
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
                  <span>Sign Out ({currentUser.name})</span>
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
