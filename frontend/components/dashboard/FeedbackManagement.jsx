"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiEye,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUser,
  FiX,
  FiXCircle,
  FiAlertCircle
} from "react-icons/fi";
import api from "@/services/api";

function StarRating({ rating = 5 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'approved' | 'pending' | 'rejected'
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    userRole: "Supporter",
    rating: 5,
    comment: "",
    status: "Approved"
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/feedback");
      const list = res.data?.data || res.data?.items || [];
      setFeedbacks(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      name: "",
      email: "",
      userRole: "Supporter",
      rating: 5,
      comment: "",
      status: "Approved"
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      userRole: item.userRole || "Supporter",
      rating: item.rating || 5,
      comment: item.comment || "",
      status: item.status || "Approved"
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) {
      toast.error("Name and Review Comment are required");
      return;
    }
    try {
      setSubmitting(true);
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await api.put(`/feedback/${id}`, form);
        toast.success("Review updated successfully!");
      } else {
        await api.post("/feedback", form);
        toast.success("Review published successfully!");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/feedback/${id}`, { status });
      toast.success(`Review ${status.toLowerCase()}!`);
      loadData();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    try {
      const id = deleteModalItem._id || deleteModalItem.id;
      await api.delete(`/feedback/${id}`);
      toast.success("Review deleted successfully!");
      setDeleteModalItem(null);
      loadData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = feedbacks.filter((f) => {
    const status = (f.status || "Pending").toLowerCase();
    const matchStatus = activeTab === "all" || status === activeTab.toLowerCase();
    const q = searchQuery.toLowerCase();
    const name = (f.name || "").toLowerCase();
    const comment = (f.comment || "").toLowerCase();
    return matchStatus && (name.includes(q) || comment.includes(q));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
            <span>Public Testimonials</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">Reviews &amp; Feedback</h1>
          <p className="text-xs text-slate-700 mt-1">
            Moderate community reviews, approve supporter testimonials, and curate donor stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by reviewer name or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["All", "Approved", "Pending", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setActiveTab(st.toLowerCase())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === st.toLowerCase()
                  ? "bg-black text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black"
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading testimonials...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No reviews found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((f) => {
              const id = f._id || f.id;
              const status = f.status || "Pending";
              return (
                <div
                  key={id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between hover:shadow-md transition text-black"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <StarRating rating={f.rating || 5} />
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${status.toLowerCase() === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : status.toLowerCase() === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 italic leading-relaxed">
                      "{f.comment}"
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-black">{f.name}</div>
                        <div className="text-[10px] text-slate-500">{f.userRole || "Supporter"}</div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {f.createdAt ? new Date(f.createdAt).toLocaleDateString("en-IN") : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {status !== "Approved" && (
                        <button
                          onClick={() => handleStatusChange(id, "Approved")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {status !== "Rejected" && (
                        <button
                          onClick={() => handleStatusChange(id, "Rejected")}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(f)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-white"
                        title="Edit"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteModalItem(f)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative text-black">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-black mb-1">
              {editingItem ? "Edit Testimonial" : "Add Testimonial"}
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              Publish or curate community feedback and reviews.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-black">
              <div>
                <label className="font-extrabold text-black block mb-1">Reviewer Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Role / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Regular Contributor / Youth Volunteer"
                  value={form.userRole}
                  onChange={(e) => setForm({ ...form, userRole: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Star Rating (1 - 5)</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-bold text-black bg-white"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Review / Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Write the testimonial message..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Publication Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-bold text-black bg-white"
                >
                  <option value="Approved">Approved (Public)</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Review" : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Delete Review?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete review from <strong>{deleteModalItem.name}</strong>?
            </p>
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
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
