'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiUsers,
  FiCompass,
  FiTarget,
  FiShield,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiAward,
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import ContentRenderer from '@/components/ContentRenderer';

export default function WhoWeArePage() {
  const { settings } = useNGO();

  const fallbackStory = `Founded by passionate young patriots and grassroots social activists, Yuva Kranti Dal (युवा क्रांति दल) was born from a deep conviction: that India's greatest reservoir of untapped power is its youth. Guided by the ethos of "Nation First, Society Always", we bridge the chasm between compassionate intent and concrete ground action.

From running evening community literacy circles for slum children and maintaining an agile 24x7 emergency blood donor network across districts, to providing women self-reliance tailoring skills and mounting rapid relief during natural disasters, our youth task force stands on the frontlines of humanitarian transformation.

We operate with unwavering corporate governance, complete CBDT statutory transparency, zero administrative overhead leakage, and an uncompromising dedication to human dignity.`;

  const fallbackMission = settings?.missionStatement || 'To channel the vibrant energy, intellect, and civic dedication of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every underprivileged child, immediate healthcare access, women economic self-reliance, and disaster relief.';
  const fallbackVision = settings?.visionStatement || 'To foster an empowered, educated, and self-reliant India where proactive youth leadership eliminates socioeconomic disparities, champions community brotherhood, and builds a prosperous nation.';

  const fallbackValues = `Nation First: Every action is dedicated to national strength and social harmony.
Integrity & Transparency: 100% statutory adherence, audited accounts, and public receipts.
Youth Leadership: Placing young changemakers in driving seats of community solutions.
Empathy in Action: Rapid, unconditional grassroots aid for every vulnerable citizen.`;

  const storyContent = settings?.whoWeAreStory || fallbackStory;
  const missionContent = settings?.whoWeAreMission || fallbackMission;
  const visionContent = settings?.whoWeAreVision || fallbackVision;
  const valuesContent = settings?.whoWeAreValues || fallbackValues;

  const bannerImg = settings?.whoWeAreBannerUrl 
    ? getContentImageUrl(settings.whoWeAreBannerUrl) 
    : 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black shadow-xs">
              <FiUsers className="w-4 h-4 text-emerald-700" />
              <span>Who We Are • {settings?.ngoNameHi || 'युवा क्रांति दल'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
              {settings?.whoWeAreHeading || 'Who We Are — The Pulse of Yuva Kranti Dal'}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {settings?.whoWeAreSubtitle || 'A Catalyst for Grassroots Youth Empowerment, Civil Welfare & Nation Building'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/donation"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-lg shadow-emerald-700/25 hover:scale-102 transition"
              >
                <FiHeart className="w-4 h-4 fill-white" />
                <span>Support Our Cause (80G Tax-Deductible)</span>
              </Link>
              <Link
                href="/volunteer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-slate-200 font-bold text-xs shadow-xs hover:scale-102 transition"
              >
                <FiUsers className="w-4 h-4 text-emerald-700" />
                <span>Join as Volunteer</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs hover:scale-102 transition"
              >
                <FiFileText className="w-4 h-4 text-slate-600" />
                <span>Legal Accreditations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. MAIN STORY & BANNER ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Dynamic Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <FiCompass className="w-3.5 h-3.5 text-emerald-700" />
                <span>Our Identity &amp; Living Journey</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Channeling Youth Energy into Lasting Social Equity
              </h2>

              {/* Dynamic Content rendered from Admin Settings */}
              <div className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
                <ContentRenderer content={storyContent} />
              </div>
            </div>

            {/* Right: Banner Image & Fast Facts */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImg}
                  alt={settings?.whoWeAreHeading || 'Yuva Kranti Dal'}
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-black/60 px-2 py-0.5 rounded-md">
                      Ground Social Action
                    </span>
                    <h3 className="text-sm font-black text-white">
                      {settings?.ngoName || 'Yuva Kranti Dal'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Mobilizing over 3,500+ verified volunteers across India.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statutory Trust Card */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3.5 shadow-xs">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FiShield className="text-emerald-700 w-4 h-4" />
                  <span>Statutory Certifications</span>
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">12A Reg No.</span>
                    <span className="font-mono font-bold text-slate-900 truncate block text-[11px] mt-0.5">
                      {settings?.exemption12A || 'CIT(EXEMP)/12A/2021-22/A-492'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">80G Tax Exemption</span>
                    <span className="font-mono font-bold text-emerald-700 truncate block text-[11px] mt-0.5">
                      {settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">NITI Aayog Darpan</span>
                    <span className="font-mono font-bold text-slate-900 truncate block text-[11px] mt-0.5">
                      {settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-semibold">PAN Card</span>
                    <span className="font-mono font-bold text-slate-900 uppercase truncate block text-[11px] mt-0.5">
                      {settings?.panNo || 'AAATB4321Q'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. MISSION & VISION DUAL CARDS ---------------- */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Our Compass
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Mission &amp; Vision Statements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The foundational guiding stars directing every program and humanitarian intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                <FiTarget className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {missionContent}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4" />
                <span>Measurable Grassroots Impact</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                <FiCompass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {visionContent}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <FiCheckCircle className="w-4 h-4" />
                <span>Self-Reliant &amp; United Nation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. CORE VALUES & ETHOS ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Core Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                The Non-Negotiable Values Guiding Our Volunteers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe that good intentions without disciplined execution and high ethics achieve little. Every volunteer and leader adheres to our transparent principles.
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <FiAward className="w-4 h-4 text-emerald-700" />
                  <span>National President Signatory</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {settings?.presidentName || 'Ravi Saini (National President & Trustee)'}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <ContentRenderer content={valuesContent} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 5. CONTACT & HELPLINE BAR ---------------- */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Have questions about our foundation or initiatives?
              </h3>
              <p className="text-xs text-slate-600">
                Reach out directly to our national central desk or visit our registered headquarters.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${settings?.phone || '+91 93196 98759'}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                <FiPhone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{settings?.phone || '+91 93196 98759'}</span>
              </a>
              <a
                href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-md shadow-emerald-700/20"
              >
                <FiMail className="w-3.5 h-3.5" />
                <span>Email Administration</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
