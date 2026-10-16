'use client';

import React from 'react';
import AnimatedImpactNumber from './AnimatedImpactNumber';

export default function ImpactStats() {
  return (
    <section className="bg-red-600 text-white py-8 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-red-500/60 last:border-none p-2">
            <div className="text-3xl sm:text-5xl font-black tracking-tight">
              <AnimatedImpactNumber value={25000} suffix="+" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-red-100 mt-1">
              Underprivileged Lives Impacted
            </div>
          </div>

          <div className="border-r border-red-500/60 last:border-none p-2">
            <div className="text-3xl sm:text-5xl font-black tracking-tight">
              <AnimatedImpactNumber value={3500} suffix="+" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-red-100 mt-1">
              Volunteers &amp; Certified Members
            </div>
          </div>

          <div className="border-r border-red-500/60 last:border-none p-2">
            <div className="text-3xl sm:text-5xl font-black tracking-tight">
              <AnimatedImpactNumber value={1800} suffix="+" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-red-100 mt-1">
              Emergency Blood Units Arranged
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl sm:text-5xl font-black tracking-tight">
              <AnimatedImpactNumber value={100} suffix="%" duration={1600} />
            </div>
            <div className="text-xs sm:text-sm font-bold text-red-100 mt-1">
              Audited &amp; 80G Tax-Deductible
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
