"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
  FiXCircle,
  FiAlertCircle,
  FiAward,
  FiFileText,
  FiCamera,
  FiExternalLink,
  FiCreditCard
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

export default function MembershipManagement() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [viewModalItem, setViewModalItem] = useState(null);
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [approvalNotice, setApprovalNotice] = useState(null);

  // Certificate Modal State
  const [certModalItem, setCertModalItem] = useState(null);
  const [certTitle, setCertTitle] = useState("Certificate of Official Membership & Recognition");
  const [certReason, setCertReason] = useState("In recognition of dedicated membership, institutional support, and community leadership.");
  const [certRole, setCertRole] = useState("Official Member");
  const [issuingCert, setIssuingCert] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/members");
      const list = res.data?.applications || res.data?.data || [];
      setMemberships(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      let res;
      try {
        res = await api.put(`/applications/members/${id}/approve`);
      } catch (e) {
        res = await api.put(`/members/${id}/approve`);
      }
      const successMsg = res?.data?.message || "सदस्यता सफलतापूर्वक स्वीकृत (Approved) कर दी गई है! आईडी कार्ड और नियुक्ति पत्र ईमेल पर भेज दिया गया है।";
      setApprovalNotice(successMsg);
      toast.success(successMsg, { duration: 6000 });
      // Optimistically mark application as approved in table
      setMemberships((prev) =>
        prev.map((m) => ((m._id === id || m.id === id) ? { ...m, status: 'approved' } : m))
      );
      loadData();
      // Auto refresh the page so all dashboard metrics and tables sync up
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Approval failed");
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
        res = await api.put(`/applications/members/${id}/reject`, { reason: rejectReason });
      } catch (e) {
        res = await api.put(`/members/${id}/reject`, { reason: rejectReason });
      }
      toast.success(res?.data?.message || "Application rejected");
      setRejectModalItem(null);
      setRejectReason("");
      setMemberships((prev) =>
        prev.map((m) => ((m._id === id || m.id === id) ? { ...m, status: 'rejected' } : m))
      );
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Rejection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    try {
      const id = deleteModalItem._id || deleteModalItem.id;
      setProcessingId(id);
      const res = await api.delete(`/applications/members/${id}`);
      toast.success(res.data?.message || "Membership application and payment files deleted successfully!");
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
        toast.success("Certificate of Membership issued and emailed!");
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

  const filtered = memberships.filter((m) => {
    const status = (m.status || "pending").toLowerCase();
    const matchStatus = activeTab === "all" || status === activeTab.toLowerCase();
    const q = searchQuery.toLowerCase();
    const name = (m.user?.name || m.name || "").toLowerCase();
    const email = (m.user?.email || m.email || "").toLowerCase();
    const txn = (m.transactionId || m.utrNumber || "").toLowerCase();
    return matchStatus && (name.includes(q) || email.includes(q) || txn.includes(q));
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Membership Management</h1>
          <p className="text-xs text-slate-700 mt-1">
            Review membership applications, verify payment proofs, and issue dual-sided QR ID cards.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer self-start md:self-auto"
          title="Refresh"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
        </button>
      </div>

      {/* Approval Success Banner */}
      {approvalNotice && (
        <div className="mx-3 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 font-bold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-black text-emerald-950">{approvalNotice}</p>
              <p className="text-xs text-emerald-750 font-medium mt-0.5">डैशबोर्ड अपडेट करने के लिए पेज रिफ्रेश हो रहा है...</p>
            </div>
          </div>
          <FiRefreshCw className="w-5 h-5 text-emerald-700 animate-spin shrink-0" />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Pending", "Approved", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setActiveTab(st.toLowerCase())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeTab === st.toLowerCase()
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-slate-100 text-black hover:bg-red-50 hover:text-red-600"
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading memberships...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No membership applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">Applicant</th>
                  <th className="py-3 px-3.5">KYC Document</th>
                  <th className="py-3 px-3.5">Plan / Fee</th>
                  <th className="py-3 px-3.5">Transaction / UTR</th>
                  <th className="py-3 px-3.5">Payment Proof</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filtered.map((m) => {
                  const id = m._id || m.id;
                  const screenshot = m.paymentScreenshot || m.screenshotUrl;
                  const photo = m.photoUrl || m.user?.photoUrl;
                  const status = m.status || "pending";
                  const name = m.user?.name || m.name || "Member Applicant";
                  const email = m.user?.email || m.email || "-";
                  const phone = m.user?.phone || m.phone || "-";
                  const docType = m.documentType || "Aadhaar Card";
                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            onClick={() => photo && setSelectedScreenshot(getContentImageUrl(photo))}
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
                          {(m.documentFront || m.documentBack || m.idProofUrl) ? (
                            <button
                              onClick={() => setViewModalItem(m)}
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
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-black">{m.planName || "Annual Membership"}</div>
                        <div className="text-[11px] text-slate-600">₹{m.feePaid || m.fee || 250}</div>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-slate-800">
                        {m.transactionId || m.utrNumber || "-"}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {screenshot ? (
                          <button
                            onClick={() => setSelectedScreenshot(getContentImageUrl(screenshot))}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px] transition cursor-pointer border border-red-200"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">No Proof</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${status.toLowerCase() === "approved" || status.toLowerCase() === "active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : status.toLowerCase() === "rejected"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewModalItem(m)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition cursor-pointer border border-blue-200 shadow-2xs"
                            title="Inspect full details, photo and verification documents"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {status.toLowerCase() === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(id)}
                                disabled={processingId === id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50 shadow-xs"
                              >
                                <FiCheck className="w-3.5 h-3.5" />
                                <span>{processingId === id ? "Approving..." : "Approve"}</span>
                              </button>
                              <button
                                onClick={() => setRejectModalItem(m)}
                                disabled={processingId === id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50 shadow-xs"
                              >
                                <FiX className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {(status.toLowerCase() === "approved" || status.toLowerCase() === "active") && (
                            <button
                              onClick={() => {
                                setCertModalItem(m);
                                setCertRole(m.user?.designation || m.planName || "Official Foundation Member");
                                setCertTitle("Certificate of Official Membership & Recognition");
                                setCertReason("In honor of official membership, lifelong commitment to community welfare, and support of the Yuva Kranti Dal.");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition cursor-pointer shadow-xs"
                              title="Offer Official Member Certificate"
                            >
                              <FiAward className="w-3.5 h-3.5" />
                              <span>Certificate</span>
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteModalItem(m)}
                            disabled={processingId === id}
                            title="Delete Application and Attached Payment Proof"
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

      {/* View Application & KYC Inspection Modal */}
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
                    Membership KYC &amp; Verification Audit
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applicant ID: <span className="font-mono font-bold text-slate-800">{viewModalItem._id || viewModalItem.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${(viewModalItem.status || "pending").toLowerCase() === "approved"
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

              {/* Applicant Overview Card */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div
                  onClick={() => (viewModalItem.photoUrl || viewModalItem.user?.photoUrl) && setSelectedScreenshot(getContentImageUrl(viewModalItem.photoUrl || viewModalItem.user?.photoUrl))}
                  className="w-20 h-20 rounded-2xl border-2 border-[#0b8026] bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#0b8026] transition"
                  title="Click to zoom photo"
                >
                  {(viewModalItem.photoUrl || viewModalItem.user?.photoUrl) ? (
                    <img
                      src={getContentImageUrl(viewModalItem.photoUrl || viewModalItem.user?.photoUrl)}
                      alt="Applicant Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left text-xs">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="font-black text-black text-base">
                      {viewModalItem.user?.name || viewModalItem.name || "Member Applicant"}
                    </h4>
                    {viewModalItem.assignedMemberId && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {viewModalItem.assignedMemberId}
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
                    {viewModalItem.address && <span><strong>Address:</strong> {viewModalItem.address}</span>}
                  </div>
                </div>
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
                      {(viewModalItem.documentFront || viewModalItem.idProofUrl) && (
                        <button
                          onClick={() => setSelectedScreenshot(getContentImageUrl(viewModalItem.documentFront || viewModalItem.idProofUrl))}
                          className="text-[10px] text-blue-600 font-extrabold hover:underline"
                        >
                          Zoom Full
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white h-44 flex items-center justify-center">
                      {(viewModalItem.documentFront || viewModalItem.idProofUrl) ? (
                        <img
                          src={getContentImageUrl(viewModalItem.documentFront || viewModalItem.idProofUrl)}
                          alt="Document Front"
                          className="h-full w-full object-contain cursor-pointer hover:scale-105 transition"
                          onClick={() => setSelectedScreenshot(getContentImageUrl(viewModalItem.documentFront || viewModalItem.idProofUrl))}
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
                          onClick={() => setSelectedScreenshot(getContentImageUrl(viewModalItem.documentBack))}
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
                          onClick={() => setSelectedScreenshot(getContentImageUrl(viewModalItem.documentBack))}
                        />
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Back Scan Uploaded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Proof Verification Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <FiCreditCard className="text-red-600 w-4 h-4" />
                    <span>Payment Verification &amp; UTR</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-700">
                    Plan: <strong className="text-red-600">{viewModalItem.planName || "Annual Membership"}</strong> (₹{viewModalItem.feePaid || viewModalItem.fee || 250})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-bold block text-[11px]">Transaction ID / UTR Number:</span>
                      <span className="font-mono font-black text-sm text-slate-900">
                        {viewModalItem.transactionId || viewModalItem.utrNumber || "N/A"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-bold block text-[11px]">Payment Method:</span>
                      <span className="font-semibold text-slate-800">{viewModalItem.paymentMethod || "UPI"}</span>
                    </div>
                    {viewModalItem.notes && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold block text-[11px]">Applicant Notes:</span>
                        <span className="text-slate-800">{viewModalItem.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Screenshot Preview Card */}
                  <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-black">
                      <span>Payment Screenshot</span>
                      {(viewModalItem.paymentScreenshot || viewModalItem.screenshotUrl) && (
                        <button
                          onClick={() => setSelectedScreenshot(getContentImageUrl(viewModalItem.paymentScreenshot || viewModalItem.screenshotUrl))}
                          className="text-[10px] text-blue-600 font-extrabold hover:underline"
                        >
                          Zoom Full
                        </button>
                      )}
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white h-36 flex items-center justify-center">
                      {(viewModalItem.paymentScreenshot || viewModalItem.screenshotUrl) ? (
                        <img
                          src={getContentImageUrl(viewModalItem.paymentScreenshot || viewModalItem.screenshotUrl)}
                          alt="Payment Screenshot"
                          className="h-full w-full object-contain cursor-pointer hover:scale-105 transition"
                          onClick={() => setSelectedScreenshot(getContentImageUrl(viewModalItem.paymentScreenshot || viewModalItem.screenshotUrl))}
                        />
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Payment Screenshot</span>
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
                {(viewModalItem.status || "pending").toLowerCase() === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const m = viewModalItem;
                        setViewModalItem(null);
                        setRejectModalItem(m);
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
                      <span>Approve &amp; Issue ID Card</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h3 className="font-black text-sm text-black mb-3">Membership Payment Proof</h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-75">
              <img
                src={selectedScreenshot}
                alt="Membership Payment Proof"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiXCircle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Reject Membership Application</h3>
            <p className="text-xs text-slate-600">
              Please enter the reason for rejecting application from{" "}
              <strong>{rejectModalItem.user?.name || rejectModalItem.name || "applicant"}</strong>.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete address proof, payment reference not credited..."
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Delete Application &amp; Files</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the membership application for{" "}
              <strong>{deleteModalItem.user?.name || deleteModalItem.name || "applicant"}</strong>?
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-left text-[11px] text-rose-800 space-y-1">
              <span className="font-bold block">⚠️ Permanent File Cleanup Action:</span>
              <p>Any attached payment screenshots or verification proof will be immediately and permanently removed from the server uploads directory.</p>
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
                <h3 className="font-black text-base text-black">Offer Membership Certificate</h3>
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
                  placeholder="e.g. Life Member / Youth Leader"
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
                  placeholder="e.g. Certificate of Official Membership & Recognition"
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
                  placeholder="In recognition of dedicated membership..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-red-500 text-black bg-slate-50/50"
                />
              </div>

              <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 text-xs text-red-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <FiCheckCircle className="text-red-600" />
                  Instant Minting &amp; Delivery:
                </p>
                <p className="text-[11px] text-slate-600">
                  A verifiable certificate with digital hash and QR code will be generated and made available on the member's profile and sent to their email.
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
