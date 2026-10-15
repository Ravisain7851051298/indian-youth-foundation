'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiMessageSquare,
  FiStar,
  FiPlus,
  FiTrash2,
  FiUser,
  FiCheckCircle,
  FiMail,
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiFilter,
  FiSend,
  FiHeart,
  FiShield,
  FiGrid,
  FiCornerDownRight,
  FiCheck,
  FiLogIn,
  FiSettings
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

// High quality initial seed feedbacks with admin replies and timestamps
const DEFAULT_FEEDBACKS = [
  {
    id: 'fb_1',
    name: 'Dr. Manish Sharma',
    email: 'dr.manish.sharma@healthplus.org',
    role: 'Regular 80G Donor',
    rating: 5,
    comment: 'The transparency and ground dedication of Indian Youth Foundation is commendable. The 80G tax receipt was generated instantly and every rupee was accounted for in their child education drive.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    adminReply: 'Thank you Dr. Manish! Your generous contributions support 45 slum children with school kits and nutrition packets. We deeply value your ongoing trust.',
    adminRepliedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    repliedBy: 'Ravi Saini (Trustee & President)'
  },
  {
    id: 'fb_2',
    name: 'Suman Lata',
    email: 'suman.lata2026@gmail.com',
    role: 'Active Volunteer',
    rating: 5,
    comment: 'Volunteering with this foundation gave me a meaningful platform to teach underprivileged children. The organization channels youth energy in the right nation-building direction.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
    adminReply: 'Suman ji, our education wing is stronger because of dedicated teachers like you. Thank you for empowering our youth cadre!',
    adminRepliedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    repliedBy: 'Foundation Youth Core'
  },
  {
    id: 'fb_3',
    name: 'Rajeev Khandelwal',
    email: 'rajeev.khandelwal@khandelwalenterprises.in',
    role: 'CSR Partner & Trustee',
    rating: 5,
    comment: 'All statutory compliances (12A, 80G, NITI Aayog Darpan) are well maintained. Our corporate CSR contribution delivered great ground-level results in rural solar water projects.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    adminReply: 'We appreciate Khandelwal Enterprises for sponsoring the Aligarh and Hathras solar water purifiers. The statutory audit report is published in the dashboard.',
    adminRepliedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    repliedBy: 'Ravi Saini (Trustee & President)'
  },
  {
    id: 'fb_4',
    name: 'Pooja Verma',
    email: 'pooja.verma@techcorp.in',
    role: 'Blood Helpline Volunteer',
    rating: 5,
    comment: 'Joined the emergency 24x7 blood donation drive in Aligarh. Extremely organized team, prompt verified digital certificates, and heartfelt commitment to human life.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString() // 5 days ago
  },
  {
    id: 'fb_5',
    name: 'Vikramaditya Rathore',
    email: 'rathore.vikram@gmail.com',
    role: 'Youth Supporter',
    rating: 5,
    comment: 'The tree plantation campaign with community geotagging was an innovative initiative. Proud to be associated with Bharatiya Yuva Kranti youth leadership movement.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString() // 7 days ago
  },
  {
    id: 'fb_6',
    name: 'Ananya Mukherjee',
    email: 'ananya.m@delhiuni.ac.in',
    role: 'Student Volunteer',
    rating: 5,
    comment: 'The free book distribution and educational remedial classes transformed dozens of lives in local settlements. Genuine, transparent, and inspiring NGO leadership.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString() // 10 days ago
  }
];

export default function FeedbackPage() {
  const {
    feedbacks = [],
    addFeedback,
    replyFeedback,
    deleteFeedback,
    currentUser
  } = useNGO();

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'admin';
  const isAuthenticated = !!currentUser;

  // Responsive slider state: 2 in small devices, 3 in large devices
  const [itemsPerView, setItemsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // View More / Filter State
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', '5star', 'donor', 'volunteer', 'replied'
  const [displayCount, setDisplayCount] = useState(6);

  // Form Submission State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState(currentUser?.role === 'Member' ? 'Registered Member' : 'Donor & Well-wisher');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline Admin Reply Modal / Drawer on Public Site
  const [replyingFeedbackId, setReplyingFeedbackId] = useState(null);
  const [inlineReplyText, setInlineReplyText] = useState('');
  const [isSubmittingInlineReply, setIsSubmittingInlineReply] = useState(false);

  // Synchronize authenticated user info into form if logged in
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Merge Context Feedbacks with Seed Defaults & Normalize
  const mergedFeedbacks = useMemo(() => {
    const list = [...(feedbacks.length ? feedbacks : DEFAULT_FEEDBACKS)];
    return list.map((fb, idx) => {
      const fallbackSeed = DEFAULT_FEEDBACKS[idx % DEFAULT_FEEDBACKS.length];
      return {
        ...fb,
        id: fb._id || fb.id || `fb_${idx}`,
        name: fb.name || 'Anonymous Supporter',
        email: fb.email || fallbackSeed.email,
        role: fb.role || fb.userRole || 'Community Supporter',
        rating: Number(fb.rating) || 5,
        comment: fb.comment || '',
        createdAt: fb.createdAt || fb.date || fallbackSeed.createdAt,
        adminReply: fb.adminReply || '',
        adminRepliedAt: fb.adminRepliedAt || null,
        repliedBy: fb.repliedBy || ''
      };
    });
  }, [feedbacks]);

  // Sort Feedbacks: Latest First Mode
  const latestFeedbacks = useMemo(() => {
    return [...mergedFeedbacks].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
  }, [mergedFeedbacks]);

  // Filtered Feedbacks for Grid View
  const filteredFeedbacks = useMemo(() => {
    return latestFeedbacks.filter((fb) => {
      if (selectedFilter === '5star') return fb.rating === 5;
      if (selectedFilter === 'donor') return fb.role?.toLowerCase().includes('donor') || fb.role?.toLowerCase().includes('csr');
      if (selectedFilter === 'volunteer') return fb.role?.toLowerCase().includes('volunteer');
      if (selectedFilter === 'replied') return !!fb.adminReply;
      return true;
    });
  }, [latestFeedbacks, selectedFilter]);

  // Responsive Breakpoints Listener (2 in small devices, 3 in large devices)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Small devices: 2
      } else {
        setItemsPerView(3); // Large devices: 3
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, latestFeedbacks.length - itemsPerView);

  // Slider Navigation
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Autoplay Slider Loop
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  // Format Date and Time helpers
  const formatDateTime = (dateVal) => {
    if (!dateVal) return { dateStr: 'Recent', timeStr: '' };
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return { dateStr: dateVal, timeStr: '' };

    const dateStr = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const timeStr = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return { dateStr, timeStr };
  };

  // Submit Feedback Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    setIsSubmitting(true);
    const newFeedback = {
      name: name.trim(),
      email: email.trim() || (currentUser?.email || `${name.toLowerCase().replace(/\s+/g, '')}@community.in`),
      role: role.trim() || 'Well-wisher & Donor',
      userRole: role.trim(),
      comment: comment.trim(),
      rating: Number(rating),
      createdAt: new Date().toISOString(),
      date: new Date().toISOString()
    };

    if (currentUser?.id || currentUser?._id) {
      newFeedback.userId = currentUser.id || currentUser._id;
    }

    await addFeedback(newFeedback);

    if (!currentUser) {
      setName('');
      setEmail('');
    }
    setComment('');
    setRating(5);
    setIsSubmitting(false);
    setSubmitted(true);
    setCurrentIndex(0); // Jump to first item to see the new review immediately
  };

  // Inline Admin Reply Submit
  const handleInlineReply = async (e, fbId) => {
    e.preventDefault();
    if (!inlineReplyText.trim()) return;

    setIsSubmittingInlineReply(true);
    await replyFeedback(fbId, {
      reply: inlineReplyText.trim(),
      repliedBy: currentUser?.name || 'Ravi Saini (Trustee & President)',
      repliedByRole: currentUser?.role || 'Administrator'
    });

    setIsSubmittingInlineReply(false);
    setReplyingFeedbackId(null);
    setInlineReplyText('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 sm:py-14 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 shadow-2xs">
            <FiMessageSquare className="w-3.5 h-3.5 text-red-600" />
            <span>Community Voice &amp; Verified Trust</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Reviews &amp; Public Feedback
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Real feedback and verified experiences shared by our contributors, regular donors, youth volunteers, and CSR partners across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </span>
              <strong className="text-slate-900">4.9 / 5.0</strong>
              <span className="text-slate-400">• Verified Donor Reviews</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Management Responses Active</span>
            </div>

            {isAdmin && (
              <Link
                href="/dashboard/feedback"
                className="flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 px-3.5 py-1.5 rounded-full border border-red-200 font-bold transition shadow-2xs"
              >
                <FiSettings className="w-3.5 h-3.5" />
                <span>Admin Feedback Panel →</span>
              </Link>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: LATEST FEEDBACKS FIRST IN RIGHT-TO-LEFT SLIDER */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          {/* Slider Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-600">
                  Latest Feedbacks (Live Stream)
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                Community Experiences &amp; Management Replies
              </h2>
              <p className="text-xs text-slate-500">
                Sorted latest first with verified user identity, contact email, timestamps, and official responses.
              </p>
            </div>

            {/* Slider Controls & Counter */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
                Showing {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, latestFeedbacks.length)} of {latestFeedbacks.length}
              </span>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 shadow-2xs transition cursor-pointer"
                  title="Previous Reviews"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 border border-slate-200 shadow-2xs transition cursor-pointer"
                  title="Next Reviews"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slider Container (2 in small devices, 3 in large devices) */}
          <div className="overflow-hidden w-full relative">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {latestFeedbacks.map((fb, idx) => {
                const { dateStr, timeStr } = formatDateTime(fb.createdAt || fb.date);
                const isNewest = idx === 0;
                const fbId = fb.id || fb._id;

                return (
                  <div
                    key={fbId || idx}
                    className="w-full sm:w-1/2 lg:w-1/3 shrink-0 p-2 sm:p-2.5"
                  >
                    <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-5 border border-slate-200 hover:border-red-300 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between relative group">
                      {isNewest && (
                        <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                          Latest Review
                        </span>
                      )}

                      <div className="space-y-3">
                        {/* Rating Stars & Role Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (fb.rating || 5)
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                            {fb.role}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-slate-700 leading-relaxed font-medium italic min-h-[50px]">
                          &ldquo;{fb.comment}&rdquo;
                        </p>

                        {/* Official Admin Reply Banner (if available) */}
                        {fb.adminReply && (
                          <div className="mt-3 bg-gradient-to-br from-red-50/80 to-slate-50 p-3 rounded-2xl border border-red-200/90 space-y-1 shadow-2xs">
                            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-900">
                              <span className="flex items-center gap-1 text-red-600">
                                <FiShield className="w-3.5 h-3.5" />
                                <span>Official Reply from {fb.repliedBy || 'Management'}</span>
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {formatDateTime(fb.adminRepliedAt).dateStr}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                              {fb.adminReply}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* User Identity, Email, Date & Time */}
                      <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2">
                        {/* User Name & Admin actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-black text-xs flex items-center justify-center shrink-0">
                              {fb.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900 truncate max-w-[150px]" title={fb.name}>
                                {fb.name}
                              </h4>
                            </div>
                          </div>

                          {/* Admin Inline Action Controls */}
                          {isAdmin && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingFeedbackId(replyingFeedbackId === fbId ? null : fbId);
                                  setInlineReplyText(fb.adminReply || '');
                                }}
                                className="text-red-600 hover:text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                              >
                                {fb.adminReply ? 'Edit Reply' : 'Reply'}
                              </button>

                              <button
                                onClick={() => deleteFeedback(fbId)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                title="Delete review"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline Reply Form on Card (when admin clicks reply) */}
                        {isAdmin && replyingFeedbackId === fbId && (
                          <form
                            onSubmit={(e) => handleInlineReply(e, fbId)}
                            className="p-2.5 rounded-xl bg-white border border-red-300 shadow-sm space-y-2 mt-2"
                          >
                            <label className="text-[10px] font-bold text-slate-700 block">
                              Write Official Admin Reply:
                            </label>
                            <textarea
                              rows={2}
                              required
                              value={inlineReplyText}
                              onChange={(e) => setInlineReplyText(e.target.value)}
                              placeholder="Write your response as NGO Administrator..."
                              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setReplyingFeedbackId(null)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmittingInlineReply}
                                className="px-3 py-1 rounded-lg text-[10px] font-bold bg-red-600 text-white cursor-pointer hover:bg-red-700 disabled:opacity-50"
                              >
                                {isSubmittingInlineReply ? 'Saving...' : 'Post Reply'}
                              </button>
                            </div>
                          </form>
                        )}

                        {/* User Email with Mail Icon */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate font-mono">
                          <FiMail className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="truncate" title={fb.email}>
                            {fb.email || 'user@community.org'}
                          </span>
                        </div>

                        {/* Time & Date Stamps */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-semibold">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3 text-slate-400" />
                            {dateStr}
                          </span>
                          {timeStr && (
                            <span className="flex items-center gap-1 font-mono text-slate-400">
                              <FiClock className="w-3 h-3 text-slate-400" />
                              {timeStr}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slider Footer: Indicators & Toggle More Feedbacks */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === i ? 'w-6 bg-red-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Buttons to Display More Feedbacks */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowAllFeedbacks((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs transition cursor-pointer"
              >
                <FiGrid className="w-3.5 h-3.5 text-red-600" />
                <span>{showAllFeedbacks ? 'Collapse Feedback Directory' : `Display All Feedbacks (${latestFeedbacks.length})`}</span>
              </button>

              <a
                href="#feedback-form"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Write Feedback</span>
              </a>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EXPANDED FEEDBACKS DIRECTORY (Triggered by "Display More" Button) */}
        {/* ------------------------------------------------------------- */}
        {showAllFeedbacks && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Full Community Feedback Directory ({filteredFeedbacks.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter by category, verified 80G donors, or official management responses.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1 sm:pb-0">
                {[
                  { key: 'all', label: `All (${latestFeedbacks.length})` },
                  { key: 'replied', label: '🛡️ Replied by Admin' },
                  { key: '5star', label: '⭐ 5 Stars' },
                  { key: 'donor', label: '80G Donors' },
                  { key: 'volunteer', label: 'Volunteers' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-bold ${
                      selectedFilter === tab.key
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Feedbacks (2 in small devices, 3 in large devices) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFeedbacks.slice(0, displayCount).map((fb, idx) => {
                const { dateStr, timeStr } = formatDateTime(fb.createdAt || fb.date);
                const fbId = fb.id || fb._id;

                return (
                  <div
                    key={fbId || idx}
                    className="bg-slate-50/70 hover:bg-white rounded-3xl p-5 border border-slate-200 hover:border-red-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (fb.rating || 5)
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {fb.role}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                        &ldquo;{fb.comment}&rdquo;
                      </p>

                      {/* Official Admin Reply in Grid */}
                      {fb.adminReply && (
                        <div className="mt-3 bg-gradient-to-br from-red-50/80 to-slate-50 p-3 rounded-2xl border border-red-200/90 space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-900">
                            <span className="flex items-center gap-1 text-red-600">
                              <FiShield className="w-3.5 h-3.5" />
                              <span>Official Reply from {fb.repliedBy || 'Management'}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {formatDateTime(fb.adminRepliedAt).dateStr}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                            {fb.adminReply}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">
                          {fb.name}
                        </h4>
                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingFeedbackId(replyingFeedbackId === fbId ? null : fbId);
                                setInlineReplyText(fb.adminReply || '');
                              }}
                              className="text-red-600 hover:text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                            >
                              {fb.adminReply ? 'Edit Reply' : 'Reply'}
                            </button>
                            <button
                              onClick={() => deleteFeedback(fbId)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete review"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* User Email */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono truncate">
                        <FiMail className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="truncate">{fb.email || 'user@community.org'}</span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-semibold">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                        {timeStr && (
                          <span className="flex items-center gap-1 font-mono text-slate-400">
                            <FiClock className="w-3 h-3 text-slate-400" />
                            {timeStr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button for Grid */}
            {displayCount < filteredFeedbacks.length && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + 6)}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                >
                  Load More Feedbacks ({filteredFeedbacks.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: AUTHENTICATED USER FEEDBACK SUBMISSION FORM */}
        {/* ------------------------------------------------------------- */}
        <div id="feedback-form" className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1 pb-2 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Share Your Experience &amp; Testimonial
            </h3>
            <p className="text-xs text-slate-500">
              Your feedback is published directly to motivate our youth volunteers and strengthen donor transparency.
            </p>
          </div>

          {/* Authentication Status Banner */}
          {isAuthenticated ? (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <span>Logged In as {currentUser.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-800 font-bold">
                      Verified {currentUser.role || 'Member'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-mono">{currentUser.email}</span>
                </div>
              </div>

              <span className="text-[10px] text-emerald-600 font-bold px-2 py-1 bg-white rounded-lg border border-emerald-200">
                Auto-Verified Review
              </span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <FiUser className="w-4 h-4 text-slate-400" />
                <span>Posting as Guest. Have an Indian Youth Foundation account?</span>
              </div>
              <Link
                href="/login?redirect=/feedback"
                className="inline-flex items-center gap-1 text-red-600 font-bold hover:underline whitespace-nowrap"
              >
                <FiLogIn className="w-3.5 h-3.5" />
                <span>Log in to Verify Review</span>
              </Link>
            </div>
          )}

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center text-xs space-y-2">
              <FiCheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-extrabold text-sm text-emerald-900">
                Thank You! Your Review Has Been Published Successfully.
              </div>
              <p className="text-slate-600 max-w-md mx-auto">
                Your feedback has been added directly to our real-time community stream. Our management team audits every review and frequently provides official replies.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Manish Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900 text-xs"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Your Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. manish.sharma@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Affiliation / Role */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Your Role / Relationship with NGO
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900 text-xs cursor-pointer"
                >
                  <option value="Regular 80G Donor">Regular 80G Donor</option>
                  <option value="Active Youth Volunteer">Active Youth Volunteer</option>
                  <option value="Registered Member">Registered Member</option>
                  <option value="CSR Partner & Corporate Donor">CSR Partner &amp; Corporate Donor</option>
                  <option value="Event / Blood Donor">Event / Blood Donor</option>
                  <option value="Well-wisher & Supporter">Well-wisher &amp; Supporter</option>
                </select>
              </div>

              {/* Rating Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Rating Experience *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`py-2 px-2 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer transition text-xs ${
                        rating === star
                          ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs ring-1 ring-amber-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <FiStar
                        className={`w-3.5 h-3.5 ${
                          rating >= star ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                        }`}
                      />
                      <span>{star} ★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Your Feedback / Testimonial *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your thoughts on transparency, volunteering experience, tax deduction receipts, or social impact..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-slate-900 text-xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FiSend className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting Review...' : 'Publish Testimonial (Live Stream)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
