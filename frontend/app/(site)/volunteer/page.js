'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiUserPlus,
  FiCheckCircle,
  FiShield,
  FiHeart,
  FiUser,
  FiLock,
  FiClock,
  FiFileText,
  FiCreditCard,
  FiArrowRight,
  FiCheck,
  FiLogIn
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

function VolunteerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  const { currentUser, settings } = useNGO();

  const isApproved = currentUser?.status === 'active' && (currentUser?.role === 'Member' || currentUser?.role === 'Volunteer');
  const isPending = currentUser?.status === 'pending';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 shadow-xs border border-emerald-200">
            <FiShield className="w-3.5 h-3.5 text-emerald-700" />
            <span>12A &amp; 80G Certified Non-Profit Organization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Volunteer &amp; Membership Enrolment
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
            Join the grassroots movement of <strong>{settings?.ngoName || 'Yuva Kranti Dal'}</strong>. All official volunteers and members receive government-recognized verifiable credentials following Trustee approval.
          </p>
        </div>

        {/* 3-Step Process Infographic Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <span className="text-2xl font-black text-emerald-500/20 absolute -top-1 -right-1 p-2">01</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-extrabold text-black text-sm">Direct Online Application</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Apply freely as a guest or with your registered account in minutes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <span className="text-2xl font-black text-emerald-500/20 absolute -top-1 -right-1 p-2">02</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-extrabold text-black text-sm">Trustee Verification</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Our executive board audits application details and statutory criteria.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <span className="text-2xl font-black text-emerald-500/20 absolute -top-1 -right-1 p-2">03</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-extrabold text-black text-sm">Credentials &amp; Documents Emailed</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Upon approval, login credentials and verified ID card are sent straight to your email.
            </p>
          </div>
        </div>

        {/* ---------------- STATE 1: USER IS LOGGED IN & APPROVED ---------------- */}
        {currentUser && isApproved && (
          <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FiCheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 inline-block">
                    Verified {currentUser.role}
                  </span>
                  <h2 className="text-xl font-black text-black">
                    Congratulations, {currentUser.name}!
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                    Your appointment has been approved by the National Executive Council. Your official Dual-Sided ID Card and Letter of Appointment are active and ready.
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-700 pt-1">
                    Official Member ID: {currentUser.memberId}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <Link
                  href="/profile/id-card"
                  className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md text-center transition flex items-center justify-center gap-2"
                >
                  <FiShield className="w-4 h-4" />
                  <span>Open Digital ID Card</span>
                </Link>
                <Link
                  href="/profile/appointment-letter"
                  className="px-5 py-3 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2"
                >
                  <FiFileText className="w-4 h-4" />
                  <span>Letter of Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STATE 2: USER IS LOGGED IN & PENDING APPROVAL ---------------- */}
        {currentUser && isPending && (
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <FiClock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 inline-block">
                  Trustee Verification in Progress
                </span>
                <h2 className="text-xl font-black text-black">
                  Application Under Review for {currentUser.name}
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                  Your application has been received and is currently undergoing administrative and bank reconciliation review.
                  Once verified by the Trustee Committee, your <strong>Digital ID Card</strong> and <strong>Formal Appointment Letter</strong> will unlock automatically in your portal.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/profile"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
              >
                Go to Profile Overview →
              </Link>
              <Link
                href="/apply-member"
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs hover:bg-slate-50 transition"
              >
                Update Payment Proof
              </Link>
            </div>
          </div>
        )}

        {/* ---------------- STATE 3: READY TO APPLY (GUEST OR LOGGED IN) ---------------- */}
        {(!currentUser || (!isApproved && !isPending)) && (
          <div className="space-y-6">
            {/* Authenticated vs Guest Status Banner */}
            {currentUser ? (
              <div className="bg-white border-2 border-slate-200 text-black p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white text-base">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-black">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-600">{currentUser.email} • Authenticated User</div>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Ready to Apply
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200 text-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <FiUserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-black">Direct Guest Enrolment Active</div>
                    <div className="text-[11px] text-slate-600">
                      You can apply directly without logging in. Upon admin approval, your login credentials will be emailed to you automatically.
                    </div>
                  </div>
                </div>
                <Link
                  href="/login?redirect=/volunteer"
                  className="shrink-0 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
                >
                  <FiLogIn className="w-3.5 h-3.5" />
                  <span>Already have an account? Sign in</span>
                </Link>
              </div>
            )}

            {/* Application Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Volunteer Service */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-emerald-600 shadow-md flex flex-col justify-between transition">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-4">
                    <FiHeart className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Grassroots Social Service
                  </span>
                  <h3 className="text-xl font-black text-black">Volunteer Enrolment</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Participate actively in community drives, free slum education, 24x7 blood helplines, environmental campaigns, and emergency disaster relief.
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-black">
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Free enrolment for active social workers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Volunteer Service Offer Letter upon approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Certificates of Appreciation for drives</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/apply-volunteer"
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 text-center transition flex items-center justify-center gap-2"
                  >
                    <span>Apply for Volunteer Service</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Option 2: Verified Member */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-emerald-600 shadow-md flex flex-col justify-between transition">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-4">
                    <FiCreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Official Trust Membership
                  </span>
                  <h3 className="text-xl font-black text-black">Verified Member Enrolment</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Become a voting/constitutional member of Yuva Kranti Dal. Receive official appointment letter, dual-sided digital ID card, and verified portal access.
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-black">
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Official Digital ID Card with QR Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Executive Appointment Letter signed by Trustees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Membership plans starting at ₹250 / year</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/apply-member"
                    className="w-full py-3 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-xs shadow-md text-center transition flex items-center justify-center gap-2"
                  >
                    <span>Choose Plan &amp; Apply for Membership</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VolunteerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading enrolment portal...</div>}>
      <VolunteerContent />
    </Suspense>
  );
}
