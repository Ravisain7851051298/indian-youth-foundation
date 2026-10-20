"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiSlash,
  FiTrash2,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiAward,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiX,
  FiAlertTriangle,
  FiCheckCircle,
  FiFilter
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    members: 0,
    volunteers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modals
  const [detailsModalUser, setDetailsModalUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blockTogglingId, setBlockTogglingId] = useState(null);

  // Quick Award Offering Modal
  const [awardModalUser, setAwardModalUser] = useState(null);
  const [awardsList, setAwardsList] = useState([]);
  const [selectedAwardId, setSelectedAwardId] = useState("");
  const [awardReason, setAwardReason] = useState("");
  const [isSubmittingAward, setIsSubmittingAward] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const [resUsers, resStats, resAwards] = await Promise.all([
        api.get("/users"),
        api.get("/users/stats").catch(() => ({ data: { stats: {} } })),
        api.get("/awards").catch(() => ({ data: { awards: [] } }))
      ]);

      const list = resUsers.data?.users || resUsers.data?.data || [];
      setUsers(Array.isArray(list) ? list : []);

      if (resStats.data?.stats) {
        setStats(resStats.data.stats);
      }
      const awds = resAwards.data?.awards || resAwards.data?.data || [];
      setAwardsList(Array.isArray(awds) ? awds : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const phone = (u.phone || "").toLowerCase();
    const memberId = (u.memberId || "").toLowerCase();
    const volunteerId = (u.volunteerId || "").toLowerCase();
    const district = (u.district || "").toLowerCase();

    const matchesSearch =
      !q ||
      name.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      memberId.includes(q) ||
      volunteerId.includes(q) ||
      district.includes(q);

    if (!matchesSearch) return false;

    if (selectedRole !== "All") {
      if (selectedRole === "Member" && !(u.role === "Member" || u.isMember)) return false;
      if (selectedRole === "Volunteer" && !(u.role === "Volunteer" || u.isVolunteer)) return false;
      if (selectedRole === "Admin" && u.role !== "Admin") return false;
      if (selectedRole === "Donor" && u.role !== "Donor") return false;
      if (selectedRole === "TeamMember" && u.role !== "TeamMember") return false;
    }

    if (selectedStatus !== "All") {
      const st = (u.status || "active").toLowerCase();
      if (st !== selectedStatus.toLowerCase()) return false;
    }

    return true;
  });

  // Handle Block / Unblock Toggle
  const handleToggleBlock = async (user) => {
    const currentStatus = user.status || "active";
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    const actionLabel = nextStatus === "blocked" ? "Block" : "Unblock";

    try {
      setBlockTogglingId(user._id || user.id);
      const res = await api.put(`/users/${user._id || user.id}/status`, {
        status: nextStatus
      });

      toast.success(res.data?.message || `User successfully ${nextStatus === "blocked" ? "blocked" : "unblocked"}`);
      setUsers((prev) =>
        prev.map((item) => ((item._id || item.id) === (user._id || user.id) ? { ...item, status: nextStatus } : item))
      );
      if (detailsModalUser && (detailsModalUser._id || detailsModalUser.id) === (user._id || user.id)) {
        setDetailsModalUser((prev) => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${actionLabel.toLowerCase()} user`);
    } finally {
      setBlockTogglingId(null);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    try {
      setIsDeleting(true);
      const id = deleteModalUser._id || deleteModalUser.id;
      await api.delete(`/users/${id}`);
      toast.success(`User ${deleteModalUser.name} deleted successfully`);
      setUsers((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setDeleteModalUser(null);
      if (detailsModalUser && (detailsModalUser._id || detailsModalUser.id) === id) {
        setDetailsModalUser(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user account");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Quick Grant Award
  const handleGrantAward = async (e) => {
    e.preventDefault();
    if (!awardModalUser) return;
    if (!selectedAwardId) {
      toast.error("Please choose an award badge");
      return;
    }
    if (!awardReason.trim()) {
      toast.error("Please enter a citation reason for the award");
      return;
    }

    try {
      setIsSubmittingAward(true);
      const chosen = awardsList.find((a) => (a._id || a.id) === selectedAwardId);
      await api.post("/awards/grant", {
        userId: awardModalUser._id || awardModalUser.id,
        awardId: selectedAwardId,
        title: chosen?.title,
        reason: awardReason.trim(),
        citation: awardReason.trim(),
        category: chosen?.category,
        tier: chosen?.tier,
        badgeColor: chosen?.badgeColor,
        badgeIcon: chosen?.badgeIcon
      });

      toast.success(`Award presented to ${awardModalUser.name}!`);
      setAwardModalUser(null);
      setSelectedAwardId("");
      setAwardReason("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to offer award");
    } finally {
      setIsSubmittingAward(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-1">
            <FiShield className="w-3.5 h-3.5 text-red-600" />
            <span>Identity &amp; Governance Center</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">All User Accounts &amp; Access Control</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage all registered public donors, verified members, field volunteers, and administrators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            title="Refresh Users"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-red-600" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mx-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-lg font-bold">
            <FiUsers className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Accounts</span>
            <span className="text-xl font-black text-black">{stats.totalUsers || users.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold">
            <FiUserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Status</span>
            <span className="text-xl font-black text-emerald-700">
              {stats.activeUsers || users.filter((u) => u.status !== "blocked").length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-lg font-bold">
            <FiUserX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Blocked</span>
            <span className="text-xl font-black text-rose-700">
              {stats.blockedUsers || users.filter((u) => u.status === "blocked").length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Members</span>
            <span className="text-xl font-black text-blue-700">
              {stats.members || users.filter((u) => u.role === "Member" || u.isMember).length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg font-bold">
            <FiAward className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Volunteers</span>
            <span className="text-xl font-black text-amber-700">
              {stats.volunteers || users.filter((u) => u.role === "Volunteer" || u.isVolunteer).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <FiFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50 focus:outline-red-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Member">Members Only</option>
              <option value="Volunteer">Volunteers Only</option>
              <option value="Donor">Donors / Public</option>
              <option value="TeamMember">Executive Team</option>
              <option value="Admin">Administrators</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50 focus:outline-red-500 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="active">Active Accounts</option>
            <option value="blocked">Blocked Accounts</option>
            <option value="pending">Pending Accounts</option>
          </select>

          <div className="bg-red-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl">
            {filteredUsers.length} Users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiUsers className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No user accounts found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">User Profile</th>
                  <th className="py-3 px-3.5">Contact Details</th>
                  <th className="py-3 px-3.5">Role &amp; Credentials</th>
                  <th className="py-3 px-3.5">Account Status</th>
                  <th className="py-3 px-3.5">Registered On</th>
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filteredUsers.map((u) => {
                  const id = u._id || u.id;
                  const isBlocked = u.status === "blocked";
                  const photo = u.photoUrl ? getContentImageUrl(u.photoUrl) : null;

                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      {/* User Profile */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img
                              src={photo}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-red-500 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-black flex items-center justify-center shrink-0 border border-red-200 text-sm">
                              {u.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-black text-sm">{u.name}</div>
                            {u.district && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <FiMapPin className="w-3 h-3 text-red-500 shrink-0" />
                                <span>{u.district}{u.state ? `, ${u.state}` : ""}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3 px-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold truncate max-w-50">
                            <FiMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.phone || "No phone"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Credentials */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-block border ${u.role === "Admin"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : u.role === "Member" || u.isMember
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : u.role === "Volunteer" || u.isVolunteer
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                    : u.role === "TeamMember"
                                      ? "bg-amber-100 text-amber-800 border-amber-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                          >
                            {u.role || "Donor"}
                          </span>
                          {(u.memberId || u.volunteerId) && (
                            <div className="font-mono text-[10px] font-bold text-slate-600">
                              ID: {u.memberId || u.volunteerId}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${isBlocked
                              ? "bg-rose-100 text-rose-800 border-rose-200"
                              : "bg-emerald-100 text-emerald-800 border-emerald-200"
                            }`}
                        >
                          {isBlocked ? <FiSlash className="w-3 h-3 text-rose-600" /> : <FiCheckCircle className="w-3 h-3 text-emerald-600" />}
                          <span>{isBlocked ? "Blocked" : "Active"}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Offer Award */}
                          <button
                            type="button"
                            onClick={() => {
                              setAwardModalUser(u);
                              setSelectedAwardId(awardsList[0]?._id || awardsList[0]?.id || "");
                              setAwardReason("");
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-bold text-xs shadow-2xs transition cursor-pointer"
                            title="Offer / Grant Official Award"
                          >
                            <FiAward className="w-3.5 h-3.5 text-amber-600" />
                            <span>Award</span>
                          </button>

                          {/* Block / Unblock Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(u)}
                            disabled={blockTogglingId === id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-2xs transition cursor-pointer disabled:opacity-50 border ${isBlocked
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              }`}
                            title={isBlocked ? "Unblock this user account" : "Block this user from logging in"}
                          >
                            <FiSlash className="w-3.5 h-3.5" />
                            <span>{isBlocked ? "Unblock" : "Block"}</span>
                          </button>

                          {/* Inspect Details */}
                          <button
                            type="button"
                            onClick={() => setDetailsModalUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                            title="View Full Profile Details"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Account */}
                          <button
                            type="button"
                            onClick={() => setDeleteModalUser(u)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer"
                            title="Delete User Permanently"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ----------------- USER DETAILS MODAL ----------------- */}
      {detailsModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-black space-y-4">
            <button
              onClick={() => setDetailsModalUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              {detailsModalUser.photoUrl ? (
                <img
                  src={getContentImageUrl(detailsModalUser.photoUrl)}
                  alt={detailsModalUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 font-black flex items-center justify-center text-2xl border border-red-200">
                  {detailsModalUser.name?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h2 className="text-xl font-black text-black">{detailsModalUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800">
                    {detailsModalUser.role || "Donor"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${detailsModalUser.status === "blocked"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                      }`}
                  >
                    {detailsModalUser.status || "active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Email</span>
                <span className="font-extrabold text-black break-all">{detailsModalUser.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Phone</span>
                <span className="font-extrabold text-black">{detailsModalUser.phone || "-"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Member ID</span>
                <span className="font-mono font-bold text-red-700">{detailsModalUser.memberId || "None"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Volunteer ID</span>
                <span className="font-mono font-bold text-emerald-700">{detailsModalUser.volunteerId || "None"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Blood Group</span>
                <span className="font-bold text-black">{detailsModalUser.bloodGroup || "O+"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Date of Birth</span>
                <span className="font-bold text-black">{detailsModalUser.dob || "-"}</span>
              </div>
            </div>

            {(detailsModalUser.address || detailsModalUser.district) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Address &amp; Location</span>
                <p className="font-semibold text-black mt-0.5">
                  {detailsModalUser.address ? `${detailsModalUser.address}, ` : ""}
                  {detailsModalUser.district ? `${detailsModalUser.district}, ` : ""}
                  {detailsModalUser.state || ""}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleBlock(detailsModalUser)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${detailsModalUser.status === "blocked"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
              >
                {detailsModalUser.status === "blocked" ? "Unblock Account" : "Block Account"}
              </button>

              <button
                type="button"
                onClick={() => setDetailsModalUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- DELETE CONFIRMATION MODAL ----------------- */}
      {deleteModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative text-black text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl border border-rose-200">
              <FiAlertTriangle />
            </div>

            <div>
              <h3 className="text-lg font-black text-black">Permanently Delete Account?</h3>
              <p className="text-xs text-slate-600 mt-1">
                You are about to delete <strong>{deleteModalUser.name}</strong> ({deleteModalUser.email}).
                This will remove their profile, authentication access, and associated award badges.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="px-5 py-2.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- OFFER AWARD MODAL ----------------- */}
      {awardModalUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAwardModalUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-amber-200">
                Offer National Honor
              </span>
              <h2 className="text-xl font-black text-black">Present Award to {awardModalUser.name}</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                The granted badge will be displayed on the recipient's personal portal (/profile/my-awards).
              </p>
            </div>

            <form onSubmit={handleGrantAward} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-black block mb-1">Select Award Badge Template *</label>
                <select
                  value={selectedAwardId}
                  onChange={(e) => setSelectedAwardId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-black bg-slate-50 focus:outline-red-500"
                  required
                >
                  {awardsList.map((awd) => (
                    <option key={awd._id || awd.id} value={awd._id || awd.id}>
                      {awd.title} ({awd.tier} • {awd.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">
                  Official Citation &amp; Reason for Award *
                </label>
                <textarea
                  rows={3}
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="e.g. For exemplary grassroots dedication, organizing 8 blood donation drives and mentoring 200 slum children in Aligarh."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-black bg-white focus:outline-red-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAwardModalUser(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAward || !selectedAwardId || !awardReason.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <FiAward className="w-3.5 h-3.5" />
                  <span>{isSubmittingAward ? "Presenting..." : "Present Award"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
