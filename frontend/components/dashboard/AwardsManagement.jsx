"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAward,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiStar,
  FiShield,
  FiHeart,
  FiZap,
  FiCheckCircle,
  FiX,
  FiFilter,
  FiCalendar,
  FiUserCheck
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

export default function AwardsManagement() {
  const [activeTab, setActiveTab] = useState("grants"); // 'grants' | 'people' | 'templates'
  const [loading, setLoading] = useState(true);

  // Data States
  const [grants, setGrants] = useState([]);
  const [awards, setAwards] = useState([]);
  const [users, setUsers] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Grant Offer Modal
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [grantTargetUser, setGrantTargetUser] = useState(null);
  const [selectedAwardId, setSelectedAwardId] = useState("");
  const [grantReason, setGrantReason] = useState("");
  const [submittingGrant, setSubmittingGrant] = useState(false);

  // Template Create/Edit Modal
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    title: "",
    description: "",
    category: "Social Service",
    tier: "Gold",
    badgeColor: "gold",
    badgeIcon: "FiAward",
    points: 100
  });
  const [submittingTemplate, setSubmittingTemplate] = useState(false);

  // Revoke Modal
  const [revokeTargetGrant, setRevokeTargetGrant] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const isGrantDisabled = submittingGrant || !selectedAwardId || !grantReason.trim();

  const isTemplateUnchanged = editingTemplate
    ? templateForm.title.trim() === (editingTemplate.title || "").trim() &&
    templateForm.description.trim() === (editingTemplate.description || "").trim() &&
    templateForm.category === (editingTemplate.category || "Social Service") &&
    templateForm.tier === (editingTemplate.tier || "Gold") &&
    templateForm.badgeColor === (editingTemplate.badgeColor || "gold") &&
    templateForm.badgeIcon === (editingTemplate.badgeIcon || "FiAward") &&
    Number(templateForm.points) === Number(editingTemplate.points || 100)
    : !templateForm.title.trim();

  const loadData = async () => {
    try {
      setLoading(true);
      const [resGrants, resAwards, resUsers] = await Promise.all([
        api.get("/awards/grants").catch(() => ({ data: { grants: [] } })),
        api.get("/awards").catch(() => ({ data: { awards: [] } })),
        api.get("/users").catch(() => ({ data: { users: [] } }))
      ]);

      const gList = resGrants.data?.grants || resGrants.data?.data || [];
      setGrants(Array.isArray(gList) ? gList : []);

      const aList = resAwards.data?.awards || resAwards.data?.data || [];
      setAwards(Array.isArray(aList) ? aList : []);

      const uList = resUsers.data?.users || resUsers.data?.data || [];
      setUsers(Array.isArray(uList) ? uList : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load awards data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Grants
  const filteredGrants = grants.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    const name = (g.userName || "").toLowerCase();
    const email = (g.userEmail || "").toLowerCase();
    const title = (g.title || "").toLowerCase();
    const reason = (g.reason || "").toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q) || title.includes(q) || reason.includes(q);

    if (!matchesSearch) return false;
    if (roleFilter !== "All" && (g.userRole || "").toLowerCase() !== roleFilter.toLowerCase()) return false;
    return true;
  });

  // Filtered People (Users / Volunteers / Members)
  const filteredPeople = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const phone = (u.phone || "").toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);

    if (!matchesSearch) return false;
    if (roleFilter !== "All") {
      if (roleFilter === "Member" && !(u.role === "Member" || u.isMember)) return false;
      if (roleFilter === "Volunteer" && !(u.role === "Volunteer" || u.isVolunteer)) return false;
      if (roleFilter === "Donor" && u.role !== "Donor") return false;
    }
    return true;
  });

  // Open Offer Award Modal for a specific user
  const openOfferModal = (user = null) => {
    setGrantTargetUser(user || users[0] || null);
    setSelectedAwardId(awards[0]?._id || awards[0]?.id || "");
    setGrantReason("");
    setGrantModalOpen(true);
  };

  // Submit Grant
  const handleGrantSubmit = async (e) => {
    e.preventDefault();
    if (!grantTargetUser) {
      toast.error("Please choose a recipient");
      return;
    }
    if (!selectedAwardId) {
      toast.error("Please choose an award badge");
      return;
    }
    if (!grantReason.trim()) {
      toast.error("Please provide a reason / citation for the award");
      return;
    }

    try {
      setSubmittingGrant(true);
      const chosen = awards.find((a) => (a._id || a.id) === selectedAwardId);
      const res = await api.post("/awards/grant", {
        userId: grantTargetUser._id || grantTargetUser.id,
        awardId: selectedAwardId,
        title: chosen?.title,
        reason: grantReason.trim(),
        citation: grantReason.trim(),
        category: chosen?.category,
        tier: chosen?.tier,
        badgeColor: chosen?.badgeColor,
        badgeIcon: chosen?.badgeIcon
      });

      toast.success(res.data?.message || "Award offered successfully!");
      setGrantModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to present award");
    } finally {
      setSubmittingGrant(false);
    }
  };

  // Revoke Grant
  const handleRevokeGrant = async () => {
    if (!revokeTargetGrant) return;
    try {
      setRevoking(true);
      const id = revokeTargetGrant._id || revokeTargetGrant.id;
      await api.delete(`/awards/grant/${id}`);
      toast.success("Award badge revoked successfully");
      setGrants((prev) => prev.filter((item) => (item._id || item.id) !== id));
      setRevokeTargetGrant(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to revoke award");
    } finally {
      setRevoking(false);
    }
  };

  // Open Template Modal
  const openCreateTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({
      title: "",
      description: "",
      category: "Social Service",
      tier: "Gold",
      badgeColor: "gold",
      badgeIcon: "FiAward",
      points: 100
    });
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (awd) => {
    setEditingTemplate(awd);
    setTemplateForm({
      title: awd.title || "",
      description: awd.description || "",
      category: awd.category || "Social Service",
      tier: awd.tier || "Gold",
      badgeColor: awd.badgeColor || "gold",
      badgeIcon: awd.badgeIcon || "FiAward",
      points: awd.points || 100
    });
    setTemplateModalOpen(true);
  };

  // Submit Template
  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    if (!templateForm.title.trim()) {
      toast.error("Award title is required");
      return;
    }

    try {
      setSubmittingTemplate(true);
      if (editingTemplate) {
        const id = editingTemplate._id || editingTemplate.id;
        await api.put(`/awards/${id}`, templateForm);
        toast.success("Award badge updated successfully");
      } else {
        await api.post("/awards", templateForm);
        toast.success("New award badge template created");
      }
      setTemplateModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save award template");
    } finally {
      setSubmittingTemplate(false);
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (awd) => {
    if (!confirm(`Are you sure you want to delete the award template '${awd.title}'?`)) return;
    try {
      const id = awd._id || awd.id;
      await api.delete(`/awards/${id}`);
      toast.success("Award template deleted");
      setAwards((prev) => prev.filter((a) => (a._id || a.id) !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete template");
    }
  };

  // Helper for badge colors
  const getBadgeStyle = (color = "gold") => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-500",
          border: "border-red-300",
          text: "text-red-700",
          pill: "bg-red-100 text-red-800 border-red-200"
        };
      case "emerald":
        return {
          bg: "bg-emerald-500",
          border: "border-emerald-300",
          text: "text-emerald-700",
          pill: "bg-emerald-100 text-emerald-800 border-emerald-200"
        };
      case "blue":
        return {
          bg: "bg-blue-500",
          border: "border-blue-300",
          text: "text-blue-700",
          pill: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "purple":
        return {
          bg: "bg-purple-500",
          border: "border-purple-300",
          text: "text-purple-700",
          pill: "bg-purple-100 text-purple-800 border-purple-200"
        };
      default:
        return {
          bg: "bg-amber-400",
          border: "border-amber-300",
          text: "text-amber-700",
          pill: "bg-amber-100 text-amber-800 border-amber-200"
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1">
            <FiAward className="w-3.5 h-3.5 text-amber-700" />
            <span>Honors &amp; Merits Desk</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">National Awards &amp; Honors Management</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Present official recognition badges to dedicated volunteers, members, and grassroots changemakers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            title="Refresh Data"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-red-600" : ""}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => openOfferModal()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <FiAward className="w-4 h-4" />
            <span>Offer Award to Person</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("grants")}
            className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === "grants" ? "bg-white text-black shadow-xs font-extrabold" : "text-slate-600 hover:text-black"
              }`}
          >
            <FiAward className="w-3.5 h-3.5 text-amber-600" />
            <span>Presented Honors ({grants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("people")}
            className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === "people" ? "bg-white text-black shadow-xs font-extrabold" : "text-slate-600 hover:text-black"
              }`}
          >
            <FiUsers className="w-3.5 h-3.5 text-blue-600" />
            <span>Recipients Directory ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${activeTab === "templates" ? "bg-white text-black shadow-xs font-extrabold" : "text-slate-600 hover:text-black"
              }`}
          >
            <FiShield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Custom Badges ({awards.length})</span>
          </button>
        </div>

        {activeTab === "templates" && (
          <button
            onClick={openCreateTemplate}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 mr-1"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Create New Badge</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar (for grants & people) */}
      {activeTab !== "templates" && (
        <div className="bg-white mx-3 p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === "grants" ? "Search presented awards, names, reasons..." : "Search users, volunteers, members..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <FiFilter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-black bg-slate-50 focus:outline-red-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Volunteer">Volunteers</option>
                <option value="Member">Members</option>
                <option value="Donor">Donors / Public</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 1: PRESENTED HONORS / GRANTS ----------------- */}
      {activeTab === "grants" && (
        <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-700 text-xs space-y-2">
              <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600" />
              <p>Loading granted honors...</p>
            </div>
          ) : filteredGrants.length === 0 ? (
            <div className="p-12 text-center text-slate-700 text-xs space-y-3">
              <FiAward className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-black">No awards presented yet.</p>
              <button
                onClick={() => openOfferModal()}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition"
              >
                Offer First Award
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                  <tr>
                    <th className="py-3 px-3.5">Recipient</th>
                    <th className="py-3 px-3.5">Award Badge</th>
                    <th className="py-3 px-3.5">Citation &amp; Reason</th>
                    <th className="py-3 px-3.5">Badge Number</th>
                    <th className="py-3 px-3.5">Date Granted</th>
                    <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-black">
                  {filteredGrants.map((g) => {
                    const id = g._id || g.id;
                    const style = getBadgeStyle(g.badgeColor);

                    return (
                      <tr key={id} className="group hover:bg-slate-50/80 transition">
                        {/* Recipient */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-3">
                            {g.userPhoto ? (
                              <img
                                src={getContentImageUrl(g.userPhoto)}
                                alt={g.userName}
                                className="w-9 h-9 rounded-full object-cover border border-amber-400 shadow-2xs"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center text-xs">
                                {g.userName?.charAt(0) || "U"}
                              </div>
                            )}
                            <div>
                              <div className="font-extrabold text-black">{g.userName}</div>
                              <span className="text-[10px] text-slate-500 font-bold block">{g.userEmail}</span>
                              <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700">
                                {g.userRole || "Member"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Award Badge */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${style.bg} text-white flex items-center justify-center font-bold text-sm shadow-xs border-2 border-white ring-2 ${style.border}`}>
                              <FiAward />
                            </div>
                            <div>
                              <div className="font-extrabold text-black text-sm">{g.title}</div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase inline-block border ${style.pill}`}>
                                {g.tier || "Gold"} • {g.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Citation & Reason */}
                        <td className="py-3 px-3.5 max-w-[280px]">
                          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                            {g.reason || g.citation}
                          </p>
                        </td>

                        {/* Badge Number */}
                        <td className="py-3 px-3.5 font-mono font-bold text-amber-800 whitespace-nowrap">
                          #{g.badgeNumber || "NA"}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                          {g.awardedAt ? new Date(g.awardedAt).toLocaleDateString("en-IN") : "-"}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                          <button
                            type="button"
                            onClick={() => setRevokeTargetGrant(g)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer"
                            title="Revoke Award Badge"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>Revoke</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 2: RECIPIENTS DIRECTORY (USERS, VOLUNTEERS, MEMBERS) ----------------- */}
      {activeTab === "people" && (
        <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">Person Profile</th>
                  <th className="py-3 px-3.5">Contact Details</th>
                  <th className="py-3 px-3.5">Affiliation Role</th>
                  <th className="py-3 px-3.5">Current Honors</th>
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                    Offer Award
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filteredPeople.map((u) => {
                  const id = u._id || u.id;
                  const photo = u.photoUrl ? getContentImageUrl(u.photoUrl) : null;
                  const earnedGrants = grants.filter((g) => (g.userId?._id || g.userId) === id);

                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img
                              src={photo}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-black flex items-center justify-center shrink-0 text-sm">
                              {u.name?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-black text-sm">{u.name}</div>
                            {u.district && <div className="text-[11px] text-slate-500">{u.district}</div>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="text-slate-800 font-semibold">{u.email}</div>
                        <div className="text-slate-500 text-[11px]">{u.phone || "No phone"}</div>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${u.role === "Member" || u.isMember
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : u.role === "Volunteer" || u.isVolunteer
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                        >
                          {u.role || "Donor"}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        {earnedGrants.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] border border-amber-200 flex items-center gap-1">
                              <FiAward className="w-3 h-3 text-amber-700" />
                              <span>{earnedGrants.length} Badge{earnedGrants.length === 1 ? "" : "s"}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No honors yet</span>
                        )}
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <button
                          type="button"
                          onClick={() => openOfferModal(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                        >
                          <FiAward className="w-3.5 h-3.5" />
                          <span>Present Award</span>
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

      {/* ----------------- TAB 3: CUSTOMIZE & MANAGE BADGE TEMPLATES ----------------- */}
      {activeTab === "templates" && (
        <div className="mx-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((awd) => {
              const id = awd._id || awd.id;
              const style = getBadgeStyle(awd.badgeColor);

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${style.pill}`}>
                        {awd.tier || "Gold"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{awd.category}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${style.bg} text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white ring-2 ${style.border}`}>
                        <FiAward className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-base text-black leading-tight">{awd.title}</h3>
                        <span className="text-xs font-bold text-slate-500 block mt-0.5">{awd.points || 100} Merit Points</span>
                      </div>
                    </div>

                    {awd.description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                        {awd.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditTemplate(awd)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <FiEdit2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(awd)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 border border-rose-200"
                    >
                      <FiTrash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- OFFER AWARD MODAL ----------------- */}
      {grantModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setGrantModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-amber-200">
                Grant Foundation Honor
              </span>
              <h2 className="text-xl font-black text-black">Present Official Award</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                The awarded badge will display on the recipient's personal account portal at /profile/my-awards.
              </p>
            </div>

            <form onSubmit={handleGrantSubmit} className="space-y-4 text-xs font-semibold">
              {/* Recipient Selection */}
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Select Recipient Person *</label>
                <select
                  value={grantTargetUser?._id || grantTargetUser?.id || ""}
                  onChange={(e) => {
                    const found = users.find((u) => (u._id || u.id) === e.target.value);
                    setGrantTargetUser(found);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-red-500 font-bold cursor-pointer"
                  required
                >
                  {users.map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.name} ({u.email}) — [{u.role || "Donor"}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Award Template Selection */}
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Choose Award Badge *</label>
                <select
                  value={selectedAwardId}
                  onChange={(e) => setSelectedAwardId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-red-500 font-bold cursor-pointer"
                  required
                >
                  {awards.map((awd) => (
                    <option key={awd._id || awd.id} value={awd._id || awd.id}>
                      {awd.title} ({awd.tier} • {awd.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Citation Reason */}
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Official Citation &amp; Reason *</label>
                <textarea
                  rows={3}
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  placeholder="e.g. In recognition of extraordinary dedication during the 2026 Winter Relief Drive and free tutoring pods."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-white focus:outline-red-500 font-medium"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGrantModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrantDisabled}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <FiAward className="w-3.5 h-3.5" />
                  <span>{submittingGrant ? "Presenting..." : "Present Award"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- CREATE / EDIT BADGE TEMPLATE MODAL ----------------- */}
      {templateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setTemplateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-emerald-200">
                Badge Design Studio
              </span>
              <h2 className="text-xl font-black text-black">
                {editingTemplate ? "Edit Award Badge" : "Create New Custom Award Badge"}
              </h2>
            </div>

            <form onSubmit={handleTemplateSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Award Title *</label>
                <input
                  type="text"
                  required
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                  placeholder="e.g. Literacy Champion Award"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Honor Tier</label>
                  <select
                    value={templateForm.tier}
                    onChange={(e) => setTemplateForm({ ...templateForm, tier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-red-500 font-bold"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Special Honor">Special Honor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Color Theme</label>
                  <select
                    value={templateForm.badgeColor}
                    onChange={(e) => setTemplateForm({ ...templateForm, badgeColor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-red-500 font-bold"
                  >
                    <option value="gold">Gold (Amber)</option>
                    <option value="red">Red (Crimson)</option>
                    <option value="emerald">Emerald (Green)</option>
                    <option value="blue">Blue (Sapphire)</option>
                    <option value="purple">Purple (Royal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Category</label>
                <select
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-red-500 font-bold"
                >
                  <option value="Social Service">Social Service</option>
                  <option value="Volunteerism">Volunteerism</option>
                  <option value="Child Education">Child Education</option>
                  <option value="Healthcare Hero">Healthcare Hero</option>
                  <option value="Emergency Relief">Emergency Relief</option>
                  <option value="Youth Leadership">Youth Leadership</option>
                  <option value="Community Champion">Community Champion</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Award Description</label>
                <textarea
                  rows={2}
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  placeholder="Criteria and meaning behind this recognition..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-black bg-white focus:outline-red-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTemplate || isTemplateUnchanged}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingTemplate ? "Saving..." : editingTemplate ? (isTemplateUnchanged ? "No Changes to Save" : "Update Award Badge") : "Save Award Badge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- REVOKE CONFIRMATION MODAL ----------------- */}
      {revokeTargetGrant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative text-black text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl border border-rose-200">
              <FiTrash2 />
            </div>

            <div>
              <h3 className="text-lg font-black text-black">Revoke Award Badge?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to revoke the <strong>{revokeTargetGrant.title}</strong> badge presented to{" "}
                <strong>{revokeTargetGrant.userName}</strong>? This will remove the badge from their personal profile.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRevokeTargetGrant(null)}
                className="px-5 py-2.5 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeGrant}
                disabled={revoking}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {revoking ? "Revoking..." : "Confirm Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
