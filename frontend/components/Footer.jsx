'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiLogIn,
  FiChevronRight,
  FiHeart,
  FiShield,
  FiAward,
  FiArrowUpRight,
  FiCheckCircle
} from 'react-icons/fi';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaLinkedinIn,
  FaTelegram
} from 'react-icons/fa6';
import { useNGO } from '../context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function Footer() {
  const { settings } = useNGO();

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings?.facebook,
      icon: FaFacebookF,
      bg: 'hover:bg-[#1877F2]',
      color: 'hover:text-white',
    },
    {
      name: 'Instagram',
      url: settings?.instagram,
      icon: FaInstagram,
      bg: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]',
      color: 'hover:text-white',
    },
    {
      name: 'YouTube',
      url: settings?.youtube,
      icon: FaYoutube,
      bg: 'hover:bg-[#FF0000]',
      color: 'hover:text-white',
    },
    {
      name: 'X (Twitter)',
      url: settings?.twitter,
      icon: FaXTwitter,
      bg: 'hover:bg-black',
      color: 'hover:text-white',
    },
    {
      name: 'LinkedIn',
      url: settings?.linkedin,
      icon: FaLinkedinIn,
      bg: 'hover:bg-[#0A66C2]',
      color: 'hover:text-white',
    },
    {
      name: 'Telegram',
      url: settings?.telegram,
      icon: FaTelegram,
      bg: 'hover:bg-[#229ED9]',
      color: 'hover:text-white',
    },
  ].filter((item) => Boolean(item.url));

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans relative overflow-hidden">
      {/* Top Green & Red dual gradient bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#0b8026] via-rose-600 to-[#dc2626]" />

      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0b8026]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ---------------- 1. TOP HIGHLIGHT CONTACT CARDS ---------------- */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Office Address Card */}
          <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-[#0b8026]/50 rounded-2xl p-5 transition-all duration-300 shadow-sm flex items-start gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-[#0b8026]/20 text-[#0b8026] group-hover:bg-[#0b8026] group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
              <FiMapPin className="text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-xs font-black uppercase tracking-wider">
                Head Office
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {settings?.address || 'State Office - Krishna Vihar Pala Road, Aligarh - 202001, Uttar Pradesh'}
              </p>
            </div>
          </div>

          {/* Contact Helpline Card */}
          <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-red-500/50 rounded-2xl p-5 transition-all duration-300 shadow-sm flex items-start gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 text-red-400 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
              <FiPhone className="text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-xs font-black uppercase tracking-wider">
                24x7 Helpline
              </h4>
              <a
                href={`tel:${settings?.phone || '+919319698759'}`}
                className="text-sm font-bold text-slate-200 hover:text-white transition block"
              >
                {settings?.phone || '+91 93196 98759'}
              </a>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                Free Community Grievance &amp; Relief
              </span>
            </div>
          </div>

          {/* Official Email Card */}
          <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-[#0b8026]/50 rounded-2xl p-5 transition-all duration-300 shadow-sm flex items-start gap-4 group">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-inner">
              <FiMail className="text-xl" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-xs font-black uppercase tracking-wider">
                Official Email Desk
              </h4>
              <a
                href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`}
                className="text-xs sm:text-sm font-bold text-slate-200 hover:text-emerald-400 transition block truncate max-w-55"
                title={settings?.email || 'samasyasamadhanparishad@gmail.com'}
              >
                {settings?.email || 'samasyasamadhanparishad@gmail.com'}
              </a>
              <span className="text-[11px] text-slate-400 font-medium block">
                Prompt response within 24 working hours
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 2. MAIN FOOTER: BRAND, QUICK LINKS, SOCIAL MEDIA ---------------- */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left Column: NGO Brand, Mission & Seal (Col 4) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl border-2 border-[#0b8026] p-1.5 bg-white flex items-center justify-center shrink-0 shadow-md">
                <img
                  src={getContentImageUrl(settings?.logoUrl) || '/logo.jpeg'}
                  alt={settings?.ngoName || 'Samasya Samadhan Parishad (SSP)'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/logo.jpeg';
                  }}
                />
              </div>
              <div>
                <h3 className="text-base font-black text-white leading-tight">
                  {settings?.ngoName || 'Samasya Samadhan Parishad (SSP)'}
                </h3>
                <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                  {settings?.tagline || 'Empowering Society, Transforming India, Nation First'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              A registered public charitable foundation dedicated to grassroots community welfare, child literacy, disaster relief, and youth empowerment across India.
            </p>

            {/* Badges / Compliances */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                <FiShield className="w-3.5 h-3.5 text-[#0b8026]" />
                <span>Section 80G Approved</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                <FiAward className="w-3.5 h-3.5 text-amber-400" />
                <span>NITI Aayog Darpan</span>
              </span>
            </div>
          </div>

          {/* Middle Column: Useful Links (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="border-b-2 border-[#0b8026] inline-block pb-1">
              <h3 className="font-black text-sm text-white tracking-wide uppercase">
                Useful Quick Links
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-300">
              <Link href="/" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Home Page</span>
              </Link>
              <Link href="/about" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>About Foundation</span>
              </Link>
              <Link href="/services" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Social Services</span>
              </Link>
              <Link href="/campaigns" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Live Campaigns</span>
              </Link>
              <Link href="/event" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Upcoming Events</span>
              </Link>
              <Link href="/apply-member" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Apply for Member</span>
              </Link>
              <Link href="/apply-volunteer" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Join Volunteer Wing</span>
              </Link>
              <Link href="/donation" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Online Donation</span>
              </Link>
              <Link href="/certificates" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Verify Certificates</span>
              </Link>
              <Link href="/team-members" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Management Team</span>
              </Link>
              <Link href="/gallery" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Photo Gallery</span>
              </Link>
              <Link href="/feedback" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Public Reviews</span>
              </Link>
              <Link href="/complaints" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>Grievance Desk</span>
              </Link>
              <Link href="/donation/80G" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                <FiChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                <span>80G Tax Exemption</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Connect & Social Media + Quick Login (Col 3) */}
          <div className="md:col-span-3 space-y-5">
            <div className="border-b-2 border-red-500 inline-block pb-1">
              <h3 className="font-black text-sm text-white tracking-wide uppercase">
                Connect With Us
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Follow our official media channels for real-time welfare drives, beneficiary stories, and urgent emergency appeals.
            </p>

            {/* Dynamic Social Media Icons Loaded from Admin Settings */}
            <div className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm ${s.bg} ${s.color}`}
                    title={s.name}
                    aria-label={s.name}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Quick Action Button: Member Login & Donation */}
            <div className="space-y-2 pt-2">
              {/* <Link
                href="/login"
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-red-900/30 transition group"
              >
                <span className="flex items-center gap-2">
                  <FiLogIn className="w-4 h-4" />
                  <span>Member &amp; Volunteer Login</span>
                </span>
                <FiArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link> */}

              <Link
                href="/donation"
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-slate-200 border border-slate-700 font-bold text-xs transition group"
              >
                <span className="flex items-center gap-2">
                  <FiHeart className="w-4 h-4 text-red-400 group-hover:text-white transition" />
                  <span>Donate to Support Causes</span>
                </span>
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- 3. BOTTOM STATUTORY & COPYRIGHT BAR ---------------- */}
      <div className="border-t border-slate-800/90 bg-slate-950/80 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            Copyright © {new Date().getFullYear()}{' '}
            <span className="text-white font-bold">
              {settings?.ngoName || 'Samasya Samadhan Parishad (SSP)'}
            </span>
            . All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-slate-400 font-medium">
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Statutory Disclaimer
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
