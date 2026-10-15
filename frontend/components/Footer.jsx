'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiShield,
  FiArrowUp,
  FiChevronRight,
  FiCheckCircle,
  FiMessageSquare
} from 'react-icons/fi';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function Footer() {
  const { settings } = useNGO();
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-900 selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ---------------- 4 SECTIONS GRID: 4 COLS ON LARGE (lg:), 2x2 ON SMALL (cols-2) ---------------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 pb-10 border-b border-slate-800/80">

          {/* SECTION 1: NGO IDENTITY & STATUTORY RECOGNITION */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-600/25 shrink-0 overflow-hidden">
                {settings?.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getContentImageUrl(settings.logoUrl)}
                    alt={settings?.ngoName || 'Logo'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120&auto=format&fit=crop&q=80';
                    }}
                  />
                ) : (
                  <span>युवा</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-red-500 text-sm sm:text-base leading-tight truncate">
                  <span className='text-red-500 '>{settings?.ngoName || 'Indian Youth Foundation'}</span>
                </h3>
                <p className="text-[11px] text-red-400 font-bold leading-tight truncate">
                  {settings?.ngoNameHi || 'भारतीय युवा क्रांति'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal line-clamp-3">
              {settings?.footerDescription || 'A nationwide youth movement committed to grassroots social empowerment, free child literacy, blood donor networks, and emergency relief.'}
            </p>

            {/* Statutory Trust Badge */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <FiShield className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span className="truncate">12A &amp; 80G Registered NGO</span>
              </div>
              <div className="text-slate-400 text-[10px] leading-tight">
                Reg: <span className="text-slate-200 font-mono font-medium">{settings?.registrationNo || 'REG/2021/NGO/DEL/8741'}</span>
              </div>
              <div className="text-slate-400 text-[10px] leading-tight">
                NITI Darpan: <span className="text-slate-200 font-mono font-medium">{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: QUICK NAVIGATION */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2 border-l-2 border-red-600 pl-2">
              <span className='text-red-500'>Quick Links</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>
                <Link href="/who-we-are" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Who We Are</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Social Services</span>
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Active Campaigns</span>
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Join as Volunteer</span>
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Member Directory</span>
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Org Certificates &amp; 80G/12A</span>
                </Link>
              </li>
              <li>
                <Link href="/mission-vision" className="hover:text-red-400 transition flex items-center gap-1.5 group">
                  <FiChevronRight className="w-3 h-3 text-red-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  <span>Mission &amp; Vision</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* SECTION 3: HEADQUARTERS & CONTACT */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2 border-l-2 border-red-600 pl-2">
              <span className='text-red-500'>Contact Us</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li >
                <Link href={settings?.googleMapEmbed} className="flex items-start gap-2">
                  <FiMapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug text-slate-300 text-[11px] sm:text-xs line-clamp-2">
                    {settings?.address || 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh'}
                  </span>
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`tel:${settings?.phone || '+91 93196 98759'}`} className="hover:text-white transition font-semibold text-[11px] sm:text-xs">
                  {settings?.phone || '+91 93196 98759'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`} className="hover:text-white transition font-medium text-[11px] sm:text-xs truncate max-w-[190px]">
                  {settings?.email || 'contact@bharatiyayuvakranti.org'}
                </a>
              </li>
            </ul>

            <div className="pt-1">
              <Link
                href="/complaints"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] text-red-400 hover:text-red-300 border border-slate-800 font-semibold transition"
              >
                <FiMessageSquare className="w-3 h-3 text-red-500" />
                <span>Help Desk &amp; Grievance</span>
              </Link>
            </div>
          </div>

          {/* SECTION 4: DIRECT 80G DONATION & BANK DETAILS */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2 border-l-2 border-red-600 pl-2">
              <span className='text-red-500'>Tax-Exempt Giving</span>
            </h4>

            {/* UPI QR Code Pill */}
            <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                alt="UPI QR Code"
                className="w-12 h-12 rounded-xl bg-white p-0.5 shrink-0"
              />
              <div className="text-[10px] space-y-0.5 overflow-hidden">
                <div className="font-bold text-white text-[11px] leading-tight">Instant UPI Donation</div>
                <div className="text-red-400 font-mono text-[10px] truncate">{settings?.upiId || 'bharatiyauva@okhdfcbank'}</div>
                <div className="text-slate-400 text-[9px]">GPay, PhonePe, Paytm</div>
              </div>
            </div>

            {/* Bank Credentials */}
            <div className="text-[10px] sm:text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 space-y-0.5 leading-tight">
              <div>A/C Name: <span className="text-slate-200 font-medium truncate block sm:inline">{settings?.bankDetails?.accountName || 'Indian Youth Foundation'}</span></div>
              <div>A/C No: <span className="text-slate-200 font-mono font-bold">{settings?.bankDetails?.accountNumber || '50200088991234'}</span></div>
              <div>IFSC: <span className="text-slate-200 font-mono font-bold">{settings?.bankDetails?.ifscCode || 'HDFC0001234'}</span> ({settings?.bankDetails?.bankName || 'HDFC Bank'})</div>
            </div>
          </div>

        </div>

        {/* ---------------- FOOTER BOTTOM BAR: COPYRIGHT, POLICIES & ATTRIBUTION ---------------- */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <span>{settings?.footerCopyright || '© 2026 Indian Youth Foundation (Bharatiya Yuva Kranti). All rights reserved.'}</span>
            <Link href="/privacy-policy" className="text-slate-400 hover:text-red-400 transition underline underline-offset-2">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-red-400 transition underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <span>Designed by</span>
              <span className="font-bold text-red-500 hover:text-red-400 transition">
                ZDC Tech Global Solution Pvt Ltd
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer border border-slate-800 shadow-2xs"
              title="Back to Top"
              aria-label="Scroll to top"
            >
              <FiArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
