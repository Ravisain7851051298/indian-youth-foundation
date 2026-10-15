'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  FiPrinter, 
  FiFileText, 
  FiCheckCircle, 
  FiLock
} from 'react-icons/fi';
import { useEffect } from 'react';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function AppointmentLetterPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const letterRef = useRef(null);

  useEffect(() => {
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  const isVerified = (currentUser?.status === 'active' || currentUser?.role === 'Volunteer' || currentUser?.role === 'Member' || currentUser?.role === 'Admin') && (currentUser?.appointmentLetterGenerated || currentUser?.memberId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <FiFileText className="text-red-600 w-5 h-5" />
            <span>Formal Letter of Appointment &amp; Offer Letter</span>
          </h2>
          <p className="text-xs text-black font-medium mt-1">
            Official statutory appointment document issued by the National Executive Council.
          </p>
        </div>

        {isVerified && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition self-start sm:self-auto cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print Appointment Letter</span>
          </button>
        )}
      </div>

      {/* ----------------- LOCKED STATE IF UNVERIFIED ----------------- */}
      {!isVerified ? (
        <div className="space-y-6">
          <div className="bg-red-50/50 border-2 border-red-300 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
              <FiLock className="w-8 h-8" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-200 text-red-900 inline-block mb-1">
                Executive Desk Notice
              </span>
              <h3 className="text-lg font-black text-black">
                Appointment Letter Locked - Committee Verification Pending
              </h3>
              <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                Formal letters of appointment carrying the official seal of the National President are legally binding documents.
                Under statutory rules, appointment letters are minted and dispatched only after verification of membership payment screenshots by our audit committee.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/profile/apply-member"
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition"
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
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-xl max-w-3xl mx-auto text-black print:shadow-none print:border-none print:p-4 space-y-6"
          >
            {/* Letterhead Header */}
            <div className="border-b-2 border-red-600 pb-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                  alt="Trust Logo"
                  className="w-12 h-12 rounded-full object-cover border border-red-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
                  }}
                />
                <div className="text-left">
                  <h1 className="text-xl sm:text-2xl font-black text-red-600 tracking-wide leading-tight">
                    INDIAN YOUTH FOUNDATION
                  </h1>
                  <h2 className="text-sm font-black text-black">
                    भारतीय युवा क्रांति (राष्ट्रीय सामाजिक न्यास)
                  </h2>
                </div>
              </div>

              <div className="text-[11px] text-black font-semibold">
                Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>421/2019</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br/>
                Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
              </div>

              <div className="text-[10px] text-black font-medium pt-1">
                Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001 • Helpline: +91 93196 98759
              </div>
            </div>

            {/* Reference & Date */}
            <div className="flex items-center justify-between text-xs font-bold text-black">
              <div>
                Ref. No: <span className="font-mono text-red-700 font-bold">BYK/APPT/2026/{(currentUser?.memberId || '101').replace('BYK-', '')}</span>
              </div>
              <div>
                Date: <span className="text-black">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Recipient */}
            <div className="text-xs space-y-1 font-medium">
              <p className="font-bold text-black">To,</p>
              <h3 className="text-sm font-black text-black">{currentUser?.name}</h3>
              <p className="text-black font-mono font-bold">Member ID: {currentUser?.memberId}</p>
              <p className="text-black">{currentUser?.address || 'Krishna Vihar, Pala Road, Aligarh'}</p>
              <p className="text-black">{currentUser?.district || 'Aligarh'}, {currentUser?.state || 'Uttar Pradesh'}</p>
            </div>

            {/* Subject */}
            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-xl">
              <p className="text-xs font-black text-black">
                SUBJECT: LETTER OF APPOINTMENT AS &ldquo;{currentUser?.designation?.toUpperCase() || 'ACTIVE SOCIAL WORKER'}&rdquo; (MEMBERSHIP TIER: {currentUser?.membershipPlan?.toUpperCase() || 'ACTIVE YOUTH MEMBER'})
              </p>
            </div>

            {/* Letter Body */}
            <div className="text-xs text-black space-y-3 leading-relaxed font-medium">
              <p>
                Dear <strong>{currentUser?.name}</strong>,
              </p>
              <p>
                We are pleased to inform you that upon careful review and verification of your application and statutory contribution receipt, the Board of Trustees and the National Executive Committee of <strong>Indian Youth Foundation (Bharatiya Yuva Kranti)</strong> have formally approved your appointment as an active member in our nationwide youth movement.
              </p>
              <p>
                In this esteemed role, you are entrusted with representing the core mission of our organization—uplifting underprivileged children through education, organizing voluntary blood donation helplines, promoting environmental sustainability, and extending humanitarian relief to vulnerable families across India.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 font-medium text-black">
                <p className="font-black text-black text-[11px] uppercase tracking-wider mb-1">Terms of Appointment:</p>
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
                  src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                  alt="Official Seal"
                  className="w-16 h-16 object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                  }}
                />
                <span className="text-[10px] font-bold text-black uppercase tracking-wider mt-1 block">
                  Official Seal of the Trust
                </span>
              </div>

              {/* President Signature */}
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt="President Signature"
                  className="h-10 object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                  }}
                />
                <div className="mt-1">
                  <h4 className="text-xs font-black text-black">
                    {settings?.presidentName || 'Ravi Saini (National President & Trustee)'}
                  </h4>
                  <p className="text-[10px] text-black font-bold">National President &amp; Trustee</p>
                  <p className="text-[9px] text-black font-medium">{settings?.ngoName || 'Indian Youth Foundation'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
