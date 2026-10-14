'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileBirthdayPosterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile');
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-slate-500">
      Redirecting to Profile Dashboard...
    </div>
  );
}
