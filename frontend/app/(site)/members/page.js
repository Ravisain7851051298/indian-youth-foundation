'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiUsers,
  FiSearch,
  FiShield,
  FiCheckCircle,
  FiMapPin,
  FiAward,
  FiUserPlus,
  FiArrowRight,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function PublicMembersPage() {
  const { settings, currentUser } = useNGO();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');

  const fetchPublicMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members/public?limit=100');
      if (res.data?.success && Array.isArray(res.data.members)) {
        setMembers(res.data.members);
      }
    } catch (err) {
      console.warn('Public members fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicMembers();
  }, []);

  const uniqueStates = useMemo(() => {
    const states = new Set();
    members.forEach((m) => {
      if (m.state) states.add(m.state);
    });
    return ['All', ...Array.from(states)];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.memberId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.district?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = stateFilter === 'All' || m.state === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [members, searchQuery, stateFilter]);

  const isMember = Boolean(
    currentUser?.role === 'Member' ||
    currentUser?.role === 'Admin' ||
    (currentUser?.isMember && !currentUser?.memberId?.startsWith('BYK-DON-')) ||
    (currentUser?.membershipApplication?.status === 'approved')
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-green-50 text-[#0b8026] text-xs font-bold border border-green-200 shadow-2xs">
            <FiUsers className="w-3.5 h-3.5 text-[#0b8026]" />
            <span>Official Cadre &amp; Verified Community Representatives</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Registered Members
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Dedicated citizens and youth changemakers leading grassroots social welfare, free education, and emergency relief operations across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={isMember ? '/profile/member' : '/apply-member'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0b8026] hover:bg-[#09661f] text-white text-xs font-bold shadow-md transition transform hover:scale-102"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>{isMember ? 'My Member Profile' : 'Apply for Official Membership'}</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-[#0b8026]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <FiFilter className="w-3.5 h-3.5" />
              <span>State:</span>
            </span>
            {uniqueStates.slice(0, 6).map((st) => (
              <button
                key={st}
                onClick={() => setStateFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  stateFilter === st
                    ? 'bg-[#0b8026] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Members Cards Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="w-10 h-10 border-3 border-[#0b8026] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-600">Loading verified membership directory...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <FiUsers className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-slate-900">No Members Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No registered members matched your search criteria. Try a different search term or apply to become a member.
            </p>
            <Link
              href="/apply-member"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0b8026] text-white text-xs font-bold mt-2"
            >
              <span>Join as Member</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMembers.map((m, idx) => (
              <div
                key={m._id || m.memberId || idx}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#0b8026]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-[#0b8026] p-0.5 overflow-hidden shadow-sm bg-white">
                      <img
                        src={getContentImageUrl(m.photoUrl) || '/logo.jpeg'}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/logo.jpeg';
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0b8026] text-white flex items-center justify-center text-xs shadow-xs" title="Verified Member">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-slate-900 leading-snug group-hover:text-[#0b8026] transition-colors">
                      {m.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-[#0b8026] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full inline-block mt-1">
                      {m.memberId || 'VERIFIED MEMBER'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-semibold line-clamp-1">
                    {m.designation || 'Active Social Worker'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiMapPin className="w-3.5 h-3.5 text-[#0b8026]" />
                    <span>{m.district ? `${m.district}, ${m.state}` : m.state || 'India'}</span>
                  </span>
                  {m.bloodGroup && (
                    <span className="font-mono font-bold text-[#d50000] bg-red-50 px-1.5 py-0.2 rounded text-[10px]">
                      {m.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
