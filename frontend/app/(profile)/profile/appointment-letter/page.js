'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  FiPrinter, 
  FiFileText, 
  FiCheckCircle, 
  FiLock,
  FiShield,
  FiDownload
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function AppointmentLetterPage() {
  const { currentUser, settings } = useNGO();
  const letterRef = useRef(null);

  const isVerified = currentUser?.status === 'active' && currentUser?.appointmentLetterGenerated;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FiFileText className="text-orange-600 w-5 h-5" />
            <span>Formal Letter of Appointment &amp; Offer Letter</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Official statutory appointment document issued by the National Executive Council.
          </p>
        </div>

        {isVerified && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print Appointment Letter</span>
          </button>
        )}
      </div>

      {/* ----------------- LOCKED STATE IF UNVERIFIED ----------------- */}
      {!isVerified ? (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
              <FiLock className="w-8 h-8" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 inline-block mb-1">
                Executive Desk Notice
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Appointment Letter Locked - Committee Verification Pending
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-lg mx-auto">
                Formal letters of appointment carrying the official seal of the National President are legally binding documents.
                Under statutory rules, appointment letters are minted and dispatched only after verification of membership payment screenshots by our audit committee.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/profile/apply-member"
                className="px-6 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition"
              >
                Submit Payment Screenshot →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- UNLOCKED OFFICIAL LETTERHEAD DOCUMENT ----------------- */
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your formal Letter of Appointment is verified, digitally stamped by the National President, and recorded in the Trust Register.
            </span>
          </div>

          <div
            ref={letterRef}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-xl max-w-3xl mx-auto text-slate-800 print:shadow-none print:border-none print:p-4 space-y-6"
          >
            {/* Letterhead Header */}
            <div className="border-b-2 border-orange-500 pb-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings?.logoUrl || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                  alt="Trust Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h1 className="text-xl sm:text-2xl font-black text-orange-600 tracking-wide leading-tight">
                    INDIAN YOUTH FOUNDATION
                  </h1>
                  <h2 className="text-sm font-black text-slate-800">
                    भारतीय युवा क्रांति (राष्ट्रीय सामाजिक न्यास)
                  </h2>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 font-medium">
                Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>421/2019</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br/>
                Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
              </div>

              <div className="text-[10px] text-slate-500 pt-1">
                Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 • Helpline: +91 93196 98759
              </div>
            </div>

            {/* Reference & Date */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <div>
                Ref. No: <span className="font-mono text-slate-900">BYK/APPT/2026/{(currentUser?.memberId || '101').replace('BYK-', '')}</span>
              </div>
              <div>
                Date: <span className="text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-500">To,</p>
              <h3 className="text-sm font-black text-slate-900">{currentUser?.name}</h3>
              <p className="text-slate-600 font-mono">Member ID: {currentUser?.memberId}</p>
              <p className="text-slate-600">{currentUser?.address || 'Krishna Vihar, Pala Road, Aligarh'}</p>
              <p className="text-slate-600">{currentUser?.district || 'Aligarh'}, {currentUser?.state || 'Uttar Pradesh'}</p>
            </div>

            {/* Subject */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-xl">
              <p className="text-xs font-black text-slate-900">
                SUBJECT: LETTER OF APPOINTMENT AS &ldquo;{currentUser?.designation?.toUpperCase() || 'ACTIVE SOCIAL WORKER'}&rdquo; (MEMBERSHIP TIER: {currentUser?.membershipPlan?.toUpperCase() || 'ACTIVE YOUTH MEMBER'})
              </p>
            </div>

            {/* Letter Body */}
            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>
                Dear <strong>{currentUser?.name}</strong>,
              </p>
              <p>
                We are pleased to inform you that upon careful review and verification of your application and statutory contribution receipt, the Board of Trustees and the National Executive Committee of <strong>Indian Youth Foundation (Bharatiya Yuva Kranti)</strong> have formally approved your appointment as an active member in our nationwide youth movement.
              </p>
              <p>
                In this esteemed role, you are entrusted with representing the core mission of our organization—uplifting underprivileged children through education, organizing voluntary blood donation helplines, promoting environmental sustainability, and extending humanitarian relief to vulnerable families across India.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 font-medium">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">Terms of Appointment:</p>
                <p>1. <strong>Tenure &amp; Validity:</strong> Your appointment is active under the charter of the Foundation and subject to renewal in accordance with your chosen plan.</p>
                <p>2. <strong>Code of Ethics:</strong> You agree to uphold absolute transparency, humanitarian dignity, and non-partisan social service at all times.</p>
                <p>3. <strong>Identity Badge:</strong> Your digital ID Card bears a unique statutory anti-tamper QR code linking to our national verification registry.</p>
              </div>

              <p>
                We warmly welcome you into our family of nation-builders and look forward to your exemplary leadership in transforming society.
              </p>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-8 border-t border-slate-200 flex items-end justify-between">
              {/* Trust Seal */}
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings?.officialSealUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                  alt="Official Seal"
                  className="w-16 h-16 object-contain mx-auto"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                  Official Seal of the Trust
                </span>
              </div>

              {/* President Signature */}
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings?.presidentSignatureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt="President Signature"
                  className="h-10 object-contain mx-auto"
                />
                <div className="mt-1">
                  <h4 className="text-xs font-black text-slate-900">Dr. Vikram Sharma</h4>
                  <p className="text-[10px] text-slate-500 font-bold">National President &amp; Founder</p>
                  <p className="text-[9px] text-slate-400">Indian Youth Foundation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
