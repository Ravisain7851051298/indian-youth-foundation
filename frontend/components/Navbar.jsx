'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHeart,
  FiPhone,
  FiUser,
  FiMenu,
  FiX,
  FiShield,
  FiDownload,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiCompass,
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiActivity,
  FiLayers,
  FiTarget,
  FiCalendar,
  FiFileText,
  FiImage,
  FiAward,
  FiUserPlus,
  FiMessageSquare,
  FiAlertCircle,
  FiLogOut
} from 'react-icons/fi';
import { useNGO } from '../context/NGOContext';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, settings, lang, toggleLanguage } = useNGO();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpenAccordion, setMobileOpenAccordion] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
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
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      const timer = setTimeout(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert('PWA App: You can install this website as a native application by clicking "Add to Home Screen" or the Install icon in your browser address bar.');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
  };

  // Structured navigation groups with descriptions & icons
  const navGroups = [
    {
      id: 'about',
      label: 'About Us',
      links: [
        { href: '/mission-vision', label: 'Mission & Vision', desc: 'Our statutory aims, constitution & ideology', icon: FiCompass },
        { href: '/team-members', label: 'Leadership & Board', desc: 'Trustees, directors & advisory council', icon: FiUserCheck },
        { href: '/story', label: 'Impact Stories', desc: 'Grassroots success & beneficiary journeys', icon: FiBookOpen },
        { href: '/members', label: 'Members Directory', desc: 'Verified social change-makers nationwide', icon: FiUsers },
      ]
    },
    {
      id: 'what-we-do',
      label: 'What We Do',
      links: [
        { href: '/services', label: 'Our Services', desc: 'Free education, medical aid & relief care', icon: FiActivity },
        { href: '/programs', label: 'Flagship Programs', desc: 'Structured ongoing social transformation drives', icon: FiLayers },
        { href: '/campaigns', label: 'Crowdfunding Drives', desc: 'Urgent causes requiring public donation', icon: FiTarget },
        { href: '/event', label: 'Events & Summits', desc: 'Upcoming rallies, blood camps & conferences', icon: FiCalendar },
      ]
    },
    {
      id: 'media',
      label: 'Media & Recognition',
      links: [
        { href: '/blogs', label: 'News & Press Releases', desc: 'Official updates, coverage & articles', icon: FiFileText },
        { href: '/gallery', label: 'Photo & Video Gallery', desc: 'Field activities & documentary glimpses', icon: FiImage },
        { href: '/certificates', label: 'Certificates of Honor', desc: 'Verified recognition & volunteer awards', icon: FiAward },
      ]
    },
    {
      id: 'get-involved',
      label: 'Get Involved',
      links: [
        { href: '/volunteer', label: 'Volunteer / Member Join', desc: 'Official registration with digital ID card', icon: FiUserPlus },
        { href: '/feedback', label: 'Reviews & Feedback', desc: 'Supporter testimonials & 5-star ratings', icon: FiMessageSquare },
        { href: '/complaints', label: 'Grievance Redressal', desc: 'Transparent inquiry & complaint resolution', icon: FiAlertCircle },
      ]
    }
  ];

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const toggleMobileAccordion = (id) => {
    setMobileOpenAccordion((prev) => (prev === id ? null : id));
  };

  // Helper to determine active state of a dropdown
  const isGroupActive = (group) => {
    return group.links.some(l => pathname === l.href);
  };

  return (
    <header className="sticky top-0 z-50 shadow-xs bg-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Statutory 12A & 80G notice */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full font-bold backdrop-blur-xs text-[11px]">
              <FiShield className="w-3.5 h-3.5" />
              12A & 80G Certified NGO • 50% Income Tax Exemption
            </span>
            <span className="hidden lg:inline text-red-100 text-[11px]">
              Govt. Reg: {settings?.registrationNo || 'REG/2021/NGO/DEL/8741'} | NITI Aayog: {settings?.nitiAayogDarpanId || 'DL/2021/0284729'}
            </span>
          </div>

          {/* Right Helpline & App Install */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${settings?.phone || '+91 98765 43210'}`}
              className="hidden sm:flex items-center gap-1 text-white hover:text-red-100 transition"
            >
              <FiPhone className="w-3.5 h-3.5" />
              <span className="font-semibold">{settings?.phone || '+91 98765 43210'}</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded-md text-[11px] backdrop-blur-xs transition cursor-pointer"
              title="Switch Language (English / हिंदी)"
            >
              <span>🌐</span>
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* PWA Install Button */}
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 font-bold px-2.5 py-1 rounded-md text-[11px] shadow-xs cursor-pointer transition"
              title="Install official progressive web app"
            >
              <FiDownload className="w-3 h-3" />
              <span>Install App</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* NGO Brand & Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform overflow-hidden">
                {settings?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>IYF</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl text-black leading-tight tracking-tight group-hover:text-red-600 transition-colors">
                  {settings?.ngoName || 'Indian Youth Foundation'}
                </span>
                <span className="text-[11px] font-semibold text-black tracking-wider">
                  {settings?.ngoNameHi || 'Bharatiya Yuva Kranti'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Dropdowns */}
            <div className="hidden lg:flex items-center space-x-1 font-semibold text-xs text-black">
              {/* Home link */}
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-xl transition-all ${pathname === '/'
                    ? 'text-red-600 font-extrabold bg-red-50'
                    : 'hover:text-red-600 hover:bg-red-50/50'
                  }`}
              >
                Home
              </Link>

              {/* Dropdown Groups */}
              {navGroups.map((group) => {
                const isOpen = activeDropdown === group.id;
                const active = isGroupActive(group);

                return (
                  <div key={group.id} className="relative">
                    <button
                      onClick={() => toggleDropdown(group.id)}
                      onMouseEnter={() => setActiveDropdown(group.id)}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${active || isOpen
                          ? 'text-red-600 font-extrabold bg-red-50/80'
                          : 'hover:text-red-600 hover:bg-red-50/50'
                        }`}
                      aria-expanded={isOpen}
                    >
                      <span>{group.label}</span>
                      <FiChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : 'text-slate-400'}`}
                      />
                    </button>

                    {/* Popover Dropdown Card */}
                    {isOpen && (
                      <div
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="space-y-1">
                          {group.links.map((link) => {
                            const Icon = link.icon;
                            const isCurrent = pathname === link.href;

                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${isCurrent
                                    ? 'bg-red-50 text-red-700'
                                    : 'hover:bg-red-50 text-black hover:text-red-700'
                                  }`}
                              >
                                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${isCurrent ? 'bg-red-600 text-white' : 'bg-slate-100 text-black'}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-xs">{link.label}</div>
                                  <div className="text-[11px] text-black font-medium truncate mt-0.5">{link.desc}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons: Donate, User Portal & Register */}
            <div className="hidden sm:flex items-center gap-2.5">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {currentUser.role === 'Admin' ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition bg-black text-white hover:bg-slate-900"
                        title="Admin Control Panel"
                      >
                        <FiGrid className="w-3.5 h-3.5 text-red-500" />
                        <span>Admin Panel</span>
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border border-slate-200 text-black hover:text-red-600 hover:border-red-500"
                        title="View User Portal & Credentials"
                      >
                        <FiUser className="w-3.5 h-3.5 text-black" />
                        <span>User Portal</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black text-xs font-bold transition border border-slate-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentUser.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover border border-red-500"
                      />
                      <span className="max-w-[120px] truncate">{currentUser.name}</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-black hover:border-red-500 hover:text-red-600 text-xs font-bold transition"
                  >
                    <FiUser className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition border border-red-200"
                  >
                    <FiUserPlus className="w-3.5 h-3.5 text-red-600" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Direct Donate Button */}
              <Link
                href="/donation"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-extrabold shadow-md shadow-red-600/25 hover:shadow-red-600/40 transform hover:-translate-y-0.5 transition"
              >
                <FiHeart className="w-4 h-4 fill-white" />
                <span>Donate (80G)</span>
              </Link>
            </div>

            {/* Mobile Hamburger & Donate Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/donation"
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold"
              >
                Donate
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-black hover:text-black hover:bg-slate-100 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. MOBILE SLIDE-OVER SIDEBAR DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  IYF
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-black truncate">
                    {settings?.ngoName || 'Indian Youth Foundation'}
                  </h3>
                  <span className="text-[10px] text-red-600 font-bold block">12A &amp; 80G Certified</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-black hover:bg-slate-200 cursor-pointer"
                aria-label="Close menu"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer User Bar */}
            <div className="p-4 border-b border-slate-100 bg-white">
              {currentUser ? (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-black">{currentUser.name}</div>
                      <span className="inline-block text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full mt-0.5">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {currentUser.role === 'Admin' ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-2 text-center rounded-xl bg-black text-white text-[11px] font-bold"
                        >
                          Admin Panel
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 py-2 text-center rounded-xl border border-slate-200 text-black text-[11px] font-bold"
                        >
                          User Portal
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2 text-center rounded-xl bg-red-600 text-white text-[11px] font-bold"
                      >
                        Open My Portal &amp; ID Card →
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-black font-bold text-xs"
                  >
                    <FiUser className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
                  >
                    <FiUserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Nav Accordion List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl font-bold transition ${pathname === '/' ? 'bg-red-50 text-red-600' : 'text-black hover:bg-slate-50'
                  }`}
              >
                Home
              </Link>

              {/* Direct Donate */}
              <Link
                href="/donation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold bg-red-50 text-red-700 border border-red-200"
              >
                <span className="flex items-center gap-2">
                  <FiHeart className="w-4 h-4 text-red-600" />
                  <span>Donations (Instant 80G Receipt)</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">50% Tax Free</span>
              </Link>

              {/* Nav Groups Accordion */}
              {navGroups.map((group) => {
                const isOpen = mobileOpenAccordion === group.id;

                return (
                  <div key={group.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                    <button
                      onClick={() => toggleMobileAccordion(group.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 font-bold text-black hover:text-red-600 transition"
                    >
                      <span>{group.label}</span>
                      <FiChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90 text-red-600' : 'text-slate-400'}`} />
                    </button>

                    {isOpen && (
                      <div className="px-2 pb-2 space-y-1 bg-white border-t border-slate-100">
                        {group.links.map((link) => {
                          const Icon = link.icon;
                          const isActive = pathname === link.href;

                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${isActive ? 'bg-red-50 text-red-600 font-bold' : 'text-black hover:bg-slate-50'
                                }`}
                            >
                              <Icon className="w-3.5 h-3.5 text-black" />
                              <span>{link.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <button
                onClick={handleInstallApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-300 text-red-700 bg-red-50 font-bold text-xs"
              >
                <FiDownload className="w-3.5 h-3.5" />
                <span>Install IYF Mobile App</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Logout from Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
