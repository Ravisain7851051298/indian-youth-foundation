'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FiPrinter,
  FiFileText,
  FiCheckCircle,
  FiLock,
  FiCreditCard,
  FiUserCheck,
  FiArrowRight,
  FiShield,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';
import { printElement } from '@/lib/printElement';

export default function AppointmentLetterPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;
  const searchParams = useSearchParams();
  const letterRef = useRef(null);

  useEffect(() => {
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  // Membership, Coordinator & Volunteer eligibility checks (strictly prevent donor ID BYK-DON- from being treated as member)
  const isMemberVerified = Boolean(
    effectiveUser?.role === 'Member' ||
    effectiveUser?.role === 'Admin' ||
    (effectiveUser?.isMember && !effectiveUser?.memberId?.startsWith('BYK-DON-')) ||
    (effectiveUser?.membershipApplication?.status === 'approved') ||
    (effectiveUser?.memberId && (effectiveUser.memberId.startsWith('BYK-MEM-') || effectiveUser.memberId.startsWith('MEM-')))
  );

  const isCoordinatorVerified = Boolean(
    effectiveUser?.role === 'Coordinator' ||
    effectiveUser?.isCoordinator ||
    (effectiveUser?.coordinatorId && !effectiveUser?.coordinatorId?.startsWith('BYK-DON-'))
  );

  const isVolunteerVerified = Boolean(
    effectiveUser?.role === 'Volunteer' ||
    effectiveUser?.isVolunteer ||
    effectiveUser?.volunteerApplication?.status === 'approved' ||
    (effectiveUser?.volunteerId && !effectiveUser?.volunteerId?.startsWith('BYK-DON-'))
  );

  const paramType = searchParams.get('type');
  const defaultTab = paramType
    ? paramType
    : (isCoordinatorVerified ? 'coordinator' : (isVolunteerVerified && !isMemberVerified ? 'volunteer' : 'member'));
  const [selectedTab, setSelectedTab] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const activeTab = selectedTab || defaultTab;
  const setActiveTab = setSelectedTab;

  const cleanTenDigit = (val, phoneFallback) => {
    if (!val) {
      const p = phoneFallback ? String(phoneFallback).replace(/\D/g, '') : '';
      return p.length >= 10 ? p.slice(-10) : '1000000001';
    }
    const str = String(val).trim();
    if (/^\d{10}$/.test(str)) return str;
    const digits = str.replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(-10);
    const p = phoneFallback ? String(phoneFallback).replace(/\D/g, '') : '';
    if (p.length >= 10) return p.slice(-10);
    return (digits + '0000000000').slice(0, 10);
  };

  const rawMemberId = effectiveUser?.memberId;
  const memberId = (rawMemberId && !rawMemberId.startsWith('BYK-DON-'))
    ? (/^\d{10}$/.test(rawMemberId) ? rawMemberId : cleanTenDigit(rawMemberId, effectiveUser?.phone))
    : (effectiveUser?.membershipApplication?.assignedMemberId || cleanTenDigit(effectiveUser?.phone, '1000000001'));

  const rawCoordId = effectiveUser?.coordinatorId || (effectiveUser?.role === 'Coordinator' && rawMemberId && !rawMemberId.startsWith('BYK-DON-') ? rawMemberId : null);
  const coordinatorId = (rawCoordId && !rawCoordId.startsWith('BYK-DON-'))
    ? (/^\d{10}$/.test(rawCoordId) ? rawCoordId : cleanTenDigit(rawCoordId, effectiveUser?.phone))
    : cleanTenDigit(effectiveUser?.phone, '1000000001');

  const rawVolId = effectiveUser?.volunteerId || effectiveUser?.volunteerApplication?.assignedVolunteerId || effectiveUser?.volunteerApplication?.volunteerId;
  const volunteerId = (rawVolId && !rawVolId.startsWith('BYK-DON-'))
    ? (/^\d{10}$/.test(rawVolId) ? rawVolId : cleanTenDigit(rawVolId, effectiveUser?.phone))
    : cleanTenDigit(effectiveUser?.phone, '1000000501');

  const isCurrentLetterVerified = activeTab === 'coordinator'
    ? isCoordinatorVerified
    : activeTab === 'member'
      ? isMemberVerified
      : isVolunteerVerified;

  const handlePrint = () => {
    if (letterRef.current) {
      const docLabel = activeTab === 'coordinator'
        ? `Coordinator_${coordinatorId}`
        : activeTab === 'volunteer'
          ? `Volunteer_${volunteerId}`
          : `Member_${memberId}`;
      printElement(letterRef.current, {
        title: `Appointment_Letter_${docLabel}`,
        pageStyle: '@page { size: A4 portrait; margin: 8mm 10mm; }'
      });
    } else {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const res = await api.get(`/documents/appointment-letter/download?type=${activeTab}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const label = activeTab === 'coordinator' ? `Coordinator_${coordinatorId}` : (activeTab === 'volunteer' ? `Volunteer_${volunteerId}` : `Member_${memberId}`);
      link.setAttribute('download', `Appointment_Letter_${label}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Blob download error, opening direct link:', err);
      window.open(`/api/documents/appointment-letter/download?type=${activeTab}`, '_blank');
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
            <FiFileText className="w-3.5 h-3.5 text-red-600" />
            <span>Formal Credentials Desk</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Official Appointment &amp; Offer Letters
          </h1>
          <p className="text-xs text-black font-medium mt-1">
            Formal statutory appointment letters bearing the seal and signature of the National President &amp; Board of Trustees.
          </p>
        </div>

        {isCurrentLetterVerified && (
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50 ${activeTab === 'coordinator'
                ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-700/20'
                : activeTab === 'member'
                  ? 'bg-red-700 hover:bg-red-800 shadow-red-700/20'
                  : 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-700/20'
                }`}
            >
              {downloadingPdf ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiDownload className="w-4 h-4" />}
              <span>Download Official PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <FiPrinter className="w-4 h-4" />
              <span>Print Letter</span>
            </button>
          </div>
        )}
      </div>

      {/* ----------------- TRI-ROLE APPOINTMENT LETTER SWITCHER TABS ----------------- */}
      <div className="flex flex-wrap items-center gap-2.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 max-w-2xl print:hidden no-print">
        <button
          onClick={() => setActiveTab('coordinator')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'coordinator'
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-black hover:text-purple-700 hover:bg-white/60'
            }`}
        >
          <FiShield className="w-4 h-4" />
          <span>Coordinator Letter</span>
          {isCoordinatorVerified && (
            <span className={`w-2 h-2 rounded-full ${activeTab === 'coordinator' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('member')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'member'
            ? 'bg-red-600 text-white shadow-md'
            : 'text-black hover:text-red-700 hover:bg-white/60'
            }`}
        >
          <FiCreditCard className="w-4 h-4" />
          <span>Member Letter</span>
          {isMemberVerified && (
            <span className={`w-2 h-2 rounded-full ${activeTab === 'member' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('volunteer')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'volunteer'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-black hover:text-indigo-700 hover:bg-white/60'
            }`}
        >
          <FiUserCheck className="w-4 h-4" />
          <span>Volunteer Offer</span>
          {isVolunteerVerified && (
            <span className={`w-2 h-2 rounded-full ${activeTab === 'volunteer' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          )}
        </button>
      </div>

      {/* ==================== TAB 1: MEMBER APPOINTMENT LETTER ==================== */}
      {activeTab === 'member' && (
        <>
          {!isMemberVerified ? (
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
                    Official Member Appointment Letter Not Unlocked
                  </h3>
                  <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Formal Member Appointment Letters carrying the official seal of the National President are legally binding documents issued upon trustee approval of your constitutional membership application.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/profile/apply-member"
                    className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center gap-1.5"
                  >
                    <span>Apply for Official Membership</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/profile/member"
                    className="px-6 py-2.5 rounded-2xl bg-white text-black border border-slate-300 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition"
                  >
                    View Membership Requirements
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-3xl mx-auto print:hidden no-print">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Official Foundation Member Appointment Letter is verified, digitally stamped by the National President, and recorded in the Trust Register.
                </span>
              </div>

              <div
                ref={letterRef}
                className="printable-document bg-white rounded-3xl p-8 sm:p-10 border border-slate-300 shadow-xl max-w-3xl mx-auto text-black print:shadow-none print:border-none print:p-0 print:m-0 print:w-full space-y-4 print:space-y-2.5 print:text-[11px]"
              >
                {/* Letterhead Header */}
                <div className="border-b-2 border-red-600 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.logoUrl) || '/logo.jpeg'}
                      alt="Trust Logo"
                      className="w-12 h-12 rounded-full object-cover border border-red-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.jpeg';
                      }}
                    />
                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-red-600 tracking-wide leading-tight">
                        YUVA KRANTI DAL
                      </h1>
                      <h2 className="text-sm font-black text-black">
                        युवा क्रांति दल (राष्ट्रीय सामाजिक न्यास)
                      </h2>
                    </div>
                  </div>

                  <div className="text-[11px] text-black font-semibold">
                    Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>{settings?.registrationNo}</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId}</strong><br />
                    Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo}</strong>
                  </div>

                  <div className="text-[10px] text-black font-medium pt-1">
                    Head Office - {settings?.address} • Helpline: {settings?.phone}
                  </div>
                </div>

                {/* Reference & Date */}
                <div className="flex items-center justify-between text-xs font-bold text-black">
                  <div>
                    Ref. No: <span className="font-mono text-red-700 font-bold">YKD/MEM-APPT/2026/{memberId.replace('BYK-', '')}</span>
                  </div>
                  <div>
                    Date: <span className="text-black">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Recipient */}
                <div className="text-xs space-y-1 font-medium">
                  <p className="font-bold text-black">To,</p>
                  <h3 className="text-sm font-black text-black">{effectiveUser?.name}</h3>
                  <p className="text-black font-mono font-bold">Member ID: {memberId}</p>
                  <p className="text-black">{effectiveUser?.address}</p>
                  <p className="text-black">{effectiveUser?.district}, {effectiveUser?.state}</p>
                </div>

                {/* Subject */}
                <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-xl">
                  <p className="text-xs font-black text-black">
                    SUBJECT: FORMAL LETTER OF APPOINTMENT AS &ldquo;{effectiveUser?.designation?.toUpperCase() || 'ACTIVE SOCIAL WORKER'}&rdquo; (MEMBERSHIP TIER: {effectiveUser?.membershipPlan?.toUpperCase() || 'OFFICIAL TRUST MEMBER'})
                  </p>
                </div>

                {/* Letter Body */}
                <div className="text-xs text-black space-y-3 leading-relaxed font-medium">
                  <p>
                    Dear <strong>{effectiveUser?.name}</strong>,
                  </p>
                  <p>
                    We are pleased to inform you that upon careful review and verification of your application and statutory contribution receipt, the Board of Trustees and the National Executive Committee of <strong>Yuva Kranti Dal (युवा क्रांति दल)</strong> have formally approved your appointment as an active member in our nationwide youth movement.
                  </p>
                  <p>
                    In this esteemed role, you are entrusted with representing the core mission of our organization—uplifting underprivileged children through education, organizing voluntary blood donation helplines, promoting environmental sustainability, and extending humanitarian relief to vulnerable families across India.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 font-medium text-black print:p-2.5 print:space-y-1 print:text-[10px]">
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
                <div className="pt-8 border-t border-slate-200 flex items-end justify-between print:pt-4">
                  {/* Trust Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl)}
                      alt="Official Seal"
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
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
                      src={getContentImageUrl(settings?.presidentSignatureUrl)}
                      alt="President Signature"
                      className="h-10 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                      }}
                    />
                    <div className="mt-1">
                      <h4 className="text-xs font-black text-black">
                        {settings?.presidentName}
                      </h4>
                      <p className="text-[10px] text-black font-bold">National President &amp; Trustee</p>
                      <p className="text-[9px] text-black font-medium">{settings?.ngoName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 2: VOLUNTEER OFFER / APPOINTMENT LETTER ==================== */}
      {activeTab === 'volunteer' && (
        <>
          {!isVolunteerVerified ? (
            <div className="space-y-6">
              <div className="bg-indigo-50/50 border-2 border-indigo-300 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-200 text-indigo-900 inline-block mb-1">
                    Volunteer Desk Notice
                  </span>
                  <h3 className="text-lg font-black text-black">
                    Volunteer Offer Letter Not Unlocked
                  </h3>
                  <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Formal Volunteer Offer Letters carrying official trust credentials are issued to active field volunteers after review of volunteer applications and identity documents.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/profile/apply-volunteer"
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                  >
                    <span>Apply for Volunteer Enrolment</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/profile/volunteer"
                    className="px-6 py-2.5 rounded-2xl bg-white text-black border border-slate-300 font-bold text-xs hover:bg-indigo-50 hover:border-indigo-300 transition"
                  >
                    View Volunteer Program Info
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-300 text-indigo-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-3xl mx-auto print:hidden no-print">
                <FiCheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  Official Grassroots Volunteer Offer &amp; Appointment Letter is active, authorized by the National President, and recorded in the Volunteer Wing Register.
                </span>
              </div>

              <div
                ref={letterRef}
                className="printable-document bg-white rounded-3xl p-8 sm:p-10 border border-slate-300 shadow-xl max-w-3xl mx-auto text-black print:shadow-none print:border-none print:p-0 print:m-0 print:w-full space-y-4 print:space-y-2.5 print:text-[11px]"
              >
                {/* Letterhead Header */}
                <div className="border-b-2 border-indigo-600 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.logoUrl)}
                      alt="Trust Logo"
                      className="w-12 h-12 rounded-full object-cover border border-indigo-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.jpeg';
                      }}
                    />
                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-indigo-700 tracking-wide leading-tight">
                        YUVA KRANTI DAL
                      </h1>
                      <h2 className="text-sm font-black text-black">
                        राष्ट्रीय युवा स्वयंसेवक कोर (Volunteer Wing)
                      </h2>
                    </div>
                  </div>

                  <div className="text-[11px] text-black font-semibold">
                    Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>{settings?.registrationNo || '421/2019'}</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br />
                    Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
                  </div>

                  <div className="text-[10px] text-black font-medium pt-1">
                    Head Office - {settings?.address || 'Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001'} • Helpline: {settings?.phone || '+91 93196 98759'}
                  </div>
                </div>

                {/* Reference & Date */}
                <div className="flex items-center justify-between text-xs font-bold text-black">
                  <div>
                    Ref. No: <span className="font-mono text-indigo-700 font-bold">YKD/VOL-APPT/2026/{volunteerId.replace('BYK-', '')}</span>
                  </div>
                  <div>
                    Date: <span className="text-black">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Recipient */}
                <div className="text-xs space-y-1 font-medium">
                  <p className="font-bold text-black">To,</p>
                  <h3 className="text-sm font-black text-black">{effectiveUser?.name}</h3>
                  <p className="text-indigo-700 font-mono font-bold">Volunteer ID: {volunteerId}</p>
                  <p className="text-black">{effectiveUser?.address}</p>
                  <p className="text-black">{effectiveUser?.district}, {effectiveUser?.state}</p>
                </div>

                {/* Subject */}
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-3 rounded-r-xl">
                  <p className="text-xs font-black text-black">
                    SUBJECT: APPOINTMENT &amp; OFFER LETTER AS &ldquo;ACTIVE YOUTH VOLUNTEER&rdquo; (DIVISION: {effectiveUser?.district?.toUpperCase() || 'ALIGARH'} CHAPTER)
                  </p>
                </div>

                {/* Letter Body */}
                <div className="text-xs text-black space-y-3 leading-relaxed font-medium">
                  <p>
                    Dear <strong>{effectiveUser?.name}</strong>,
                  </p>
                  <p>
                    On behalf of the Board of Trustees and the National Executive Committee of <strong>Yuva Kranti Dal (युवा क्रांति दल)</strong>, we are pleased to appoint you as an <strong>Active Grassroots Volunteer</strong> in our National Youth Social Wing.
                  </p>
                  <p>
                    We acknowledge with gratitude your willingness to offer your voluntary services, expertise, and leadership for community empowerment. You are authorized to coordinate field outreach programs, assist in 24x7 emergency blood donor mobilization, teach underprivileged children, and support disaster relief campaigns.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 font-medium text-black print:p-2.5 print:space-y-1 print:text-[10px]">
                    <p className="font-black text-black text-[11px] uppercase tracking-wider mb-1">Volunteer Terms &amp; Scope of Service:</p>
                    <p>1. <strong>Field Authorization:</strong> You are officially assigned Volunteer ID: <strong>{volunteerId}</strong>. You may carry your digital volunteer badge for ground authentication during relief drives and hospital coordination.</p>
                    <p>2. <strong>Social Citations:</strong> Active hours and exceptional contributions will be honored with official National Certificates of Appreciation and volunteer citations.</p>
                    <p>3. <strong>Honorary Commitment:</strong> This volunteer position is an honorary public service dedication driven by youth patriotism and humanitarian ideals.</p>
                  </div>

                  <p>
                    We extend our warmest wishes and trust your dedication will ignite hope, dignity, and empowerment across communities.
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-8 border-t border-slate-200 flex items-end justify-between print:pt-4">
                  {/* Trust Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl)}
                      alt="Official Seal"
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
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
                      src={getContentImageUrl(settings?.presidentSignatureUrl)}
                      alt="President Signature"
                      className="h-10 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                      }}
                    />
                    <div className="mt-1">
                      <h4 className="text-xs font-black text-black">
                        {settings?.presidentName}
                      </h4>
                      <p className="text-[10px] text-black font-bold">National President &amp; Trustee</p>
                      <p className="text-[9px] text-black font-medium">{settings?.ngoName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 3: COORDINATOR APPOINTMENT LETTER ==================== */}
      {activeTab === 'coordinator' && (
        <>
          {!isCoordinatorVerified ? (
            <div className="space-y-6">
              <div className="bg-purple-50/50 border-2 border-purple-300 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 inline-block mb-1">
                    Coordinator Cadre Notice
                  </span>
                  <h3 className="text-lg font-black text-black">
                    Coordinator Appointment Letter Restricted
                  </h3>
                  <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Formal Coordinator Appointment Orders carrying official executive seals are issued directly by the Board of Trustees to appointed field leaders. Public self-registration for this role is disabled.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/profile"
                    className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
                  >
                    <span>View Foundation Profile</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-300 text-purple-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-3xl mx-auto print:hidden no-print">
                <FiCheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                <span>
                  Official Area Coordinator Statutory Appointment Order is active, ratified by the Board of Trustees, and registered in the National Executive Roll.
                </span>
              </div>

              <div
                ref={letterRef}
                className="printable-document bg-white rounded-3xl p-8 sm:p-10 border border-slate-300 shadow-xl max-w-3xl mx-auto text-black print:shadow-none print:border-none print:p-0 print:m-0 print:w-full space-y-4 print:space-y-2.5 print:text-[11px]"
              >
                {/* Letterhead Header */}
                <div className="border-b-2 border-purple-600 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.logoUrl)}
                      alt="Trust Logo"
                      className="w-12 h-12 rounded-full object-cover border border-purple-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.jpeg';
                      }}
                    />
                    <div className="text-left">
                      <h1 className="text-xl sm:text-2xl font-black text-purple-700 tracking-wide leading-tight">
                        {settings?.ngoName}
                      </h1>
                      <h2 className="text-sm font-black text-black">
                        {settings?.ngoNameHi}
                      </h2>
                    </div>
                  </div>

                  <div className="text-[11px] text-black font-semibold">
                    Regd. Under Indian Trusts Act, 1882 • Reg. No: <strong>{settings?.registrationNo}</strong> • NITI Aayog NGO Darpan ID: <strong>{settings?.nitiAayogDarpanId}</strong><br />
                    Certified under Section <strong>12A &amp; 80G</strong> of Income Tax Act 1961 • PAN: <strong>{settings?.panNo}</strong>
                  </div>

                  <div className="text-[10px] text-black font-medium pt-1">
                    Head Office - {settings?.address} • Helpline: {settings?.phone}
                  </div>
                </div>

                {/* Reference & Date */}
                <div className="flex items-center justify-between text-xs font-bold text-black">
                  <div>
                    Ref. No: <span className="font-mono text-purple-700 font-bold">YKD/COORD-APPT/2026/{coordinatorId.replace('BYK-', '')}</span>
                  </div>
                  <div>
                    Date: <span className="text-black">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Recipient */}
                <div className="text-xs space-y-1 font-medium">
                  <p className="font-bold text-black">To,</p>
                  <h3 className="text-sm font-black text-black">{effectiveUser?.name}</h3>
                  <p className="text-purple-700 font-mono font-bold">Coordinator ID: {coordinatorId}</p>
                  <p className="text-black">{effectiveUser?.address || 'Krishna Vihar, Pala Road, Aligarh'}</p>
                  <p className="text-black">{effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'Uttar Pradesh'}</p>
                </div>

                {/* Subject */}
                <div className="bg-purple-50 border-l-4 border-purple-600 p-3 rounded-r-xl">
                  <p className="text-xs font-black text-black">
                    SUBJECT: FORMAL STATUTORY APPOINTMENT AS &ldquo;OFFICIAL AREA YOUTH COORDINATOR&rdquo; (DIVISION: {effectiveUser?.district?.toUpperCase() || 'ALIGARH'} CHAPTER)
                  </p>
                </div>

                {/* Letter Body */}
                <div className="text-xs text-black space-y-3 leading-relaxed font-medium">
                  <p>
                    Dear <strong>{effectiveUser?.name}</strong>,
                  </p>
                  <p>
                    On behalf of the Board of Trustees and the National Executive Council of <strong>Yuva Kranti Dal (युवा क्रांति दल)</strong>, we have the distinct privilege to formally appoint you as an <strong>Official Area Youth Coordinator</strong> representing our movement.
                  </p>
                  <p>
                    In this leadership capacity, you are vested with constitutional authorization to represent the Foundation, mobilize youth leadership, enroll prospective members, coordinate humanitarian relief operations, and liaise with district social welfare bodies.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 font-medium text-black print:p-2.5 print:space-y-1 print:text-[10px]">
                    <p className="font-black text-black text-[11px] uppercase tracking-wider mb-1">Scope of Authority &amp; Statutory Responsibilities:</p>
                    <p>1. <strong>Member Enrolment Authority:</strong> You are authorized to onboard and enroll prospective members into our movement through your official Coordinator Portal. Final statutory approval and identity badge generation will be executed by the Central Trustee Board.</p>
                    <p>2. <strong>Field Leadership:</strong> You will lead voluntary blood donation drives, child education shelters, and youth development workshops within your designated territorial jurisdiction.</p>
                    <p>3. <strong>Ethics &amp; Integrity:</strong> You agree to uphold constitutional secularism, transparency, and non-partisan social service, refraining from any unauthorized representations or misuse of trust credentials.</p>
                    <p>4. <strong>Statutory Credentials:</strong> Your digital Coordinator ID Card and Appointment Order carry anti-tamper verification registered in the Central NGO Registry.</p>
                  </div>

                  <p>
                    We congratulate you on this appointment and express our utmost confidence in your leadership to inspire youth and uplift society.
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-8 border-t border-slate-200 flex items-end justify-between print:pt-4">
                  {/* Trust Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl)}
                      alt="Official Seal"
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
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
                      src={getContentImageUrl(settings?.presidentSignatureUrl)}
                      alt="President Signature"
                      className="h-10 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '';
                      }}
                    />
                    <div className="mt-1">
                      <h4 className="text-xs font-black text-black">
                        {settings?.presidentName}
                      </h4>
                      <p className="text-[10px] text-black font-bold">National President &amp; Trustee</p>
                      <p className="text-[9px] text-black font-medium">{settings?.ngoName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
