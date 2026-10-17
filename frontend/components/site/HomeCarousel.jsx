'use client';

import React, { useState, useEffect } from 'react';
import { getContentImageUrl } from '@/lib/authApi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DEFAULT_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&auto=format&fit=crop&q=80',
    title: 'Samasya Samadhan Parishad (SSP)',
    subtitle: 'Dedicated to sustainable development, education and health',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&auto=format&fit=crop&q=80',
    title: 'Empowering Communities Across India',
    subtitle: 'Transparent social welfare and humanitarian service',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&auto=format&fit=crop&q=80',
    title: '24/7 Voluntary Support & Community Upliftment',
    subtitle: 'Together we can make a difference',
  },
];

export default function HomeCarousel({ slides = [] }) {
  const displaySlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || displaySlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, displaySlides.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % displaySlides.length);
  };

  return (
    <div
      className="relative w-full h-[340px] sm:h-[480px] md:h-[600px] lg:h-[720px] xl:h-[800px] 2xl:h-[860px] overflow-hidden bg-slate-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {displaySlides.map((slide, idx) => {
        const isActive = idx === currentIdx;
        const imgUrl = getContentImageUrl(slide.imageUrl);

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={imgUrl}
              alt={slide.title || `SSP Banner ${idx + 1}`}
              className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-102' : 'scale-100'
              }`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].imageUrl;
              }}
            />
            {/* Very subtle bottom gradient if text exists */}
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-10 text-white">
                {slide.title && (
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-black drop-shadow-md">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-xs sm:text-base text-slate-200 mt-1 max-w-3xl drop-shadow-sm font-medium">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows matching reference screenshot style */}
      {displaySlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-14 rounded-md bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs cursor-pointer"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-14 rounded-md bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs cursor-pointer"
            aria-label="Next Slide"
          >
            <FiChevronRight className="w-8 h-8" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIdx ? 'w-8 bg-white shadow' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
