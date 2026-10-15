'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  FiUsers, 
  FiSearch, 
  FiCheckCircle, 
  FiXCircle, 
  FiDownload, 
  FiPrinter, 
  FiShield, 
  FiEye,
  FiSlash,
  FiFileText,
  FiX,
  FiUserPlus
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

function MembersContent() {
  const { members, verifyMember, setMemberStatus, currentUser } = useNGO();
  const searchParams = useSearchParams();
  const viewId = searchParams.get('view');

  const [search, setSearch] = useState(viewId || '');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState(null);

  const isAdmin = currentUser?.role === 'Admin';

  const filteredMembers = members.filter(m => {
    const matchesSearch = !search || (
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.memberId?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.district?.toLowerCase().includes(search.toLowerCase())
    );
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-1 border border-red-200">
              <FiUsers className="w-3.5 h-3.5 text-red-600" />
              <span>Official Registry & Verification</span>
            </div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">
              Members & Volunteers Directory
            </h1>
            <p className="text-xs sm:text-sm text-black/80 mt-1">
              Search by member name, membership ID, or phone to verify credentials, active designation, and ID card status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <a
                href="/api/members/export/excel"
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <FiDownload className="w-3.5 h-3.5" />
                <span>Export to Excel (.xlsx)</span>
              </a>
            )}
            <Link
              href="/volunteer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
            >
              <FiUserPlus className="w-3.5 h-3.5" />
              <span>Apply for Membership</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID (e.g. BYK-MEM-101), phone, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-red-500 text-sm font-medium text-black"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 w-full sm:w-auto">
            {['ALL', 'Admin', 'TeamMember', 'Volunteer', 'Member'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  roleFilter === r ? 'bg-red-600 text-white shadow-xs' : 'text-gray-700 hover:text-black'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Member ID Card Preview Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl relative">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Official Digital ID Preview</span>
                <h3 className="text-lg font-black text-black mt-0.5">{selectedMember.name}</h3>
                <span className="font-mono text-xs text-gray-500 font-bold">{selectedMember.memberId}</span>
              </div>

              {/* Mini Card */}
              <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden text-xs">
                <div className="flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getContentImageUrl(selectedMember.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={selectedMember.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                    }}
                  />
                  <div>
                    <div className="font-extrabold text-sm">{selectedMember.name}</div>
                    <div className="text-red-100 font-semibold text-[11px] mt-0.5">{selectedMember.designation}</div>
                    <div className="text-[10px] opacity-90 mt-1">Blood: {selectedMember.bloodGroup} • {selectedMember.district || 'Aligarh'}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <div className="p-1 bg-white rounded-lg">
                    <QRCodeSVG
                      value={`https://bharatiyayuvakranti.org/verify/member/${selectedMember.memberId}`}
                      size={50}
                    />
                  </div>
                  <div className="text-right text-[10px]">
                    <div className="font-bold text-white">Verified Member</div>
                    <div className="text-red-100">Indian Youth Foundation</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  href="/profile?tab=idcard"
                  className="flex-1 py-2.5 text-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Print Full Digital ID
                </Link>
                <Link
                  href="/profile?tab=letter"
                  className="flex-1 py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-black font-bold text-xs rounded-xl transition"
                >
                  Appointment Letter
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Members Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id || member.memberId}
              className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(member.photoUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                      }}
                    />
                    <div>
                      <h3 className="font-extrabold text-base text-black">{member.name}</h3>
                      <span className="text-xs font-bold text-red-600 block">{member.designation}</span>
                      <span className="text-[11px] font-mono font-bold text-gray-500">{member.memberId}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    member.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : (member.status === 'blocked' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {member.status === 'active' ? 'Active' : member.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] bg-slate-50 p-3 rounded-xl border border-gray-100 text-black">
                  <div>Blood Group: <strong className="text-red-600 font-bold">{member.bloodGroup}</strong></div>
                  <div>Role: <strong className="text-black font-bold">{member.role}</strong></div>
                  <div>District: <strong>{member.district || 'Aligarh'}</strong></div>
                  <div>Membership Fee: <strong className={member.feePaid ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{member.feePaid ? 'Paid' : 'Pending'}</strong></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <FiEye className="w-3.5 h-3.5 text-red-600" />
                  <span>View ID Card</span>
                </button>

                {isAdmin && (
                  <div className="flex items-center gap-1.5">
                    {member.status !== 'active' ? (
                      <button
                        onClick={() => verifyMember(member.memberId || member._id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] transition cursor-pointer"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => setMemberStatus(member.memberId || member._id, 'blocked')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[10px] transition cursor-pointer"
                        title="Block member"
                      >
                        Block
                      </button>
                    )}
                    <button
                      onClick={() => setMemberStatus(member.memberId || member._id, 'deactivated')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-medium transition cursor-pointer"
                      title="Deactivate account"
                    >
                      Deactivate
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading members registry...</div>}>
      <MembersContent />
    </Suspense>
  );
}
