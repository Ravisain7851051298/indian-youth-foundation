'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FiMessageSquare,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiCornerDownRight,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiMail,
  FiCalendar,
  FiShield,
  FiUser,
  FiCheck,
  FiEdit3,
  FiEye
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function AdminFeedbackPage() {
  const {
    feedbacks = [],
    replyFeedback,
    updateFeedbackStatus,
    deleteFeedback,
    currentUser,
    loading
  } = useNGO();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'needs_reply', 'replied', 'approved', 'rejected'
  const [selectedFeedbackForReply, setSelectedFeedbackForReply] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [responderName, setResponderName] = useState(currentUser?.name || 'Ravi Saini (Trustee & President)');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: feedbacks.length,
      needs_reply: feedbacks.filter(f => !f.adminReply).length,
      replied: feedbacks.filter(f => !!f.adminReply).length,
      approved: feedbacks.filter(f => (f.status || 'Approved') === 'Approved').length,
      rejected: feedbacks.filter(f => f.status === 'Rejected').length
    };
  }, [feedbacks]);

  // Filtered and sorted feedbacks (Latest First)
  const filteredFeedbacks = useMemo(() => {
    return feedbacks
      .filter((fb) => {
        // Tab filter
        if (activeTab === 'needs_reply' && fb.adminReply) return false;
        if (activeTab === 'replied' && !fb.adminReply) return false;
        if (activeTab === 'approved' && (fb.status || 'Approved') !== 'Approved') return false;
        if (activeTab === 'rejected' && fb.status !== 'Rejected') return false;

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          fb.name?.toLowerCase().includes(q) ||
          fb.email?.toLowerCase().includes(q) ||
          fb.comment?.toLowerCase().includes(q) ||
          fb.role?.toLowerCase().includes(q) ||
          fb.userRole?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || a.date || 0).getTime();
        const timeB = new Date(b.createdAt || b.date || 0).getTime();
        return timeB - timeA;
      });
  }, [feedbacks, activeTab, searchQuery]);

  // Open Reply Modal
  const openReplyModal = (fb) => {
    setSelectedFeedbackForReply(fb);
    setReplyText(fb.adminReply || '');
    setResponderName(currentUser?.name || fb.repliedBy || 'Ravi Saini (Trustee & President)');
  };

  // Submit Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedFeedbackForReply) return;

    setIsSubmittingReply(true);
    const fbId = selectedFeedbackForReply._id || selectedFeedbackForReply.id;
    const res = await replyFeedback(fbId, {
      reply: replyText.trim(),
      repliedBy: responderName.trim(),
      repliedByRole: currentUser?.role || 'Administrator'
    });

    setIsSubmittingReply(false);
    if (res?.success) {
      setActionSuccess('Official reply posted and synced with public review stream!');
      setSelectedFeedbackForReply(null);
      setReplyText('');
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // Status Change
  const handleStatusChange = async (id, status) => {
    await updateFeedbackStatus(id, status);
    setActionSuccess(`Feedback marked as ${status}`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to permanently delete this feedback review?')) {
      await deleteFeedback(id);
      setActionSuccess('Feedback deleted successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card (VolunteerManagement Standard) */}
      <div className="bg-white p-4 rounded-b-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FiMessageSquare className="text-emerald-700 w-5 h-5" />
            <span>Community Feedback &amp; Review Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit user testimonials, verify ratings, dispatch official management replies, and moderate public feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/feedback"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FiEye className="w-3.5 h-3.5 text-emerald-700" />
            <span>View Public Stream</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition px-2 py-1"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="mx-3 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs animate-fadeIn">
          <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar (VolunteerManagement Standard) */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by reviewer name, email, role, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
        </div>

        {/* Status / Category Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {[
            { key: 'all', label: 'All Reviews', count: counts.all },
            { key: 'needs_reply', label: 'Needs Reply', count: counts.needs_reply },
            { key: 'replied', label: 'Replied', count: counts.replied },
            { key: 'approved', label: 'Approved', count: counts.approved },
            { key: 'rejected', label: 'Rejected', count: counts.rejected }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Container (VolunteerManagement Standard) */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Reviewer Details</th>
                <th className="py-3 px-3.5">Rating &amp; Experience</th>
                <th className="py-3 px-3.5">Official Admin Reply</th>
                <th className="py-3 px-3.5">Date &amp; Time</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right sticky right-0 bg-slate-50 z-20 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No reviews found matching the current search query or filter tab.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => {
                  const id = fb._id || fb.id;
                  const dateVal = fb.createdAt || fb.date;
                  const formattedDate = dateVal ? new Date(dateVal).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
                  const formattedTime = dateVal ? new Date(dateVal).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
                  const status = fb.status || 'Approved';

                  return (
                    <tr key={id} className="group hover:bg-slate-50/80 transition">
                      {/* Reviewer Details */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                            {fb.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{fb.name}</span>
                              {fb.userId && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  Member
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <FiMail className="w-3 h-3 text-emerald-600" />
                              <span className="font-mono">{fb.email || 'No email provided'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Role: {fb.role || fb.userRole || 'Supporter'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rating & Review */}
                      <td className="py-3 px-3.5 max-w-[240px]">
                        <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (fb.rating || 5)
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] font-bold text-slate-500 ml-1">
                            ({fb.rating || 5}/5)
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-2" title={fb.comment}>
                          &ldquo;{fb.comment}&rdquo;
                        </p>
                      </td>

                      {/* Official Admin Reply Status */}
                      <td className="py-3 px-3.5 max-w-[220px]">
                        {fb.adminReply ? (
                          <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-xs space-y-0.5">
                            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                              <span className="flex items-center gap-1">
                                <FiShield className="w-3 h-3 text-emerald-600" />
                                <span>{fb.repliedBy || 'Management'}</span>
                              </span>
                              <span className="text-slate-400">
                                {fb.adminRepliedAt ? new Date(fb.adminRepliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Replied'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 line-clamp-2">
                              {fb.adminReply}
                            </p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <FiClock className="w-3 h-3 text-amber-600" />
                            <span>Awaiting Admin Reply</span>
                          </span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-xs text-slate-500">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <FiCalendar className="w-3 h-3 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                        {formattedTime && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {formattedTime}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Sticky Right Actions Column */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reply / Edit Reply Button */}
                          <button
                            type="button"
                            onClick={() => openReplyModal(fb)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition shadow-2xs cursor-pointer"
                            title="Reply to Review"
                          >
                            <FiCornerDownRight className="w-3.5 h-3.5" />
                            <span>{fb.adminReply ? 'Edit Reply' : 'Reply'}</span>
                          </button>

                          {/* Approve / Reject toggle */}
                          {status !== 'Approved' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(id, 'Approved')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                              title="Approve Review"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}

                          {status === 'Approved' && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(id, 'Rejected')}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                              title="Hide / Reject Review"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Feedback"
                          >
                            <FiTrash2 className="w-4 h-4" />
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

      {/* Admin Reply Modal */}
      {selectedFeedbackForReply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCornerDownRight className="text-emerald-700" />
                <span>Reply to Community Feedback</span>
              </h3>
              <button
                onClick={() => setSelectedFeedbackForReply(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Review Snapshot Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900">{selectedFeedbackForReply.name}</h4>
                  <span className="text-[11px] text-slate-500">{selectedFeedbackForReply.email}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(selectedFeedbackForReply.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 italic border-l-2 border-emerald-600 pl-2.5">
                &ldquo;{selectedFeedbackForReply.comment}&rdquo;
              </p>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Responding Authority Name &amp; Title *
                </label>
                <input
                  type="text"
                  required
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  placeholder="e.g. Ravi Saini (National President & Trustee)"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Official Response Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Express gratitude to the donor/volunteer, explain foundation impact, and reaffirm transparent commitment to nation-building..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  * This reply will be displayed inside an official verification card directly below the user&apos;s review on the public website.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFeedbackForReply(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shadow-md shadow-emerald-700/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <FiCornerDownRight className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? 'Dispatching Reply...' : 'Post Official Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
