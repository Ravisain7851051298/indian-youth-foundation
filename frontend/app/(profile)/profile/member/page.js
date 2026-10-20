'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiCreditCard, 
  FiShield, 
  FiFileText, 
  FiAward, 
  FiCheckCircle, 
  FiCheck, 
  FiClock, 
  FiArrowRight, 
  FiDownload, 
  FiUserCheck,
  FiAlertCircle,
  FiExternalLink
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';

export default function ProfileMemberPage() {
  const { currentUser, settings } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const isMember = (
    effectiveUser?.role === 'Member' || 
    effectiveUser?.role === 'Admin' || 
    effectiveUser?.isMember || 
    !!effectiveUser?.memberId || 
    effectiveUser?.membershipApplication?.status === 'approved'
  );

  const memberApp = effectiveUser?.membershipApplication;
  const isPending = effectiveUser?.status === 'pending' || memberApp?.status === 'pending';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <FiCreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Constitutional Governance Wing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Official Foundation Membership
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Verified membership credentials, statutory privileges, and executive council status under Section 12A &amp; 80G.
          </p>
        </div>

        {isMember && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/profile/id-card?type=member"
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center gap-1.5"
            >
              <FiShield className="w-4 h-4" />
              <span>Member ID Card</span>
            </Link>
            <Link
              href="/profile/appointment-letter"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <FiFileText className="w-4 h-4" />
              <span>Appointment Letter</span>
            </Link>
          </div>
        )}
      </div>

      {/* ----------------- MEMBER STATUS DISPLAY ----------------- */}
      {isMember ? (
        <div className="space-y-6">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs inline-block">
                  Verified Active Member
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  {effectiveUser?.name}
                </h2>
                <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                  You are officially enrolled as a verified member of <strong>Yuva Kranti Dal</strong>. Your statutory rights include voting participation in the annual general assembly, digital identity verification, and community representation.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-emerald-200 block">Official Membership ID</span>
                <span className="text-xl font-mono font-black text-white block mt-0.5">
                  {effectiveUser?.memberId || 'MEM-VERIFIED'}
                </span>
                <span className="text-[10px] text-emerald-200 mt-1 inline-flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3 text-emerald-300" /> Anti-Fraud Verifiable
                </span>
              </div>
            </div>
          </div>

          {/* Core Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Enrolment Plan</span>
              <span className="font-black text-black text-sm mt-1 block">
                {effectiveUser?.membershipPlan || memberApp?.planName || 'Standard Constitutional Member'}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Active &amp; Compliant</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Designation / Role</span>
              <span className="font-black text-black text-sm mt-1 block">
                {effectiveUser?.designation || 'Active Social Worker'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Executive Council</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Blood Group on Record</span>
              <span className="font-mono font-black text-red-600 text-sm mt-1 block">
                {effectiveUser?.bloodGroup || 'O+'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Donor Registry Sync</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Trustees Verification</span>
              <span className="font-black text-emerald-700 text-sm mt-1 flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Statutorily Approved</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">12A &amp; 80G Certified</span>
            </div>
          </div>

          {/* Quick Access Documents */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-black text-black text-base flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Your Official Membership Documents</span>
              <span className="text-xs text-slate-500 font-normal">Instant Digital Download</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Official Member ID Card</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Dual-sided laminated identity badge with anti-tamper QR code and national president seal.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/id-card?type=member"
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Open Member ID Card</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Appointment Letter</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Official letterhead appointment document recognized under Trust Act for institutional verification.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/appointment-letter"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Appointment Letter</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Member Certificates of Honor</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Verifiable Certificates of Appreciation awarded for social leadership, drives, and tenure.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/certificates"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>View My Certificates</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- NOT A MEMBER YET (APPLICATION INFO) ----------------- */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-red-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-2xl shrink-0 border border-red-200 shadow-inner">
                  <FiCreditCard className="w-7 h-7 text-red-600" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                      Constitutional Membership
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• Not Enrolled</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-black">
                    Join as an Official Member of Yuva Kranti Dal
                  </h2>
                  <p className="text-xs text-black leading-relaxed max-w-2xl font-medium">
                    Become a voting, verified member of an official 12A &amp; 80G Certified Non-Governmental Organization registered under Indian Trust Bylaws.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href="/profile/apply-member"
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply for Membership Now</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Member Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-red-600 font-black">
                  <FiShield className="w-4 h-4" />
                  <span>Verifiable Photo ID Card</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Official dual-sided digital identity card signed by National President with anti-fraud QR code for field authorization.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-red-600 font-black">
                  <FiFileText className="w-4 h-4" />
                  <span>Statutory Appointment Letter</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Formal appointment letter printed with government registration numbers, 12A/80G orders, and Trust seals.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-red-600 font-black">
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Voting &amp; Executive Council</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Direct voting privileges in the annual general assembly and opportunity to lead district-level youth welfare committees.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">
                Annual membership fees directly support grassroots child education and emergency blood banks.
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/members"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-black font-bold text-xs hover:bg-slate-50 transition"
                >
                  Explore Member Directory
                </Link>
                <Link
                  href="/profile/apply-member"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <span>Start Application</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
