'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiAward,
  FiUserPlus,
  FiUsers,
  FiShield,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiRefreshCw
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

export default function CoordinatorHubPage() {
  const { currentUser } = useNGO();
  const [stats, setStats] = useState({
    totalRecruits: 0,
    pendingRecruits: 0,
    approvedRecruits: 0,
    rejectedRecruits: 0,
    totalFeesBrought: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const isCoordinator = currentUser?.role === 'Coordinator' || currentUser?.isCoordinator;
  const [loading, setLoading] = useState(Boolean(isCoordinator));

  const loadData = async () => {
    try {
      const res = await api.get('/coordinators/my-stats');
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
      if (res.data?.recentApplications) {
        setRecentApplications(res.data.recentApplications);
      }
    } catch (err) {
      console.warn('Note fetching coordinator stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCoordinator) return;
    loadData();
  }, [isCoordinator]);

  if (!isCoordinator) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
          <FiShield className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-black">Coordinator Portal Access Restricted</h2>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          The Coordinator Hub is exclusively reserved for appointed Foundation Coordinators. Coordinators cannot self-register and are appointed by the National Administration.
        </p>
        <div className="pt-2">
          <Link
            href="/profile"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs inline-flex items-center gap-1.5"
          >
            <span>Back to Profile Overview</span>
          </Link>
        </div>
      </div>
    );
  }

  const coordinatorId = currentUser?.coordinatorId || currentUser?.memberId || 'BYK-COORD-PENDING';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-linear-to-r from-purple-900 via-purple-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-bold border border-white/20">
              <FiAward className="w-3.5 h-3.5 text-yellow-400" />
              <span>Official Leadership Wing • Yuva Kranti Dal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, Coordinator {currentUser?.name}
            </h1>
            <p className="text-xs text-purple-100 max-w-2xl leading-relaxed font-medium">
              You are vested with statutory authority to represent Yuva Kranti Dal, onboard new executive members, and lead regional welfare campaigns in your designated jurisdiction.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-bold text-purple-200">
              <span className="font-mono bg-black/30 px-3 py-1 rounded-lg border border-white/10 text-yellow-300">
                Coordinator ID: {coordinatorId}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3.5 h-3.5 text-yellow-400" />
                {currentUser?.district || 'Aligarh'}, {currentUser?.state || 'Uttar Pradesh'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Link
              href="/profile/add-member"
              className="px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>+ Add New Member</span>
            </Link>

            <Link
              href="/profile/my-members"
              className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <FiUsers className="w-4 h-4" />
              <span>View Recruited Members</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Recruits</span>
            <span className="text-xl font-black text-black">{stats.totalRecruits}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg font-bold">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pending Admin Review</span>
            <span className="text-xl font-black text-amber-700">{stats.pendingRecruits}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified &amp; Active</span>
            <span className="text-xl font-black text-emerald-700">{stats.approvedRecruits}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
            <FiDollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Collections Brought</span>
            <span className="text-xl font-black text-blue-700">₹{stats.totalFeesBrought.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/profile/add-member"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 shadow-2xs transition flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <FiUserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-black">Enroll New Member</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Submit new membership application directly under your coordination with KYC docs.
            </p>
          </div>
          <div className="pt-4 text-xs font-bold text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>Add Member Now</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/profile/my-members"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-2xs transition flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <FiUsers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-black">My Recruited Members</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Track approval status, generated Member IDs, and payments for members enrolled by you.
            </p>
          </div>
          <div className="pt-4 text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>View All ({stats.totalRecruits})</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/profile/id-card?type=coordinator"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-2xs transition flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <FiShield className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-black">Coordinator ID Badge</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              View and print your official dual-sided Coordinator ID badge with anti-tamper QR code.
            </p>
          </div>
          <div className="pt-4 text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>Open ID Badge</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/profile/appointment-letter?type=coordinator"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-2xs transition flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <FiFileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-black">Appointment Letter</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Download your official statutory letter of appointment issued under trust authority.
            </p>
          </div>
          <div className="pt-4 text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition">
            <span>View Letter</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Coordinator Authority Notice */}
      <div className="bg-purple-50/70 border-2 border-purple-200 rounded-3xl p-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
            <FiAward className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-black text-purple-950">
              Coordinator Charter &amp; Onboarding Guidelines
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              As an appointed Coordinator, you hold deliberative authority to recruit dedicated citizens into Yuva Kranti Dal. When you add a new member, ensure accurate KYC information and clear payment screenshot / UTR. The <strong>Trustee Administration</strong> carries out the final statutory approval and auto-dispatches the official Member ID and dual-sided credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Enrolled Members Preview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-black">Recent Enrolled Members</h3>
            <p className="text-xs text-slate-500 font-medium">Members enrolled under your coordination</p>
          </div>
          <Link
            href="/profile/my-members"
            className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
          >
            <span>View All Recruits →</span>
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            <p className="font-bold text-xs text-slate-700">No Members Added Yet</p>
            <p className="text-[11px] text-slate-400 mt-1">Click the button below to add your first member.</p>
            <div className="mt-3">
              <Link
                href="/profile/add-member"
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
              >
                <FiUserPlus className="w-3.5 h-3.5" />
                <span>+ Add Member</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApplications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-black">{app.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${app.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                      {app.status === 'approved' ? 'Approved by Admin' : (app.status === 'pending' ? 'Pending Admin Approval' : 'Rejected')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {app.planName} • Fee: ₹{app.feeAmount || app.amount || 250} • {new Date(app.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div className="text-right">
                  {app.assignedMemberId ? (
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      {app.assignedMemberId}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      Awaiting Trustee Verification
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
