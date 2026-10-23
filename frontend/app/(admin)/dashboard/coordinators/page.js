'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiAward,
  FiUserPlus,
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiSend,
  FiMapPin,
  FiShield,
  FiX,
  FiFileText,
  FiCreditCard,
  FiDollarSign,
  FiUserCheck
} from 'react-icons/fi';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

export default function CoordinatorsManagementPage() {
  const [coordinators, setCoordinators] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [inspectMembersModal, setInspectMembersModal] = useState(null); // coordinator data
  const [membersList, setMembersList] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // Form states for creating new coordinator
  const [newCoordData, setNewCoordData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '1995-01-01',
    address: '',
    district: 'Aligarh',
    state: 'Uttar Pradesh',
    designation: 'District Youth Coordinator',
    photoUrl: '',
    password: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Form states for promoting existing user
  const [promoteUserId, setPromoteUserId] = useState('');
  const [promoteDesignation, setPromoteDesignation] = useState('District Youth Coordinator');
  const [isPromoting, setIsPromoting] = useState(false);

  // Action states
  const [resendingId, setResendingId] = useState(null);
  const [approvingMemberId, setApprovingMemberId] = useState(null);

  const loadCoordinators = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coordinators');
      setCoordinators(res.data?.coordinators || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load coordinators, plese refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadUsersForPromotion = async () => {
    try {
      const res = await api.get('/users');
      const list = res.data?.users || res.data?.data || [];
      // Exclude existing coordinators and admins
      const eligible = list.filter(u => u.role !== 'Coordinator' && u.role !== 'Admin' && !u.isCoordinator);
      setAllUsers(eligible);
      if (eligible.length > 0 && !promoteUserId) {
        setPromoteUserId(eligible[0]._id || eligible[0].id);
      }
    } catch (err) {
      console.warn('Failed to load eligible users for promotion:', err.message);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/coordinators').catch(() => ({ data: { data: [] } })),
      api.get('/users').catch(() => ({ data: { users: [] } }))
    ])
      .then(([coordRes, usersRes]) => {
        if (!active) return;
        const coordData = coordRes.data?.data || coordRes.data?.coordinators || [];
        setCoordinators(coordData);

        const list = usersRes.data?.users || usersRes.data?.data || [];
        const eligible = list.filter((u) => u.role !== 'Coordinator' && u.role !== 'Admin' && !u.isCoordinator);
        setAllUsers(eligible);
        if (eligible.length > 0) {
          setPromoteUserId(eligible[0]._id || eligible[0].id);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter coordinators by search query
  const filteredCoordinators = coordinators.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const coordId = (c.coordinatorId || c.memberId || '').toLowerCase();
    const district = (c.district || '').toLowerCase();
    return name.includes(q) || email.includes(q) || phone.includes(q) || coordId.includes(q) || district.includes(q);
  });

  // Calculate overall metrics
  const totalCoordinators = coordinators.length;
  const totalRecruits = coordinators.reduce((sum, c) => sum + (c.stats?.totalRecruits || 0), 0);
  const totalPending = coordinators.reduce((sum, c) => sum + (c.stats?.pendingRecruits || 0), 0);
  const totalApproved = coordinators.reduce((sum, c) => sum + (c.stats?.approvedRecruits || 0), 0);
  const totalFeesBrought = coordinators.reduce((sum, c) => sum + (c.stats?.totalFeesBrought || 0), 0);

  // Handle Create Coordinator
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newCoordData.name.trim() || !newCoordData.email.trim() || !newCoordData.phone.trim()) {
      toast.error('Name, Email, and Phone are mandatory fields.');
      return;
    }
    try {
      setIsCreating(true);
      const res = await api.post('/coordinators/create', newCoordData);
      toast.success(res.data?.message || 'Coordinator successfully appointed! Letter & ID card emailed.', { duration: 6000 });
      setShowCreateModal(false);
      setNewCoordData({
        name: '',
        email: '',
        phone: '',
        bloodGroup: 'O+',
        dob: '1995-01-01',
        address: '',
        district: 'Aligarh',
        state: 'Uttar Pradesh',
        designation: 'District Youth Coordinator',
        photoUrl: '',
        password: ''
      });
      loadCoordinators();
      loadUsersForPromotion();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coordinator');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Promote Existing User
  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    const targetUserId = promoteUserId || (allUsers.length > 0 ? (allUsers[0]._id || allUsers[0].id) : null);
    if (!targetUserId) {
      toast.error('Please select an existing registered user to promote.');
      return;
    }
    try {
      setIsPromoting(true);
      let res;
      try {
        res = await api.post(`/coordinators/promote/${targetUserId}`, {
          userId: targetUserId,
          designation: promoteDesignation
        });
      } catch (err1) {
        if (err1.response?.status === 404) {
          try {
            res = await api.post(`/users/${targetUserId}/make-coordinator`, {
              userId: targetUserId,
              designation: promoteDesignation
            });
          } catch (err2) {
            res = await api.post('/coordinators/promote', {
              userId: targetUserId,
              designation: promoteDesignation
            });
          }
        } else {
          throw err1;
        }
      }
      toast.success(res.data?.message || 'User promoted to Coordinator! Letter & ID card emailed.', { duration: 6000 });
      setShowPromoteModal(false);
      loadCoordinators();
      loadUsersForPromotion();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to promote user to coordinator');
    } finally {
      setIsPromoting(false);
    }
  };

  // Open Recruited Members Modal
  const openInspectMembers = async (coord) => {
    setInspectMembersModal(coord);
    setMembersLoading(true);
    try {
      const res = await api.get(`/coordinators/${coord._id || coord.id}/members`);
      setMembersList(res.data?.applications || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch recruited members');
      setMembersList([]);
    } finally {
      setMembersLoading(false);
    }
  };

  // Approve a pending member inside modal
  const handleApproveMemberInModal = async (appId) => {
    try {
      setApprovingMemberId(appId);
      let res;
      try {
        res = await api.put(`/applications/members/${appId}/approve`);
      } catch (e) {
        res = await api.put(`/members/${appId}/approve`);
      }
      toast.success(res.data?.message || 'Member approved! Official ID Card & Appointment Letter generated & emailed.', { duration: 5000 });
      // Update local state
      setMembersList(prev => prev.map(m => (m._id === appId || m.id === appId) ? { ...m, status: 'approved' } : m));
      loadCoordinators();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve member');
    } finally {
      setApprovingMemberId(null);
    }
  };

  // Resend credentials
  const handleResendCredentials = async (coord) => {
    try {
      setResendingId(coord._id || coord.id);
      const res = await api.post(`/coordinators/${coord._id || coord.id}/resend-credentials`);
      toast.success(res.data?.message || `Appointment letter & login details re-sent to ${coord.email}!`, { duration: 5000 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend credentials');
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2 border border-purple-200">
            <FiAward className="w-3.5 h-3.5 text-purple-700" />
            <span>National Coordination Wing</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Coordinators Leadership Hub
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
            Manage appointed regional coordinators, review members recruited by each coordinator, and execute statutory final approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              loadUsersForPromotion();
              setShowPromoteModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FiUserCheck className="w-4 h-4 text-purple-700" />
            <span>Promote Existing User</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Add New Coordinator</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
            <FiAward className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Coordinators</span>
            <span className="text-xl font-black text-black">{totalCoordinators}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Recruits</span>
            <span className="text-xl font-black text-blue-700">{totalRecruits}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg font-bold">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pending Admin Approval</span>
            <span className="text-xl font-black text-amber-700">{totalPending}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold">
            <FiDollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified Fees Brought</span>
            <span className="text-xl font-black text-emerald-700">₹{totalFeesBrought.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search coordinators by name, phone, email, district, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-purple-500 text-black placeholder:text-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCoordinators}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Coordinators Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-600 tracking-wider">
                <th className="py-3 px-4">Coordinator Profile</th>
                <th className="py-3 px-4">Designation & Region</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4 text-center">Recruits Summary</th>
                <th className="py-3 px-4 text-center">Fees Collected</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-black">
              {filteredCoordinators.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <FiAward className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm text-slate-700">No Coordinators Found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {searchQuery ? 'Try adjusting your search query.' : 'Click "Add New Coordinator" or "Promote Existing User" to assign leadership.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCoordinators.map((c) => {
                  const id = c._id || c.id;
                  const photo = c.photoUrl;
                  const coordId = c.coordinatorId || c.memberId || 'COORD-PENDING';
                  const recruits = c.stats?.totalRecruits || 0;
                  const pending = c.stats?.pendingRecruits || 0;
                  const approved = c.stats?.approvedRecruits || 0;
                  const fees = c.stats?.totalFeesBrought || 0;

                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition group">
                      {/* Coordinator Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-purple-700">
                            {photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={getContentImageUrl(photo)} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{(c.name || 'C').charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-black flex items-center gap-1.5">
                              <span>{c.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                                Coordinator
                              </span>
                            </div>
                            <div className="font-mono text-[10px] font-bold text-purple-700 mt-0.5">
                              ID: {coordId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Region */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{c.designation || 'District Youth Coordinator'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <FiMapPin className="w-3 h-3 text-slate-400" />
                          <span>{c.district || 'Aligarh'}, {c.state || 'UP'}</span>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 flex items-center gap-1.5 font-medium">
                          <FiMail className="w-3 h-3 text-slate-400" />
                          <span>{c.email}</span>
                        </div>
                        <div className="text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                          <FiPhone className="w-3 h-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </div>
                      </td>

                      {/* Recruits Summary */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => openInspectMembers(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-purple-100 text-purple-900 font-extrabold text-xs transition border border-slate-200 hover:border-purple-300 cursor-pointer"
                        >
                          <FiUsers className="w-3.5 h-3.5 text-purple-700" />
                          <span>{recruits} Members</span>
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-bold">
                          {pending > 0 && (
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              {pending} pending
                            </span>
                          )}
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {approved} active
                          </span>
                        </div>
                      </td>

                      {/* Fees Collected */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ₹{fees.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openInspectMembers(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 font-bold text-xs transition cursor-pointer"
                            title="Inspect all members added by this coordinator"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>Recruits</span>
                          </button>

                          <button
                            type="button"
                            disabled={resendingId === id}
                            onClick={() => handleResendCredentials(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                            title="Resend Appointment Letter, ID Card & Password Email"
                          >
                            <FiSend className={`w-3.5 h-3.5 ${resendingId === id ? 'animate-spin' : ''}`} />
                            <span>{resendingId === id ? 'Sending...' : 'Resend Email'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- MODAL 1: ADD NEW COORDINATOR ----------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FiUserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Create & Appoint New Coordinator</h3>
                  <p className="text-[11px] text-slate-500">Official letter, ID card & credentials will be automatically generated and emailed.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-black mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newCoordData.name}
                    onChange={(e) => setNewCoordData({ ...newCoordData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="coordinator@example.com"
                    value={newCoordData.email}
                    onChange={(e) => setNewCoordData({ ...newCoordData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">Mobile Phone (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={newCoordData.phone}
                    onChange={(e) => setNewCoordData({ ...newCoordData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">Coordinator Designation</label>
                  <input
                    type="text"
                    placeholder="District Youth Coordinator"
                    value={newCoordData.designation}
                    onChange={(e) => setNewCoordData({ ...newCoordData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">District / City</label>
                  <input
                    type="text"
                    placeholder="Aligarh"
                    value={newCoordData.district}
                    onChange={(e) => setNewCoordData({ ...newCoordData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Uttar Pradesh"
                    value={newCoordData.state}
                    onChange={(e) => setNewCoordData({ ...newCoordData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">Blood Group</label>
                  <select
                    value={newCoordData.bloodGroup}
                    onChange={(e) => setNewCoordData({ ...newCoordData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-black mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newCoordData.dob}
                    onChange={(e) => setNewCoordData({ ...newCoordData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-black mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street / Sector / Pin Code"
                  value={newCoordData.address}
                  onChange={(e) => setNewCoordData({ ...newCoordData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-black mb-1">
                  Custom Password (Optional - leave blank to auto-generate)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for auto-generated secure password e.g. BYK@729183"
                  value={newCoordData.password}
                  onChange={(e) => setNewCoordData({ ...newCoordData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md shadow-purple-700/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>{isCreating ? 'Minting Credentials & Sending...' : 'Confirm Appointment & Send Letter'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: PROMOTE EXISTING USER ----------------- */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Promote Existing User to Coordinator</h3>
                  <p className="text-[11px] text-slate-500">Grants coordinator rights & generates appointment credentials.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-black mb-1">Select Registered User *</label>
                {allUsers.length === 0 ? (
                  <p className="text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                    No eligible registered users found to promote. All active users are already coordinators or administrators.
                  </p>
                ) : (
                  <select
                    value={promoteUserId}
                    onChange={(e) => setPromoteUserId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
                  >
                    {allUsers.map(u => (
                      <option key={u._id || u.id} value={u._id || u.id}>
                        {u.name} ({u.email}) - Current Role: {u.role}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-bold text-black mb-1">Coordinator Designation</label>
                <input
                  type="text"
                  placeholder="Regional Youth Coordinator"
                  value={promoteDesignation}
                  onChange={(e) => setPromoteDesignation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPromoting || allUsers.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md shadow-purple-700/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>{isPromoting ? 'Promoting & Emailing...' : 'Confirm Promotion'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 3: VIEW MEMBERS ADDED BY COORDINATOR ----------------- */}
      {inspectMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FiUsers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">
                    Members Recruited by {inspectMembersModal.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Coordinator ID: <strong className="font-mono text-purple-700">{inspectMembersModal.coordinatorId || inspectMembersModal.memberId}</strong> • Total Enrolled: {membersList.length}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectMembersModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              {membersLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <FiRefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="text-xs font-bold">Loading recruited members...</span>
                </div>
              ) : membersList.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="font-bold text-sm text-slate-700">No Members Added Yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">This coordinator has not enrolled any members so far.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {membersList.map((m) => {
                    const appId = m._id || m.id;
                    const isPending = m.status === 'pending';
                    const isApproved = m.status === 'approved';

                    return (
                      <div
                        key={appId}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-black">{m.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${isApproved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : m.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                              {m.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold">
                              {m.planName || 'Executive Member'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 font-medium">
                            <span>📧 {m.email || 'N/A'}</span>
                            <span>📱 {m.phone || 'N/A'}</span>
                            <span>Fee: ₹{m.feeAmount || m.amount || 250}</span>
                            <span>UTR: {m.transactionId || m.utrNumber || 'N/A'}</span>
                          </div>

                          {m.assignedMemberId && (
                            <div className="font-mono text-[10px] font-bold text-emerald-800 pt-0.5">
                              Official Member ID: {m.assignedMemberId}
                            </div>
                          )}
                        </div>

                        {/* Action: Admin Final Approve Button */}
                        <div className="shrink-0">
                          {isPending ? (
                            <button
                              type="button"
                              disabled={approvingMemberId === appId}
                              onClick={() => handleApproveMemberInModal(appId)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <FiCheckCircle className="w-3.5 h-3.5" />
                              <span>{approvingMemberId === appId ? 'Approving...' : 'Admin Final Approve'}</span>
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <FiCheckCircle className="w-4 h-4" />
                              <span>Approved</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 flex items-center justify-end border-t border-slate-200">
              <button
                type="button"
                onClick={() => setInspectMembersModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
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
