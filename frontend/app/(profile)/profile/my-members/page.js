'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiRefreshCw,
  FiShield,
  FiExternalLink,
  FiDollarSign,
  FiX,
  FiFileText
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNGO } from '@/context/NGOContext';
import { authFetch, getContentImageUrl } from '@/lib/authApi';

export default function MyRecruitedMembersPage() {
  const { currentUser } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchMembers = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await authFetch('/coordinator/my-members');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMembers(data.data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error('Error fetching coordinator members:', err);
      setError('Unable to load your member applications. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    authFetch('/coordinator/my-members')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && Array.isArray(data.data)) {
          setMembers(data.data);
        } else {
          setMembers([]);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching coordinator members:', err);
        setError('Unable to load your member applications. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Compute stat counters
  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter((m) => m.status === 'pending').length;
    const approved = members.filter((m) => m.status === 'approved').length;
    const rejected = members.filter((m) => m.status === 'rejected').length;
    const totalFees = members
      .filter((m) => m.status === 'approved')
      .reduce((sum, m) => sum + (Number(m.feeAmount || m.amount) || 0), 0);

    return { total, pending, approved, rejected, totalFees };
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    let result = [...members];

    if (activeTab === 'pending') {
      result = result.filter((m) => m.status === 'pending');
    } else if (activeTab === 'approved') {
      result = result.filter((m) => m.status === 'approved');
    } else if (activeTab === 'rejected') {
      result = result.filter((m) => m.status === 'rejected');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          (m.fullName || m.name || '').toLowerCase().includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          (m.phone || '').includes(q) ||
          (m.transactionId || '').toLowerCase().includes(q) ||
          (m.assignedMemberId || '').toLowerCase().includes(q) ||
          (m.district || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [members, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2 border border-purple-200">
            <FiShield className="w-3.5 h-3.5 text-purple-700" />
            <span>Coordinator Enrolment Registry</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Members Enrolled by You
          </h1>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Track all members added through your coordinator portal. Final trustee approval &amp; ID card issuance is executed by the Central Admin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchMembers(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            title="Refresh List"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/profile/add-member"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add New Member</span>
          </Link>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Enrolled</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-black">{stats.total}</div>
          <span className="text-[11px] text-slate-500 font-medium">All submitted registrations</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Awaiting Admin</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FiClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{stats.pending}</div>
          <span className="text-[11px] text-amber-700 font-medium">In Trustee Admin review</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Approved &amp; Active</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.approved}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Official IDs Generated</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Fees Collected</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">₹{stats.totalFees.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-500 font-medium">Approved contributions</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-xs'
                : 'text-slate-600 hover:text-black'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, UTR, ID..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table or Card Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-600 font-bold">Loading your recruited members...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center space-y-3">
          <FiXCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-xs font-bold">{error}</p>
          <button
            onClick={() => fetchMembers()}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-2xl mx-auto">
            <FiUsers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-black">No Enrolled Members Found</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-medium">
              {searchQuery
                ? `No members match your search "${searchQuery}". Try clearing the search.`
                : activeTab !== 'all'
                ? `No members currently in "${activeTab}" status.`
                : "You haven't added any members yet. You can enroll new members directly from your portal."}
            </p>
          </div>
          <Link
            href="/profile/add-member"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Enroll First Member</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Member Name &amp; Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Plan &amp; Contribution</th>
                  <th className="py-3.5 px-4">Payment UTR</th>
                  <th className="py-3.5 px-4">Enrolment Date</th>
                  <th className="py-3.5 px-4">Status &amp; Member ID</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const applicantName = member.fullName || member.name || 'Member Applicant';
                  const isApproved = member.status === 'approved';
                  const isPending = member.status === 'pending';
                  const isRejected = member.status === 'rejected';

                  return (
                    <tr key={member._id} className="hover:bg-purple-50/30 transition">
                      {/* Name & Contact */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs shrink-0 overflow-hidden border border-purple-200">
                            {member.photoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={getContentImageUrl(member.photoUrl)}
                                alt={applicantName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              applicantName.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs">{applicantName}</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5 font-medium">
                              <span className="flex items-center gap-1">
                                <FiPhone className="w-3 h-3 text-slate-400" />
                                {member.phone}
                              </span>
                              {member.email && (
                                <span className="flex items-center gap-1 truncate max-w-[140px]">
                                  <FiMail className="w-3 h-3 text-slate-400" />
                                  {member.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-700">
                        <div className="flex items-center gap-1 font-medium">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.district || 'Aligarh'}, {member.state || 'UP'}</span>
                        </div>
                        {member.bloodGroup && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 mt-1">
                            Blood: {member.bloodGroup}
                          </span>
                        )}
                      </td>

                      {/* Plan & Fee */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-black capitalize">
                          {member.plan?.title || member.planName || member.membershipPlan || 'Standard Membership'}
                        </div>
                        <div className="text-[11px] font-extrabold text-purple-700">
                          ₹{Number(member.feeAmount || member.amount || 0).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Payment UTR */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-[11px] font-bold text-slate-800">
                          {member.transactionId || 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          Mode: {member.paymentMode || 'UPI'}
                        </div>
                        {member.paymentScreenshotUrl && (
                          <a
                            href={getContentImageUrl(member.paymentScreenshotUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-800 mt-0.5"
                          >
                            <span>Receipt</span>
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>

                      {/* Enrolment Date */}
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {member.createdAt
                              ? new Date(member.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Recently'}
                          </span>
                        </div>
                      </td>

                      {/* Status & Assigned Member ID */}
                      <td className="py-4 px-4">
                        {isPending && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                              <FiClock className="w-3 h-3 text-amber-600" />
                              <span>Pending Admin Review</span>
                            </span>
                            <span className="block text-[10px] text-slate-500 mt-1 font-medium">
                              Awaiting Trustee Approval
                            </span>
                          </div>
                        )}
                        {isApproved && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Approved &amp; Active</span>
                            </span>
                            {member.assignedMemberId && (
                              <div className="font-mono font-black text-purple-700 text-[11px] mt-1">
                                {member.assignedMemberId}
                              </div>
                            )}
                          </div>
                        )}
                        {isRejected && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                              <FiXCircle className="w-3 h-3 text-rose-600" />
                              <span>Rejected</span>
                            </span>
                            {member.adminRemarks && (
                              <div className="text-[10px] text-rose-700 mt-0.5 line-clamp-1" title={member.adminRemarks}>
                                {member.adminRemarks}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedApplicant(member)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 text-xs font-bold transition cursor-pointer"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FiFileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Member Application Profile</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Added under your Coordinator charter</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Applicant Basic Info */}
            <div className="flex items-center gap-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-white border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-black text-purple-700 text-base">
                {selectedApplicant.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getContentImageUrl(selectedApplicant.photoUrl)}
                    alt={selectedApplicant.fullName || selectedApplicant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (selectedApplicant.fullName || selectedApplicant.name || 'M').slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-base font-black text-black">
                  {selectedApplicant.fullName || selectedApplicant.name}
                </h4>
                <p className="text-xs font-bold text-purple-700">
                  {selectedApplicant.designation || 'Active Social Worker'}
                </p>
                <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  Status:{' '}
                  <span
                    className={`font-black ${
                      selectedApplicant.status === 'approved'
                        ? 'text-emerald-600'
                        : selectedApplicant.status === 'rejected'
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {selectedApplicant.status?.toUpperCase()}
                  </span>
                  {selectedApplicant.assignedMemberId && (
                    <span className="font-mono text-purple-700 ml-2 font-bold">
                      ({selectedApplicant.assignedMemberId})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Properties Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Mobile Phone</span>
                <strong className="text-black font-semibold">{selectedApplicant.phone}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Email Address</span>
                <strong className="text-black font-semibold truncate block">{selectedApplicant.email || 'N/A'}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">District / State</span>
                <strong className="text-black font-semibold">{selectedApplicant.district || 'Aligarh'}, {selectedApplicant.state || 'UP'}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Blood Group</span>
                <strong className="text-red-600 font-bold">{selectedApplicant.bloodGroup || 'O+'}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Plan</span>
                <strong className="text-black font-semibold">{selectedApplicant.plan?.title || selectedApplicant.planName || 'Official Trust Member'}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Contribution Fee</span>
                <strong className="text-purple-700 font-black">₹{Number(selectedApplicant.feeAmount || selectedApplicant.amount || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Payment Mode</span>
                <strong className="text-black font-semibold uppercase">{selectedApplicant.paymentMode || 'UPI'}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Transaction UTR</span>
                <strong className="font-mono text-black font-semibold">{selectedApplicant.transactionId || 'N/A'}</strong>
              </div>
            </div>

            {/* Address */}
            {selectedApplicant.address && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                <span className="text-[10px] text-slate-500 uppercase block font-bold mb-0.5">Address</span>
                {selectedApplicant.address}
              </div>
            )}

            {/* Payment Proof / Screenshot */}
            {selectedApplicant.paymentScreenshotUrl && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-black block">Submitted Payment Receipt:</span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-48 bg-slate-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getContentImageUrl(selectedApplicant.paymentScreenshotUrl)}
                    alt="Payment Receipt"
                    className="max-h-48 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Admin Remarks if any */}
            {selectedApplicant.adminRemarks && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 font-medium">
                <strong className="block font-bold mb-0.5">Trustee Admin Remarks:</strong>
                {selectedApplicant.adminRemarks}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
