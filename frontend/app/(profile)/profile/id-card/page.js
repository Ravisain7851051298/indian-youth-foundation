'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FiPrinter,
  FiShield,
  FiCheckCircle,
  FiLock,
  FiCreditCard,
  FiUserCheck,
  FiArrowRight,
  FiHeart
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function IdCardPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;
  const searchParams = useSearchParams();
  const cardRef = useRef(null);

  // Allow tab query: /profile/id-card?type=volunteer or ?type=member
  const initialType = searchParams.get('type') === 'volunteer' ? 'volunteer' : 'member';
  const [activeTab, setActiveTab] = useState(initialType);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  // Membership & Volunteer eligibility checks
  const isMemberVerified = (
    effectiveUser?.role === 'Member' || 
    effectiveUser?.role === 'Admin' || 
    effectiveUser?.isMember || 
    !!effectiveUser?.memberId
  );

  const isVolunteerVerified = (
    effectiveUser?.role === 'Volunteer' || 
    effectiveUser?.isVolunteer || 
    effectiveUser?.volunteerApplication?.status === 'approved' ||
    !!effectiveUser?.volunteerId
  );

  const memberId = effectiveUser?.memberId || 'MEM-PENDING';
  const volunteerId = effectiveUser?.volunteerId || effectiveUser?.volunteerApplication?.volunteerId || (effectiveUser?.role === 'Volunteer' ? effectiveUser?.memberId : `VOL-${effectiveUser?.phone ? effectiveUser.phone.slice(-4) : '2026'}`);

  const memberVerificationUrl = `${origin || 'https://indianyouthfoundation.org'}/verify/member/${memberId}`;
  const volunteerVerificationUrl = `${origin || 'https://indianyouthfoundation.org'}/verify/volunteer/${volunteerId}`;

  const isCurrentCardVerified = activeTab === 'member' ? isMemberVerified : isVolunteerVerified;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
            <FiShield className="w-3.5 h-3.5 text-red-600" />
            <span>Digital ID Card Verification Desk</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Official Verifiable Identity Badges
          </h1>
          <p className="text-xs text-black font-medium mt-1">
            Official dual-sided identification cards with statutory anti-tamper QR code and National Trustee seals.
          </p>
        </div>

        {isCurrentCardVerified && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition self-start sm:self-auto cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print {activeTab === 'member' ? 'Member ID Card' : 'Volunteer ID Card'}</span>
          </button>
        )}
      </div>

      {/* ----------------- DUAL ID CARD SWITCHER TABS ----------------- */}
      <div className="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 max-w-xl">
        <button
          onClick={() => setActiveTab('member')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'member'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-black hover:text-red-700 hover:bg-white/60'
          }`}
        >
          <FiCreditCard className="w-4 h-4" />
          <span>Official Member ID Card</span>
          {isMemberVerified && (
            <span className={`w-2 h-2 rounded-full ${activeTab === 'member' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('volunteer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'volunteer'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-black hover:text-indigo-700 hover:bg-white/60'
          }`}
        >
          <FiUserCheck className="w-4 h-4" />
          <span>Grassroots Volunteer ID Card</span>
          {isVolunteerVerified && (
            <span className={`w-2 h-2 rounded-full ${activeTab === 'volunteer' ? 'bg-white' : 'bg-emerald-500'}`}></span>
          )}
        </button>
      </div>

      {/* ==================== TAB 1: MEMBER ID CARD ==================== */}
      {activeTab === 'member' && (
        <>
          {!isMemberVerified ? (
            /* Locked State for Member ID Card */
            <div className="space-y-6">
              <div className="bg-red-50/50 border-2 border-red-300 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-3xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-200 text-red-900 inline-block mb-1">
                    Membership Desk Notice
                  </span>
                  <h3 className="text-lg font-black text-black">
                    Official Member ID Card Not Unlocked
                  </h3>
                  <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    In strict adherence to statutory Trust bylaws and charitable anti-fraud regulations, official Member ID cards with verifiable QR codes are issued upon trustee approval of your constitutional membership enrolment.
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
            /* Unlocked Official Member ID Card (Red & Burgundy Theme) */
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-4xl mx-auto">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Official Foundation Member ID Card is verified and active. Scan the QR code with any mobile camera to verify credentials in real-time.
                </span>
              </div>

              <div ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto print:max-w-none print:m-0">
                {/* FRONT SIDE */}
                <div className="bg-gradient-to-b from-red-600 via-red-700 to-red-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px] border border-red-500">
                  {/* Header */}
                  <div className="text-center space-y-1 relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                        alt="Logo"
                        className="w-8 h-8 rounded-full bg-white p-0.5 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
                        }}
                      />
                      <span className="text-[11px] font-black tracking-wider uppercase text-red-100">
                        {settings?.ngoName || 'Indian Youth Foundation'}
                      </span>
                    </div>
                    <h3 className="text-base font-black tracking-wide leading-tight">
                      {settings?.ngoNameHi || 'भारतीय युवा क्रांति'}
                    </h3>
                    <p className="text-[10px] text-red-100 font-medium">
                      Reg. No: {settings?.registrationNo || '421/2019'} • 12A &amp; 80G Certified NGO
                    </p>
                    <div className="w-full h-0.5 bg-red-400/50 my-2" />
                  </div>

                  {/* Photo & Identity */}
                  <div className="text-center my-auto py-2 relative z-10 space-y-2">
                    <div className="relative inline-block mx-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getContentImageUrl(effectiveUser?.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
                        alt={effectiveUser?.name || 'Member Photo'}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300';
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white border border-white">
                        MEMBER
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black tracking-wide">{effectiveUser?.name}</h4>
                      <p className="text-xs font-bold text-red-100">{effectiveUser?.designation || 'Active Social Worker'}</p>
                    </div>

                    <div className="bg-black/35 backdrop-blur-xs py-1.5 px-4 rounded-xl inline-block border border-white/20">
                      <span className="text-[11px] font-mono font-black tracking-wider text-white">
                        MEMBER ID: {memberId}
                      </span>
                    </div>
                  </div>

                  {/* Card Front Footer */}
                  <div className="pt-3 border-t border-red-500/50 flex items-center justify-between text-[10px] relative z-10">
                    <div>
                      <span className="text-red-200 block">Blood Group:</span>
                      <span className="font-bold text-white text-xs">{effectiveUser?.bloodGroup || 'O+'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-red-200 block">Valid Upto:</span>
                      <span className="font-bold text-white text-xs">Dec 2027</span>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px] border border-slate-200 text-black">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                        Official Member Verification
                      </span>
                      <span className="text-[10px] font-mono text-black font-bold">
                        {memberId}
                      </span>
                    </div>

                    {/* QR Code */}
                    <div className="text-center py-2">
                      <div className="inline-block p-2 bg-white rounded-xl border border-red-200 shadow-2xs mb-1">
                        <QRCodeSVG value={memberVerificationUrl} size={110} />
                      </div>
                      <span className="text-[10px] font-bold text-black block">
                        Scan with camera to verify credentials
                      </span>
                    </div>

                    {/* Info List */}
                    <div className="space-y-1.5 text-[11px] border-t border-slate-100 pt-3 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Mobile:</span>
                        <strong className="text-black">{effectiveUser?.phone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Email:</span>
                        <strong className="text-black">{effectiveUser?.email}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Location:</span>
                        <strong className="text-black">{effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'UP'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Issue Authority:</span>
                        <strong className="text-black">Board of Trustees</strong>
                      </div>
                    </div>
                  </div>

                  {/* Head Office & Seal / Sign */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                          alt="Seal"
                          className="w-10 h-10 object-contain mx-auto"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                          }}
                        />
                        <span className="text-[9px] text-black font-bold block">Official Seal</span>
                      </div>

                      <div className="text-right">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                          alt="Signature"
                          className="h-8 object-contain ml-auto"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                          }}
                        />
                        <span className="text-[9px] text-black font-bold block truncate max-w-[120px]">
                          {settings?.presidentName || 'National President'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-700 text-center leading-tight font-medium">
                      Head Office: {settings?.address || 'Krishna Vihar Pala Road Aligarh, Uttar Pradesh'}<br />
                      Helpline: {settings?.phone || '+91 93196 98759'} • {settings?.email || 'samasyasamadhanparishad@gmail.com'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 2: VOLUNTEER ID CARD ==================== */}
      {activeTab === 'volunteer' && (
        <>
          {!isVolunteerVerified ? (
            /* Locked State for Volunteer ID Card */
            <div className="space-y-6">
              <div className="bg-indigo-50/50 border-2 border-indigo-300 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  <FiLock className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-200 text-indigo-900 inline-block mb-1">
                    Volunteer Desk Notice
                  </span>
                  <h3 className="text-lg font-black text-black">
                    Official Volunteer ID Card Not Unlocked
                  </h3>
                  <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                    Volunteer identification badges are issued to active field volunteers participating in our blood banks, child education drives, and disaster relief programs.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/profile/apply-volunteer"
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                  >
                    <span>Join as Active Volunteer</span>
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
            /* Unlocked Official Volunteer ID Card (Navy & Indigo Theme) */
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-300 text-indigo-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold max-w-4xl mx-auto">
                <FiCheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  Official Grassroots Volunteer ID Card is verified and active. Field coordinators or authorities can scan the QR code to verify ground authorization.
                </span>
              </div>

              <div ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto print:max-w-none print:m-0">
                {/* FRONT SIDE (VOLUNTEER) */}
                <div className="bg-gradient-to-b from-indigo-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px] border border-indigo-500">
                  {/* Header */}
                  <div className="text-center space-y-1 relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                        alt="Logo"
                        className="w-8 h-8 rounded-full bg-white p-0.5 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
                        }}
                      />
                      <span className="text-[11px] font-black tracking-wider uppercase text-indigo-100">
                        {settings?.ngoName || 'Indian Youth Foundation'}
                      </span>
                    </div>
                    <h3 className="text-base font-black tracking-wide leading-tight">
                      राष्ट्रीय युवा स्वयंसेवक कोर
                    </h3>
                    <p className="text-[10px] text-indigo-200 font-medium">
                      Grassroots Volunteer Service • Anti-Tamper Badge
                    </p>
                    <div className="w-full h-0.5 bg-indigo-400/40 my-2" />
                  </div>

                  {/* Photo & Identity */}
                  <div className="text-center my-auto py-2 relative z-10 space-y-2">
                    <div className="relative inline-block mx-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getContentImageUrl(effectiveUser?.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
                        alt={effectiveUser?.name || 'Volunteer Photo'}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300';
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500 text-white border border-white">
                        VOLUNTEER
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black tracking-wide">{effectiveUser?.name}</h4>
                      <p className="text-xs font-bold text-indigo-200">
                        {effectiveUser?.volunteerApplication?.skills || 'Grassroots Relief Volunteer'}
                      </p>
                    </div>

                    <div className="bg-black/35 backdrop-blur-xs py-1.5 px-4 rounded-xl inline-block border border-white/20">
                      <span className="text-[11px] font-mono font-black tracking-wider text-indigo-100">
                        VOLUNTEER ID: {volunteerId}
                      </span>
                    </div>
                  </div>

                  {/* Card Front Footer */}
                  <div className="pt-3 border-t border-indigo-500/50 flex items-center justify-between text-[10px] relative z-10">
                    <div>
                      <span className="text-indigo-200 block">Blood Group:</span>
                      <span className="font-bold text-white text-xs">{effectiveUser?.bloodGroup || 'O+'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-indigo-200 block">Volunteer Wing:</span>
                      <span className="font-bold text-white text-xs">{effectiveUser?.district || 'Aligarh'} Chapter</span>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE (VOLUNTEER) */}
                <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px] border border-slate-200 text-black">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                        Official Volunteer Verification
                      </span>
                      <span className="text-[10px] font-mono text-black font-bold">
                        {volunteerId}
                      </span>
                    </div>

                    {/* QR Code */}
                    <div className="text-center py-2">
                      <div className="inline-block p-2 bg-white rounded-xl border border-indigo-200 shadow-2xs mb-1">
                        <QRCodeSVG value={volunteerVerificationUrl} size={110} />
                      </div>
                      <span className="text-[10px] font-bold text-black block">
                        Scan with camera for volunteer credentials
                      </span>
                    </div>

                    {/* Info List */}
                    <div className="space-y-1.5 text-[11px] border-t border-slate-100 pt-3 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Mobile:</span>
                        <strong className="text-black">{effectiveUser?.phone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Email:</span>
                        <strong className="text-black">{effectiveUser?.email}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Service Area:</span>
                        <strong className="text-black">{effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'UP'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Affiliation:</span>
                        <strong className="text-black">National Youth Volunteer Corps</strong>
                      </div>
                    </div>
                  </div>

                  {/* Head Office & Seal / Sign */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                          alt="Seal"
                          className="w-10 h-10 object-contain mx-auto"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                          }}
                        />
                        <span className="text-[9px] text-black font-bold block">Official Seal</span>
                      </div>

                      <div className="text-right">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                          alt="Signature"
                          className="h-8 object-contain ml-auto"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                          }}
                        />
                        <span className="text-[9px] text-black font-bold block truncate max-w-[120px]">
                          {settings?.presidentName || 'Youth Coordinator / President'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-700 text-center leading-tight font-medium">
                      Head Office: {settings?.address || 'Krishna Vihar Pala Road Aligarh, Uttar Pradesh'}<br />
                      Helpline: {settings?.phone || '+91 93196 98759'} • {settings?.email || 'samasyasamadhanparishad@gmail.com'}
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
