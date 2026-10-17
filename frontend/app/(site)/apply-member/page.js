'use client';

import React, { Suspense } from 'react';
import ApplyMembershipPage from '@/app/(profile)/profile/apply-member/page';

export default function SiteApplyMemberPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<div className="p-10 text-center text-xs font-bold text-slate-500">Loading Membership Application Form...</div>}>
          <ApplyMembershipPage />
        </Suspense>
      </div>
    </div>
  );
}
