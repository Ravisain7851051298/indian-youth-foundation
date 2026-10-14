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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3 shadow-xs">
            <FiShield className="w-3.5 h-3.5 text-red-600" />
            <span>12A &amp; 80G Certified Non-Profit Organization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Volunteer &amp; Membership Enrolment
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
            Join the grassroots movement of <strong>{settings?.ngoName || 'Indian Youth Foundation'}</strong>. All official volunteers and members receive government-recognized verifiable credentials following Trustee approval.
          </p>
        </div>

        {/* 3-Step Process Infographic Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <span className="text-2xl font-black text-red-500/20 absolute -top-1 -right-1 p-2">01</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-extrabold text-black text-sm">Account Login / Register</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Create your secure personal account with password and confirm password.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <span className="text-2xl font-black text-red-500/20 absolute -top-1 -right-1 p-2">02</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-extrabold text-black text-sm">Submit Application</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Apply for Volunteer Service or choose a Membership Plan with your details.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
            <span className="text-2xl font-black text-red-500/20 absolute -top-1 -right-1 p-2">03</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-extrabold text-black text-sm">Admin Approval &amp; ID Card</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Trustee committee audits application; ID Card &amp; Appointment Letter unlock automatically.
            </p>
          </div>
        </div>

        {/* ---------------- STATE 1: USER IS NOT LOGGED IN ---------------- */}
        {!currentUser && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl shadow-md border border-red-200">
              <FiLock className="w-8 h-8" />
            </div>

            <div className="max-w-lg mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-black">
                Please Sign In or Register to Apply
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                To maintain the statutory compliance and legal integrity of Indian Youth Foundation (12A &amp; 80G Certified NGO), all volunteer and membership applications must be linked to a verified user account.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/login?redirect=/volunteer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2"
              >
                <FiLogIn className="w-4 h-4" />
                <span>Sign In to Apply</span>
              </Link>
              <Link
                href="/register?redirect=/volunteer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <FiUserPlus className="w-4 h-4" />
                <span>Create New User Account</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              Already have an account? Sign in above and your application will be instantly connected to your profile.
            </div>
          </div>
        )}

        {/* ---------------- STATE 2: USER IS LOGGED IN & APPROVED ---------------- */}
        {currentUser && isApproved && (
          <div className="bg-white border-2 border-red-500/30 rounded-3xl p-6 sm:p-10 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                  ✓
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-900 inline-block">
                    Verified {currentUser.role}
                  </span>
                  <h2 className="text-xl font-black text-black">
                    Congratulations, {currentUser.name}!
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed max-w-xl">
                    Your appointment has been approved by the National Executive Council. Your official Dual-Sided ID Card and Letter of Appointment are active and ready.
                  </p>
                  <p className="text-xs font-mono font-bold text-red-600 pt-1">
                    Official Member ID: {currentUser.memberId}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <Link
                  href="/profile/id-card"
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md text-center transition flex items-center justify-center gap-2"
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

        {/* ---------------- STATE 3: USER IS LOGGED IN & PENDING APPROVAL ---------------- */}
        {currentUser && isPending && (
          <div className="bg-white border-2 border-red-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                ⏳
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-900 inline-block">
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
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition"
              >
                Go to Profile Overview →
              </Link>
              <Link
                href="/profile/apply-member"
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs hover:bg-slate-50 transition"
              >
                Update Payment Proof
              </Link>
            </div>
          </div>
        )}

        {/* ---------------- STATE 4: LOGGED IN USER READY TO APPLY ---------------- */}
        {currentUser && !isApproved && !isPending && (
          <div className="space-y-6">
            {/* Authenticated User Status Bar */}
            <div className="bg-white border-2 border-slate-200 text-black p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white text-base">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-black">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-600">{currentUser.email} • Authenticated User</div>
                </div>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                Ready to Apply
              </span>
            </div>

            {/* Application Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Volunteer Service */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-red-500 shadow-md flex flex-col justify-between transition">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mb-4">
                    <FiHeart className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Grassroots Social Service
                  </span>
                  <h3 className="text-xl font-black text-black">Volunteer Enrolment</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Participate actively in community drives, free slum education, 24x7 blood helplines, environmental campaigns, and emergency disaster relief.
                  </p>
                  
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-black">
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Free enrolment for active social workers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Volunteer Service Offer Letter upon approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Certificates of Appreciation for drives</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/profile/apply-volunteer"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 text-center transition flex items-center justify-center gap-2"
                  >
                    <span>Apply for Volunteer Service</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Option 2: Verified Member */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-red-500 shadow-md flex flex-col justify-between transition">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mb-4">
                    <FiCreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Official Trust Membership
                  </span>
                  <h3 className="text-xl font-black text-black">Verified Member Enrolment</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    Become a voting/constitutional member of Indian Youth Foundation. Receive official appointment letter, dual-sided digital ID card, and verified portal access.
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-black">
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Official Digital ID Card with QR Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Executive Appointment Letter signed by Trustees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Membership plans starting at ₹250 / year</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/profile/apply-member"
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
