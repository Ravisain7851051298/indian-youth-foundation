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
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
            <FiShield className="w-3.5 h-3.5" />
            <span>Grassroots Field Operations</span>
          </div>
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "bg-slate-100 text-black hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.key
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Skills &amp; Motivation</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">ID Proof Document</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filtered.map((v) => {
                  const id = v._id || v.id;
                  const proof = v.idProofDocument || v.idProofUrl || v.documentUrl;
                  const status = (v.status || "pending").toLowerCase();
                  const isApproved = status === "approved" || status === "active";
                  const isRejected = status === "rejected";
                  const isPending = !isApproved && !isRejected;

                  const name = v.user?.name || v.name || "Volunteer Applicant";
                  const email = v.user?.email || v.email || "-";
                  const phone = v.user?.phone || v.phone || "-";
                  const skillsDisplay = formatSkills(v.skills) || "Social Work & Volunteering";
                  const assignedId = v.assignedVolunteerId || v.user?.memberId;

                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black text-sm flex items-center gap-1.5">
                          <span>{name}</span>
                          {isApproved && assignedId && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                              {assignedId}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <FiMail className="w-3 h-3 text-slate-400" />
                            {email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FiPhone className="w-3 h-3 text-slate-400" />
                            {phone}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
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

                      <td className="py-3.5 px-4 text-slate-800 font-semibold whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="w-3 h-3 text-slate-400" />
                          {v.availability || "Weekends / Flexible"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {proof ? (
                          <button
                            onClick={() => setSelectedProof(getContentImageUrl(proof))}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px] transition cursor-pointer border border-red-200"
                          >
                            {isPdfDocument(proof) ? (
                              <FiFileText className="w-3.5 h-3.5" />
                            ) : (
                              <FiEye className="w-3.5 h-3.5" />
                            )}
                            <span>{isPdfDocument(proof) ? "Inspect PDF" : "View ID Proof"}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No Document</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              isApproved
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
                            <p className="text-[10px] text-rose-600 max-w-[160px] truncate" title={v.rejectionReason}>
                              Reason: {v.rejectionReason}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-IN") : "-"}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(id)}
                                disabled={processingId === id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50 shadow-sm"
                              >
                                <FiCheck className="w-3.5 h-3.5" />
                                <span>{processingId === id ? "Approving..." : "Approve"}</span>
                              </button>
                              <button
                                onClick={() => setRejectModalItem(v)}
                                disabled={processingId === id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50 shadow-sm"
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition cursor-pointer shadow-sm"
                              title="Offer Official Certificate"
                            >
                              <FiAward className="w-3.5 h-3.5" />
                              <span>Offer Certificate</span>
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteModalItem(v)}
                            disabled={processingId === id}
                            title="Delete Volunteer Application & ID Documents"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer border border-transparent hover:border-rose-200"
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

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[340px] max-h-[70vh]">
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
                  A verifiable certificate with digital hash and QR code will be generated and made available on the volunteer's profile and sent to their email.
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
