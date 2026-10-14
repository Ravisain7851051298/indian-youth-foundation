'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  FiPrinter, 
  FiShield, 
  FiCheckCircle, 
  FiLock
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';
import { useNGO } from '@/context/NGOContext';

export default function IdCardPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const cardRef = useRef(null);

  useEffect(() => {
    if (refreshUser) refreshUser();
  }, [refreshUser]);

  const isVerified = (currentUser?.status === 'active' || currentUser?.role === 'Volunteer' || currentUser?.role === 'Member' || currentUser?.role === 'Admin') && (currentUser?.idCardGenerated || currentUser?.memberId);
  const roleType = currentUser?.role?.toLowerCase() === 'volunteer' ? 'volunteer' : 'member';
  const verificationUrl = `https://bharatiyayuvakranti.org/verify/${roleType}/${currentUser?.memberId || 'PENDING'}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <FiShield className="text-red-600 w-5 h-5" />
            <span>Digital ID Card Verification Desk</span>
          </h2>
          <p className="text-xs text-black font-medium mt-1">
            Dual-sided verifiable identification badge with statutory anti-tamper QR code.
          </p>
        </div>

        {isVerified && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition self-start sm:self-auto cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print Official ID Card</span>
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
                Verification Desk Notice
              </span>
              <h3 className="text-lg font-black text-black">
                Official ID Card Locked - Payment &amp; Identity Verification Pending
              </h3>
              <p className="text-xs text-black mt-2 leading-relaxed max-w-lg mx-auto font-medium">
                In strict adherence to Trust bylaws and charitable NGO anti-fraud regulations, official digital ID cards with verifiable QR codes are locked until the National Executive Committee reviews and approves your membership application and payment screenshot.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/profile/apply-member"
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition"
              >
                Submit Payment Screenshot →
              </Link>
              <Link
                href="/profile"
                className="px-6 py-2.5 rounded-2xl bg-white text-black border border-slate-300 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition"
              >
                Check Application Status
              </Link>
            </div>
          </div>

          {/* Watermarked Preview Mock */}
          <div className="opacity-40 pointer-events-none select-none max-w-md mx-auto filter blur-[1px]">
            <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-300 text-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-red-600/40 uppercase -rotate-12 border-4 border-red-600/40 px-6 py-2 rounded-2xl">
                  LOCKED - UNVERIFIED
                </span>
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-2" />
              <div className="h-4 w-32 bg-slate-200 mx-auto rounded mb-2" />
              <div className="h-3 w-48 bg-slate-100 mx-auto rounded" />
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- UNLOCKED OFFICIAL DUAL-SIDED ID CARD ----------------- */
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Official ID Card is verified and active. Any citizen or authority can scan the QR code to verify credential validity in real-time.
            </span>
          </div>

          <div ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto print:max-w-none print:m-0">
            {/* FRONT SIDE */}
            <div className="bg-linear-to-b from-red-600 via-red-700 to-red-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px] border border-red-500">
              {/* Card Header */}
              <div className="text-center space-y-1 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings?.logoUrl || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                    alt="Logo"
                    className="w-8 h-8 rounded-full bg-white p-0.5 object-cover"
                  />
                  <span className="text-[11px] font-black tracking-wider uppercase text-red-100">
                    Indian Youth Foundation
                  </span>
                </div>
                <h3 className="text-base font-black tracking-wide leading-tight">
                  भारतीय युवा क्रांति
                </h3>
                <p className="text-[10px] text-red-100 font-medium">
                  Reg. No: 421/2019 • 12A &amp; 80G Certified NGO
                </p>
                <div className="w-full h-0.5 bg-red-400/50 my-2" />
              </div>

              {/* Photo & Identity */}
              <div className="text-center my-auto py-2 relative z-10 space-y-2">
                <div className="relative inline-block mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300'}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                  />
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white border border-white">
                    VERIFIED
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-black tracking-wide">{currentUser.name}</h4>
                  <p className="text-xs font-bold text-red-100">{currentUser.designation || currentUser.role}</p>
                </div>

                <div className="bg-black/35 backdrop-blur-xs py-1.5 px-4 rounded-xl inline-block border border-white/20">
                  <span className="text-[11px] font-mono font-black tracking-wider text-white">
                    ID: {currentUser.memberId}
                  </span>
                </div>
              </div>

              {/* Card Front Footer */}
              <div className="pt-3 border-t border-red-500/50 flex items-center justify-between text-[10px] relative z-10">
                <div>
                  <span className="text-red-200 block">Blood Group:</span>
                  <span className="font-bold text-white text-xs">{currentUser.bloodGroup || 'O+'}</span>
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
                    Official Verification Portal
                  </span>
                  <span className="text-[10px] font-mono text-black font-bold">
                    {currentUser.memberId}
                  </span>
                </div>

                {/* QR Code */}
                <div className="text-center py-2">
                  <div className="inline-block p-2 bg-white rounded-xl border border-red-200 shadow-2xs mb-1">
                    <QRCodeSVG value={verificationUrl} size={110} />
                  </div>
                  <span className="text-[10px] font-bold text-black block">
                    Scan with camera to verify credentials
                  </span>
                </div>

                {/* Info List */}
                <div className="space-y-1.5 text-[11px] border-t border-slate-100 pt-3 font-medium">
                  <div className="flex justify-between">
                    <span className="text-black font-semibold">Mobile:</span>
                    <strong className="text-black">{currentUser.phone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black font-semibold">Email:</span>
                    <strong className="text-black">{currentUser.email}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black font-semibold">Location:</span>
                    <strong className="text-black">{currentUser.district || 'Aligarh'}, {currentUser.state || 'UP'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black font-semibold">Issue Authority:</span>
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
                      src={settings?.officialSealUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                      alt="Seal"
                      className="w-10 h-10 object-contain mx-auto"
                    />
                    <span className="text-[9px] text-black font-bold block">Official Seal</span>
                  </div>

                  <div className="text-right">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings?.presidentSignatureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt="Signature"
                      className="h-8 object-contain ml-auto"
                    />
                    <span className="text-[9px] text-black font-bold block">National President</span>
                  </div>
                </div>

                <div className="text-[9px] text-black text-center leading-tight font-medium">
                  Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh<br/>
                  Helpline: +91 93196 98759 • samasyasamadhanparishad@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
