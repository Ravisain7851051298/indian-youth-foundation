'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiTarget,
  FiCompass,
  FiCheckCircle,
  FiArrowRight,
  FiAward,
  FiUsers,
  FiFileText,
  FiHeart,
  FiBookOpen,
  FiActivity,
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function HomeAbout() {
  const { settings } = useNGO();

  const corePillars = [
    {
      title: 'Free Child Education',
      desc: 'Free evening tuition, school bags, and stationery kits for slum children.',
      icon: FiBookOpen,
    },
    {
      title: '24/7 Blood Network',
      desc: 'Emergency blood & platelet donor mobilization across all districts.',
      icon: FiActivity,
    },
    {
      title: 'Women Self-Reliance',
      desc: 'Vocational tailoring units, micro-enterprise training & livelihood kits.',
      icon: FiAward,
    },
    {
      title: 'Emergency Relief Care',
      desc: 'Disaster response, winter blanket drives, and dry ration distribution.',
      icon: FiHeart,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200" aria-label="About Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold mb-3">
            <FiShield className="w-4 h-4 text-red-600" />
            <span>Government-Recognized 12A &amp; 80G Certified NGO</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
            {settings?.aboutHeading || 'About Indian Youth Foundation (भारतीय युवा क्रांति)'}
          </h2>

          <p className="text-xs sm:text-base text-slate-600 mt-3 font-medium leading-relaxed">
            {settings?.aboutSubtitle || 'A Grassroots Youth Social Welfare Movement Dedicated to Nation Building & Upliftment'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Dynamic Story, Mission & Vision */}
          <div className="lg:col-span-7 space-y-6">

            {/* Dynamic About Story */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {settings?.aboutStory ||
                'Founded by visionary youth leaders, Indian Youth Foundation is committed to grassroots nation-building. Operating across multiple states, our volunteers organize child education initiatives, 24x7 emergency blood donor networks, rural women livelihood training, and rapid disaster relief assistance.'}
            </p>

            {/* Mission & Vision Dynamic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Mission Card */}
              <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 hover:border-red-300 transition shadow-xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm shadow-red-600/30">
                    <FiTarget className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-black">Our Mission</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {settings?.missionStatement ||
                    settings?.aboutMissionSummary ||
                    'To channel the energy and passion of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every child, healthcare access, and disaster relief.'}
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 hover:border-rose-300 transition shadow-xs">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center font-bold shadow-sm shadow-rose-600/30">
                    <FiCompass className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-black">Our Vision</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {settings?.visionStatement ||
                    settings?.aboutVisionSummary ||
                    'To foster an empowered, educated, and self-reliant nation where proactive youth leadership eliminates socioeconomic disparities and creates lasting community prosperity.'}
                </p>
              </div>
            </div>

            {/* Dynamic Statutory Details Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-black text-red-600 uppercase tracking-widest block">
                Statutory Accreditations &amp; Compliance Details
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">80G Approval No:</div>
                  <div className="font-mono font-bold text-black mt-0.5">{settings?.exemption80G || 'CIT(EXEMP)/80G/881'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">12A Reg. No:</div>
                  <div className="font-mono font-bold text-black mt-0.5">{settings?.exemption12A || 'CIT(EXEMP)/12A/492'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">NITI Aayog Darpan:</div>
                  <div className="font-mono font-bold text-black mt-0.5">{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold">Registration / PAN:</div>
                  <div className="font-mono font-bold text-black mt-0.5">{settings?.registrationNo || settings?.panNo || 'AAATB4321Q'}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/20 hover:scale-102 transition cursor-pointer"
              >
                <span>Read Full Foundation Story</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/who-we-are"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-black border border-slate-300 hover:border-red-300 font-bold text-xs transition cursor-pointer"
              >
                <span>Who We Are</span>
              </Link>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1 ml-auto"
              >
                <FiFileText className="w-3.5 h-3.5" />
                <span>Verify Certificates</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Visual Feature Card & Core Initiatives */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              <img
                src={getContentImageUrl(settings?.whoWeAreBannerUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80')}
                alt="Indian Youth Foundation Leadership"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    Grassroots Youth Movement
                  </span>
                  <h3 className="text-lg font-black leading-snug">
                    {settings?.ngoName || 'Indian Youth Foundation'}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium">
                    {settings?.tagline || 'Empowering Youth, Transforming Society, Nation First'}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Action Pillars Grid */}
            <div className="grid grid-cols-2 gap-3">
              {corePillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-red-300 transition">
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-black text-black leading-snug">{pillar.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
