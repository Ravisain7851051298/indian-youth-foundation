'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedImpactNumber
 * Smoothly animates a numeric count up from 0 to the target value when scrolled into view.
 * Renders as a clean inline element without any weird buttons or scorecard frames.
 *
 * @param {number} value - The numeric target value (e.g. 25000)
 * @param {string} suffix - E.g. "+", "%"
 * @param {string} prefix - E.g. "₹"
 * @param {number} duration - Animation duration in ms (default: 2000)
 * @param {string} className - Optional extra CSS class
 */
export default function AnimatedImpactNumber({
  value = 0,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}) {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  // Trigger animation when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smoothly increment with cubic ease-out
  useEffect(() => {
    if (!started) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }

    let frameId;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(value * easeOut);
      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [started, value, duration]);

  const formattedValue = count.toLocaleString('en-IN');

  return (
    <span ref={containerRef} className={`tabular-nums ${className}`}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
