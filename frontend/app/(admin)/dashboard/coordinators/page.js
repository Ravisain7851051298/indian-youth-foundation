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
  FiUserCheck,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiAlertTriangle,
  FiEyeOff,
  FiCopy,
  FiCheck,
  FiUploadCloud
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

  // Edit Coordinator state
  const [editingCoord, setEditingCoord] = useState(null);
  const [editCoordData, setEditCoordData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '1995-01-01',
    address: '',
    district: 'Aligarh',
    state: 'Uttar Pradesh',
    designation: 'District Youth Coordinator',
    status: 'active',
    coordinatorId: '',
    password: ''
  });
  const [isUpdatingCoord, setIsUpdatingCoord] = useState(false);

  // Delete / Revoke Coordinator state
  const [deletingCoord, setDeletingCoord] = useState(null);
  const [deleteAction, setDeleteAction] = useState('revoke'); // 'revoke' or 'delete'
  const [isDeletingCoord, setIsDeletingCoord] = useState(false);

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
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [createdResultModal, setCreatedResultModal] = useState(null);
  const [showResultPassword, setShowResultPassword] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyCredentials = (text) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      toast.success('Credentials copied to clipboard!');
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  // Form states for promoting existing user
  const [promoteUserId, setPromoteUserId] = useState('');
  const [promoteDesignation, setPromoteDesignation] = useState('District Youth Coordinator');
  const [isPromoting, setIsPromoting] = useState(false);

  // Action states
  const [resendingId, setResendingId] = useState(null);
  const [approvingMemberId, setApprovingMemberId] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleUploadPhoto = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('category', 'profiles');
    fd.append('file', file);

    try {
      setUploadingPhoto(true);
      let res;
      try {
        res = await api.post('/upload?category=profiles', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-category': 'profiles',
            'x-upload-category': 'profiles'
          }
        });
      } catch (err1) {
        res = await api.post('/uploads?category=profiles', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-category': 'profiles',
            'x-upload-category': 'profiles'
          }
        });
      }
      const url = res.data?.url || res.data?.fileUrl || '';
      if (!url) throw new Error('No image URL returned');

      if (isEdit) {
        setEditCoordData((prev) => ({ ...prev, photoUrl: url }));
      } else {
        setNewCoordData((prev) => ({ ...prev, photoUrl: url }));
      }
      toast.success('Coordinator profile photo uploaded to profiles directory!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openEditCoordModal = (coord) => {
    setEditingCoord(coord);
    setEditCoordData({
      name: coord.name || '',
      email: coord.email || '',
      phone: coord.phone || '',
      bloodGroup: coord.bloodGroup || 'O+',
      dob: coord.dob ? coord.dob.substring(0, 10) : '1995-01-01',
      address: coord.address || '',
      district: coord.district || 'Aligarh',
      state: coord.state || 'Uttar Pradesh',
      designation: coord.designation || 'District Youth Coordinator',
      status: coord.status || 'active',
      coordinatorId: coord.coordinatorId || coord.memberId || '',
      photoUrl: coord.photoUrl || '',
      password: ''
    });
  };

  const handleUpdateCoordSubmit = async (e) => {
    e.preventDefault();
    if (!editingCoord) return;
    if (!editCoordData.name.trim() || !editCoordData.email.trim() || !editCoordData.phone.trim()) {
      toast.error('Name, Email, and Mobile Phone are mandatory.');
      return;
    }
    try {
      setIsUpdatingCoord(true);
      const targetId = editingCoord._id || editingCoord.id;
      const res = await api.put(`/coordinators/${targetId}`, editCoordData);
      toast.success(res.data?.message || 'Coordinator profile updated successfully!');
      setEditingCoord(null);
      loadCoordinators();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update coordinator');
    } finally {
      setIsUpdatingCoord(false);
    }
  };

  const handleDeleteCoordSubmit = async () => {
    if (!deletingCoord) return;
    try {
      setIsDeletingCoord(true);
      const targetId = deletingCoord._id || deletingCoord.id;
      const res = await api.delete(`/coordinators/${targetId}?action=${deleteAction}`);
      toast.success(res.data?.message || (deleteAction === 'delete' ? 'Coordinator deleted permanently' : 'Coordinator role revoked'));
      setDeletingCoord(null);
      loadCoordinators();
      loadUsersForPromotion();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove coordinator');
    } finally {
      setIsDeletingCoord(false);
    }
  };

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

      const createdCoord = res.data?.coordinator || {
        name: newCoordData.name,
        email: newCoordData.email,
        phone: newCoordData.phone,
        district: newCoordData.district,
        state: newCoordData.state,
        designation: newCoordData.designation,
        coordinatorId: res.data?.coordinator?.coordinatorId || 'BYK-COORD'
      };
      const finalTempPassword = res.data?.temporaryPassword || newCoordData.password || 'BYK@' + Math.floor(100000 + Math.random() * 900000);
      setCreatedResultModal({
        coordinator: createdCoord,
        temporaryPassword: finalTempPassword
      });

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
      setShowAddPassword(false);
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
    const targetId = coord._id || coord.id;
    if (!targetId) {
      toast.error('Coordinator identifier missing.');
      return;
    }

    try {
      setResendingId(targetId);
      let res;
      try {
        res = await api.post(`/coordinators/${targetId}/resend-credentials`);
      } catch (err1) {
        if (err1.response?.status === 404) {
          res = await api.post(`/coordinator/${targetId}/resend-credentials`);
        } else {
          throw err1;
        }
      }

      const returnedPassword = res.data?.temporaryPassword;
      const returnedCoord = res.data?.coordinator || coord;

      if (returnedPassword) {
        setCreatedResultModal({
          coordinator: returnedCoord,
          temporaryPassword: returnedPassword
        });
      }

      toast.success(
        res.data?.message || `Appointment letter & login details re-sent to ${coord.email}!`,
        { duration: 6000 }
      );
    } catch (err) {
      console.error('Failed to resend credentials:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to resend credentials';
      toast.error(msg);
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-x-96 pb-4 border-b rounded-3xl px-8 py-3 border-slate-300 shadow-md">
        <div className=''>
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
      <div className="mx-3 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
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
      <div className="bg-white mx-3 p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
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
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
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
                          <div className="w-11 h-11 rounded-2xl bg-purple-100 border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-purple-700 shadow-2xs">
                            {photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={getContentImageUrl(photo)} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-black">{(c.name || 'C').charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-black flex items-center gap-1.5 flex-wrap">
                              <span>{c.name}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${c.status === 'blocked'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : c.status === 'deactivated'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                {c.status ? c.status.toUpperCase() : 'ACTIVE'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200/80">
                                {coordId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Region */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{c.designation || 'District Youth Coordinator'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{c.district || 'Aligarh'}, {c.state || 'UP'}</span>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 flex items-center gap-1.5 font-medium text-xs">
                          <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-45" title={c.email}>{c.email}</span>
                        </div>
                        <div className="text-slate-600 flex items-center gap-1.5 mt-1 font-medium text-xs">
                          <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{c.phone}</span>
                        </div>
                      </td>

                      {/* Recruits Summary */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => openInspectMembers(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold text-xs transition border border-purple-200 cursor-pointer shadow-2xs"
                        >
                          <FiUsers className="w-3.5 h-3.5 text-purple-700" />
                          <span>{recruits} Enrolled</span>
                        </button>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] font-bold">
                          {pending > 0 && (
                            <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                              {pending} pending
                            </span>
                          )}
                          <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                            {approved} active
                          </span>
                        </div>
                      </td>

                      {/* Fees Collected */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 inline-block shadow-2xs">
                          ₹{fees.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openInspectMembers(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 font-bold text-xs transition cursor-pointer shadow-2xs"
                            title="Inspect all members added by this coordinator"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>Recruits</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditCoordModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs transition cursor-pointer shadow-2xs"
                            title="Edit coordinator profile and details"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            disabled={resendingId === id}
                            onClick={() => handleResendCredentials(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50 shadow-2xs"
                            title="Resend Appointment Letter, ID Card & Password Email"
                          >
                            <FiSend className={`w-3.5 h-3.5 ${resendingId === id ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{resendingId === id ? 'Sending...' : 'Email'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeletingCoord(c);
                              setDeleteAction('revoke');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition cursor-pointer shadow-2xs"
                            title="Revoke or delete coordinator"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
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

              {/* Profile Photo Upload -> Stored in uploads/profiles */}
              <div>
                <label className="block font-bold text-black mb-1">
                  Coordinator Profile Photo (Stored in profiles folder)
                </label>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-13 h-13 rounded-2xl bg-purple-100 border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-purple-700 shadow-2xs">
                    {newCoordData.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getContentImageUrl(newCoordData.photoUrl)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black">{(newCoordData.name || 'C').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold cursor-pointer transition shadow-2xs">
                      <FiUploadCloud className="w-4 h-4" />
                      <span>{uploadingPhoto ? 'Uploading to profiles...' : 'Upload Profile Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingPhoto}
                        onChange={(e) => handleUploadPhoto(e, false)}
                      />
                    </label>
                    {newCoordData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setNewCoordData({ ...newCoordData, photoUrl: '' })}
                        className="ml-2.5 text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">Photo is securely stored in <span className="font-mono text-purple-700 font-bold">uploads/profiles/</span></p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-black mb-1">
                  Custom Password (Optional - leave blank to auto-generate)
                </label>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    placeholder="Leave empty for auto-generated secure password e.g. BYK@729183"
                    value={newCoordData.password}
                    onChange={(e) => setNewCoordData({ ...newCoordData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 transition cursor-pointer p-1"
                    title={showAddPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAddPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Leave blank to auto-generate a secure password. You will be able to view and copy it upon creation.
                </p>
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

      {/* ----------------- MODAL 4: EDIT COORDINATOR ----------------- */}
      {editingCoord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FiEdit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Edit Coordinator Profile</h3>
                  <p className="text-[11px] text-slate-500">Update regional assignment, contact details & statutory status.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCoord(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCoordSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCoordData.name}
                    onChange={(e) => setEditCoordData({ ...editCoordData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editCoordData.email}
                    onChange={(e) => setEditCoordData({ ...editCoordData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={editCoordData.phone}
                    onChange={(e) => setEditCoordData({ ...editCoordData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Official Designation</label>
                  <input
                    type="text"
                    value={editCoordData.designation}
                    onChange={(e) => setEditCoordData({ ...editCoordData, designation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">District</label>
                  <input
                    type="text"
                    value={editCoordData.district}
                    onChange={(e) => setEditCoordData({ ...editCoordData, district: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">State</label>
                  <input
                    type="text"
                    value={editCoordData.state}
                    onChange={(e) => setEditCoordData({ ...editCoordData, state: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Blood Group</label>
                  <select
                    value={editCoordData.bloodGroup}
                    onChange={(e) => setEditCoordData({ ...editCoordData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium bg-white"
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
                    value={editCoordData.dob}
                    onChange={(e) => setEditCoordData({ ...editCoordData, dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Account Status</label>
                  <select
                    value={editCoordData.status}
                    onChange={(e) => setEditCoordData({ ...editCoordData, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium bg-white"
                  >
                    <option value="active">Active (Full Portal Access)</option>
                    <option value="deactivated">Deactivated (Suspended)</option>
                    <option value="blocked">Blocked (Restricted)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">Coordinator ID Badge</label>
                  <input
                    type="text"
                    value={editCoordData.coordinatorId}
                    onChange={(e) => setEditCoordData({ ...editCoordData, coordinatorId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Complete Address</label>
                <textarea
                  rows={2}
                  value={editCoordData.address}
                  onChange={(e) => setEditCoordData({ ...editCoordData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                />
              </div>

              {/* Edit Profile Photo Upload -> Stored in uploads/profiles */}
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Coordinator Profile Photo (Stored in profiles folder)
                </label>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-13 h-13 rounded-2xl bg-purple-100 border border-purple-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-purple-700 shadow-2xs">
                    {editCoordData.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getContentImageUrl(editCoordData.photoUrl)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black">{(editCoordData.name || 'C').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold cursor-pointer transition shadow-2xs">
                      <FiUploadCloud className="w-4 h-4" />
                      <span>{uploadingPhoto ? 'Uploading to profiles...' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingPhoto}
                        onChange={(e) => handleUploadPhoto(e, true)}
                      />
                    </label>
                    {editCoordData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditCoordData({ ...editCoordData, photoUrl: '' })}
                        className="ml-2.5 text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">Stored in <span className="font-mono text-purple-700 font-bold">uploads/profiles/</span></p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Reset Password (Optional)</label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    placeholder="Leave empty to preserve existing password"
                    value={editCoordData.password}
                    onChange={(e) => setEditCoordData({ ...editCoordData, password: e.target.value })}
                    className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-700 transition cursor-pointer p-1"
                    title={showEditPassword ? 'Hide password' : 'Show password'}
                  >
                    {showEditPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Only enter a new password if you want to override their current login password.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCoord(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCoord}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FiSave className="w-3.5 h-3.5" />
                  <span>{isUpdatingCoord ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 5: REVOKE / DELETE COORDINATOR ----------------- */}
      {deletingCoord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">Remove Coordinator</h3>
                <p className="text-[11px] text-slate-500 font-medium">Configure administrator removal action.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              Select how to remove coordinator privileges for <strong className="text-black font-extrabold">{deletingCoord.name}</strong> ({deletingCoord.coordinatorId || deletingCoord.email}):
            </p>

            <div className="space-y-2 text-xs">
              <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${deleteAction === 'revoke' ? 'border-purple-600 bg-purple-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name="coordDeleteAction"
                  value="revoke"
                  checked={deleteAction === 'revoke'}
                  onChange={() => setDeleteAction('revoke')}
                  className="mt-0.5 text-purple-600"
                />
                <div>
                  <strong className="block text-black font-bold">Revoke Coordinator Role (Recommended)</strong>
                  <span className="text-[11px] text-slate-500">Demotes user back to Member or Donor. Retains existing user account and login history.</span>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${deleteAction === 'delete' ? 'border-rose-600 bg-rose-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name="coordDeleteAction"
                  value="delete"
                  checked={deleteAction === 'delete'}
                  onChange={() => setDeleteAction('delete')}
                  className="mt-0.5 text-rose-600"
                />
                <div>
                  <strong className="block text-rose-700 font-bold">Permanent Account Deletion</strong>
                  <span className="text-[11px] text-slate-500">Completely deletes the user account from database. Irreversible action.</span>
                </div>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingCoord}
                onClick={() => setDeletingCoord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingCoord}
                onClick={handleDeleteCoordSubmit}
                className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 ${deleteAction === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-purple-700 hover:bg-purple-800'}`}
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>{isDeletingCoord ? 'Processing...' : (deleteAction === 'delete' ? 'Confirm Deletion' : 'Confirm Role Revoke')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------- MODAL 6: APPOINTED COORDINATOR RESULT WITH SEEN PASSWORD ----------------- */}
      {createdResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Coordinator Appointed Successfully!</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Official Appointment Letter &amp; ID Card generated</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreatedResultModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Coordinator summary card */}
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                {(createdResultModal.coordinator?.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm text-black truncate">
                  {createdResultModal.coordinator?.name}
                </h4>
                <p className="text-xs font-bold text-purple-800">
                  {createdResultModal.coordinator?.designation || 'District Youth Coordinator'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                  <span className="font-mono font-bold text-purple-700">
                    ID: {createdResultModal.coordinator?.coordinatorId || 'BYK-COORD'}
                  </span>
                  <span>•</span>
                  <span>{createdResultModal.coordinator?.district || 'Aligarh'}, {createdResultModal.coordinator?.state || 'UP'}</span>
                </div>
              </div>
            </div>

            {/* Login Credentials Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Coordinator Login Credentials
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Active
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Registered Email / Username</span>
                <div className="flex items-center justify-between mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-mono text-xs font-bold text-black select-all">
                    {createdResultModal.coordinator?.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCredentials(createdResultModal.coordinator?.email)}
                    className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer p-1"
                    title="Copy Email"
                  >
                    <FiCopy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Assigned Password</span>
                  <span className="text-[10px] text-slate-400">Click eye to view</span>
                </div>
                <div className="flex items-center justify-between mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-mono text-xs font-bold text-purple-700 tracking-wide select-all">
                    {showResultPassword ? createdResultModal.temporaryPassword : '••••••••••••'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowResultPassword(!showResultPassword)}
                      className="p-1 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-slate-100 cursor-pointer transition"
                      title={showResultPassword ? 'Hide password' : 'Show password'}
                    >
                      {showResultPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(createdResultModal.temporaryPassword)}
                      className="p-1 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-slate-100 cursor-pointer transition"
                      title="Copy Password"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 bg-blue-50/70 p-3 rounded-xl border border-blue-100 font-medium leading-relaxed">
              An automated notification containing their official appointment letter, digital ID card, and portal login instructions has been dispatched to <strong>{createdResultModal.coordinator?.email}</strong>.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const payload = `Coordinator: ${createdResultModal.coordinator?.name}\nCoordinator ID: ${createdResultModal.coordinator?.coordinatorId}\nEmail: ${createdResultModal.coordinator?.email}\nPassword: ${createdResultModal.temporaryPassword}\nLogin Portal: https://bharatiyayuvakranti.org/login`;
                  handleCopyCredentials(payload);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition cursor-pointer flex items-center gap-1.5"
              >
                {copiedText ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copied Details!' : 'Copy All Credentials'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedResultModal(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 transition cursor-pointer"
              >
                Done &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
