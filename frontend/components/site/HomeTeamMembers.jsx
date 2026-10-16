'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUsers, FiArrowRight } from 'react-icons/fi';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

const DEFAULT_LEADERS = [
  {
    _id: 'ldr_1',
    name: 'Ravi Saini',
    position: 'National President & Founder Trustee',
    department: 'Leadership & Board',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  },
  {
    _id: 'ldr_2',
    name: 'Sunita Sharma',
    position: 'Director of Women Livelihood',
    department: 'Youth Empowerment & Training',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
  },
  {
    _id: 'ldr_3',
    name: 'Dr. Amit Verma',
    position: 'Chief Coordinator - Blood Network',
    department: 'Healthcare & Emergency Relief',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
  },
  {
    _id: 'ldr_4',
    name: 'Vikram Rajput',
    position: 'Head of Child Literacy',
    department: 'Child Education Drives',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'
  }
];

export default function HomeTeamMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadMembers() {
      try {
        const res = await api.get('/team-members');
        const list = res.data?.data || res.data?.items || [];
        if (mounted && Array.isArray(list) && list.length > 0) {
          setMembers(list.slice(0, 8));
        } else if (mounted) {
          setMembers(DEFAULT_LEADERS);
        }
      } catch (e) {
        if (mounted) setMembers(DEFAULT_LEADERS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMembers();
    return () => {
      mounted = false;
    };
  }, []);

  const displayList = members.length > 0 ? members : DEFAULT_LEADERS;

  return (
    <section className="py-20 bg-slate-50/80 border-b border-slate-200" aria-label="Team Members Section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiUsers className="w-3.5 h-3.5 text-red-600" />
              <span>Leadership &amp; Team</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Our Dedicated Team Members
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl font-medium">
              Driven by passionate changemakers and youth leaders steering grassroots empowerment across India.
            </p>
          </div>

          <Link
            href="/team-members"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-red-50 text-red-600 font-bold text-xs border border-red-200 shadow-sm transition hover:scale-102 self-start md:self-auto shrink-0 cursor-pointer"
          >
            <span>View All Members</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Clean Non-Card Profile Showcase: Only Profile Pic, Name, Position */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-12 sm:gap-x-12 sm:gap-y-14 justify-items-center">
          {displayList.map((m) => {
            const photo = m.image
              ? getContentImageUrl(m.image)
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';

            return (
              <div
                key={m._id || m.id}
                className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-300"
              >
                {/* Circular Profile Picture */}
                <div className="relative mb-3.5">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-lg border-4 border-white ring-4 ring-red-100 group-hover:ring-red-500 transition-all duration-300 group-hover:scale-105 bg-slate-100">
                    <img
                      src={photo}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-black text-black group-hover:text-red-600 transition-colors tracking-tight leading-snug">
                  {m.name}
                </h3>

                {/* Position */}
                <p className="text-xs sm:text-sm font-semibold text-red-600 tracking-normal mt-0.5 leading-snug max-w-[180px] sm:max-w-[210px]">
                  {m.position || m.role || 'Team Member'}
                </p>

                {/* Department */}
                {m.department && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200/80">
                    {m.department}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
