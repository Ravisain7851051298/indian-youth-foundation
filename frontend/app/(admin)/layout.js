'use client';

import React, { useState, useEffect } from 'react';
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
  FiUserCheck,
  FiHeart,
  FiFileText,
  FiCalendar,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiSidebar,
  FiAward,
  FiActivity,
  FiPlay,
  FiBookOpen
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings, members, donations, complaints } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const authLoading = useSelector((state) => state.auth?.loading);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Active user resolution prioritizing whichever is available
  const user = currentUser || reduxUser;

  // Initialize and persist collapsed state from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('iyf_admin_sidebar_collapsed');
      if (saved === 'true') {
        setCollapsed(true);
      }
    } catch (e) { }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('iyf_admin_sidebar_collapsed', String(next));
      } catch (e) { }
      return next;
    });
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Real-time counter metrics for badge indicators
  const pendingMembers = members?.filter(m => m.status === 'pending')?.length || 0;
  const pendingDonations = donations?.filter(d => d.status === 'pending')?.length || 0;
  const pendingComplaints = complaints?.filter(c => c.status === 'pending')?.length || 0;
  const totalApprovalsPending = pendingMembers + pendingDonations;

  const navItems = [
    { label: 'Control Overview', href: '/dashboard', icon: FiHome },
    { label: 'President Message', href: '/dashboard/president-message', icon: FiUserCheck },
    { label: 'YouTube Videos', href: '/dashboard/youtube-videos', icon: FiPlay },
    { label: 'Manage Content', href: '/dashboard/managecontent', icon: FiBookOpen },
    { label: 'User Accounts', href: '/dashboard/users', icon: FiUsers },
    { label: 'Awards & Honors', href: '/dashboard/awards', icon: FiAward },
    { label: 'Approvals Center', href: '/dashboard/approvals', icon: FiCheckSquare, badge: totalApprovalsPending },
    { label: 'Members Directory', href: '/dashboard/members', icon: FiUsers },
    { label: 'Volunteer Wing', href: '/dashboard/volunteers', icon: FiUserCheck },
    { label: '80G Donations', href: '/dashboard/donations', icon: FiHeart },
    { label: 'Campaigns CMS', href: '/dashboard/campaigns', icon: FiFileText },
    { label: 'Our Services', href: '/dashboard/services', icon: FiActivity },
    { label: 'Events Management', href: '/dashboard/events', icon: FiCalendar },
    { label: 'News & Press Releases', href: '/dashboard/blogs', icon: FiFileText },
    { label: 'Photo & Video Gallery', href: '/dashboard/gallery', icon: FiImage },
    { label: 'Executive Team', href: '/dashboard/team-members', icon: FiUsers },
    { label: 'Membership Plans', href: '/dashboard/plans', icon: FiLayers },
    { label: 'Complaints & Enquries', href: '/dashboard/complaints', icon: FiAlertCircle, badge: pendingComplaints },
    { label: 'Review & Feedbacks', href: '/dashboard/feedback', icon: FiAlertCircle },
    { label: 'Email Audit Logs', href: '/dashboard/email-logs', icon: FiMail },
    { label: 'Org Certificates', href: '/dashboard/certificates', icon: FiShield },
    { label: 'NGO Master Settings', href: '/settings', icon: FiSettings }
  ];

  // Active page title resolution
  const activeItem = navItems.find(item => pathname === item.href) ||
    navItems.find(item => pathname.startsWith(item.href) && item.href !== '/dashboard') ||
    { label: 'Control Overview', href: '/dashboard', icon: FiHome };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Wait for client mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Initializing Trustee Workspace...</p>
        </div>
      </div>
    );
  }

  // If auth is still checking and user is not yet populated
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Verifying Trustee Credentials...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 text-black flex flex-col md:flex-row antialiased">
      {/* ----------------- FIXED DESKTOP SIDEBAR (COLLAPSIBLE) ----------------- */}
      <aside
        className={`hidden md:flex flex-col justify-between fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-xs select-none ${collapsed ? 'w-20' : 'w-64'
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className={`px-4 py-3 border-b border-slate-200 flex items-center transition-all ${collapsed ? 'justify-center flex-col gap-2' : 'justify-between'
            }`}>
            {!collapsed ? (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b8026] to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-700/20 font-black text-white text-base shrink-0 overflow-hidden">
                    {settings?.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={getContentImageUrl(settings.logoUrl)}
                        alt="Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      'युवा'
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-xs font-black text-black leading-tight truncate">
                      {settings?.ngoName || 'Yuva Kranti Dal'}
                    </h2>
                    <span className="text-[10px] text-[#0b8026] font-extrabold uppercase tracking-wider block truncate">
                      Trustee Admin
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b8026] to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-700/20 font-black text-white text-base shrink-0 cursor-pointer overflow-hidden"
                  onClick={toggleCollapsed}
                  title="Expand sidebar"
                >
                  {settings?.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getContentImageUrl(settings.logoUrl)}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    'युवा'
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Navigation Links Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
            {!collapsed && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1.5">
                Operations &amp; Governance
              </span>
            )}

            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              const badge = item.badge || 0;

              if (collapsed) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all ${active
                      ? 'bg-[#0b8026] text-white shadow-md shadow-emerald-800/25'
                      : 'text-slate-600 hover:text-[#0b8026] hover:bg-emerald-50'
                      }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                    {/* Floating Tooltip */}
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {badge > 0 && (
                        <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded text-[9px] font-black">
                          {badge}
                        </span>
                      )}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${active
                    ? 'bg-[#0b8026] text-white shadow-md shadow-emerald-800/20'
                    : 'text-slate-700 hover:text-[#0b8026] hover:bg-emerald-50/80'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${active ? 'bg-white text-[#0b8026]' : 'bg-emerald-100 text-[#0b8026]'
                      }`}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Actions */}
          {/* <div className={`border-t border-slate-200 bg-slate-50/60 transition-all ${collapsed ? 'p-2 space-y-2' : 'p-3 space-y-1'
            }`}>
            {collapsed ? (
              <>
                <Link
                  href="/profile"
                  className="group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl text-slate-700 hover:text-red-600 hover:bg-white transition"
                >
                  <FiShield className="w-5 h-5 text-red-600" />
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                    User Portal View
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </Link>

                <Link
                  href="/"
                  className="group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl text-slate-700 hover:text-black hover:bg-white transition"
                >
                  <FiGlobe className="w-5 h-5 text-slate-600" />
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                    View Public Website
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="group relative flex items-center justify-center w-11 h-11 mx-auto rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <FiLogOut className="w-5 h-5" />
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-red-950 text-white text-[11px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
                    Sign Out
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-950" />
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:text-red-700 hover:bg-red-50 transition"
                >
                  <FiShield className="w-4 h-4 text-red-600" />
                  <span>User Portal View</span>
                </Link>

                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-black hover:bg-white transition border border-transparent hover:border-slate-200"
                >
                  <FiGlobe className="w-4 h-4 text-slate-500" />
                  <span>View Public Website</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </>
            )}
          </div> */}
        </div>
      </aside>

      {/* ----------------- MOBILE DRAWER WITH BACKDROP ----------------- */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col justify-between shadow-2xl z-10">
            <div className="flex flex-col h-full overflow-hidden">
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0b8026] to-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                    युवा
                  </div>
                  <div>
                    <div className="text-xs font-black text-black">Trustee Admin</div>
                    <div className="text-[10px] text-slate-600 truncate max-w-[140px]">{currentUser?.name}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-black transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  const badge = item.badge || 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${active ? 'bg-[#0b8026] text-white shadow-md' : 'text-slate-800 hover:bg-emerald-50 hover:text-[#0b8026]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-white text-[#0b8026]' : 'bg-emerald-100 text-[#0b8026]'
                          }`}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-black hover:bg-white transition"
                >
                  <FiShield className="w-4 h-4 text-[#0b8026]" />
                  <span>User Portal View</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-black hover:bg-white transition"
                >
                  <FiGlobe className="w-4 h-4 text-slate-600" />
                  <span>Public Website</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MAIN ADMIN WORKSPACE WITH HEADER ----------------- */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${collapsed ? 'md:pl-20' : 'md:pl-64'
          }`}
      >
        {/* DEDICATED TOP HEADER FOR ADMIN DASHBOARD */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between gap-4 shadow-2xs">
          {/* Left section: Collapse/Expand toggles & Page Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden md:inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black transition cursor-pointer border border-slate-200"
              title={collapsed ? "Expand full sidebar" : "Collapse sidebar to icons only"}
            >
              <FiSidebar className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black transition cursor-pointer"
              aria-label="Open Admin Menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {/* Active Page Breadcrumb & Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span>Trustee Admin</span>
                <span>/</span>
                <span className="text-[#0b8026] font-black">{activeItem?.label}</span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-black truncate flex items-center gap-2">
                <span>{activeItem?.label}</span>
                {totalApprovalsPending > 0 && activeItem?.href === '/dashboard/approvals' && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                    {totalApprovalsPending} Awaiting Review
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Right section: Quick Actions & Profile Widget */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-black text-xs font-bold transition shadow-2xs"
              title="Navigate to Public Website"
            >
              <FiGlobe className="w-3.5 h-3.5 text-slate-600" />
              <span>Live Site</span>
            </Link>

            <Link
              href="/profile"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[#0b8026] text-xs font-bold transition shadow-2xs"
              title="Open User Portal View"
            >
              <FiShield className="w-3.5 h-3.5 text-[#0b8026]" />
              <span>User Portal</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 sm:border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0b8026] text-white font-extrabold flex items-center justify-center text-xs shadow-xs overflow-hidden">
                {currentUser?.photoUrl ? (
                  <img
                    src={getContentImageUrl(currentUser.photoUrl)}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'
                )}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-extrabold text-black leading-tight truncate max-w-[130px]">
                  {currentUser?.name || 'Trustee Admin'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">National Trustee</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-500 bg-emerald-50 border border-emerald-200 shadow-sm hover:text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                title="Sign Out Session"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-0 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
