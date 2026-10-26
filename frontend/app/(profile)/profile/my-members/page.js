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
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiUploadCloud,
  FiImage,
  FiCheck,
  FiAlertCircle,
  FiZoomIn
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { api, getContentImageUrl } from '@/lib/authApi';

export default function MyRecruitedMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [previewImageModal, setPreviewImageModal] = useState(null); // { url, title }

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [activeEditTab, setActiveEditTab] = useState('profile'); // 'profile', 'payment'
  const [uploadingField, setUploadingField] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photoUrl: '',
    paymentScreenshot: '',
    bloodGroup: 'O+',
    dob: '2000-01-01',
    address: '',
    district: 'Aligarh',
    state: 'Uttar Pradesh',
    designation: 'Member',
    transactionId: '',
    paymentMethod: 'UPI',
    notes: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Member Confirmation State
  const [deletingMember, setDeletingMember] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openEditModal = (member) => {
    setEditingMember(member);
    setActiveEditTab('profile');
    setEditFormData({
      name: member.name || member.fullName || '',
      email: member.email || '',
      phone: member.phone || '',
      photoUrl: member.photoUrl || '',
      paymentScreenshot: member.paymentScreenshot || member.paymentScreenshotUrl || member.screenshotUrl || '',
      bloodGroup: member.bloodGroup || 'O+',
      dob: member.dob ? member.dob.substring(0, 10) : '2000-01-01',
      address: member.address || '',
      district: member.district || 'Aligarh',
      state: member.state || 'Uttar Pradesh',
      designation: member.designation || 'Member',
      transactionId: member.transactionId || member.utrNumber || '',
      paymentMethod: member.paymentMethod || member.paymentMode || 'UPI',
      notes: member.notes || ''
    });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    let category = 'documents';
    if (fieldName === 'photoUrl') {
      category = 'profiles';
    } else if (fieldName === 'paymentScreenshot') {
      category = 'payments';
    }

    const uploadFormData = new FormData();
    uploadFormData.append('category', category);
    uploadFormData.append('file', file);

    try {
      setUploadingField(fieldName);
      let res;
      try {
        res = await api.post(`/upload?category=${category}`, uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-category': category,
            'x-upload-category': category
          }
        });
      } catch (err1) {
        res = await api.post(`/uploads?category=${category}`, uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-category': category,
            'x-upload-category': category
          }
        });
      }
      const fileUrl = res.data?.url || res.data?.fileUrl || res.data?.filePath || '';
      if (!fileUrl) throw new Error('No URL returned from upload server');

      setEditFormData((prev) => ({ ...prev, [fieldName]: fileUrl }));
      toast.success(
        `${fieldName === 'photoUrl' ? 'Profile photo' : 'Payment screenshot'} uploaded!`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'File upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editFormData.name.trim()) {
      toast.error('Member full name is mandatory.');
      return;
    }
    try {
      setIsUpdating(true);
      const res = await api.put(`/coordinator/members/${editingMember._id}`, editFormData);
      toast.success(res.data?.message || 'Member application updated successfully!');
      const updated = res.data?.application || res.data?.data;
      if (updated) {
        setMembers((prev) => prev.map((m) => (m._id === editingMember._id ? { ...m, ...updated } : m)));
        if (selectedApplicant && selectedApplicant._id === editingMember._id) {
          setSelectedApplicant((prev) => ({ ...prev, ...updated }));
        }
      } else {
        fetchMembers();
      }
      setEditingMember(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update member');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/coordinator/members/${deletingMember._id}`);
      toast.success(res.data?.message || 'Member application deleted successfully!');
      setMembers((prev) => prev.filter((m) => m._id !== deletingMember._id));
      if (selectedApplicant?._id === deletingMember._id) {
        setSelectedApplicant(null);
      }
      setDeletingMember(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  const extractMembers = (res) => {
    if (!res) return [];
    const payload = res.data !== undefined ? res.data : res;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.members)) return payload.members;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.applications)) return payload.applications;
    return [];
  };

  const fetchMembers = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await api.get('/coordinator/my-members');
      setMembers(extractMembers(res));
    } catch (err) {
      console.error('Error fetching coordinator members:', err);
      setError('Unable to load your member applications. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    api.get('/coordinator/my-members')
      .then((res) => {
        if (!active) return;
        setMembers(extractMembers(res));
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'all'
              ? 'bg-white text-black shadow-xs'
              : 'text-slate-600 hover:text-black'
              }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-amber-700'
              }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-700'
              }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-rose-700'
              }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-60">
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
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Member Profile &amp; Contact</th>
                  <th className="py-3.5 px-4">Location &amp; Blood</th>
                  <th className="py-3.5 px-4">Plan &amp; Contribution</th>
                  <th className="py-3.5 px-4">Payment UTR &amp; Receipt</th>
                  <th className="py-3.5 px-4">Trustee Review Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filteredMembers.map((member) => {
                  const applicantName = member.fullName || member.name || 'Member Applicant';
                  const isApproved = member.status === 'approved';
                  const isPending = member.status === 'pending';
                  const isRejected = member.status === 'rejected';
                  const paymentProof = member.paymentScreenshot || member.paymentScreenshotUrl || member.screenshotUrl;

                  return (
                    <tr key={member._id} className="hover:bg-purple-50/30 transition group">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs shrink-0 overflow-hidden border border-purple-200 shadow-2xs">
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
                            <div className="font-extrabold text-black text-xs flex items-center gap-1.5 flex-wrap">
                              <span>{applicantName}</span>
                              {member.designation && member.designation !== 'Member' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                  {member.designation}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5 font-medium flex-wrap">
                              <span className="flex items-center gap-1">
                                <FiPhone className="w-3 h-3 text-slate-400 shrink-0" />
                                {member.phone}
                              </span>
                              {member.email && (
                                <span className="flex items-center gap-1 truncate max-w-40" title={member.email}>
                                  <FiMail className="w-3 h-3 text-slate-400 shrink-0" />
                                  {member.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location & Blood */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center gap-1 font-semibold text-xs">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.district || 'Aligarh'}, {member.state || 'UP'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {member.bloodGroup && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Blood: {member.bloodGroup}
                            </span>
                          )}
                          {member.gender && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {member.gender}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Plan & Fee */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-xs capitalize truncate max-w-40" title={member.plan?.title || member.planName || 'Standard Membership'}>
                          {member.plan?.title || member.planName || member.membershipPlan || 'Standard Membership'}
                        </div>
                        <div className="text-xs font-black text-purple-700 mt-0.5">
                          ₹{Number(member.feeAmount || member.amount || 0).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Payment UTR & Receipt */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs font-bold text-slate-800 select-all">
                          {member.transactionId || member.utrNumber || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 font-medium capitalize">
                            {member.paymentMode || member.paymentMethod || 'UPI'}
                          </span>
                          {paymentProof ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImageModal({ url: paymentProof, title: `${applicantName} - Payment Receipt` })}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200 transition cursor-pointer"
                              title="Click to view full payment screenshot"
                            >
                              <FiImage className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-rose-500 font-semibold italic">No Receipt</span>
                          )}
                        </div>
                      </td>

                      {/* Status & Assigned Member ID */}
                      <td className="py-3.5 px-4">
                        {isPending && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                              <FiClock className="w-3 h-3 text-amber-600" />
                              <span>Pending Admin Review</span>
                            </span>
                            <span className="block text-[10px] text-slate-500 mt-1 font-medium">
                              Under Trustee Verification
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
                              <div className="font-mono font-black text-purple-700 text-xs mt-1">
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
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setSelectedApplicant(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition cursor-pointer border border-purple-200 shadow-2xs"
                            title="Inspect complete member profile and documents"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer border border-blue-200 shadow-2xs"
                            title="Edit member profile, documents, and payment receipt"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingMember(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer border border-rose-200 shadow-2xs"
                            title="Delete member application"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 1: DETAIL INSPECTION MODAL ----------------- */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FiFileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Member Application Profile</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Added under your Coordinator charter</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Applicant Basic Info Header */}
            <div className="flex items-center gap-3.5 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
              <div className="w-16 h-16 rounded-2xl bg-white border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-black text-purple-700 text-lg shadow-sm">
                {selectedApplicant.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getContentImageUrl(selectedApplicant.photoUrl)}
                    alt={selectedApplicant.fullName || selectedApplicant.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setPreviewImageModal({ url: selectedApplicant.photoUrl, title: `${selectedApplicant.name || selectedApplicant.fullName} - Photo` })}
                  />
                ) : (
                  (selectedApplicant.fullName || selectedApplicant.name || 'M').slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-black truncate">
                  {selectedApplicant.fullName || selectedApplicant.name}
                </h4>
                <p className="text-xs font-bold text-purple-700">
                  {selectedApplicant.designation || 'Active Social Worker'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1 font-medium flex-wrap">
                  <span
                    className={`font-black px-2 py-0.5 rounded-full text-[10px] border ${
                      selectedApplicant.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : selectedApplicant.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {selectedApplicant.status?.toUpperCase()}
                  </span>
                  {selectedApplicant.assignedMemberId && (
                    <span className="font-mono text-purple-700 font-bold bg-white px-2 py-0.5 rounded border border-purple-200">
                      ID: {selectedApplicant.assignedMemberId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 1: Detailed Properties Grid */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Personal &amp; Contact Details
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-700">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Mobile Phone</span>
                  <strong className="text-black font-semibold truncate block">{selectedApplicant.phone}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Email Address</span>
                  <strong className="text-black font-semibold truncate block">{selectedApplicant.email || 'N/A'}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">District / State</span>
                  <strong className="text-black font-semibold truncate block">{selectedApplicant.district || 'Aligarh'}, {selectedApplicant.state || 'UP'}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Blood Group</span>
                  <strong className="text-rose-600 font-bold">{selectedApplicant.bloodGroup || 'O+'}</strong>
                </div>
              </div>
            </div>

            {/* Address */}
            {selectedApplicant.address && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                <span className="text-[10px] text-slate-500 uppercase block font-bold mb-0.5">Address</span>
                {selectedApplicant.address}
              </div>
            )}

            {/* Section 2: Payment Verification & Proof */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Payment Verification &amp; Proof
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-700">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Plan</span>
                  <strong className="text-black font-semibold truncate block">{selectedApplicant.plan?.title || selectedApplicant.planName || 'Trust Member'}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Contribution Fee</span>
                  <strong className="text-purple-700 font-black">₹{Number(selectedApplicant.feeAmount || selectedApplicant.amount || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Payment Mode</span>
                  <strong className="text-black font-semibold uppercase">{selectedApplicant.paymentMode || selectedApplicant.paymentMethod || 'UPI'}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Transaction UTR</span>
                  <strong className="font-mono text-black font-semibold truncate block">{selectedApplicant.transactionId || selectedApplicant.utrNumber || 'N/A'}</strong>
                </div>
              </div>

              {/* Payment Receipt Image */}
              {(selectedApplicant.paymentScreenshot || selectedApplicant.paymentScreenshotUrl || selectedApplicant.screenshotUrl) && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-600 block">Payment Screenshot Receipt:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewImageModal({ url: selectedApplicant.paymentScreenshot || selectedApplicant.paymentScreenshotUrl || selectedApplicant.screenshotUrl, title: `${selectedApplicant.name || selectedApplicant.fullName} - Payment Receipt` })}
                      className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                    >
                      <FiZoomIn className="w-3 h-3" />
                      <span>Full View</span>
                    </button>
                  </div>
                  <div
                    onClick={() => setPreviewImageModal({ url: selectedApplicant.paymentScreenshot || selectedApplicant.paymentScreenshotUrl || selectedApplicant.screenshotUrl, title: `${selectedApplicant.name || selectedApplicant.fullName} - Payment Receipt` })}
                    className="border border-slate-200 rounded-xl overflow-hidden max-h-48 bg-white flex items-center justify-center cursor-pointer hover:border-purple-300 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(selectedApplicant.paymentScreenshot || selectedApplicant.paymentScreenshotUrl || selectedApplicant.screenshotUrl)}
                      alt="Payment Receipt"
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Admin Remarks if any */}
            {selectedApplicant.adminRemarks && (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900 font-medium">
                <strong className="block font-bold mb-0.5">Trustee Admin Remarks:</strong>
                {selectedApplicant.adminRemarks}
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedApplicant;
                    setSelectedApplicant(null);
                    openEditModal(target);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile &amp; Documents</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = selectedApplicant;
                    setSelectedApplicant(null);
                    setDeletingMember(target);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: EDIT MEMBER APPLICATION (PROFILE, DOCUMENTS, PAYMENT) ----------------- */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FiEdit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Edit Member Application</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Modify profile details, re-upload documents, and update payment proof
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Navigation for Edit Modal */}
            <div className="mt-4 flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveEditTab('profile')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition whitespace-nowrap cursor-pointer text-center ${
                  activeEditTab === 'profile'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                1. Profile &amp; Contact
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('payment')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition whitespace-nowrap cursor-pointer text-center ${
                  activeEditTab === 'payment'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                2. Payment &amp; Receipt
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="mt-5 space-y-4">
              {/* TAB 1: PROFILE & CONTACT */}
              {activeEditTab === 'profile' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Photo Upload Section */}
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-black text-purple-700 text-lg shadow-sm">
                      {editFormData.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getContentImageUrl(editFormData.photoUrl)}
                          alt={editFormData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{(editFormData.name || 'M').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs font-bold text-black mb-1">
                        Member Profile Photo
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 font-bold text-xs cursor-pointer transition flex items-center gap-1.5 shadow-2xs">
                          <FiUploadCloud className="w-3.5 h-3.5" />
                          <span>{uploadingField === 'photoUrl' ? 'Uploading...' : 'Upload New Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingField === 'photoUrl'}
                            onChange={(e) => handleFileUpload(e, 'photoUrl')}
                            className="hidden"
                          />
                        </label>
                        {editFormData.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditFormData({ ...editFormData, photoUrl: '' })}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">JPG, PNG or WEBP up to 10MB</span>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        Full Legal Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">
                        Mobile Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Designation / Role Title</label>
                      <input
                        type="text"
                        value={editFormData.designation}
                        onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">District</label>
                      <input
                        type="text"
                        value={editFormData.district}
                        onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">State</label>
                      <input
                        type="text"
                        value={editFormData.state}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Blood Group</label>
                      <select
                        value={editFormData.bloodGroup}
                        onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editFormData.dob}
                        onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">Residential Address</label>
                    <textarea
                      rows={2}
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
              )}
              {/* TAB 2: PAYMENT & RECEIPT SCREENSHOT */}
              {activeEditTab === 'payment' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Payment Contribution Mode</label>
                      <select
                        value={editFormData.paymentMethod}
                        onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
                      >
                        {['UPI', 'Bank Transfer (IMPS/NEFT)', 'Cash Contribution', 'Cheque/DD'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1">Payment UTR / Transaction ID</label>
                      <input
                        type="text"
                        value={editFormData.transactionId}
                        onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium"
                      />
                    </div>
                  </div>

                  {/* Payment Screenshot Uploader */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-black block">Payment Screenshot / Receipt</span>
                        <span className="text-[10px] text-slate-500">Provide bank or UPI payment confirmation receipt</span>
                      </div>
                      {editFormData.paymentScreenshot && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          Receipt Attached
                        </span>
                      )}
                    </div>

                    {editFormData.paymentScreenshot ? (
                      <div className="relative group border border-slate-200 rounded-xl overflow-hidden bg-white max-h-44 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getContentImageUrl(editFormData.paymentScreenshot)}
                          alt="Receipt Preview"
                          className="max-h-44 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImageModal({ url: editFormData.paymentScreenshot, title: 'Payment Receipt Preview' })}
                          className="absolute inset-0 bg-black/40 text-white font-bold text-xs flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <FiZoomIn className="w-4 h-4" />
                          <span>Click to Enlarge</span>
                        </button>
                      </div>
                    ) : (
                      <div className="h-32 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                        No payment receipt screenshot uploaded
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs text-center cursor-pointer transition flex items-center justify-center gap-1.5 shadow-2xs">
                        <FiUploadCloud className="w-3.5 h-3.5" />
                        <span>{uploadingField === 'paymentScreenshot' ? 'Uploading Screenshot...' : 'Upload Receipt Screenshot'}</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          disabled={uploadingField === 'paymentScreenshot'}
                          onChange={(e) => handleFileUpload(e, 'paymentScreenshot')}
                          className="hidden"
                        />
                      </label>
                      {editFormData.paymentScreenshot && (
                        <button
                          type="button"
                          onClick={() => setEditFormData({ ...editFormData, paymentScreenshot: '' })}
                          className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">Internal Coordinator Remarks / Notes</label>
                    <input
                      type="text"
                      value={editFormData.notes}
                      onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                      placeholder="Verified contribution directly with member..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {activeEditTab !== 'profile' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeEditTab === 'payment') setActiveEditTab('documents');
                        else if (activeEditTab === 'documents') setActiveEditTab('profile');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      &larr; Previous Step
                    </button>
                  )}
                  {activeEditTab !== 'payment' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeEditTab === 'profile') setActiveEditTab('documents');
                        else if (activeEditTab === 'documents') setActiveEditTab('payment');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition cursor-pointer border border-purple-200"
                    >
                      Next Step &rarr;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <FiSave className="w-3.5 h-3.5" />
                    <span>{isUpdating ? 'Saving Application...' : 'Save All Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: DELETE MEMBER CONFIRMATION ----------------- */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold">
                <FiTrash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">Delete Member Application</h3>
                <p className="text-[11px] text-slate-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              Are you sure you want to permanently delete the enrolled member application for <strong className="text-black font-extrabold">{deletingMember.name || deletingMember.fullName}</strong>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingMember(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteMember}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 4: IMAGE LIGHTBOX / ZOOM MODAL ----------------- */}
      {previewImageModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-black text-sm text-black truncate max-w-md">
                {previewImageModal.title || 'Preview Image'}
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={getContentImageUrl(previewImageModal.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center gap-1 hover:bg-purple-100 transition"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImageModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-2xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getContentImageUrl(previewImageModal.url)}
                alt={previewImageModal.title || 'Preview'}
                className="max-h-[70vh] object-contain rounded-xl shadow"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
