'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FiGrid,
  FiCreditCard,
  FiUsers,
  FiTarget,
  FiClock,
  FiDownload,
  FiAward,
  FiPlay,
  FiSettings,
  FiEye,
  FiPrinter,
  FiUser,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiCalendar,
  FiActivity,
  FiPieChart,
  FiBarChart2,
  FiFileText,
  FiArrowUpRight,
  FiHeart,
  FiShield,
  FiCheck,
  FiUserCheck
} from 'react-icons/fi';
import { ADMIN_NAV_ITEMS } from '@/components/AdminSidebar';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function DashboardPage() {
  const {
    currentUser,
    members = [],
    donations = [],
    campaigns = [],
    complaints = [],
    settings,
    verifyMember,
    setMemberStatus
  } = useNGO();

  const isAdmin = currentUser?.role === 'Admin';
  const isTeam = currentUser?.role === 'TeamMember';

  // Interactive Chart States
  const [timeRange, setTimeRange] = useState('6m'); // '7d' | '30d' | '6m' | '1y'
  const [chartMetric, setChartMetric] = useState('amount'); // 'amount' | 'donors'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredDonutIdx, setHoveredDonutIdx] = useState(null);
  const [hoveredBarIdx, setHoveredBarIdx] = useState(null);
  const [activeRecentTab, setActiveRecentTab] = useState('donations'); // 'donations' | 'members'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication Gates
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🔒
          </div>
          <h2 className="text-xl font-black text-slate-900">Dashboard Access Required</h2>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Please log in with your credentials to access the administrative controls or member profile.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              Go to Login Page
            </Link>
            <Link
              href="/profile"
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              View Member Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If Member or Volunteer, route to profile dashboard
  if (!isAdmin && !isTeam) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            👤
          </div>
          <h2 className="text-xl font-black text-slate-900">Member Profile Dashboard</h2>
          <p className="text-xs text-slate-600 mt-2">
            Welcome, <strong>{currentUser.name}</strong>! Your official digital ID Card, Appointment Letter, and Certificates are available in your Profile Dashboard.
          </p>
          <div className="mt-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              <FiUser className="w-4 h-4" />
              <span>Open My Profile &amp; ID Card Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Core Stats
  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const pendingMembers = members.filter(m => m.status === 'pending');
  const activeMembers = members.filter(m => m.status === 'active');
  const pendingDonations = donations.filter(d => d.status === 'pending');
  const totalVerifiedMembers = activeMembers.length;
  const totalReceiptsCount = donations.filter(d => Boolean(d.receiptNumber)).length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Safe date parser
  const parseSafeDate = (d) => {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // -------------------------------------------------------------
  // Dynamic Chart 1: Interactive Real-Time Donation Inflow Trends
  // 100% REAL DATA from database - no simulated or mock metrics
  // -------------------------------------------------------------
  const trendData = useMemo(() => {
    const validDonations = donations.filter(d => d.status !== 'rejected');
    const now = new Date();

    if (timeRange === '7d') {
      const points = [];
      for (let i = 6; i >= 0; i--) {
        const targetDay = new Date(now);
        targetDay.setDate(now.getDate() - i);
        const y = targetDay.getFullYear();
        const m = targetDay.getMonth();
        const dateNum = targetDay.getDate();
        const label = targetDay.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });

        const matching = validDonations.filter(item => {
          const dt = parseSafeDate(item.date || item.createdAt);
          return dt && dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === dateNum;
        });

        const amt = matching.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        points.push({
          label,
          amount: amt,
          donors: matching.length,
          growth: '0%'
        });
      }

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          points[i].growth = points[i].amount > 0 ? '+100%' : '0%';
        } else {
          const prev = points[i - 1].amount;
          const curr = points[i].amount;
          if (prev === 0 && curr === 0) {
            points[i].growth = '0%';
          } else if (prev === 0 && curr > 0) {
            points[i].growth = '+100%';
          } else {
            const pct = Math.round(((curr - prev) / prev) * 100);
            points[i].growth = `${pct >= 0 ? '+' : ''}${pct}%`;
          }
        }
      }
      return points;
    }

    if (timeRange === '30d') {
      const weeks = [
        { label: 'Week 1', startDaysAgo: 28, endDaysAgo: 21 },
        { label: 'Week 2', startDaysAgo: 21, endDaysAgo: 14 },
        { label: 'Week 3', startDaysAgo: 14, endDaysAgo: 7 },
        { label: 'Week 4', startDaysAgo: 7, endDaysAgo: 0 }
      ];

      const points = weeks.map(w => {
        const start = new Date(now);
        start.setDate(now.getDate() - w.startDaysAgo);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setDate(now.getDate() - w.endDaysAgo);
        end.setHours(23, 59, 59, 999);

        const matching = validDonations.filter(item => {
          const dt = parseSafeDate(item.date || item.createdAt);
          return dt && dt >= start && dt <= end;
        });

        const amt = matching.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        return {
          label: w.label,
          amount: amt,
          donors: matching.length,
          growth: '0%'
        };
      });

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          points[i].growth = points[i].amount > 0 ? '+100%' : '0%';
        } else {
          const prev = points[i - 1].amount;
          const curr = points[i].amount;
          if (prev === 0 && curr === 0) {
            points[i].growth = '0%';
          } else if (prev === 0 && curr > 0) {
            points[i].growth = '+100%';
          } else {
            const pct = Math.round(((curr - prev) / prev) * 100);
            points[i].growth = `${pct >= 0 ? '+' : ''}${pct}%`;
          }
        }
      }
      return points;
    }

    if (timeRange === '1y') {
      const points = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        const label = d.toLocaleDateString('en-IN', { month: 'short' });

        const matching = validDonations.filter(item => {
          const dt = parseSafeDate(item.date || item.createdAt);
          return dt && dt.getFullYear() === y && dt.getMonth() === m;
        });

        const amt = matching.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        points.push({
          label,
          amount: amt,
          donors: matching.length,
          growth: '0%'
        });
      }

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          points[i].growth = points[i].amount > 0 ? '+100%' : '0%';
        } else {
          const prev = points[i - 1].amount;
          const curr = points[i].amount;
          if (prev === 0 && curr === 0) {
            points[i].growth = '0%';
          } else if (prev === 0 && curr > 0) {
            points[i].growth = '+100%';
          } else {
            const pct = Math.round(((curr - prev) / prev) * 100);
            points[i].growth = `${pct >= 0 ? '+' : ''}${pct}%`;
          }
        }
      }
      return points;
    }

    // Default '6m'
    const points = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const label = d.toLocaleDateString('en-IN', { month: 'short' });

      const matching = validDonations.filter(item => {
        const dt = parseSafeDate(item.date || item.createdAt);
        return dt && dt.getFullYear() === y && dt.getMonth() === m;
      });

      const amt = matching.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      points.push({
        label,
        amount: amt,
        donors: matching.length,
        growth: '0%'
      });
    }

    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        points[i].growth = points[i].amount > 0 ? '+100%' : '0%';
      } else {
        const prev = points[i - 1].amount;
        const curr = points[i].amount;
        if (prev === 0 && curr === 0) {
          points[i].growth = '0%';
        } else if (prev === 0 && curr > 0) {
          points[i].growth = '+100%';
        } else {
          const pct = Math.round(((curr - prev) / prev) * 100);
          points[i].growth = `${pct >= 0 ? '+' : ''}${pct}%`;
        }
      }
    }
    return points;
  }, [timeRange, donations]);

  // SVG Area Chart Coordinate Mapping
  const chartMaxVal = useMemo(() => {
    const vals = trendData.map(d => chartMetric === 'amount' ? d.amount : d.donors);
    const max = Math.max(...vals, 0);
    return max > 0 ? max : (chartMetric === 'amount' ? 1000 : 5);
  }, [trendData, chartMetric]);

  const svgCoords = useMemo(() => {
    const W = 620;
    const H = 200;
    const padX = 40;
    const padY = 25;
    const availW = W - padX * 2;
    const availH = H - padY * 2;

    const points = trendData.map((d, i) => {
      const val = chartMetric === 'amount' ? d.amount : d.donors;
      const x = padX + (i / Math.max(trendData.length - 1, 1)) * availW;
      const y = H - padY - (val / chartMaxVal) * availH;
      return { x, y, data: d };
    });

    if (points.length < 2) return { path: '', area: '', points: [] };

    // Cubic Bézier spline
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2.5;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 2.5;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const area = `${path} L ${points[points.length - 1].x} ${H - padY} L ${points[0].x} ${H - padY} Z`;

    return { path, area, points };
  }, [trendData, chartMetric, chartMaxVal]);

  // -------------------------------------------------------------
  // Dynamic Chart 2: Cause Allocation
  // Real aggregates grouped by campaignTitle from donations
  // -------------------------------------------------------------
  const donutCauses = useMemo(() => {
    const validDonations = donations.filter(d => d.status !== 'rejected');
    const colorPalette = ['#0b8026', '#059669', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

    const map = {};
    let grandTotal = 0;

    validDonations.forEach(d => {
      const cause = (d.campaignTitle || 'General Welfare Fund').trim();
      const amt = Number(d.amount || 0);
      map[cause] = (map[cause] || 0) + amt;
      grandTotal += amt;
    });

    const entries = Object.entries(map).filter(([_, amt]) => amt > 0);

    if (entries.length === 0) {
      return [
        { name: 'General Social Welfare Fund', percentage: 100, amount: 0, color: '#0b8026' }
      ];
    }

    entries.sort((a, b) => b[1] - a[1]);

    const topEntries = entries.slice(0, 5);
    const restAmount = entries.slice(5).reduce((sum, [_, amt]) => sum + amt, 0);

    const items = topEntries.map(([name, amt], idx) => ({
      name,
      amount: amt,
      percentage: grandTotal > 0 ? Math.round((amt / grandTotal) * 100) : 0,
      color: colorPalette[idx % colorPalette.length]
    }));

    if (restAmount > 0) {
      items.push({
        name: 'Other Welfare Causes',
        amount: restAmount,
        percentage: grandTotal > 0 ? Math.round((restAmount / grandTotal) * 100) : 0,
        color: '#64748b'
      });
    }

    const sumPct = items.reduce((s, it) => s + it.percentage, 0);
    if (sumPct > 0 && sumPct !== 100 && items.length > 0) {
      items[0].percentage += (100 - sumPct);
    }

    return items;
  }, [donations]);

  // -------------------------------------------------------------
  // Dynamic Chart 3: Real Member vs Volunteer Velocity
  // -------------------------------------------------------------
  const enrolmentVelocity = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();
      const monthLabel = d.toLocaleDateString('en-IN', { month: 'short' });

      const monthMembers = members.filter(m => {
        const dt = parseSafeDate(m.createdAt || m.verifiedAt);
        const isMem = m.role === 'Member' || m.isMember;
        return isMem && dt && dt.getFullYear() === mYear && dt.getMonth() === mMonth;
      }).length;

      const monthVolunteers = members.filter(m => {
        const dt = parseSafeDate(m.createdAt || m.verifiedAt);
        const isVol = m.role === 'Volunteer' || m.isVolunteer;
        return isVol && dt && dt.getFullYear() === mYear && dt.getMonth() === mMonth;
      }).length;

      result.push({
        month: monthLabel,
        members: monthMembers,
        volunteers: monthVolunteers
      });
    }
    return result;
  }, [members]);

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#0b8026] ring-2 ring-emerald-500/20 p-0.5 bg-white flex items-center justify-center overflow-hidden shadow-xs shrink-0">
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
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {isAdmin ? 'Admin Master Control & Analytics Hub' : 'Team Member Operations Hub'}
              </h1>
              <p className="text-xs text-slate-500">
                Organization: <strong className="text-slate-800">{settings?.ngoName || 'Yuva Kranti Dal'}</strong> • National Executive &amp; Trustee Operations
              </p>
            </div>
          </div>
        </div>

        {/* Quick Exports & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Refresh Metrics"
            aria-label="Refresh Metrics"
          >
            <FiRefreshCw className={`w-4 h-4 text-emerald-700 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <a
            href="/api/members/export/excel"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shadow-2xs"
            title="Export Members Directory"
          >
            <FiDownload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Members Excel</span>
          </a>

          <a
            href="/api/donations/export/excel"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition shadow-2xs"
            title="Export 80G Donations"
          >
            <FiDownload className="w-3.5 h-3.5 text-blue-600" />
            <span>Donations Excel</span>
          </a>

          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <FiSettings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Pending Approvals Urgent Attention Banner */}
      {(pendingMembers.length > 0 || pendingDonations.length > 0) && (
        <div className="mx-3 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>Action Required: Verification Desk</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                  {pendingMembers.length + pendingDonations.length} Pending
                </span>
              </h3>
              <p className="text-xs text-amber-900 mt-0.5">
                {pendingMembers.length} member application(s) and {pendingDonations.length} 80G donation(s) require payment proof audit before ID cards and official tax receipts are minted.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/approvals"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Open Approvals Desk</span>
            <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 4 Interactive Executive KPI Cards */}
      <div className="mx-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 80G Donations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total 80G Donations</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <FiCreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{totalDonations.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>{donations.length} Direct Inflows</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              100% Tax Exempt
            </span>
          </div>
        </div>

        {/* Card 2: Verified Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Enrolled Members</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <FiUsers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalVerifiedMembers} <span className="text-xs text-slate-400 font-normal">Active</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">
              Total Network: <strong className="text-slate-800">{members.length}</strong>
            </span>
            {pendingMembers.length > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {pendingMembers.length} Awaiting
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                All Cleared
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Active Campaigns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Social Campaigns</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <FiTarget className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {campaigns.length} <span className="text-xs text-slate-400 font-normal">Active</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
              <FiHeart className="w-3 h-3" />
              <span>Crowdfunding</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Verified Causes
            </span>
          </div>
        </div>

        {/* Card 4: 80G Tax Exemption Receipts Minted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">80G Receipts Minted</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg group-hover:scale-110 transition">
                <FiFileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalReceiptsCount} <span className="text-xs text-slate-400 font-normal">Issued</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-700 font-bold">
              <FiCheckCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>QR Verified &amp; Signed</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
              Sec 80G Compliant
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Interactive Charts Section 1: Inflow Trend & Cause Donut */}
      {/* ------------------------------------------------------------- */}
      <div className="mx-3 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Dynamic Spline Area Chart (8 Columns) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            {/* Chart Header & Interactive Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <FiActivity className="text-emerald-700 w-4 h-4" />
                  <h3 className="text-sm font-black text-slate-900">Donation Velocity &amp; Inflow Trajectory</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Interactive real-time financial tracking of verified 80G tax deductible contributions.
                </p>
              </div>

              {/* Controls: Metric Toggle & Timeframe Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* Metric Selector */}
                <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold">
                  <button
                    onClick={() => setChartMetric('amount')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${chartMetric === 'amount' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    ₹ Amount
                  </button>
                  <button
                    onClick={() => setChartMetric('donors')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${chartMetric === 'donors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    Donors
                  </button>
                </div>

                {/* Time Range Pills */}
                <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-bold">
                  {['7d', '30d', '6m', '1y'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2 py-1 rounded-lg uppercase tracking-wider text-[10px] font-black transition cursor-pointer ${timeRange === range ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Interactive Area Chart Container */}
            <div className="relative pt-6 pb-2">
              <svg
                viewBox="0 0 620 200"
                className="w-full h-56 overflow-visible select-none"
              >
                <defs>
                  <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b8026" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#0b8026" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#0b8026" stopOpacity="0.0" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0b8026" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Horizontal Gridlines */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
                  const y = 200 - 25 - ratio * 150;
                  const labelVal = chartMetric === 'amount'
                    ? (chartMaxVal >= 1000
                      ? `₹${Math.round((chartMaxVal * ratio) / 1000)}k`
                      : `₹${Math.round(chartMaxVal * ratio)}`)
                    : Math.round(chartMaxVal * ratio);
                  return (
                    <g key={ratio}>
                      <line
                        x1="40"
                        y1={y}
                        x2="580"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x="34"
                        y={y + 3}
                        fill="#94a3b8"
                        fontSize="9"
                        textAnchor="end"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Area Gradient Fill */}
                {svgCoords.area && (
                  <path
                    d={svgCoords.area}
                    fill="url(#donationGradient)"
                  />
                )}

                {/* Curved Spline Path */}
                {svgCoords.path && (
                  <path
                    d={svgCoords.path}
                    fill="none"
                    stroke="#0b8026"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                )}

                {/* Interactive Points & Vertical Guideline */}
                {svgCoords.points.map((pt, idx) => {
                  const isHovered = hoveredPoint === idx;
                  return (
                    <g key={idx}>
                      {/* Vertical Guide on Hover */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1="25"
                          x2={pt.x}
                          y2="175"
                          stroke="#0b8026"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Visible Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 7 : 4}
                        fill={isHovered ? "#0b8026" : "#ffffff"}
                        stroke="#0b8026"
                        strokeWidth={isHovered ? 3 : 2.5}
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      {/* Transparent Hover Hitbox */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="18"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      {/* X Axis Labels */}
                      <text
                        x={pt.x}
                        y="192"
                        fill={isHovered ? "#0b8026" : "#64748b"}
                        fontSize="10"
                        fontWeight={isHovered ? "800" : "600"}
                        textAnchor="middle"
                      >
                        {pt.data.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Dynamic Tooltip Card */}
              {hoveredPoint !== null && svgCoords.points[hoveredPoint] && (
                <div
                  className="absolute pointer-events-none transition-all duration-150 bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1 z-30 min-w-37.5"
                  style={{
                    left: `${Math.min(Math.max(svgCoords.points[hoveredPoint].x - 65, 10), 450)}px`,
                    top: `${Math.max(svgCoords.points[hoveredPoint].y - 80, 0)}px`
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider pb-1 border-b border-slate-800">
                    <span>{trendData[hoveredPoint].label} Period</span>
                    <span className="text-emerald-400">{trendData[hoveredPoint].growth}</span>
                  </div>
                  <div className="text-sm font-black text-white">
                    ₹{trendData[hoveredPoint].amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Active Donors:</span>
                    <strong className="text-amber-400">{trendData[hoveredPoint].donors} Donors</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Footer Bar */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Average Donation</span>
              <div className="font-extrabold text-slate-900 mt-0.5">
                ₹{donations.length ? Math.round(totalDonations / donations.length).toLocaleString('en-IN') : '0'}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Tax Deductibility</span>
              <div className="font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1">
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>80G Active</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Audited Inflows</span>
              <div className="font-extrabold text-slate-900 mt-0.5">
                ₹{totalDonations.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Donut Chart (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FiPieChart className="text-emerald-700" />
                  <span>Cause Allocation</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dynamic split of received funds across social programs.
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                5 Causes
              </span>
            </div>

            {/* SVG Donut Visual */}
            <div className="relative flex items-center justify-center my-4">
              <svg viewBox="0 0 160 160" className="w-44 h-44 -rotate-90">
                {(() => {
                  let accumulatedOffset = 0;
                  const circumference = 2 * Math.PI * 60; // r=60 => ~376.99
                  return donutCauses.map((item, idx) => {
                    const strokeDash = (item.percentage / 100) * circumference;
                    const strokeOffset = -accumulatedOffset;
                    accumulatedOffset += strokeDash;
                    const isHovered = hoveredDonutIdx === idx;

                    return (
                      <circle
                        key={idx}
                        cx="80"
                        cy="80"
                        r="60"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={isHovered ? 20 : 16}
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredDonutIdx(idx)}
                        onMouseLeave={() => setHoveredDonutIdx(null)}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Dynamic Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                {hoveredDonutIdx !== null ? (
                  <>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">
                      {donutCauses[hoveredDonutIdx].name}
                    </span>
                    <span className="text-base font-black text-slate-900 mt-0.5">
                      {donutCauses[hoveredDonutIdx].percentage}%
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      ₹{donutCauses[hoveredDonutIdx].amount.toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Allocated
                    </span>
                    <span className="text-base font-black text-slate-900 mt-0.5">
                      100%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      ₹{totalDonations.toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Causes Legend */}
            <div className="space-y-1.5 pt-2">
              {donutCauses.map((item, idx) => {
                const isHovered = hoveredDonutIdx === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDonutIdx(idx)}
                    onMouseLeave={() => setHoveredDonutIdx(null)}
                    className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${isHovered
                      ? 'bg-slate-50 border-slate-300 shadow-2xs'
                      : 'border-transparent hover:bg-slate-50/60'
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-bold text-slate-800 text-[11px] truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-extrabold text-slate-900 text-[11px]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Interactive Charts Section 2: Onboarding Velocity & Goals */}
      {/* ------------------------------------------------------------- */}
      <div className="mx-3 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Onboarding Velocity Bar Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FiBarChart2 className="text-emerald-700" />
                  <span>Members &amp; Volunteers Enrolment Velocity</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Monthly intake comparison between fee-paying members and field volunteers.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                  <span>Members</span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <span>Volunteers</span>
                </span>
              </div>
            </div>

            {/* Bar Chart Bars */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-slate-100 px-2 pb-2">
                {enrolmentVelocity.map((item, idx) => {
                  const maxVal = Math.max(...enrolmentVelocity.map(v => Math.max(v.members, v.volunteers)), 1);
                  const memberH = Math.round((item.members / maxVal) * 100);
                  const volH = Math.round((item.volunteers / maxVal) * 100);
                  const isHovered = hoveredBarIdx === idx;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                      onMouseEnter={() => setHoveredBarIdx(idx)}
                      onMouseLeave={() => setHoveredBarIdx(null)}
                    >
                      {/* Tooltip on Hover */}
                      <div className={`text-[10px] font-bold text-slate-800 transition ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        +{item.members + item.volunteers}
                      </div>

                      {/* Side by side bars */}
                      <div className="flex items-end gap-1.5 w-full justify-center">
                        {/* Members Bar */}
                        <div
                          style={{ height: `${memberH}%` }}
                          className={`w-3.5 sm:w-4 rounded-t-lg bg-emerald-700 transition-all duration-300 ${isHovered ? 'brightness-110 shadow-md shadow-emerald-600/30' : 'opacity-90'
                            }`}
                          title={`Members: ${item.members}`}
                        ></div>

                        {/* Volunteers Bar */}
                        <div
                          style={{ height: `${volH}%` }}
                          className={`w-3.5 sm:w-4 rounded-t-lg bg-emerald-500 transition-all duration-300 ${isHovered ? 'brightness-110 shadow-md shadow-emerald-500/30' : 'opacity-90'
                            }`}
                          title={`Volunteers: ${item.volunteers}`}
                        ></div>
                      </div>

                      <span className={`text-[11px] mt-1 transition ${isHovered ? 'font-black text-slate-900' : 'font-semibold text-slate-500'}`}>
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Verified ID Cards Minted: <strong className="text-slate-900 font-mono">{activeMembers.length}</strong></span>
                <span>Active Volunteer Wing: <strong className="text-emerald-700">{members.filter(m => m.isVolunteer || m.role === 'Volunteer').length} Cadres</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Funding Goals & Progress Gauges (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FiTarget className="text-emerald-700" />
                  <span>Campaign Goal Completion</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Milestone targets for ongoing verified social campaigns.
                </p>
              </div>
              <Link
                href="/campaigns"
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>All</span>
                <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Campaign Progress Items */}
            <div className="space-y-3.5 pt-3">
              {campaigns.length > 0 ? (
                campaigns.slice(0, 4).map((c, idx) => {
                  const goalAmt = Number(c.goalAmount ?? c.goal ?? c.targetAmount ?? 100000);
                  const campaignDonations = donations.filter(d =>
                    (d.campaignId && (d.campaignId === c._id || d.campaignId === c.id)) ||
                    (d.campaign && typeof d.campaign === 'string' && d.campaign.toLowerCase() === (c.title || '').toLowerCase())
                  ).reduce((s, d) => s + Number(d.amount || 0), 0);
                  const raisedAmt = Number(c.raisedAmount ?? c.raised ?? 0) || campaignDonations;
                  const pct = goalAmt > 0 ? Math.min(Math.round((raisedAmt / goalAmt) * 100), 100) : 0;

                  return (
                    <div key={idx} className="space-y-1.5 p-2 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 truncate max-w-55" title={c.title}>
                          {c.title}
                        </span>
                        <span className="font-extrabold text-slate-900 font-mono text-[11px]">
                          {pct}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-teal-600' : 'bg-emerald-700'
                            }`}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Raised: <strong>₹{raisedAmt.toLocaleString('en-IN')}</strong></span>
                        <span>Goal: <strong>₹{goalAmt.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <FiTarget className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                  <p>No active campaigns launched yet.</p>
                  <Link href="/campaigns" className="text-emerald-700 font-bold hover:underline mt-1 inline-block">
                    + Launch First Campaign
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 18 Navigation Modules Quick Jump Hub */}
      {/* ------------------------------------------------------------- */}
      <div className="mx-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <FiShield className="text-emerald-700" />
              <span>Foundation Control Hub &amp; Module Directory (18 Modules)</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instant 1-click administrative command for all public pages, memberships, records, and statutory configurations.
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700">
            18 Modules Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 transition flex flex-col items-center text-center group shadow-2xs cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-800 flex items-center justify-center mb-2 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold line-clamp-1 group-hover:text-emerald-800">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Recent Operational Activity (Tabs: 80G Donations / Members) */}
      {/* ------------------------------------------------------------- */}
      <div className="mx-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header with Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveRecentTab('donations')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${activeRecentTab === 'donations'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
            >
              <FiCreditCard className="w-3.5 h-3.5" />
              <span>Recent 80G Donations ({donations.length})</span>
            </button>

            <button
              onClick={() => setActiveRecentTab('members')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${activeRecentTab === 'members'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
            >
              <FiUsers className="w-3.5 h-3.5" />
              <span>Member Enrolments ({members.length})</span>
            </button>
          </div>

          <Link
            href={activeRecentTab === 'donations' ? '/donation' : '/members'}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{activeRecentTab === 'donations' ? 'View All Donations Directory' : 'View Full Member Directory'}</span>
            <FiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab 1: Recent Donations Table */}
        {activeRecentTab === 'donations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt No.</th>
                  <th className="py-3 px-4">Donor Name &amp; Contact</th>
                  <th className="py-3 px-4">PAN Number</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Cause / Campaign</th>
                  <th className="py-3 px-4 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                    80G Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No donations recorded yet. When a donor contributes online or via UPI, transactions appear here immediately.
                    </td>
                  </tr>
                ) : (
                  donations.slice(0, 6).map((d) => (
                    <tr key={d._id || d.receiptNumber} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {d.receiptNumber || 'BYK-80G-PENDING'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{d.donorName}</div>
                        <div className="text-[11px] text-slate-500">{d.donorPhone || d.donorEmail || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                        {d.panNumber || 'NA'}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600 whitespace-nowrap text-sm">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 max-w-50">
                        <span className="font-bold text-slate-900 line-clamp-1">{d.campaignTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{d.paymentMethod || 'UPI'}</span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <Link
                          href={`/donation?receipt=${d.receiptNumber}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 transition cursor-pointer"
                        >
                          <FiPrinter className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Print 80G Receipt</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Recent Members Table */}
        {activeRecentTab === 'members' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No members registered yet.
                    </td>
                  </tr>
                ) : (
                  members.slice(0, 6).map((member) => {
                    const id = member.memberId || member._id;
                    const isActive = member.status === 'active';
                    return (
                      <tr key={id} className="group hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getContentImageUrl(member.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
                              }}
                            />
                            <div>
                              <div className="font-extrabold text-slate-900">{member.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{member.memberId || id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {member.designation || 'Active Youth Member'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {member.feePaid ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              ₹{member.feeAmount || 250} Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              Fee Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {isActive ? 'Active & Minted' : (member.status || 'Pending')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isActive ? (
                              <button
                                onClick={() => verifyMember(id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer transition"
                              >
                                <FiCheck className="w-3.5 h-3.5" />
                                <span>Verify &amp; Issue ID</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setMemberStatus(id, 'blocked')}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] cursor-pointer transition"
                              >
                                Block
                              </button>
                            )}
                            <Link
                              href={`/members?view=${id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition cursor-pointer"
                            >
                              View Card
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
