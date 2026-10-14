'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiGrid, 
  FiCreditCard, 
  FiUsers, 
  FiTarget, 
  FiCheckCircle, 
  FiClock, 
  FiFileText, 
  FiDownload, 
  FiAward, 
  FiAlertCircle, 
  FiPlay, 
  FiPlus, 
  FiSettings, 
  FiShare2, 
  FiEye,
  FiPrinter,
  FiUser
} from 'react-icons/fi';
import AdminSidebar, { ADMIN_NAV_ITEMS } from '@/components/AdminSidebar';
import { useNGO } from '@/context/NGOContext';

export default function DashboardPage() {
  const { 
    currentUser, 
    members, 
    donations, 
    campaigns, 
    complaints, 
    settings, 
    verifyMember, 
    setMemberStatus 
  } = useNGO();

  const isAdmin = currentUser?.role === 'Admin';
  const isTeam = currentUser?.role === 'TeamMember';

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🔒
          </div>
          <h2 className="text-xl font-black text-black">Dashboard Access Required</h2>
          <p className="text-xs text-gray-700 mt-2 font-medium">
            Please log in with your credentials to access the administrative controls or member profile.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              Go to Login Page
            </Link>
            <Link
              href="/profile"
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-xs transition cursor-pointer"
            >
              View Member Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If Member or Volunteer, route to their profile dashboard
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
              <span>Open My Profile & ID Card Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const pendingMembers = members.filter(m => m.status === 'pending');
  const activeMembers = members.filter(m => m.status === 'active');
  const pendingGrievances = complaints.filter(c => c.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Pending Approvals Attention Banner */}
      {(pendingMembers.length > 0 || donations.some(d => d.status === 'pending')) && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              ⏳
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-950">
                Action Required: Pending Applications & Payment Proofs Awaiting Verification
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                {pendingMembers.length} member application(s) and {donations.filter(d => d.status === 'pending').length} donation(s) require payment screenshot validation before official credentials and 80G tax receipts are released.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/approvals"
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 whitespace-nowrap transition"
          >
            Open Approvals Desk →
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-black flex items-center gap-2">
            <FiGrid className="text-red-600" />
            <span>
              {isAdmin ? 'Admin Master Control Dashboard' : 'Team Member Management Portal'}
            </span>
          </h1>
          <p className="text-xs text-gray-600 mt-1 font-medium">
            Organization: <strong className="text-black">{settings?.ngoName}</strong> • Real-time Members, 80G Donations & CMS Controls
          </p>
        </div>

        {/* Quick Exports & Site link */}
        <div className="flex items-center gap-2.5">
          <a
            href="/api/members/export/excel"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-black border border-slate-300 text-xs font-bold shadow-2xs transition"
            title="Download Members Excel Backup"
          >
            <FiDownload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Members Excel</span>
          </a>
          <a
            href="/api/donations/export/excel"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-black border border-slate-300 text-xs font-bold shadow-2xs transition"
            title="Download 80G Donations Excel Backup"
          >
            <FiDownload className="w-3.5 h-3.5 text-blue-600" />
            <span>80G Donations Excel</span>
          </a>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition cursor-pointer"
          >
            <FiSettings className="w-3.5 h-3.5" />
            <span>NGO Settings</span>
          </Link>
        </div>
      </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total 80G Donations</span>
              <div className="text-2xl font-black text-black mt-1">
                ₹{totalDonations.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">100% Tax Deductible</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <FiCreditCard className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Verified Members</span>
              <div className="text-2xl font-black text-black mt-1">
                {activeMembers.length}
              </div>
              <span className="text-[11px] text-red-600 font-bold">{pendingMembers.length} Pending Approval</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center text-xl">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Campaigns</span>
              <div className="text-2xl font-black text-black mt-1">
                {campaigns.length}
              </div>
              <span className="text-[11px] text-blue-600 font-bold">Crowdfunding Progress</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
              <FiTarget className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Verified Page Views</span>
              <div className="text-2xl font-black text-black mt-1">
                {Number(settings?.pageViews || 18450).toLocaleString()}
              </div>
              <span className="text-[11px] text-purple-600 font-bold">Google Analytics Active</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              <FiEye className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 18 Nav Items Quick Jump Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs mb-8">
          <h2 className="text-xs font-black text-black uppercase tracking-widest mb-5">
            Website Modules & Admin Control Hub (All 18 Areas)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-black hover:text-red-600 transition flex flex-col items-center text-center group shadow-2xs"
                >
                  <Icon className="w-5 h-5 mb-2 text-black group-hover:text-red-600" />
                  <span className="text-xs font-bold line-clamp-1 text-black group-hover:text-red-600">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pending Member Verifications Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-black flex items-center gap-2">
                <FiClock className="text-red-600" />
                <span>Member Verification & Digital ID / Appointment Card Issuance</span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Approve newly registered volunteers and members to grant official QR-verified ID Cards and Appointment Letters
              </p>
            </div>
            <Link
              href="/members"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View Full Directory →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-gray-500 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Fee Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.slice(0, 5).map((member) => (
                  <tr key={member._id || member.memberId} className="hover:bg-red-50/20">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-black">{member.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono font-bold">{member.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <div>{member.phone}</div>
                      <div className="text-[11px] text-gray-500">{member.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-black font-medium">
                      {member.designation}
                    </td>
                    <td className="py-3.5 px-4">
                      {member.feePaid ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ₹{member.feeAmount || 250} Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        member.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : (member.status === 'blocked' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-black')
                      }`}>
                        {member.status === 'active' ? 'Active' : member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {member.status !== 'active' ? (
                        <button
                          onClick={() => verifyMember(member.memberId || member._id)}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                        >
                          Verify & Issue ID
                        </button>
                      ) : (
                        <button
                          onClick={() => setMemberStatus(member.memberId || member._id, 'blocked')}
                          className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] cursor-pointer"
                        >
                          Block
                        </button>
                      )}
                      <Link
                        href={`/members?view=${member.memberId}`}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-[11px] inline-block cursor-pointer"
                      >
                        View Card
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent 80G Donations Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-black flex items-center gap-2">
                <FiCreditCard className="text-red-600" />
                <span>Recent 80G Donations Received</span>
              </h2>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Every donor receives an automated official 80G tax exemption receipt number with QR validation
              </p>
            </div>
            <Link
              href="/donation"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View All Donations →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-gray-500 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">Receipt No.</th>
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">PAN Number</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.slice(0, 4).map((d) => (
                  <tr key={d._id || d.receiptNumber} className="hover:bg-red-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                      {d.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-black">{d.donorName}</div>
                      <div className="text-[11px] text-gray-600">{d.donorPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-black font-semibold">
                      {d.panNumber || 'NA'}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {d.campaignTitle}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/donation?receipt=${d.receiptNumber}`}
                        className="px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px] inline-flex items-center gap-1 border border-red-200"
                      >
                        <FiPrinter className="w-3 h-3 text-red-600" />
                        <span>Print 80G Receipt</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Training & Marketing Video Hub */}
        <div className="bg-white text-black p-7 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">
                Foundation Admin Training &amp; Video Hub
              </span>
              <h3 className="text-lg font-black text-black mt-0.5">
                Fundraising, NGO Promotion &amp; 80G Compliance Guides
              </h3>
            </div>
            <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
              Video Tutorials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-red-300 hover:bg-red-50/20 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                  <FiPlay className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-black">How to Mobilize Members &amp; Promote NGO</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Best practices for expanding your social volunteer network using WhatsApp and social media.
                </p>
              </div>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                Watch Tutorial →
              </a>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-red-300 hover:bg-red-50/20 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                  <FiAward className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-black">Attracting Donors &amp; 80G Benefits</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Explaining 50% tax deductions to individual donors and securing corporate CSR funds.
                </p>
              </div>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                Watch Tutorial →
              </a>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-red-300 hover:bg-red-50/20 transition">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                  <FiSettings className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-black">Digital ID Card &amp; Letter Generator</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  How to generate and print verified ID cards and appointment letters with 1-click.
                </p>
              </div>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                Watch Tutorial →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }


