'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiUser, 
  FiCreditCard, 
  FiFileText, 
  FiAward, 
  FiHeart, 
  FiCheckCircle, 
  FiClock, 
  FiShield, 
  FiArrowRight,
  FiUploadCloud,
  FiShare2,
  FiAlertTriangle
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function ProfileOverviewPage() {
  const { currentUser, settings } = useNGO();

  const isVerified = currentUser?.status === 'active';
  const isPending = currentUser?.status === 'pending';

  return (
    <div className="space-y-6">
      {/* ----------------- TOP STATUS HERO BANNER ----------------- */}
      {isPending ? (
        <div className="bg-linear-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                ⏳
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 inline-block">
                  Statutory Verification Desk
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Application Under Review by Trustees
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  <strong>Zero-Fraud Institutional Policy:</strong> To protect the legal integrity of Indian Youth Foundation (12A &amp; 80G Certified NGO), no official credentials (ID Cards, Formal Appointment Letters, or 80G Tax Receipts) are issued automatically.
                  Our administrative committee validates your payment screenshot and UTR against bank ledgers before activating credentials.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/profile/apply-member"
                className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 text-center transition flex items-center justify-center gap-1.5"
              >
                <FiUploadCloud className="w-4 h-4" />
                <span>Upload Payment Proof</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                ✓
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 inline-block">
                  Verified Active Credentials
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Welcome, {currentUser?.name}!
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  Your appointment as <strong>{currentUser?.designation || 'Active Social Worker'}</strong> has been officially approved by the National Executive Council.
                  Your dual-sided ID card and letter of appointment are active and verified.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/profile/id-card"
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 text-center transition flex items-center justify-center gap-1.5"
              >
                <FiShield className="w-4 h-4" />
                <span>Open Digital ID Card</span>
              </Link>
              <Link
                href="/profile/appointment-letter"
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <FiFileText className="w-4 h-4" />
                <span>Letter of Appointment</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 4 QUICK ACCESS ACTION CARDS ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Membership Plan */}
        <Link
          href="/profile/apply-member"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-orange-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <FiCreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">Membership Plan</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {currentUser?.membershipPlan || 'Choose custom plan & upload payment proof'}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-600">
            <span>Manage Plan</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 2: Volunteer Wing */}
        <Link
          href="/profile/apply-volunteer"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <FiUser className="w-5 h-5" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">Volunteer Service</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Participate in community drives, blood helplines &amp; teaching.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
            <span>Volunteer Wings</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 3: 80G Receipts */}
        <Link
          href="/profile/donations"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <FiHeart className="w-5 h-5" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">80G Tax Receipts</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Download verified 80G tax exemption receipts for IT returns.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
            <span>View Receipts</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 4: Certificates */}
        <Link
          href="/profile/certificates"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-purple-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <FiAward className="w-5 h-5" />
          </div>
          <h3 className="font-black text-slate-900 text-sm">Certificates</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            National citations conferred by the Board of Trustees.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600">
            <span>View Awards</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* ----------------- REGISTRATION & TRUST METADATA CARD ----------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <h3 className="font-black text-slate-900 text-sm mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Official Trust Enrolment Profile</span>
          <span className="text-xs font-normal text-slate-400">
            Registered Head Office: Krishna Vihar Pala Road Aligarh
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Full Legal Name</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{currentUser?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Registered Email</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{currentUser?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Verified Mobile</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{currentUser?.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Assigned Member / Reg. ID</span>
            <span className="font-mono font-bold text-orange-600 mt-0.5 block">
              {currentUser?.memberId || 'Verification Pending'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Blood Group</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{currentUser?.bloodGroup || 'O+'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Designation / Role</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{currentUser?.designation || currentUser?.role}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">District / State</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {currentUser?.district || 'Aligarh'}, {currentUser?.state || 'Uttar Pradesh'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Verification Status</span>
            <span className={`inline-block mt-0.5 font-bold ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isVerified ? '✓ Verified by Trustee Board' : '⏳ Audit Clearance Pending'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Statutory Act Registration</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {settings?.registrationNo || '421/2019'} (12A &amp; 80G Certified)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
