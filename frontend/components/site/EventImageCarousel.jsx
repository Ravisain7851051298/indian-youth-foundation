'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { getContentImageUrl } from '@/lib/authApi';

const DEFAULT_EVENT_FALLBACK = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';

export default function EventImageCarousel({
  images = [],
  fallbackImage = '',
  title = 'Event Photo',
  className = 'h-56',
  badgeText = ''
}) {
  // Collect all available image URLs up to 5
  const rawList = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : (fallbackImage ? [fallbackImage] : [DEFAULT_EVENT_FALLBACK]);

  const list = rawList.slice(0, 5);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto transition every 3.5 seconds if more than 1 image
  useEffect(() => {
    if (list.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % list.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [list.length, isHovered]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % list.length);
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-900 group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Auto cycling images */}
      {list.map((src, idx) => {
        const isActive = currentIdx === idx;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={getContentImageUrl(src)}
              alt={`${title} - Photo ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_EVENT_FALLBACK;
              }}
            />
          </div>
        );
      })}

      {/* Subtle top and bottom shadows for badge visibility */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-t from-black/60 via-transparent to-black/20" />

      {/* Top Left: Badge / Date */}
      {badgeText && (
        <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
          {badgeText}
        </span>
      )}

      {/* Top Right: Multi-image count badge (e.g. 1/4) */}
      {list.length > 1 && (
        <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
          <FiImage className="w-3 h-3 text-red-400" />
          <span>{currentIdx + 1}/{list.length}</span>
        </span>
      )}

      {/* Prev / Next controls on hover (visible if >1 image) */}
      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Bottom Dots Indicator */}
      {list.length > 1 && (
        <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5">
          {list.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIdx(idx);
              }}
              aria-label={`Jump to image ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIdx === idx ? 'w-5 bg-red-500' : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
