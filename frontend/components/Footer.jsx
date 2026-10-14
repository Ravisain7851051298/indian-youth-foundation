'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiHeart, 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiShield, 
  FiEye, 
  FiArrowUp
} from 'react-icons/fi';
import { useNGO } from '../context/NGOContext';

export default function Footer() {
  const { settings } = useNGO();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-slate-300 pt-16 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Column 1: NGO Identity & Tax Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/25 overflow-hidden">
                {settings?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>IYF</span>
                )}
              </div>
              <div>
                <h3 className="font-black text-white text-base">
                  {settings?.ngoName || 'Indian Youth Foundation'}
                </h3>
                <p className="text-xs text-red-500 font-bold">
                  {settings?.ngoNameHi || 'Bharatiya Yuva Kranti'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {settings?.footerDescription || 'A registered non-profit organization dedicated to youth development, child education, healthcare relief, and social empowerment. Recognized under Section 12A & 80G of the Income Tax Act.'}
            </p>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <FiShield className="w-4 h-4 shrink-0" />
                <span>12A &amp; 80G Certified Non-Profit</span>
              </div>
              <div className="text-slate-400">
                80G Order: <span className="text-slate-200 font-mono font-bold">{settings?.exemption80G}</span>
              </div>
              <div className="text-slate-400">
                12A Order: <span className="text-slate-200 font-mono font-bold">{settings?.exemption12A}</span>
              </div>
              <div className="text-slate-400">
                NITI Aayog Darpan: <span className="text-slate-200 font-mono font-bold">{settings?.nitiAayogDarpanId}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white tracking-widest uppercase border-l-2 border-red-600 pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-red-500 transition">
                  Our Social Services
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-red-500 transition">
                  Crowdfunding Campaigns
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-red-500 transition">
                  Join as Volunteer / Member
                </Link>
              </li>
              <li>
                <Link href="/members" className="hover:text-red-500 transition">
                  Member Directory &amp; ID Verification
                </Link>
              </li>
              <li>
                <Link href="/team-members" className="hover:text-red-500 transition">
                  Core Management Team
                </Link>
              </li>
              <li>
                <Link href="/mission-vision" className="hover:text-red-500 transition">
                  Mission, Vision &amp; Objectives
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-red-500 transition">
                  Flagship Programs
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-red-500 transition">
                  Certificate Verification
                </Link>
              </li>
              <li>
                <Link href="/story" className="hover:text-red-500 transition">
                  Life Impact Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white tracking-widest uppercase border-l-2 border-red-600 pl-2.5">
              Contact &amp; Headquarters
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings?.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition font-medium">
                  {settings?.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition font-medium">
                  {settings?.email}
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/complaints"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-red-500 border border-slate-800 font-semibold transition"
              >
                <span>Submit Grievance / Inquiry</span>
              </Link>
            </div>
          </div>

          {/* Column 4: Direct UPI QR & Bank Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white tracking-widest uppercase border-l-2 border-red-600 pl-2.5">
              Direct Bank &amp; UPI Donation
            </h4>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                alt="UPI QR Code"
                className="w-16 h-16 rounded-xl bg-white p-1 shrink-0"
              />
              <div className="text-[11px] space-y-0.5">
                <div className="font-bold text-white">Scan with any UPI App</div>
                <div className="text-red-400 font-mono text-[10px] break-all">{settings?.upiId}</div>
                <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm accepted</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div>Account: <span className="text-slate-200 font-medium">{settings?.bankDetails?.accountName}</span></div>
              <div>A/C No: <span className="text-slate-200 font-mono font-bold">{settings?.bankDetails?.accountNumber}</span></div>
              <div>IFSC: <span className="text-slate-200 font-mono font-bold">{settings?.bankDetails?.ifscCode}</span> ({settings?.bankDetails?.bankName})</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright, legal links & Page views */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>{settings?.footerCopyright || '© 2026 Indian Youth Foundation. All rights reserved.'}</span>
            <Link href="/privacy-policy" className="text-slate-400 hover:text-red-400 transition underline underline-offset-2">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-red-400 transition underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-400">
              <FiEye className="w-4 h-4 text-red-500" />
              <span>Verified Page Views: <strong className="text-white font-mono">{Number(settings?.pageViews || 18450).toLocaleString()}</strong></span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="Back to Top"
            >
              <FiArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
