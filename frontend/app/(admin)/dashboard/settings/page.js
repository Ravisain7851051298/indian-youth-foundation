'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings');
  }, [router]);

  return (
    <div className="p-8 text-center text-xs font-semibold text-slate-500">
      Redirecting to NGO Master Settings &amp; CMS...
    </div>
  );
}
