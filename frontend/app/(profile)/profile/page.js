'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiUser, 
  FiCreditCard, 
  FiFileText, 
  FiAward, 
  FiHeart, 
  FiShield, 
  FiArrowRight,
  FiUploadCloud
} from 'react-icons/fi';
import { useEffect } from 'react';
import { useNGO } from '@/context/NGOContext';

export default function ProfileOverviewPage() {
  const { currentUser, settings, refreshUser } = useNGO();

  useEffect(() => {
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  const isVerified = currentUser?.status === 'active';
  const isPending = currentUser?.status === 'pending';

  return (
    <div className="space-y-6">
      {/* ----------------- TOP STATUS HERO BANNER ----------------- */}
      {isPending ? (
        <div className="bg-red-50/50 border-2 border-red-300 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                ⏳
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-200 text-red-900 inline-block">
                  Statutory Verification Desk
                </span>
                <h2 className="text-lg sm:text-xl font-black text-black">
                  Application Under Review by Trustees
                </h2>
                <p className="text-xs text-black leading-relaxed max-w-2xl font-medium">
                  <strong>Zero-Fraud Institutional Policy:</strong> To protect the legal integrity of Indian Youth Foundation (12A &amp; 80G Certified NGO), no official credentials (ID Cards, Formal Appointment Letters, or 80G Tax Receipts) are issued automatically.
                  Our administrative committee validates your payment screenshot and UTR against bank ledgers before activating credentials.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/profile/apply-member"
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 text-center transition flex items-center justify-center gap-1.5"
              >
                <FiUploadCloud className="w-4 h-4" />
                <span>Upload Payment Proof</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                ✓
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 inline-block">
                  Verified Active Credentials
                </span>
                <h2 className="text-lg sm:text-xl font-black text-black">
                  Welcome, {currentUser?.name}!
                </h2>
                <p className="text-xs text-black leading-relaxed max-w-2xl font-medium">
                  Your appointment as <strong>{currentUser?.designation || 'Active Social Worker'}</strong> has been officially approved by the National Executive Council.
                  Your dual-sided ID card and letter of appointment are active and verified.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/profile/id-card"
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 text-center transition flex items-center justify-center gap-1.5"
              >
                <FiShield className="w-4 h-4" />
                <span>Open Digital ID Card</span>
              </Link>
              <Link
                href="/profile/appointment-letter"
                className="px-5 py-2.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
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
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiCreditCard className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-black text-black text-sm">Membership Plan</h3>
          <p className="text-[11px] text-black font-medium mt-1">
            {currentUser?.membershipPlan || 'Choose custom plan & upload payment proof'}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>Manage Plan</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 2: Volunteer Wing */}
        <Link
          href="/profile/apply-volunteer"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiUser className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-black text-black text-sm">Volunteer Service</h3>
          <p className="text-[11px] text-black font-medium mt-1">
            Participate in community drives, blood helplines &amp; teaching.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>Volunteer Wings</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 3: 80G Receipts */}
        <Link
          href="/profile/donations"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiHeart className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-black text-black text-sm">80G Tax Receipts</h3>
          <p className="text-[11px] text-black font-medium mt-1">
            Download verified 80G tax exemption receipts for IT returns.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>View Receipts</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 4: Certificates */}
        <Link
          href="/profile/certificates"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-2xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiAward className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-black text-black text-sm">Certificates</h3>
          <p className="text-[11px] text-black font-medium mt-1">
            National citations conferred by the Board of Trustees.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>View Awards</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* ----------------- REGISTRATION & TRUST METADATA CARD ----------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <h3 className="font-black text-black text-sm mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Official Trust Enrolment Profile</span>
          <span className="text-xs font-normal text-black font-medium">
            Registered Head Office: Krishna Vihar Pala Road Aligarh
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-black font-semibold block">Full Legal Name</span>
            <span className="font-bold text-black text-sm mt-0.5 block">{currentUser?.name}</span>
          </div>
          <div>
            <span className="text-black font-semibold block">Registered Email</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.email}</span>
          </div>
          <div>
            <span className="text-black font-semibold block">Verified Mobile</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.phone}</span>
          </div>
          <div>
            <span className="text-black font-semibold block">Assigned Member / Reg. ID</span>
            <span className="font-mono font-bold text-red-600 mt-0.5 block">
              {currentUser?.memberId || 'Verification Pending'}
            </span>
          </div>
          <div>
            <span className="text-black font-semibold block">Blood Group</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.bloodGroup || 'O+'}</span>
          </div>
          <div>
            <span className="text-black font-semibold block">Designation / Role</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.designation || currentUser?.role}</span>
          </div>
          <div>
            <span className="text-black font-semibold block">District / State</span>
            <span className="font-bold text-black mt-0.5 block">
              {currentUser?.district || 'Aligarh'}, {currentUser?.state || 'Uttar Pradesh'}
            </span>
          </div>
          <div>
            <span className="text-black font-semibold block">Verification Status</span>
            <span className={`inline-block mt-0.5 font-bold ${isVerified ? 'text-emerald-700 font-bold' : 'text-red-600'}`}>
              {isVerified ? '✓ Verified by Trustee Board' : '⏳ Audit Clearance Pending'}
            </span>
          </div>
          <div>
            <span className="text-black font-semibold block">Statutory Act Registration</span>
            <span className="font-bold text-black mt-0.5 block">
              {settings?.registrationNo || '421/2019'} (12A &amp; 80G Certified)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
