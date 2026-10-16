"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUploadCloud,
  FiUser,
  FiX,
  FiXCircle,
  FiAlertCircle
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

export default function DonationManagement() {
  const [activeTab, setActiveTab] = useState("donations"); // 'donations' | 'settings'
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModalDonation, setRejectModalDonation] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteModalDonation, setDeleteModalDonation] = useState(null);

  // Settings State (Bank & UPI QR)
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState("");
  const [bankSettings, setBankSettings] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    upiId: "",
    upiQrImage: ""
  });

  const loadDonations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/donations");
      const list = res.data?.donations || res.data?.data || [];
      setDonations(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await api.get("/settings");
      if (res.data?.success && res.data?.settings) {
        const s = res.data.settings;
        setBankSettings({
          accountName: s.bankDetails?.accountName || "",
          accountNumber: s.bankDetails?.accountNumber || "",
          ifscCode: s.bankDetails?.ifscCode || "",
          bankName: s.bankDetails?.bankName || "",
          branch: s.bankDetails?.branch || "",
          upiId: s.upiId || "",
          upiQrImage: s.upiQrImage || ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
    loadSettings();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/donations/${id}/approve`);
      toast.success(res.data?.message || "Donation approved and 80G receipt issued!");
      loadDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModalDonation) return;
    try {
      setActionLoading(true);
      const id = rejectModalDonation._id || rejectModalDonation.id;
      const res = await api.put(`/donations/${id}/reject`, { reason: rejectReason });
      toast.success(res.data?.message || "Donation rejected");
      setRejectModalDonation(null);
      setRejectReason("");
      loadDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDonation = async () => {
    if (!deleteModalDonation) return;
    try {
      setActionLoading(true);
      const id = deleteModalDonation._id || deleteModalDonation.id;
      await api.delete(`/donations/${id}`);
      toast.success("Donation record and associated files deleted");
      setDeleteModalDonation(null);
      loadDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQrSelection = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const handleRemoveQr = () => {
    setQrFile(null);
    setQrPreview("");
    setBankSettings((prev) => ({ ...prev, upiQrImage: "" }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      let upiQrImage = bankSettings.upiQrImage;

      if (qrFile) {
        const formData = new FormData();
        formData.append("file", qrFile);
        const upRes = await api.post("/upload", formData);
        if (upRes.data?.success && upRes.data?.url) {
          upiQrImage = upRes.data.url;
        }
      }

      await api.put("/settings", {
        upiId: bankSettings.upiId,
        upiQrImage,
        bankDetails: {
          accountName: bankSettings.accountName,
          accountNumber: bankSettings.accountNumber,
          ifscCode: bankSettings.ifscCode,
          bankName: bankSettings.bankName,
          branch: bankSettings.branch
        }
      });

      toast.success("Banking & UPI credentials updated successfully!");
      setQrFile(null);
      setQrPreview("");
      loadSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchStatus = statusFilter === "All" || d.status?.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const donorName = (d.donor?.name || d.donorName || "").toLowerCase();
    const txn = (d.transactionId || d.receiptNumber || "").toLowerCase();
    return matchStatus && (donorName.includes(q) || txn.includes(q));
  });

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">80G Donation Management</h1>
          <p className="text-xs text-slate-700 mt-1">
            Audit contributor payment proofs, verify bank transfers, and issue automated 80G tax receipts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === "donations"
                ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                : "text-slate-700 hover:text-black"
              }`}
          >
            Donations List
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === "settings"
                ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                : "text-slate-700 hover:text-black"
              }`}
          >
            UPI &amp; Bank Settings
          </button>
        </div>
      </div>

      {activeTab === "donations" ? (
        <>
          {/* Search & Status Filters */}
          <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by contributor name or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["All", "Pending", "Approved", "Rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${statusFilter === st
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                >
                  {st}
                </button>
              ))}
              <button
                onClick={loadDonations}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="Refresh"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-700 text-xs space-y-2">
                <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
                <p>Loading donations...</p>
              </div>
            ) : filteredDonations.length === 0 ? (
              <div className="p-12 text-center text-slate-700 text-xs space-y-2">
                <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
                <p className="font-semibold text-black">No donations match your filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                    <tr>
                      <th className="py-3 px-3.5">Contributor</th>
                      <th className="py-3 px-3.5">Amount</th>
                      <th className="py-3 px-3.5">Transaction / UTR</th>
                      <th className="py-3 px-3.5">Payment Proof</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5">Date</th>
                      <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-black">
                    {filteredDonations.map((d) => {
                      const id = d._id || d.id;
                      const screenshot = d.screenshotUrl || d.paymentScreenshot;
                      const status = d.status || "Pending";
                      return (
                        <tr key={id} className="group hover:bg-slate-50/80 transition">
                          <td className="py-3 px-3.5">
                            <div className="font-extrabold text-black text-sm">{d.donorName || d.donor?.name || "Anonymous"}</div>
                            <div className="text-[11px] text-slate-600">{d.donorEmail || d.donor?.email} • {d.donorPhone || d.donor?.phone}</div>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-black text-sm text-black">₹{Number(d.amount || 0).toLocaleString("en-IN")}</span>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-[11px] font-bold text-slate-800">
                            {d.transactionId || d.utrNumber || "-"}
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
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${status.toLowerCase() === "approved"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : status.toLowerCase() === "rejected"
                                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}
                            >
                              {status}
                            </span>
                            {status.toLowerCase() === "rejected" && d.rejectionReason && (
                              <div className="text-[10px] text-rose-600 font-bold mt-1 max-w-[180px]">
                                Reason: {d.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                            {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : "-"}
                          </td>
                          <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center justify-end gap-1.5">
                              {status.toLowerCase() === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(id)}
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50 shadow-xs"
                                  >
                                    <FiCheck className="w-3.5 h-3.5" />
                                    <span>{actionLoading ? "Approving..." : "Approve"}</span>
                                  </button>
                                  <button
                                    onClick={() => setRejectModalDonation(d)}
                                    disabled={actionLoading}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50 shadow-xs"
                                  >
                                    <FiX className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setDeleteModalDonation(d)}
                                disabled={actionLoading}
                                title="Delete Donation Record"
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
        </>
      ) : (
        /* Bank & UPI QR Settings Form */
        <div className="bg-white mx-3 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl text-black">
          <h2 className="text-xl font-black text-black mb-1">NGO Banking &amp; UPI QR Credentials</h2>
          <p className="text-xs text-slate-600 mb-6">
            Configure the bank account details and UPI QR code shown on public donation pages.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs text-black">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-black block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={bankSettings.accountName}
                  onChange={(e) => setBankSettings({ ...bankSettings, accountName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={bankSettings.accountNumber}
                  onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankSettings.bankName}
                  onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={bankSettings.ifscCode}
                  onChange={(e) => setBankSettings({ ...bankSettings, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black uppercase bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-black block mb-1">Branch Name</label>
                <input
                  type="text"
                  value={bankSettings.branch}
                  onChange={(e) => setBankSettings({ ...bankSettings, branch: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-extrabold text-black block mb-1">Direct UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g. bharatiyauva@okhdfcbank"
                  value={bankSettings.upiId}
                  onChange={(e) => setBankSettings({ ...bankSettings, upiId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>
            </div>

            {/* UPI QR Image with Display Preview & Remove Image */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-extrabold text-black text-xs block">
                Official UPI QR Code (Display &amp; Remove Option)
              </span>

              {qrPreview || bankSettings.upiQrImage ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                  <img
                    src={qrPreview || getContentImageUrl(bankSettings.upiQrImage)}
                    alt="UPI QR Code Preview"
                    className="w-32 h-32 object-contain rounded-lg border border-slate-300 shadow-sm"
                  />
                  <div className="text-left space-y-2">
                    <div className="text-xs font-bold text-black">Active UPI QR Code</div>
                    <p className="text-[11px] text-slate-600">
                      This QR code is displayed to public donors on the donation portal.
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveQr}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Remove QR Image</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                  <label className="cursor-pointer space-y-1 block">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-xl">
                      <FiUploadCloud />
                    </div>
                    <span className="text-xs font-bold text-red-600 hover:underline block">
                      Click to upload new UPI QR Code image
                    </span>
                    <span className="text-[10px] text-slate-400 block">PNG, JPG or JPEG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrSelection}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? "Saving Settings..." : "Save Banking Credentials"}
              </button>
            </div>
          </form>
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
            <h3 className="font-black text-sm text-black mb-3">Bank Transfer Proof Screenshot</h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[300px]">
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
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
      {rejectModalDonation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiXCircle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Reject Donation Record</h3>
            <p className="text-xs text-slate-600">
              Please enter the reason for rejecting donation from{" "}
              <strong>{rejectModalDonation.donorName || "contributor"}</strong>.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. UTR mismatch with bank statement, unreadable screenshot..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalDonation(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalDonation && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteModalDonation(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Delete Donation Record &amp; Proofs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the donation record of{" "}
              <strong>₹{Number(deleteModalDonation.amount || 0).toLocaleString("en-IN")}</strong> from{" "}
              <strong>{deleteModalDonation.donorName || deleteModalDonation.donor?.name || "contributor"}</strong>?
            </p>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-left text-[11px] text-rose-800 space-y-1">
              <span className="font-bold block">⚠️ Permanent Removal:</span>
              <p>The donation record, any associated payment screenshot, and 80G receipt will be permanently deleted from the database and disk storage.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalDonation(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteDonation}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
