"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiX,
  FiImage,
  FiVideo
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

const CATEGORIES = [
  "All Categories",
  "Field Logistics & Aid",
  "ID Card / Credential Issue",
  "Membership / Donation Inquiry",
  "Child Education Sponsorship",
  "General Grievance",
  "Other"
];

const STATUS_TABS = ["All", "Pending Review", "In Progress", "Resolved", "Closed"];

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusDraft, setStatusDraft] = useState("Pending Review");
  const [remarksDraft, setRemarksDraft] = useState("");
  const [savingResolution, setSavingResolution] = useState(false);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaints");
      const list = res.data?.grievances || res.data?.data || [];
      setComplaints(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const openTicketModal = (t) => {
    setSelectedTicket(t);
    setStatusDraft(t.status || "Pending Review");
    setRemarksDraft(t.adminAnswer || t.adminRemarks || t.resolution || t.resolutionNotes || "");
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      setSavingResolution(true);
      const id = selectedTicket._id || selectedTicket.id;
      await api.put(`/complaints/${id}`, {
        status: statusDraft,
        adminAnswer: remarksDraft,
        adminRemarks: remarksDraft,
        resolutionNotes: remarksDraft,
        resolution: remarksDraft
      });
      toast.success("Ticket answer & resolution saved successfully!");
      setSelectedTicket(null);
      loadComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setSavingResolution(false);
    }
  };

  const filtered = complaints.filter((t) => {
    const matchStatus = activeStatus === "All" || (t.status || "").toLowerCase() === activeStatus.toLowerCase();
    const matchCat = categoryFilter === "All Categories" || (t.category || "") === categoryFilter;
    const q = searchQuery.toLowerCase();
    const name = (t.name || t.fullName || t.user?.name || "").toLowerCase();
    const subj = (t.subject || t.title || "").toLowerCase();
    const ticketNo = String(t.ticketNumber || t._id || "").toLowerCase();
    return matchStatus && matchCat && (name.includes(q) || subj.includes(q) || ticketNo.includes(q));
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Complaints &amp; Grievances</h1>
          <p className="text-xs text-slate-700 mt-1">
            Redressal desk for member inquiries, field issues, and public complaints.
          </p>
        </div>

        <button
          onClick={loadComplaints}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer self-start md:self-auto"
          title="Refresh"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ticket number, name, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-black"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            {STATUS_TABS.map((st) => (
              <button
                key={st}
                onClick={() => setActiveStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${activeStatus === st
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading grievances...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No grievance tickets match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-black font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">Ticket</th>
                  <th className="py-3 px-3.5">Complainant</th>
                  <th className="py-3 px-3.5">Category</th>
                  <th className="py-3 px-3.5">Subject</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-black">
                {filtered.map((t) => {
                  const id = t._id || t.id;
                  const status = t.status || "Pending Review";
                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3.5 font-mono font-bold text-red-700 whitespace-nowrap">
                        #{t.ticketNumber || (id ? id.slice(-6).toUpperCase() : "NA")}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-extrabold text-black">{t.name || t.fullName || t.user?.name || "Anonymous"}</div>
                        <div className="text-[11px] text-slate-600">{t.email || t.user?.email || "-"}</div>
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-800 whitespace-nowrap">{t.category || "General"}</td>
                      <td className="py-3 px-3.5 max-w-[200px]">
                        <div className="font-bold text-black line-clamp-1">{t.subject || t.title}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">{t.description || t.message}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {(t.imageUrl || (Array.isArray(t.attachments) && t.attachments.some(a => /\.(jpe?g|png|webp|gif)$/i.test(a)))) && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-700 font-bold border border-red-200">
                              <FiImage className="w-3 h-3" /> Photo
                            </span>
                          )}
                          {(t.videoUrl || (Array.isArray(t.attachments) && t.attachments.some(a => /\.(mp4|webm|mov|ogg)$/i.test(a)))) && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-bold border border-purple-200">
                              <FiVideo className="w-3 h-3" /> Video
                            </span>
                          )}
                          {(t.adminAnswer || t.resolutionNotes) && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              Answered
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${status.toLowerCase().includes("resolved") || status.toLowerCase().includes("closed")
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : status.toLowerCase().includes("progress")
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <button
                          onClick={() => openTicketModal(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
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

      {/* Ticket Modal */}
      {selectedTicket && (() => {
        const isVideo = (url) => /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(url || "");
        const images = [];
        const videos = [];

        if (selectedTicket.imageUrl) images.push(getContentImageUrl(selectedTicket.imageUrl));
        if (selectedTicket.videoUrl) videos.push(getContentImageUrl(selectedTicket.videoUrl));

        const extraAtts = Array.isArray(selectedTicket.attachments)
          ? selectedTicket.attachments
          : selectedTicket.attachment ? [selectedTicket.attachment] : [];

        extraAtts.forEach((att) => {
          if (!att) return;
          const url = getContentImageUrl(att);
          if (isVideo(url)) {
            if (!videos.includes(url)) videos.push(url);
          } else {
            if (!images.includes(url)) images.push(url);
          }
        });

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-black space-y-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-black uppercase text-red-700 bg-red-50 px-2.5 py-1 rounded-full inline-block mb-1">
                  Ticket #{selectedTicket.ticketNumber || (selectedTicket._id ? selectedTicket._id.slice(-6).toUpperCase() : "NA")}
                </span>
                <h2 className="text-xl font-black text-black">{selectedTicket.subject || selectedTicket.title}</h2>
                <div className="text-xs text-slate-600 mt-1">
                  From: <strong>{selectedTicket.name || selectedTicket.fullName || "User"}</strong> ({selectedTicket.email} • {selectedTicket.phone || "No phone"})
                </div>
              </div>

              {/* Complainant Message */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-extrabold text-black block">Complainant Message / Details:</span>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {selectedTicket.description || selectedTicket.message}
                </p>
              </div>

              {/* Uploaded Evidence Media (Images & Videos) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FiShield className="text-red-600 w-3.5 h-3.5" />
                    Uploaded Evidence &amp; Media Files
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {images.length} Image{images.length === 1 ? "" : "s"} • {videos.length} Video{videos.length === 1 ? "" : "s"}
                  </span>
                </div>

                {images.length === 0 && videos.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">No image or video files attached to this grievance.</p>
                ) : (
                  <div className="space-y-3">
                    {/* Images */}
                    {images.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                          <FiImage className="w-3.5 h-3.5" /> Photos Attached:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {images.map((imgUrl, idx) => (
                            <a
                              key={idx}
                              href={imgUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="group block rounded-xl overflow-hidden border border-slate-200 bg-white relative aspect-video hover:border-red-500 transition shadow-xs"
                            >
                              <img
                                src={imgUrl}
                                alt={`Evidence ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                                View Full
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {videos.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
                          <FiVideo className="w-3.5 h-3.5" /> Videos Attached:
                        </span>
                        <div className="space-y-2">
                          {videos.map((vidUrl, idx) => (
                            <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                              <video
                                src={vidUrl}
                                controls
                                preload="metadata"
                                className="w-full max-h-56 object-contain"
                              />
                              <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-[11px] text-white">
                                <span className="font-mono text-slate-300 text-[10px]">Evidence Video #{idx + 1}</span>
                                <a
                                  href={vidUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-red-400 hover:text-red-300 font-bold underline"
                                >
                                  Open in New Tab
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Answer & Resolution Form */}
              <form onSubmit={handleSaveResolution} className="space-y-4 text-xs text-black pt-2">
                <div>
                  <label className="font-extrabold text-black block mb-1">Ticket Status</label>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-bold text-black bg-white"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-extrabold text-black block">
                      Official Admin Answer / Redressal Response
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Visible to Complainant on Portal
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={remarksDraft}
                    onChange={(e) => setRemarksDraft(e.target.value)}
                    placeholder="Provide official resolution answer or clarification. The user will be able to read this response when tracking their ticket..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingResolution}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {savingResolution ? "Saving Answer..." : "Save & Post Answer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
