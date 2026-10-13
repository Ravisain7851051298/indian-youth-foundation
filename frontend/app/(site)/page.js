'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiHeart, 
  FiShield, 
  FiUsers, 
  FiAward, 
  FiArrowRight, 
  FiCalendar, 
  FiMapPin, 
  FiCheckCircle, 
  FiShare2, 
  FiPlay,
  FiActivity,
  FiTarget,
  FiBookOpen,
  FiGift,
  FiPhone,
  FiMail,
  FiFileText,
  FiStar,
  FiCompass,
  FiLayers
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function HomePage() {
  const { 
    settings, 
    campaigns, 
    services, 
    events, 
    blogs, 
    feedbacks,
    lang 
  } = useNGO();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = settings?.heroSlides?.length ? settings.heroSlides : [
    {
      title: 'Empowering Youth, Transforming Society, Nation First',
      subtitle: 'Indian Youth Foundation (Bharatiya Yuva Kranti) is a nationwide non-profit movement mobilizing young leaders for child education, healthcare relief, and rural empowerment.',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Join as Member (Get ID Card)',
      buttonLink: '/volunteer'
    },
    {
      title: '100% Transparent Giving with 80G Tax Exemption',
      subtitle: 'Your contribution provides education to underprivileged children and emergency healthcare. Download your instant official 80G receipt immediately.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Donate Online (80G Receipt)',
      buttonLink: '/donation'
    }
  ];

  const currentSlide = heroSlides[activeSlide] || heroSlides[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SLIDER SECTION */}
      <section className="relative min-h-[620px] sm:min-h-[680px] flex items-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 scale-105"
          style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold backdrop-blur-md">
              <FiShield className="w-4 h-4" />
              <span>12A & 80G Certified Non-Profit • NITI Aayog Registered</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              {currentSlide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {currentSlide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/donation"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 hover:scale-105 transition"
              >
                <FiHeart className="w-4 h-4 fill-white" />
                <span>Donate Now (Instant 80G Receipt)</span>
              </Link>
              <Link
                href="/volunteer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-md hover:scale-105 transition"
              >
                <span>Join Foundation (Get ID Card)</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2 pt-6">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-8 bg-orange-500' : 'w-2.5 bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS COUNTER BAR */}
      <section className="bg-orange-600 text-white py-10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="border-r border-orange-500/60 last:border-none p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">25,000+</div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1.5">Underprivileged Lives Impacted</div>
            </div>
            <div className="border-r border-orange-500/60 last:border-none p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">3,500+</div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1.5">Active Volunteers & Members</div>
            </div>
            <div className="border-r border-orange-500/60 last:border-none p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">1,800+</div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1.5">Emergency Blood Units Donated</div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">100%</div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1.5">Audited & 80G Tax Exempt</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
                About the Foundation
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {settings?.aboutHeading || 'About Indian Youth Foundation (Bharatiya Yuva Kranti)'}
              </h2>
              <p className="text-sm font-semibold text-orange-600">
                {settings?.aboutSubtitle || 'A Government-Recognized Youth Social Welfare Movement Dedicated to Nation Building'}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {settings?.aboutStory || 'Founded by passionate youth leaders, Indian Youth Foundation is committed to grassroots nation-building. Operating across multiple states, our volunteers organize child education initiatives, 24x7 emergency blood donor networks, rural women livelihood training, and rapid disaster relief assistance.'}
              </p>

              {/* Statutory compliance callouts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[10px]">12A Registration</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5 truncate">{settings?.exemption12A}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[10px]">80G Tax Exemption</div>
                  <div className="font-mono font-bold text-orange-600 mt-0.5 truncate">{settings?.exemption80G}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[10px]">NITI Aayog Darpan</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5 truncate">{settings?.nitiAayogDarpanId}</div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href="/mission-vision"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md"
                >
                  <FiCompass className="w-4 h-4 text-orange-400" />
                  <span>Mission & Vision</span>
                </Link>
                <Link
                  href="/team-members"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition"
                >
                  <span>Meet Leadership Team →</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                  alt="Indian Youth Foundation Volunteers"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Youth Volunteer Movement</span>
                    <h3 className="text-lg font-black mt-0.5">Empowering Grassroots Communities Nationwide</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
              Identity & Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1.5 tracking-tight">
              Who We Are: The 4 Pillars of Our Movement
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Indian Youth Foundation is built on an unwavering commitment to youth energy, ethical transparency, and direct ground-level impact without bureaucratic intermediaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl mb-4">
                🎓
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Child Education (Shiksha)</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Free schooling kits, remedial tuition centers, and girl child scholarships enabling children in slum settlements to pursue higher studies.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-4">
                🩸
              </div>
              <h3 className="font-extrabold text-base text-slate-900">24x7 Blood Donor Network</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mobilizing rapid blood and platelet donations for emergency accident victims, pregnant mothers, and thalassemia patients.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl mb-4">
                💼
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Women & Youth Livelihood</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tailoring cooperatives, digital literacy workshops, and small business mentoring empowering rural women to earn dignified incomes.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
                🌿
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Environmental & Relief Work</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Native tree plantation drives, flood and winter relief kit distributions, and clean water access projects in marginalized clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE DO (OUR SERVICES) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
                What We Do
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1.5 tracking-tight">
                Our Core Social Welfare Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore All Services</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div 
                key={srv.id}
                className="bg-slate-50 p-7 rounded-3xl border border-slate-200/90 hover:shadow-xl hover:bg-white hover:border-orange-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl mb-5 group-hover:bg-orange-600 group-hover:text-white transition">
                    <FiActivity className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Active Service
                  </span>
                  <Link href="/services" className="text-orange-600 font-bold hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAMPAIGNS (CROWDFUNDING PLATFORM) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">
                Crowdfunding Drives
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-1.5 tracking-tight">
                Urgent Causes Requiring Your Kind Support
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-400 hover:text-orange-300"
            >
              <span>View All Campaigns</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.slice(0, 3).map((camp) => {
              const raised = camp.raisedAmount || 0;
              const goal = camp.goalAmount || 100000;
              const percent = Math.min(100, Math.round((raised / goal) * 100));

              return (
                <div 
                  key={camp._id || camp.id}
                  className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 hover:border-orange-500 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={camp.bannerImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {camp.urgent && (
                      <span className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                        Urgent Need
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-slate-900/90 text-orange-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {camp.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white line-clamp-2">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700">
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs mt-2 font-medium">
                        <span className="text-white font-bold">
                          ₹{Number(raised).toLocaleString('en-IN')} <span className="text-slate-400 font-normal">Raised</span>
                        </span>
                        <span className="text-orange-400 font-extrabold">{percent}%</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Target: ₹{Number(goal).toLocaleString('en-IN')} • {camp.donorCount || 0} Donors
                      </div>

                      <Link
                        href={`/donation?campaign=${camp._id || camp.id}`}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
                      >
                        <FiHeart className="w-4 h-4 fill-white" />
                        <span>Donate to this Cause (80G)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. LATEST NEWS & PRESS RELEASES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
                News Portal
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1.5 tracking-tight">
                Latest News & Official Press Releases
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>All News & Media</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((item) => (
              <div 
                key={item._id || item.id}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{item.date}</div>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <Link
                      href="/blogs"
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <span>Read Full Press Article</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EVENTS SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
                Events & Summits
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1.5 tracking-tight">
                Upcoming Foundation Summits & Activities
              </h2>
            </div>
            <Link
              href="/event"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <span>Explore All Events</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((evt) => (
              <div 
                key={evt._id || evt.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="flex items-center gap-1 bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded-full text-[11px]">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>{evt.date}</span>
                    </span>
                    <span className="text-slate-500 font-semibold text-[11px]">{evt.time || '10:00 AM'}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                    <FiMapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/event"
                    className="w-full text-center py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Register / Attend Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">
              Supporter Voices
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1.5 tracking-tight">
              What Donors & Volunteers Say About Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Transparent reporting, verified 80G receipts, and genuine field transformation build community trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.slice(0, 3).map((fb) => (
              <div 
                key={fb.id || fb._id}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{fb.comment}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{fb.name}</h4>
                    <span className="text-[11px] text-slate-500">{fb.role || 'Supporter'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{fb.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 80G TAX EXEMPTION & DIRECT UPI SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <FiShield className="w-4 h-4" />
                Income Tax Exemption under Section 80G & 12A
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
                Claim <span className="text-orange-400">50% Tax Deduction</span> on Every Donation You Make!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                All donations to Indian Youth Foundation are eligible for 50% deduction under Section 80G of the Income Tax Act. Official digitally verified 80G receipts with unique QR codes are generated immediately upon donation.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-slate-400 text-[11px]">80G Approval No:</div>
                  <div className="text-white font-mono font-bold mt-1 text-xs">{settings?.exemption80G}</div>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-slate-400 text-[11px]">12A Registration No:</div>
                  <div className="text-white font-mono font-bold mt-1 text-xs">{settings?.exemption12A}</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/donation"
                  className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg transition"
                >
                  Donate Online & Get 80G Receipt
                </Link>
                <Link
                  href="/certificates"
                  className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
                >
                  View Statutory Certificates
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white text-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Direct UPI Giving</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">Scan & Donate with Any UPI App</h3>
              <div className="my-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
                <img
                  src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                  alt="UPI Donation QR Code"
                  className="w-48 h-48 rounded-xl"
                />
              </div>
              <p className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-4 py-1.5 rounded-full">
                {settings?.upiId}
              </p>
              <p className="text-[11px] text-slate-500 mt-2.5">
                Bank A/C: {settings?.bankDetails?.accountName} • {settings?.bankDetails?.bankName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. HEAD OFFICE LOCATION (ALIGARH) & GOOGLE MAP PREVIEW */}
      <section className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">Head Office</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Visit Our Foundation Head Office
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect with our state coordinators and project directors at our Aligarh head office for CSR partnerships, membership drives, and community welfare initiatives.
              </p>

              <div className="space-y-3 text-xs text-slate-700 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <FiMapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{settings?.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiPhone className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Helpline: <strong className="text-slate-900">{settings?.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiMail className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Email: <strong className="text-slate-900">{settings?.email}</strong></span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/complaints"
                  className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
                >
                  Contact Form / Inquiries
                </Link>
                <Link
                  href="/volunteer"
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 transition"
                >
                  Join as Volunteer
                </Link>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="lg:col-span-7 h-88 rounded-3xl overflow-hidden border border-slate-300 shadow-lg">
              <iframe
                title="NGO Head Office Location Map"
                src={settings?.googleMapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
