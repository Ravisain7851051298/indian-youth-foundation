"use client";

import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
  FiX,
  FiXCircle,
  FiAlertCircle,
  FiTrash2,
  FiExternalLink,
  FiFileText,
  FiAward
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

export default function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProof, setSelectedProof] = useState(null);
  const [viewModalItem, setViewModalItem] = useState(null);
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Certificate Modal State
  const [certModalItem, setCertModalItem] = useState(null);
  const [certTitle, setCertTitle] = useState("Certificate of Appreciation for Dedicated Volunteer Service");
  const [certReason, setCertReason] = useState("In recognition of outstanding dedication and exemplary leadership for societal empowerment and youth volunteer services.");
  const [certRole, setCertRole] = useState("Active Youth Volunteer");
  const [issuingCert, setIssuingCert] = useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.get("/applications/volunteers");
      } catch {
        // Fallback to alternative endpoint
        res = await api.get("/volunteers");
      }
      const list = res.data?.applications || res.data?.data || res.data?.volunteers || [];
      setVolunteers(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load volunteer applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const initFetch = async () => {
      try {
        let res;
        try {
          res = await api.get("/applications/volunteers");
        } catch {
          res = await api.get("/volunteers");
        }
        if (!ignore) {
          const list = res.data?.applications || res.data?.data || res.data?.volunteers || [];
          setVolunteers(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (!ignore) {
          toast.error(err.response?.data?.message || "Failed to load volunteer applications");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    initFetch();
    return () => {
      ignore = true;
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      let res;
      try {
        res = await api.put(`/applications/volunteers/${id}/approve`);
      } catch (e) {
        res = await api.put(`/volunteers/${id}/approve`);
      }
      toast.success(res.data?.message || "Volunteer approved! Badge & Appointment Letter issued.");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalItem) return;
    const id = rejectModalItem._id || rejectModalItem.id;
    try {
      setProcessingId(id);
      let res;
      try {
        res = await api.put(`/applications/volunteers/${id}/reject`, { reason: rejectReason });
      } catch (e) {
        res = await api.put(`/volunteers/${id}/reject`, { reason: rejectReason });
      }
      toast.success(res.data?.message || "Application rejected");
      setRejectModalItem(null);
      setRejectReason("");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    const id = deleteModalItem._id || deleteModalItem.id;
    try {
      setProcessingId(id);
      let res;
      try {
        res = await api.delete(`/applications/volunteers/${id}`);
      } catch (e) {
        res = await api.delete(`/volunteers/${id}`);
      }
      toast.success(res.data?.message || "Volunteer application and ID documents deleted successfully!");
      setDeleteModalItem(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    if (!certModalItem) return;
    try {
      setIssuingCert(true);
      const recipientUser = certModalItem.user || {};
      const payload = {
        recipientId: recipientUser._id || certModalItem.userId || certModalItem.user,
        recipientName: recipientUser.name || certModalItem.name,
        recipientEmail: recipientUser.email || certModalItem.email,
        title: certTitle,
        reason: certReason,
        roleOrDesignation: certRole
      };
      const res = await api.post("/certificates", payload);
      if (res.data?.success) {
        toast.success("Certificate of Appreciation minted and issued to volunteer!");
        setCertModalItem(null);
      } else {
        toast.error(res.data?.message || "Failed to issue certificate");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error issuing certificate");
    } finally {
      setIssuingCert(false);
    }
  };

  const formatSkills = (skills) => {
    if (!skills) return "";
    if (Array.isArray(skills)) return skills.join(", ");
    if (typeof skills === "string") return skills;
    return String(skills);
  };

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    for (const v of volunteers) {
      const st = (v.status || "pending").toLowerCase();
      if (st === "approved" || st === "active") approved++;
      else if (st === "rejected") rejected++;
      else pending++;
    }
    return {
      all: volunteers.length,
      pending,
      approved,
      rejected
    };
  }, [volunteers]);

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      const status = (v.status || "pending").toLowerCase();
      const isApproved = status === "approved" || status === "active";
      const isRejected = status === "rejected";
      const isPending = !isApproved && !isRejected;

      let matchStatus = true;
      if (activeTab === "pending") matchStatus = isPending;
      else if (activeTab === "approved") matchStatus = isApproved;
      else if (activeTab === "rejected") matchStatus = isRejected;

      if (!matchStatus) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const name = (v.user?.name || v.name || "").toLowerCase();
      const email = (v.user?.email || v.email || "").toLowerCase();
      const phone = (v.user?.phone || v.phone || "").toLowerCase();
      const skills = formatSkills(v.skills).toLowerCase();
      const interests = (v.interests || "").toLowerCase();
      const volId = (v.assignedVolunteerId || v.user?.memberId || "").toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        skills.includes(q) ||
        interests.includes(q) ||
        volId.includes(q)
      );
    });
  }, [volunteers, activeTab, searchQuery]);

  const isPdfDocument = (url) => {
    if (!url || typeof url !== "string") return false;
    return /\.pdf(\?|$)/i.test(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Volunteer Applications</h1>
          <p className="text-xs text-slate-700 mt-1">
            Audit youth volunteer credentials, verify national ID proofs, and authorize official volunteer badges.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer self-start md:self-auto disabled:opacity-50"
          title="Refresh Data"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by volunteer name, email, phone, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "approved", label: "Approved", count: counts.approved },
            { key: "rejected", label: "Rejected", count: counts.rejected }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === tab.key
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-slate-100 text-black hover:bg-red-50 hover:text-red-600"
                }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-black"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading volunteer applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No volunteer applications found.</p>
            {searchQuery && (
              <p className="text-[11px] text-slate-500">
                Try clearing your search query or switching tabs.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">Volunteer</th>
                  <th className="py-3 px-3.5">KYC Document</th>
                  <th className="py-3 px-3.5">Skills &amp; Motivation</th>
                  <th className="py-3 px-3.5">Availability</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filtered.map((v) => {
                  const id = v._id || v.id;
                  const proof = v.documentFront || v.idProofDocument || v.idProofUrl || v.documentUrl;
                  const photo = v.photoUrl || v.user?.photoUrl;
                  const status = (v.status || "pending").toLowerCase();
                  const isApproved = status === "approved" || status === "active";
                  const isRejected = status === "rejected";
                  const isPending = !isApproved && !isRejected;

                  const name = v.user?.name || v.name || "Volunteer Applicant";
                  const email = v.user?.email || v.email || "-";
                  const phone = v.user?.phone || v.phone || "-";
                  const skillsDisplay = formatSkills(v.skills) || "Social Work & Volunteering";
                  const assignedId = v.assignedVolunteerId || v.user?.memberId;
                  const docType = v.documentType || "Aadhaar Card";

                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div 
                            onClick={() => photo && setSelectedProof(getContentImageUrl(photo))}
                            className={`w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center ${photo ? 'cursor-pointer hover:ring-2 hover:ring-[#0b8026]' : ''}`}
                            title={photo ? "Click to view photo" : "No photo"}
                          >
                            {photo ? (
                              <img
                                src={getContentImageUrl(photo)}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiUser className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-black text-sm">{name}</div>
                            <div className="text-[11px] text-slate-600">{email} • {phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 block w-fit">
                            {docType}
                          </span>
                          {(proof || v.documentBack) ? (
                            <button
                              onClick={() => setViewModalItem(v)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              <FiEye className="w-3 h-3" />
                              <span>Inspect Documents</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No Doc Attached</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 max-w-45">
                        <div className="font-bold text-black line-clamp-1">{skillsDisplay}</div>
                        {(v.motivation || v.whyJoin) && (
                          <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5" title={v.motivation || v.whyJoin}>
                            {v.motivation || v.whyJoin}
                          </div>
                        )}
                        {v.interests && (
                          <div className="text-[10px] text-red-600 font-medium line-clamp-1 mt-0.5">
                            Interests: {v.interests}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3.5 text-slate-800 font-semibold whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="w-3 h-3 text-slate-400" />
                          {v.availability || "Weekends / Flexible"}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${isApproved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : isRejected
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                          >
                            {isApproved && <FiCheck className="w-3 h-3" />}
                            {isRejected && <FiX className="w-3 h-3" />}
                            {isPending && <FiClock className="w-3 h-3" />}
                            <span>{status}</span>
                          </span>

                          {isRejected && v.rejectionReason && (
                            <p className="text-[10px] text-rose-600 max-w-40 truncate" title={v.rejectionReason}>
                              Reason: {v.rejectionReason}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                        {v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-IN") : "-"}
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewModalItem(v)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition cursor-pointer border border-blue-200 shadow-2xs"
                            title="Inspect volunteer details, photo, and 2-sided KYC documents"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(id)}
                                disabled={!!processingId}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-[11px] transition cursor-pointer disabled:cursor-not-allowed shadow-xs"
                              >
                                {processingId === id ? (
                                  <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <FiCheck className="w-3.5 h-3.5" />
                                )}
                                <span>{processingId === id ? "Approving..." : "Approve"}</span>
                              </button>
                              <button
                                onClick={() => setRejectModalItem(v)}
                                disabled={!!processingId}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-[11px] transition cursor-pointer disabled:cursor-not-allowed shadow-xs"
                              >
                                <FiX className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => {
                                setCertModalItem(v);
                                setCertRole(v.user?.designation || "Active Youth Volunteer");
                                setCertTitle("Certificate of Appreciation for Dedicated Volunteer Service");
                                setCertReason("In recognition of outstanding dedication, volunteer service, and societal leadership.");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition cursor-pointer shadow-xs"
                              title="Offer Official Certificate"
                            >
                              <FiAward className="w-3.5 h-3.5" />
                              <span>Certificate</span>
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteModalItem(v)}
                            disabled={processingId === id}
                            title="Delete Volunteer Application"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <FiTrash2 className="w-4 h-4" />
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

      {/* View Volunteer Application & KYC Inspection Modal */}
      {viewModalItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl relative text-black max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0b8026] text-white flex items-center justify-center font-black shadow-xs">
                  <FiShield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-black">
                    Volunteer Application &amp; KYC Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Application ID: <span className="font-mono font-bold text-slate-800">{viewModalItem._id || viewModalItem.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  (viewModalItem.status || "pending").toLowerCase() === "approved" || (viewModalItem.status || "pending").toLowerCase() === "active"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : (viewModalItem.status || "pending").toLowerCase() === "rejected"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}>
                  {viewModalItem.status || "pending"}
                </span>
                <button
                  onClick={() => setViewModalItem(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-200 transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              
              {/* Volunteer Overview Card */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div 
                  onClick={() => (viewModalItem.photoUrl || viewModalItem.user?.photoUrl) && setSelectedProof(getContentImageUrl(viewModalItem.photoUrl || viewModalItem.user?.photoUrl))}
                  className="w-20 h-20 rounded-2xl border-2 border-[#0b8026] bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#0b8026] transition"
                  title="Click to zoom photo"
                >
                  {(viewModalItem.photoUrl || viewModalItem.user?.photoUrl) ? (
                    <img
                      src={getContentImageUrl(viewModalItem.photoUrl || viewModalItem.user?.photoUrl)}
                      alt="Volunteer Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left text-xs">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-black text-black text-base">
                      {viewModalItem.user?.name || viewModalItem.name || "Volunteer Applicant"}
                    </h4>
                    {viewModalItem.assignedVolunteerId && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {viewModalItem.assignedVolunteerId}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 pt-1">
                    <span><strong>Email:</strong> {viewModalItem.user?.email || viewModalItem.email || "-"}</span>
                    <span><strong>Phone:</strong> {viewModalItem.user?.phone || viewModalItem.phone || "-"}</span>
                    <span><strong>Blood Group:</strong> {viewModalItem.bloodGroup || viewModalItem.user?.bloodGroup || "O+"}</span>
                  </div>
                  <div className="text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 pt-0.5">
                    <span><strong>District:</strong> {viewModalItem.district || viewModalItem.user?.district || "Aligarh"}</span>
                    <span><strong>State:</strong> {viewModalItem.state || viewModalItem.user?.state || "Uttar Pradesh"}</span>
                    <span><strong>Availability:</strong> {viewModalItem.availability || "Weekends"}</span>
                  </div>
                </div>
              </div>

              {/* Volunteer Service Motivations & Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block text-[11px]">Skills &amp; Capabilities:</span>
                  <p className="font-extrabold text-slate-900">{formatSkills(viewModalItem.skills)}</p>
                </div>
                {viewModalItem.interests && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-bold block text-[11px]">Humanitarian Interests:</span>
                    <p className="font-semibold text-slate-900">{viewModalItem.interests}</p>
                  </div>
                )}
                {(viewModalItem.motivation || viewModalItem.whyJoin) && (
                  <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-bold block text-[11px]">Why Join Motivation:</span>
                    <p className="text-slate-800 leading-relaxed font-medium">{viewModalItem.motivation || viewModalItem.whyJoin}</p>
                  </div>
                )}
              </div>

              {/* KYC Government Documents Section (Front & Back) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <FiShield className="text-[#0b8026] w-4 h-4" />
                    <span>Government Verification Document ({viewModalItem.documentType || "Aadhaar Card"})</span>
                  </span>
                  <span className="text-[11px] font-extrabold text-[#0b8026] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {viewModalItem.documentType || "Aadhaar Card"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Side Document */}
                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-black">
                      <span className="flex items-center gap-1">
                        <FiFileText className="text-[#0b8026] w-3.5 h-3.5" />
                        <span>Document Front Side (सामने)</span>
                      </span>
                      {(viewModalItem.documentFront || viewModalItem.idProofUrl || viewModalItem.idProofDocument) && (
                        <button
                          onClick={() => setSelectedProof(getContentImageUrl(viewModalItem.documentFront || viewModalItem.idProofUrl || viewModalItem.idProofDocument))}
                          className="text-[10px] text-blue-600 font-extrabold hover:underline"
                        >
                          Zoom Full
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white h-44 flex items-center justify-center">
                      {(viewModalItem.documentFront || viewModalItem.idProofUrl || viewModalItem.idProofDocument) ? (
                        <img
                          src={getContentImageUrl(viewModalItem.documentFront || viewModalItem.idProofUrl || viewModalItem.idProofDocument)}
                          alt="Document Front"
                          className="h-full w-full object-contain cursor-pointer hover:scale-105 transition"
                          onClick={() => setSelectedProof(getContentImageUrl(viewModalItem.documentFront || viewModalItem.idProofUrl || viewModalItem.idProofDocument))}
                        />
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Front Scan Uploaded</span>
                      )}
                    </div>
                  </div>

                  {/* Back Side Document */}
                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-black">
                      <span className="flex items-center gap-1">
                        <FiFileText className="text-[#dc2626] w-3.5 h-3.5" />
                        <span>Document Back Side (पीछे)</span>
                      </span>
                      {viewModalItem.documentBack && (
                        <button
                          onClick={() => setSelectedProof(getContentImageUrl(viewModalItem.documentBack))}
                          className="text-[10px] text-blue-600 font-extrabold hover:underline"
                        >
                          Zoom Full
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white h-44 flex items-center justify-center">
                      {viewModalItem.documentBack ? (
                        <img
                          src={getContentImageUrl(viewModalItem.documentBack)}
                          alt="Document Back"
                          className="h-full w-full object-contain cursor-pointer hover:scale-105 transition"
                          onClick={() => setSelectedProof(getContentImageUrl(viewModalItem.documentBack))}
                        />
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Back Scan Uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setViewModalItem(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Close Audit
              </button>

              <div className="flex items-center gap-2">
                {((viewModalItem.status || "pending").toLowerCase() === "pending") && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const v = viewModalItem;
                        setViewModalItem(null);
                        setRejectModalItem(v);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <FiX className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                    <button
                      type="button"
                      disabled={processingId === (viewModalItem._id || viewModalItem.id)}
                      onClick={async () => {
                        const id = viewModalItem._id || viewModalItem.id;
                        await handleApprove(id);
                        setViewModalItem(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#0b8026] hover:bg-[#075018] text-white font-black text-xs shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <FiCheck className="w-4 h-4" />
                      <span>Approve &amp; Issue Offer Letter</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ID Proof Preview Modal */}
      {selectedProof && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProof(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl relative text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              title="Close Preview"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between gap-4 mb-4 pr-10">
              <div>
                <h3 className="font-black text-sm text-black">National Identity Document Verification</h3>
                <p className="text-[11px] text-slate-500">Examine original government-issued ID card or credential</p>
              </div>

              <a
                href={selectedProof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-85 max-h-[70vh]">
              {isPdfDocument(selectedProof) ? (
                <iframe
                  src={selectedProof}
                  title="PDF Identity Document"
                  className="w-full h-[65vh] rounded-xl border-0"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedProof}
                  alt="Government ID Proof"
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProof(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setRejectModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiXCircle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Reject Volunteer Application</h3>
            <p className="text-xs text-slate-600">
              Please enter the reason for rejecting volunteer application from{" "}
              <strong>{rejectModalItem.user?.name || rejectModalItem.name || "applicant"}</strong>.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Inconclusive government ID, age verification required, incomplete details..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingId !== null}
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {processingId !== null ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Delete Volunteer Application &amp; Files</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the volunteer application for{" "}
              <strong>{deleteModalItem.user?.name || deleteModalItem.name || "applicant"}</strong>?
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-left text-[11px] text-rose-800 space-y-1">
              <span className="font-bold block">⚠️ Permanent File Cleanup Action:</span>
              <p>Any attached government identity proofs, resume, or credentials will be permanently erased from the server uploads directory.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingId !== null}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {processingId !== null ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Certificate Modal */}
      {certModalItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setCertModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-black">Offer Official Certificate</h3>
                <p className="text-xs text-slate-500">
                  Recipient: <strong>{certModalItem.user?.name || certModalItem.name}</strong> ({certModalItem.user?.email || certModalItem.email})
                </p>
              </div>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role on Certificate
                </label>
                <input
                  type="text"
                  required
                  value={certRole}
                  onChange={(e) => setCertRole(e.target.value)}
                  placeholder="e.g. Dedicated Youth Volunteer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-red-500 text-black bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. Certificate of Appreciation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-red-500 text-black bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason / Citation
                </label>
                <textarea
                  rows={3}
                  required
                  value={certReason}
                  onChange={(e) => setCertReason(e.target.value)}
                  placeholder="In recognition of outstanding dedication..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-red-500 text-black bg-slate-50/50"
                />
              </div>

              <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 text-xs text-red-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <FiCheckCircle className="text-red-600" />
                  Instant Minting &amp; Delivery:
                </p>
                <p className="text-[11px] text-slate-600">
                  A verifiable certificate with digital hash and QR code will be generated and made available on the volunteer&apos;s profile and sent to their email.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCertModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issuingCert}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {issuingCert ? "Minting Certificate..." : "Mint & Send Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
