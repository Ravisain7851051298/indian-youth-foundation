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
  FiLayers,
  FiImage
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function HomePage() {
  const { 
    settings, 
    campaigns, 
    services, 
    events, 
    blogs, 
    gallery,
    feedbacks,
    lang 
  } = useNGO();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = settings?.heroSlides?.length ? settings.heroSlides : [
    {
      title: 'Empowering Youth, Transforming Society, Nation First',
      subtitle: 'Indian Youth Foundation (Bharatiya Yuva Kranti) is a government-registered non-profit movement mobilizing young leaders for child education, emergency healthcare, and rural empowerment.',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Join as Member (Get ID Card)',
      buttonLink: '/volunteer'
    },
    {
      title: '100% Transparent Giving with 80G Tax Exemption',
      subtitle: 'Your kind contribution funds scholarships for underprivileged children and emergency healthcare relief. Download your official 80G tax certificate immediately.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
      buttonText: 'Donate Online (Instant 80G)',
      buttonLink: '/donation'
    }
  ];

  const currentSlide = heroSlides[activeSlide] || heroSlides[0];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* 1. HERO SECTION (White & Red Modern Banner) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-white py-16 sm:py-24 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-black shadow-xs">
                <FiShield className="w-4 h-4 text-red-600" />
                <span>Section 80G &amp; 12A Certified • NITI Aayog Darpan Registered</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.15]">
                {currentSlide.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                {currentSlide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/donation"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl shadow-red-600/25 hover:scale-102 transition cursor-pointer"
                >
                  <FiHeart className="w-4 h-4 fill-white" />
                  <span>Donate Online (80G Tax Exemption)</span>
                </Link>
                <Link
                  href="/volunteer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-black border-2 border-slate-200 hover:border-red-300 font-bold text-sm shadow-sm hover:scale-102 transition cursor-pointer"
                >
                  <span>Join as Volunteer / Member</span>
                  <FiArrowRight className="w-4 h-4 text-red-600" />
                </Link>
              </div>

              {/* Slider Dots & Indicators */}
              <div className="flex items-center gap-3 pt-4">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx ? 'w-8 bg-red-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <img
                  src={getContentImageUrl(currentSlide.imageUrl)}
                  alt="Indian Youth Foundation Grassroots Work"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-400 bg-black/40 px-2 py-0.5 rounded-md">
                      Youth Social Leadership
                    </span>
                    <h3 className="text-lg font-black leading-snug">
                      Over 25,000+ Underprivileged Beneficiaries Supported Across India
                    </h3>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl border border-red-100 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl border border-red-200">
                  <FiAward className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500">Official Status</div>
                  <div className="text-sm font-black text-black">Government Verified NGO</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER BAR (White & Red) */}
      <section className="bg-red-600 text-white py-10 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-red-500/60 last:border-none p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">25,000+</div>
              <div className="text-xs sm:text-sm font-bold text-red-100 mt-1.5">Underprivileged Lives Impacted</div>
            </div>
            <div className="border-r border-red-500/60 last:border-none p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">3,500+</div>
              <div className="text-xs sm:text-sm font-bold text-red-100 mt-1.5">Volunteers &amp; Members with ID Cards</div>
            </div>
            <div className="border-r border-red-500/60 last:border-none p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">1,800+</div>
              <div className="text-xs sm:text-sm font-bold text-red-100 mt-1.5">Emergency Blood Units Arranged</div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-5xl font-black tracking-tight">100%</div>
              <div className="text-xs sm:text-sm font-bold text-red-100 mt-1.5">Audited &amp; 80G Tax Exempt</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT THE FOUNDATION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                <span>About the Movement</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                {settings?.aboutHeading || 'Indian Youth Foundation (Bharatiya Yuva Kranti)'}
              </h2>
              <p className="text-sm font-bold text-red-600">
                {settings?.aboutSubtitle || 'A Registered National Youth Social Welfare Movement Dedicated to Nation Building'}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {settings?.aboutStory || 'Operating across multiple states, our volunteers organize child education initiatives, 24x7 emergency blood donor networks, rural women livelihood training, and rapid disaster relief assistance.'}
              </p>

              {/* Statutory compliance callouts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-bold">12A Registration</div>
                  <div className="font-mono font-black text-black mt-0.5 truncate">{settings?.exemption12A || '12A-REG-VERIFIED'}</div>
                </div>
                <div className="bg-red-50/60 p-3 rounded-2xl border border-red-200">
                  <div className="text-red-700 text-[10px] font-bold">80G Tax Exemption</div>
                  <div className="font-mono font-black text-red-600 mt-0.5 truncate">{settings?.exemption80G || '80G-TAX-EXEMPT'}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[10px] font-bold">NITI Aayog Darpan</div>
                  <div className="font-mono font-black text-black mt-0.5 truncate">{settings?.nitiAayogDarpanId || 'DARPAN-RJ-2024'}</div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href="/mission-vision"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-xs transition shadow-md"
                >
                  <FiCompass className="w-4 h-4 text-red-400" />
                  <span>Mission &amp; Vision</span>
                </Link>
                <Link
                  href="/team-members"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-red-50 text-black font-bold text-xs transition"
                >
                  <span>Meet Leadership Team →</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                  alt="Indian Youth Foundation Volunteers"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">Youth Volunteer Movement</span>
                    <h3 className="text-lg font-black mt-0.5">Empowering Grassroots Communities Nationwide</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAMPAIGNS (CROWDFUNDING PLATFORM) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiTarget className="w-3.5 h-3.5 text-red-600" />
                <span>Urgent Crowdfunding Drives</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Support Verified Causes &amp; Save Lives
              </h2>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700"
            >
              <span>View All Active Drives</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.slice(0, 3).map((camp) => {
              const raised = camp.raisedAmount || 0;
              const goal = camp.goalAmount || 100000;
              const percent = Math.min(100, Math.round((raised / goal) * 100));
              const banner = getContentImageUrl(camp.bannerImage || (Array.isArray(camp.images) && camp.images[0]));

              return (
                <div 
                  key={camp._id || camp.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-red-500 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={banner || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                      }}
                    />
                    {camp.urgent && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                        Urgent Need
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {camp.category || 'General'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-black text-black line-clamp-2 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {camp.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {/* Progress Bar */}
                      <div className="w-full bg-red-50 h-2.5 rounded-full overflow-hidden border border-red-100">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-rose-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs mt-2 font-semibold">
                        <span className="text-black font-bold">
                          ₹{Number(raised).toLocaleString('en-IN')} <span className="text-slate-500 font-normal">Raised</span>
                        </span>
                        <span className="text-red-600 font-black">{percent}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Target: ₹{Number(goal).toLocaleString('en-IN')} • {camp.donorCount || 0} Generous Donors
                      </div>

                      <Link
                        href={`/donation?campaign=${camp._id || camp.id}`}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                      >
                        <FiHeart className="w-4 h-4 fill-white" />
                        <span>Donate to this Cause (80G Tax Exemption)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. GALLERY HIGHLIGHTS PREVIEW (New Section) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
                <FiImage className="w-3.5 h-3.5 text-red-600" />
                <span>Field Documentation</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Photo &amp; Video Gallery Highlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
                Witness our on-ground youth drives, relief distributions, and community impact.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700"
            >
              <span>Explore Full Gallery ({gallery.length} items)</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(gallery.slice(0, 4).length > 0 ? gallery.slice(0, 4) : [
              { title: 'Free Education Kit Distribution', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600', category: 'Child Education' },
              { title: 'Emergency Blood Donation Camp', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600', category: 'Health' },
              { title: 'Women Tailoring & Skill Center', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600', category: 'Livelihood' },
              { title: 'Winter Blanket & Ration Relief', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600', category: 'Disaster Relief' },
            ]).map((item, idx) => (
              <Link
                key={item._id || item.id || idx}
                href="/gallery"
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 aspect-4/3 bg-slate-100 flex flex-col justify-end p-4"
              >
                <img
                  src={getContentImageUrl(item.url || item.imageUrl)}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-black/60 px-2 py-0.5 rounded-md">
                    {item.category || 'Grassroots Impact'}
                  </span>
                  <h4 className="font-bold text-xs mt-1 line-clamp-1 leading-snug text-white">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. UPCOMING EVENTS & CONFERENCES */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiCalendar className="w-3.5 h-3.5 text-red-600" />
                <span>Foundation Gatherings</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Upcoming Foundation Events &amp; Summits
              </h2>
            </div>
            <Link
              href="/event"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700"
            >
              <span>Explore All Events</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((evt) => (
              <div 
                key={evt._id || evt.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="flex items-center gap-1 bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-full text-[11px] border border-red-200">
                      <FiCalendar className="w-3.5 h-3.5 text-red-600" />
                      <span>{evt.date || 'Upcoming'}</span>
                    </span>
                    <span className="text-slate-500 font-semibold text-[11px]">{evt.time || '10:00 AM'}</span>
                  </div>
                  <h3 className="text-base font-black text-black">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed line-clamp-2 font-medium">
                    {evt.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-3 font-medium">
                    <FiMapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="truncate">{evt.location || 'Foundation Head Office / Online'}</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/event"
                    className="w-full text-center py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Attend / Register for Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST NEWS & PRESS RELEASES */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
                <FiFileText className="w-3.5 h-3.5 text-red-600" />
                <span>Media &amp; Publications</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Latest News &amp; Official Press Releases
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700"
            >
              <span>View All Press Releases</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((item) => {
              const img = getContentImageUrl(item.image || item.imageUrl);
              return (
                <div 
                  key={item._id || item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between group"
                >
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img
                      src={img || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400';
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-black text-red-600 uppercase tracking-wider">{item.date || 'Press Release'}</div>
                      <h3 className="font-black text-base text-black mt-1 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-2 line-clamp-3 leading-relaxed font-medium">
                        {item.content || item.summary}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href="/blogs"
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <span>Read Full Press Article</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. 80G TAX EXEMPTION & DIRECT UPI GIVING */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-sm">
                <FiShield className="w-4 h-4 text-white" />
                Income Tax Exemption under Section 80G &amp; 12A
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
                Claim <span className="text-yellow-300">50% Tax Deduction</span> on Every Donation You Make!
              </h2>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                All donations to Indian Youth Foundation are eligible for 50% deduction under Section 80G of the Income Tax Act. Official digitally verified 80G receipts with unique QR verification codes are generated immediately upon donation.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-white/80 text-[11px] font-bold">80G Approval Number:</div>
                  <div className="text-white font-mono font-black mt-1 text-xs">{settings?.exemption80G || 'AABTI1234F2024'}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-white/80 text-[11px] font-bold">12A Registration Number:</div>
                  <div className="text-white font-mono font-black mt-1 text-xs">{settings?.exemption12A || '12A-DEL-2024'}</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/donation"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-red-700 font-black text-xs shadow-xl transition cursor-pointer"
                >
                  Donate Online &amp; Get 80G Receipt
                </Link>
                <Link
                  href="/certificates"
                  className="px-6 py-3.5 rounded-2xl bg-red-950/40 hover:bg-red-950/60 text-white font-bold text-xs border border-white/30 transition backdrop-blur-sm cursor-pointer"
                >
                  View Statutory Certificates
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white text-black p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border-4 border-white">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Direct UPI Giving</span>
              <h3 className="text-base font-black text-black mt-1">Scan &amp; Donate with Any UPI App</h3>
              <div className="my-5 p-3 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
                <img
                  src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                  alt="UPI Donation QR Code"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              </div>
              <p className="text-xs font-mono font-bold text-black bg-red-50 border border-red-200 px-4 py-1.5 rounded-full">
                {settings?.upiId || 'bharatiyauva@okhdfcbank'}
              </p>
              <p className="text-[11px] text-slate-600 mt-2.5 font-medium">
                Bank A/C: {settings?.bankDetails?.accountName || 'Indian Youth Foundation'} • {settings?.bankDetails?.bankName || 'State Bank of India'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 9. HEAD OFFICE LOCATION & REACH US */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Head Office</span>
              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Visit Our National Foundation Office
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Connect with our directors and state coordinators for CSR partnerships, membership drives, and volunteer initiatives.
              </p>

              <div className="space-y-3 text-xs text-black bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm font-medium">
                <div className="flex items-start gap-2.5">
                  <FiMapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{settings?.address || 'Indian Youth Foundation Head Office, Aligarh, Uttar Pradesh'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiPhone className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Helpline: <strong className="text-black">{settings?.phone || '+91 7851051298'}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiMail className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Email: <strong className="text-black">{settings?.email || 'contact@indianyouthfoundation.org'}</strong></span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/complaints"
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                >
                  Contact Form / Inquiries
                </Link>
                <Link
                  href="/volunteer"
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-red-50 text-black font-bold text-xs border border-slate-300 transition cursor-pointer"
                >
                  Join as Volunteer
                </Link>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="lg:col-span-7 h-88 rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <iframe
                title="NGO Head Office Location Map"
                src={settings?.googleMapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112999.8824302613!2d78.0101683972656!3d27.8973944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a4805e1b21ef%3A0xb36340c2be3a525e!2sAligarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
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
