'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiArrowRight,
  FiShield,
  FiHeart,
  FiActivity,
  FiAward,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

// 3 High-resolution curated fallback images for NGO initiatives
const DEFAULT_CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&auto=format&fit=crop&q=80',
];

export default function Hero() {
  const { settings } = useNGO();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = settings?.heroSlides?.length
    ? settings.heroSlides
    : [
      {
        title: 'Empowering Youth, Transforming Society, Nation First',
        subtitle:
          'Yuva Kranti Dal (युवा क्रांति दल) is a premier 12A & 80G certified NGO mobilizing young leaders for free child literacy, emergency healthcare, and rural empowerment.',
        imageUrl: DEFAULT_CAROUSEL_IMAGES[0],
        tag: 'National Youth Movement',
        ctaPrimaryText: 'Donate Online (Instant 80G)',
        ctaPrimaryLink: '/donation',
        ctaSecondaryText: 'Join as Member (Get ID Card)',
        ctaSecondaryLink: '/members',
        highlight: 'Over 25,000+ Underprivileged Beneficiaries Across India',
      },
      {
        title: '100% Transparent Giving with Section 80G Tax Exemption',
        subtitle:
          'Your contribution funds school books, student scholarships, emergency blood delivery, and women vocational centers. Claim 50% tax deduction with instant receipts.',
        imageUrl: DEFAULT_CAROUSEL_IMAGES[1],
        tag: '50% Income Tax Exemption',
        ctaPrimaryText: 'Contribute to a Campaign',
        ctaPrimaryLink: '/campaigns',
        ctaSecondaryText: 'Inspect Legal Certificates',
        ctaSecondaryLink: '/certificates',
        highlight: 'Instant 80G Form 10BD Eligible Receipts Generated',
      },
      {
        title: '24/7 Voluntary Blood Network & Emergency Relief Helpline',
        subtitle:
          'Connecting critical hospital patients with verified voluntary donors across districts in real time. Over 1,800 emergency units arranged with zero donor charges.',
        imageUrl: DEFAULT_CAROUSEL_IMAGES[2],
        tag: 'Emergency Relief Care',
        ctaPrimaryText: 'Emergency Blood Support',
        ctaPrimaryLink: '/complaints',
        ctaSecondaryText: 'Apply as Volunteer',
        ctaSecondaryLink: '/volunteer',
        highlight: 'Zero Administrative Fee Deductions • Real Ground Relief',
      },
    ];

  // Auto-slide transition: all hero elements change simultaneously every 6s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const currentSlide = slides[activeSlide] || slides[0];

  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Writing text typewriter animation for slide title
  useEffect(() => {
    const fullText = currentSlide?.title || '';
    setDisplayedTitle('');
    setIsTyping(true);

    let currentIndex = 0;
    const speed = 25; // 25ms per character for smooth energetic typing

    const typingTimer = setInterval(() => {
      currentIndex++;
      setDisplayedTitle(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        clearInterval(typingTimer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(typingTimer);
  }, [activeSlide, currentSlide?.title]);

  return (
    <section
      className="relative isolate overflow-hidden py-14 sm:py-20 border-b border-red-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Section"
    >
      {/* ---------------- BACKGROUND IMAGES WITH SMOOTH ANIMATION ---------------- */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        {slides.map((slide, idx) => {
          const bgImg = slide.imageUrl || DEFAULT_CAROUSEL_IMAGES[idx % DEFAULT_CAROUSEL_IMAGES.length];
          const isActive = activeSlide === idx;

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img
                src={getContentImageUrl(bgImg)}
                alt={`Yuva Kranti Dal Background Initiative ${idx + 1}`}
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${isActive ? 'scale-110 translate-x-1 -translate-y-1' : 'scale-100 translate-x-0 translate-y-0'
                  }`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_CAROUSEL_IMAGES[idx % DEFAULT_CAROUSEL_IMAGES.length];
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ---------------- CLEAN RED & WHITE THEME OVERLAY (MORE VISIBLE IMAGES) ---------------- */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-white/90 via-white/65 to-white/35" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-red-50/30 via-transparent to-white/60" />

      {/* Ambient Red Glow Highlights */}
      <div className="absolute -top-24 left-1/4 -z-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 -z-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Arrows for Carousel */}
      <button
        type="button"
        onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition backdrop-blur-xs border border-white/20 shadow-lg cursor-pointer"
        aria-label="Previous Slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition backdrop-blur-xs border border-white/20 shadow-lg cursor-pointer"
        aria-label="Next Slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* ---------------- FOREGROUND CONTENT (ALL CHANGE AT THE SAME TIME) ---------------- */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">

            {/* Trust Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-black shadow-xs">
              <FiShield className="w-4 h-4 text-red-600 shrink-0" />
              <span>{currentSlide.tag || 'Section 80G & 12A Certified • NITI Aayog Darpan Registered'}</span>
            </div>

            {/* Main Headline with Gradient & Writing Text Animation (Zero Layout Shift) */}
            <h1
              className="relative text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14] min-h-[105px] sm:min-h-[145px] lg:min-h-[185px]"
            >
              {/* Invisible phantom text reserving exact full layout space so zero layout shift occurs */}
              <span className="invisible select-none opacity-0 block" aria-hidden="true">
                {currentSlide.title}
              </span>

              {/* Absolute overlay containing the animated typewriter text in the exact reserved box */}
              <span className="absolute inset-0 block">
                <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent inline">
                  {displayedTitle}
                </span>
                {isTyping && (
                  <span className="inline-block w-1.5 h-[0.8em] ml-1.5 bg-red-600 animate-pulse align-baseline rounded-full" />
                )}
              </span>
            </h1>

            {/* Subtitle with stable min-height */}
            <p
              key={`sub-${activeSlide}`}
              className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium animate-fadeIn min-h-[72px] sm:min-h-[56px]"
            >
              {currentSlide.subtitle}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={currentSlide.ctaPrimaryLink || '/donation'}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl shadow-red-600/25 hover:scale-102 transition cursor-pointer"
              >
                <FiHeart className="w-4 h-4 fill-white" />
                <span>{currentSlide.ctaPrimaryText || 'Donate Online (Instant 80G)'}</span>
              </Link>

              <Link
                href={currentSlide.ctaSecondaryLink || '/volunteer'}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-black border-2 border-slate-200 hover:border-red-300 font-bold text-sm shadow-xs hover:scale-102 transition cursor-pointer"
              >
                <span>{currentSlide.ctaSecondaryText || 'Join as Member (Get ID Card)'}</span>
                <FiArrowRight className="w-4 h-4 text-red-600" />
              </Link>
            </div>

            {/* Clean Navigation Dots: Click to navigate slides */}
            <div className="flex items-center gap-2.5 pt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${activeSlide === idx
                    ? 'w-10 bg-red-600 shadow-sm shadow-red-500/50'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Right Hero Image Card (Changes at the exact same time) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                key={`slide-img-${activeSlide}`}
                src={getContentImageUrl(currentSlide.imageUrl)}
                alt={currentSlide.title || 'Yuva Kranti Dal Grassroots Initiatives'}
                className="w-full h-[400px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 animate-fadeIn"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_CAROUSEL_IMAGES[activeSlide % DEFAULT_CAROUSEL_IMAGES.length];
                }}
              />

              {/* Subtle bottom gradient for readability of pill & text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    <FiActivity className="w-3 h-3" />
                    <span>Live Grassroots Movement</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug text-white drop-shadow-md">
                    {currentSlide.highlight}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium">
                    Child literacy schools • Emergency blood dispatch • Women skill centers
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Quick Trust Badge */}
            <div className="absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl border border-red-100 shadow-xl hidden sm:flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-lg border border-red-200">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statutory Transparency</div>
                <div className="text-xs font-black text-black">12A &amp; 80G Certified Non-Profit</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Fade-in Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0.2;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
}