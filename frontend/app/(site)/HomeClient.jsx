'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HomeCarousel from '@/components/site/HomeCarousel';
import {
  FiUsers,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiArrowRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiActivity,
  FiAward,
  FiClock,
  FiTag,
  FiStar,
  FiShield,
  FiCornerDownRight,
  FiMessageSquare
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import { getYoutubeEmbedUrl } from '@/lib/youtube';

const DEFAULT_OBJECTIVES = [
  {
    title: 'SOCIAL WELFARE',
    subtitle: 'Community Upliftment',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&auto=format&fit=crop&q=80',
    link: '/donation',
  },
  {
    title: 'HEALTH & RESEARCH',
    subtitle: 'Free Medical Camps',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
    link: '/campaigns',
  },
  {
    title: 'EDUCATION & TRAINING',
    subtitle: 'Child Literacy & Skills',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    link: '/volunteer',
  },
  {
    title: 'HUMAN RIGHTS',
    subtitle: 'Justice & Empowerment',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    link: '/who-we-are',
  },
  {
    title: 'ANTI CRIME',
    subtitle: 'Awareness & Protection',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    link: '/complaints',
  },
];

export default function HomePage() {
  const { settings, gallery, feedbacks, campaigns, events, blogs, members, services, currentUser } = useNGO();

  const isMember = Boolean(
    currentUser?.role === 'Member' ||
    currentUser?.role === 'Admin' ||
    (currentUser?.isMember && !currentUser?.memberId?.startsWith('BYK-DON-')) ||
    (currentUser?.membershipApplication?.status === 'approved') ||
    (currentUser?.memberId && (currentUser.memberId.startsWith('BYK-MEM-') || currentUser.memberId.startsWith('MEM-')))
  );

  // Tab State: 'news' | 'activity' | 'members'
  const [activeTab, setActiveTab] = useState('news');

  // Testimonial Slider State
  const [reviewIdx, setReviewIdx] = useState(0);

  // Gallery Slider State
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Objectives List
  const objectives =
    settings?.objectives && settings.objectives.length > 0
      ? settings.objectives
      : DEFAULT_OBJECTIVES;

  // YouTube Videos List
  const ytVideos =
    settings?.youtubeVideos && settings.youtubeVideos.length > 0
      ? settings.youtubeVideos
      : [
        {
          title: 'समस्या समाधान परिषद (SSP) के राष्ट्रीय अध्यक्ष श्री...',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        {
          title: 'समस्या समाधान परिषद (SSP) के पदाधिकारी एवं सामाजिक...',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
      ];

  // Helper to format embed url
  const formatYtEmbed = (url) => getYoutubeEmbedUrl(url);

  // Approved Reviews / Testimonials list from real backend API
  const approvedReviews =
    feedbacks && feedbacks.length > 0
      ? feedbacks.filter((f) => {
        const st = (f.status || 'Approved').toLowerCase();
        return st === 'approved';
      })
      : [
        {
          name: 'Anirudh',
          role: 'Member & Regular Donor',
          userRole: 'Member',
          rating: 5,
          profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          comment:
            'Through your compassionate initiatives and remarkable leadership, you have demonstrated a steadfast commitment to underprivileged communities. Your organization’s selfless contributions have not only inspired others but have also set a shining example of humanitarianism and solidarity.',
          adminReply: 'Thank you Anirudh ji! Your unwavering dedication as a verified member fuels our child welfare drives.',
          adminRepliedAt: new Date().toISOString(),
          repliedBy: 'Ravi Saini (Trustee & President)'
        },
        {
          name: 'Sunil Aggarwal',
          role: 'Verified CSR Contributor',
          userRole: 'CSR Contributor',
          rating: 5,
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          comment:
            'Transparent operations, real ground impact, and immediate 80G tax acknowledgment. Truly proud to be associated with Yuva Kranti Dal.',
          adminReply: 'Sunil ji, corporate CSR support like yours allows us to provide school supplies and uniforms to 450+ village children.',
          adminRepliedAt: new Date().toISOString(),
          repliedBy: 'Foundation Core Administration'
        },
        {
          name: 'Dr. R. K. Sharma',
          role: 'Community Health Advisor',
          userRole: 'Volunteer',
          rating: 5,
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          comment:
            'The dedication of the volunteers in rural education and emergency healthcare delivery is unmatched in our district. Highly transparent NGO.',
          adminReply: 'Doctor sahab, your guidance during our free medical camps makes high quality diagnosis accessible to poor families.',
          adminRepliedAt: new Date().toISOString(),
          repliedBy: 'Ravi Saini (National President)'
        },
      ];

  const galleryList =
    gallery && gallery.length > 0
      ? gallery
      : [
        {
          title: 'Education Drive',
          url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
        },
        {
          title: 'Medical Camp',
          url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600',
        },
        {
          title: 'Youth Workshop',
          url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
        },
        {
          title: 'Relief Distribution',
          url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600',
        },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#0b8026] selection:text-white">

      {/* ---------------- 1. HERO CAROUSEL ---------------- */}
      <HomeCarousel slides={settings?.heroSlides} />

      {/* ---------------- 2. ACTION TABS & 3-COLUMN DASHBOARD SECTION ---------------- */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 3 Top Buttons: Latest News (Red theme), Latest Activity (Green theme), Our Members (Green-Red mix) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:gap-44 max-w-full mx-auto mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`py-2 px-6 rounded-xl border-2 font-black text-xs sm:text-sm transition cursor-pointer shadow-xs ${activeTab === 'news'
                ? 'border-red-600 bg-linear-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25 scale-102'
                : 'border-red-600/60 text-red-700 hover:bg-rose-50/60'
                }`}
            >
              Latest News
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`py-2 px-6 rounded-xl border-2 font-black text-xs sm:text-sm transition cursor-pointer shadow-xs ${activeTab === 'activity'
                ? 'border-[#0b8026] bg-linear-to-r from-[#0b8026] to-[#075018] text-white shadow-md shadow-emerald-500/25 scale-102'
                : 'border-emerald-600/60 text-[#0b8026] hover:bg-emerald-50/60'
                }`}
            >
              Latest Activity
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`py-2 px-6 rounded-xl border-2 font-black text-xs sm:text-sm transition cursor-pointer shadow-xs ${activeTab === 'members'
                ? 'border-[#0b8026] bg-linear-to-r from-[#0b8026] via-rose-600 to-red-600 text-white shadow-md scale-102'
                : 'border-emerald-600/60 text-slate-800 hover:bg-emerald-50/60'
                }`}
            >
              Our Members
            </button>
          </div>

          {/* 3-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column (col-span-3): Green & Red border card + Member Apply & Donate Us buttons */}
            <div className="lg:col-span-3 space-y-4">
              {/* Dual-bordered Welcome box */}
              <div className="border-4 border-[#0b8026] bg-linear-to-b from-emerald-50/90 via-white to-rose-50/40 rounded-2xl p-5 min-h-55 sm:min-h-65 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white mb-2 shadow-xs">
                  🇮🇳 Rashtra Hit Sarvopari
                </span>
                <div className="w-14 h-14 rounded-full bg-white border-2 border-[#0b8026] ring-2 ring-red-500/30 flex items-center justify-center text-[#0b8026] mb-2 shadow-xs">
                  <FiCheckCircle className="w-7 h-7 text-[#0b8026]" />
                </div>
                <h4 className="font-black text-[#0b8026] text-lg uppercase tracking-wide">
                  YUVA KRANTI <span className="text-[#dc2626]">DAL</span>
                </h4>
                <p className="text-xs text-slate-800 mt-1 font-bold leading-snug">
                  {settings?.ngoName || 'Yuva Kranti Dal'}
                </p>
                <span className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  National Youth &amp; Social Welfare Movement
                </span>
              </div>

              {/* Action card buttons in Green & Red theme */}
              <Link
                href={isMember ? '/profile/member' : '/apply-member'}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border-2 border-[#0b8026] bg-white hover:bg-emerald-50 text-slate-800 font-extrabold text-sm shadow-xs transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0b8026] text-white flex items-center justify-center group-hover:scale-105 transition shadow-xs">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <span className="text-[#0b8026] font-black">
                    {isMember ? 'Member Profile' : 'Apply for Member'}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Free
                </span>
              </Link>

              <Link
                href="/donation"
                className="flex items-center justify-between w-full p-3.5 rounded-xl border-2 border-red-600 bg-linear-to-r from-red-600 via-rose-600 to-red-700 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md shadow-red-500/25 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center group-hover:scale-105 transition shadow-xs">
                    <FiHeart className="w-5 h-5 fill-red-600" />
                  </div>
                  <span className="text-white font-black">Donate Us</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/40">
                  80G Tax Free
                </span>
              </Link>
            </div>

            {/* Middle Column (col-span-6): Dynamic content based on active tab */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 min-h-95 shadow-sm flex flex-col justify-between">
              {activeTab === 'news' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-red-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      <h3 className="font-black text-red-700 text-sm sm:text-base uppercase tracking-wide">
                        Latest News &amp; Bulletins
                      </h3>
                    </div>
                    <Link
                      href="/blogs"
                      className="text-[11px] font-bold text-[#0b8026] hover:text-[#075018] hover:underline flex items-center gap-1"
                    >
                      <span>View All News</span>
                      <FiArrowRight className="w-3 h-3 text-red-600" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {blogs && blogs.length > 0 ? (
                      blogs.slice(0, 3).map((item, idx) => {
                        const bId = item._id || item.id || idx;
                        return (
                          <Link
                            key={bId}
                            href={`/blogs/${bId}`}
                            className="p-3.5 bg-slate-50 hover:bg-rose-50/40 transition-colors rounded-xl border border-slate-200 hover:border-red-400 flex gap-3.5 items-start group cursor-pointer shadow-2xs"
                          >
                            {item.image && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                                <img
                                  src={getContentImageUrl(item.image)}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/logo.jpeg';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                <FiCalendar className="w-3 h-3 text-red-600" />
                                <span>{item.date || item.createdAt ? new Date(item.date || item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Official Update'}</span>
                                <span className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase">
                                  {item.category || (Array.isArray(item.tags) && item.tags[0]) || 'News'}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1 line-clamp-1 group-hover:text-red-700 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.content || item.description || item.summary}
                              </p>
                              <span className="text-[10px] font-bold text-red-600 mt-1 inline-flex items-center gap-1 group-hover:underline">
                                <span>Read full story</span>
                                <FiChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <>
                        <div className="p-3.5 bg-slate-50 hover:bg-rose-50/40 transition rounded-xl border border-slate-200">
                          <div className="text-[10px] font-bold text-red-700 flex items-center gap-1.5">
                            <FiCalendar className="w-3 h-3" />
                            <span>National Bulletin • 2026</span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">
                            {settings?.newsTickerText || 'युवा क्रांति दल द्वारा राष्ट्रीय कार्यकारिणी एवं जिला स्तरीय समितियों का गठन प्रारंभ।'}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            इच्छुक समाजसेवी, युवा एवं वरिष्ठ नागरिक संगठन की सदस्यता प्राप्त कर समाज सेवा में योगदान दें।
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 hover:bg-[#eef8f0] transition rounded-xl border border-slate-200">
                          <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1.5">
                            <FiCalendar className="w-3 h-3" />
                            <span>District Camp Announcement</span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">
                            Free Medical Health &amp; Research Camp in Aligarh District
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            State Office Krishna Vihar Pala Road Aligarh organizing free medical checkup and medicine distribution for underprivileged families.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FiActivity className="w-4 h-4 text-[#0b8026]" />
                      <h3 className="font-black text-[#0b8026] text-sm sm:text-base uppercase tracking-wide">
                        Recent Field Activities &amp; Events
                      </h3>
                    </div>
                    <Link href="/event" className="text-[11px] text-[#0b8026] font-bold hover:underline">
                      All Events →
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {events && events.length > 0 ? (
                      events.slice(0, 3).map((evt, idx) => (
                        <div
                          key={evt._id || evt.id || idx}
                          className="p-3.5 bg-slate-50 hover:bg-[#eef8f0] transition-colors rounded-xl border border-slate-200 hover:border-[#0b8026]/40 flex gap-3.5 items-start group"
                        >
                          {evt.image && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                              <img
                                src={getContentImageUrl(evt.image)}
                                alt={evt.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/logo.jpeg';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#0b8026]">
                              <FiClock className="w-3 h-3" />
                              <span>{evt.date ? new Date(evt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming Activity'}</span>
                              {evt.location && <span className="text-slate-500">• {evt.location}</span>}
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-1 line-clamp-1 group-hover:text-[#0b8026] transition-colors">
                              {evt.title}
                            </h4>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {evt.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            Stationery &amp; Education Kit Distribution
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            Distributed over 500 sets of educational kits and school bags to deserving students in rural areas.
                          </p>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            Emergency Blood Donation Support Drive
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            Coordinated emergency voluntary donors for district hospital patients with 24/7 helpline.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-[#0b8026]" />
                      <h3 className="font-black text-[#0b8026] text-sm sm:text-base uppercase tracking-wide">
                        Active Verified Members
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {members?.length || 0} Listed
                    </span>
                  </div>

                  {members && members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-55 overflow-y-auto pr-1">
                      {members.slice(0, 6).map((m, idx) => (
                        <div
                          key={m._id || m.memberId || idx}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0b8026]/40 hover:bg-[#eef8f0]/40 transition"
                        >
                          <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-white shadow-2xs">
                            <img
                              src={getContentImageUrl(m.photoUrl) || '/logo.jpeg'}
                              alt={m.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/logo.jpeg';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-xs text-slate-900 truncate">
                              {m.name}
                            </div>
                            <div className="text-[10px] text-[#0b8026] font-bold truncate">
                              {m.memberId || 'Verified Member'}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {m.designation || m.state || 'Social Worker'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 py-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-xl font-black text-[#0b8026]">3,500+</div>
                        <div className="text-[11px] font-semibold text-slate-500">Registered Members</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-xl font-black text-emerald-700">50+</div>
                        <div className="text-[11px] font-semibold text-slate-500">District Units</div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Join our nationwide humanitarian youth initiative
                    </span>
                    <Link
                      href={isMember ? '/profile/member' : '/apply-member'}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#0b8026] to-[#dc2626] hover:from-[#09661f] hover:to-[#b91c1c] text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>{isMember ? 'My Profile' : 'Apply for Member'}</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Yuva Kranti Dal Portal</span>
                <span className="font-bold text-[#0b8026]">Verified NGO</span>
              </div>
            </div>

            {/* Right Column (col-span-3): Management Team Card */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border-2 border-emerald-600/30 rounded-xl p-5 shadow-sm min-h-75 flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#0b8026] ring-2 ring-red-500/30 p-1 bg-white mb-3 shadow-xs">
                    <img
                      src="/logo.jpeg"
                      alt="Management Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="font-extrabold text-sm text-center text-slate-900">
                    Governing Body &amp; Advisors
                  </h4>
                  <p className="text-xs text-center text-slate-500 mt-1 leading-relaxed">
                    Dedicated leadership steering nationwide humanitarian interventions and welfare projects.
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/team-members"
                    className="block text-center py-2 px-4 rounded-xl border-2 border-red-600 text-red-700 hover:bg-red-600 hover:text-white text-xs font-extrabold transition shadow-2xs"
                  >
                    Management Team
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- 3. ABOUT US SECTION ---------------- */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Pill Header with Green & Red Accents */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>About Us</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
          </div>

          {/* 2-Column Card with Logo on Left and Content on Right */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

              {/* Left Logo / Seal */}
              <div className="md:col-span-4 flex items-center justify-center p-4">
                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl border-2 border-[#0b8026] ring-4 ring-red-500/20 p-4 bg-white shadow-md flex items-center justify-center">
                  <img
                    src={getContentImageUrl(settings?.logoUrl) || '/logo.jpeg'}
                    alt="Yuva Kranti Dal Seal"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logo.jpeg';
                    }}
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="md:col-span-8 space-y-4">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                  About Us
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {settings?.homeAboutStory ||
                    'Yuva Kranti Dal is a passionate advocate for positive change, dedicated to making a tangible difference in the world. Since our inception, we have been driven by a singular mission: to empower individuals and communities to thrive through sustainable development initiatives, education, healthcare access, and environmental stewardship.'}
                </p>

                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Our Values
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                    {settings?.homeOurValues ||
                      'At Yuva Kranti Dal, our core values of compassion, integrity, and inclusivity guide everything we do. We believe in the power of collaboration and collective action to address pressing global challenges and create lasting impact.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Our Impact
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                    {settings?.homeOurImpact ||
                      'Through strategic partnerships, grassroots initiatives, and the dedication of our team, we have achieved significant milestones in social development, child education, and emergency healthcare relief. Our work has touched the lives of countless individuals and continues to inspire positive change worldwide.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Join Us
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                    {settings?.homeJoinUs ||
                      'Join us in our mission to create a brighter, more equitable world for all. Together, we can make a difference.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 4. PRESIDENT MESSAGE SECTION ---------------- */}
      <section id="president-message" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Pill Header with Green & Red Accents */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>{settings?.presidentMessageTitle || 'President Message'}</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
          </div>

          {/* 2-Column Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

              {/* Left Seal / President Photo */}
              <div className="md:col-span-4 flex items-center justify-center p-4">
                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl border-2 border-[#0b8026] ring-4 ring-red-500/20 p-2 bg-white shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={getContentImageUrl(settings?.presidentPhotoUrl) || getContentImageUrl(settings?.logoUrl) || '/logo.jpeg'}
                    alt="President Portrait"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logo.jpeg';
                    }}
                  />
                </div>
              </div>

              {/* Right Letter */}
              <div className="md:col-span-8 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="font-black text-red-700 text-sm">Dear Friends,</p>

                <div className="space-y-3 whitespace-pre-line">
                  {settings?.presidentMessageContent ||
                    `It is with great pride and humility that I address you as the President of Yuva Kranti Dal. Since our founding 2022, our organization has been driven by a simple yet profound belief: that every individual, regardless of circumstance, deserves the opportunity to thrive.

At Yuva Kranti Dal, we are not just dreamers; we are doers. We roll up our sleeves and work tirelessly to turn our vision of a better world into reality. From providing access to education and healthcare to championing environmental sustainability and social justice, our efforts are guided by a deep commitment to making a meaningful difference in the lives of others.

But we cannot do it alone. Our success is built on the support of passionate individuals like you—individuals who share our values and our vision for a brighter future. Together, we can amplify our impact and create lasting change that reverberates far beyond our borders.

As we look to the future, I am filled with hope and optimism. The challenges we face are great, but so too is our resolve to overcome them. With your continued support, I am confident that we can build a world where every person has the opportunity to flourish and thrive.

Thank you for your unwavering commitment to our cause. Together, we are truly making a difference.`}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Warm regards,</p>
                    <p className="font-black text-[#0b8026] text-sm mt-0.5">
                      {settings?.ngoName || 'Yuva Kranti Dal'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    National President
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 4.5 OUR WELFARE SERVICES SECTION (NEW DYNAMIC SHOWCASE) ---------------- */}
      <section id="services-section" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>Our Services &amp; Initiatives</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
            <p className="text-xs text-slate-600 mt-2 max-w-xl mx-auto font-medium">
              Explore active grassroots welfare initiatives launched for child education, healthcare relief, women empowerment, and youth livelihood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services && services.length > 0 ? services.slice(0, 6) : DEFAULT_OBJECTIVES.slice(0, 3)).map((srv, idx) => {
              const sId = srv._id || srv.id || idx;
              const sImg = getContentImageUrl(srv.image || srv.bannerImage || srv.imageUrl || (Array.isArray(srv.images) && srv.images[0])) || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600';
              const title = srv.titleEn || srv.title || 'Social Welfare Program';
              const desc = srv.description || srv.content || 'Dedicated community support and field relief intervention program.';
              const cat = srv.category || 'Grassroots Relief';
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={sId}
                  className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-red-500 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative w-full h-48 bg-slate-200 overflow-hidden">
                      <img
                        src={sImg}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/logo.jpeg';
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs backdrop-blur-xs ${
                          isEven ? 'bg-linear-to-r from-red-600 to-rose-600' : 'bg-linear-to-r from-[#0b8026] to-emerald-700'
                        }`}>
                          {cat}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-extrabold text-sm line-clamp-1 text-white">
                          {title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <Link
                      href={`/services/${sId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b8026] hover:text-[#075018] group-hover:underline"
                    >
                      <span>Explore Program</span>
                      <FiArrowRight className="w-3.5 h-3.5 text-red-600 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/donation"
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-[#0b8026] text-white font-bold text-[11px] shadow-xs transition"
                    >
                      Support
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-r from-[#0b8026] via-rose-600 to-red-600 hover:from-[#09661f] hover:to-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/20 transition transform hover:scale-105"
            >
              <span>View All Services &amp; Initiatives</span>
              <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ---------------- 5. OUR OBJECTIVES (5 PILLARS IMAGE CARDS) ---------------- */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Pill Header with Green & Red Accents */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>Our Objectives</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
          </div>

          {/* 5 Cards Row matching screenshot #3 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {objectives.slice(0, 5).map((obj, i) => {
              const objImage = obj.imageUrl || obj.image;
              const bgImg = objImage
                ? getContentImageUrl(objImage)
                : DEFAULT_OBJECTIVES[i % DEFAULT_OBJECTIVES.length].image;

              return (
                <Link
                  key={i}
                  href={obj.link || '/about'}
                  className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-4 border border-slate-200 cursor-pointer"
                >
                  <img
                    src={bgImg}
                    alt={obj.title || 'Objective'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_OBJECTIVES[i % DEFAULT_OBJECTIVES.length].image;
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="relative z-10 text-white flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-xs sm:text-sm tracking-wide uppercase leading-tight text-white drop-shadow-sm">
                        {obj.title}
                      </h4>
                      {obj.subtitle && (
                        <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                          {obj.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-[#0b8026] flex items-center justify-center transition shrink-0 ml-1">
                      <FiChevronRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---------------- 6. YOUTUBE VIDEOS ---------------- */}
      <section id="youtube-videos" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Pill Header with Red & Green Theme */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-red-600 bg-linear-to-r from-rose-50 via-white to-emerald-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>YouTube Videos</span>
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
            </span>
          </div>

          {/* Videos Grid side by side matching screenshot #4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ytVideos.map((vid, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col"
              >
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={formatYtEmbed(vid.url || vid.videoUrl)}
                    title={vid.title || `SSP YouTube Video ${idx + 1}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------- 7. PHOTO GALLERY ---------------- */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Pill Header with Green & Red Accents */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>Photo Gallery</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryList.slice(galleryIdx * 4, galleryIdx * 4 + 4).map((item, idx) => (
              <Link
                key={idx}
                href="/gallery"
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 aspect-4/3 bg-slate-100 flex flex-col justify-end p-4"
              >
                <img
                  src={getContentImageUrl(item.url || item.imageUrl)}
                  alt={item.title || `Yuva Kranti Dal Gallery ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <h4 className="font-bold text-xs mt-1 line-clamp-1 leading-snug text-white">
                    {item.title || 'Social Impact Drive'}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

          {/* Slider controls & View All */}
          <div className="flex flex-col items-center justify-center gap-3 mt-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGalleryIdx((prev) => Math.max(0, prev - 1))}
                disabled={galleryIdx === 0}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-red-600 hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shadow-2xs cursor-pointer"
                aria-label="Previous Gallery"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setGalleryIdx((prev) => ((prev + 1) * 4 < galleryList.length ? prev + 1 : 0))}
                className="w-9 h-9 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-[#0b8026] hover:border-[#0b8026] flex items-center justify-center transition shadow-2xs cursor-pointer"
                aria-label="Next Gallery"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-linear-to-r from-[#0b8026] to-[#dc2626] hover:from-[#09661f] hover:to-[#b91c1c] text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <span>View All Photos</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ---------------- 8. WHAT PEOPLE SAYS (TESTIMONIAL & COMMUNITY FEEDBACK) ---------------- */}
      <section id="feedback-section" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Pill Header with Green & Red Accents */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>What People Say</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Verified community feedback, member testimonials, and official foundation responses
            </p>
          </div>

          {/* Testimonial Card with Circular Profile on Top and Left/Right Arrows */}
          <div className="relative pt-12">
            {/* Circular Avatar floating on top in Green & Red Ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
              <div className="w-24 h-24 rounded-full border-4 border-red-600 ring-4 ring-[#0b8026]/40 p-1 bg-white shadow-xl flex items-center justify-center overflow-hidden">
                {approvedReviews[reviewIdx]?.profilePicture || approvedReviews[reviewIdx]?.photoUrl || approvedReviews[reviewIdx]?.userId?.photoUrl ? (
                  <img
                    src={getContentImageUrl(approvedReviews[reviewIdx]?.profilePicture || approvedReviews[reviewIdx]?.photoUrl || approvedReviews[reviewIdx]?.userId?.photoUrl)}
                    alt={approvedReviews[reviewIdx]?.name || 'User Profile'}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-linear-to-tr from-[#0b8026] to-emerald-500 flex items-center justify-center text-white text-3xl font-black shadow-inner">
                    {approvedReviews[reviewIdx]?.name ? approvedReviews[reviewIdx].name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="relative bg-white rounded-3xl pt-16 pb-8 px-6 sm:px-14 border border-slate-200 shadow-sm text-center">
              {/* Left Arrow */}
              <button
                type="button"
                onClick={() => setReviewIdx((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length)}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-300 hover:border-[#0b8026] hover:bg-[#eef8f0] text-slate-700 hover:text-[#0b8026] flex items-center justify-center shadow-xs transition cursor-pointer z-10"
                aria-label="Previous Testimonial"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={() => setReviewIdx((prev) => (prev + 1) % approvedReviews.length)}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-300 hover:border-[#0b8026] hover:bg-[#eef8f0] text-slate-700 hover:text-[#0b8026] flex items-center justify-center shadow-xs transition cursor-pointer z-10"
                aria-label="Next Testimonial"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>

              <div className="max-w-2xl mx-auto space-y-4">

                {/* 5-Star Rating */}
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${i < (approvedReviews[reviewIdx]?.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                        }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-1">
                    ({approvedReviews[reviewIdx]?.rating || 5}.0)
                  </span>
                </div>

                {/* Review Message */}
                <span className="text-3xl font-serif text-[#0b8026]/40 block -mb-2">“</span>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-normal px-2">
                  {approvedReviews[reviewIdx]?.comment ||
                    approvedReviews[reviewIdx]?.message ||
                    'Through your compassionate initiatives and remarkable leadership, you have demonstrated a steadfast commitment to underprivileged communities. Your organization’s selfless contributions have not only inspired others but have also set a shining example of humanitarianism and solidarity.'}
                </p>

                {/* User Info with thumbnail & Role Badge */}
                <div className="pt-2 flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-300 bg-emerald-50 shrink-0">
                      {approvedReviews[reviewIdx]?.profilePicture || approvedReviews[reviewIdx]?.photoUrl || approvedReviews[reviewIdx]?.userId?.photoUrl ? (
                        <img
                          src={getContentImageUrl(approvedReviews[reviewIdx]?.profilePicture || approvedReviews[reviewIdx]?.photoUrl || approvedReviews[reviewIdx]?.userId?.photoUrl)}
                          alt={approvedReviews[reviewIdx]?.name || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#0b8026] text-xs font-black">
                          {approvedReviews[reviewIdx]?.name ? approvedReviews[reviewIdx].name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#0b8026]">
                      {approvedReviews[reviewIdx]?.name || 'Anirudh'}
                    </h4>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-0.5">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                      {approvedReviews[reviewIdx]?.role || approvedReviews[reviewIdx]?.userRole || 'Verified Member'}
                    </span>
                  </div>
                </div>

                {/* Official Admin / Management Reply Banner with Admin's Official Portrait / Logo Image */}
                {approvedReviews[reviewIdx]?.adminReply && (
                  <div className="mt-4 bg-linear-to-br from-emerald-50/90 to-slate-50 p-4 rounded-2xl border border-emerald-200/90 text-left space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-black text-slate-900 border-b border-emerald-100 pb-2">
                      <div className="flex items-center gap-2.5 text-[#0b8026]">
                        {/* Admin Image */}
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#0b8026] bg-white shadow-xs shrink-0">
                          <img
                            src={getContentImageUrl(settings?.presidentPhotoUrl || settings?.logoUrl || '/logo.jpeg')}
                            alt={approvedReviews[reviewIdx]?.repliedBy || 'Admin Official'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/logo.jpeg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <FiShield className="w-3.5 h-3.5 text-[#0b8026]" />
                            <span className="text-slate-900 font-bold">Official Response</span>
                          </div>
                          <span className="text-[11px] text-[#0b8026] font-semibold block">
                            {approvedReviews[reviewIdx]?.repliedBy || 'Management / National President'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {approvedReviews[reviewIdx]?.adminRepliedAt
                          ? new Date(approvedReviews[reviewIdx].adminRepliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                          : 'Official Desk'}
                      </span>
                    </div>
                    <div className="pl-1 pt-1 flex items-start gap-2.5">
                      <FiCornerDownRight className="w-4 h-4 text-[#0b8026] shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {approvedReviews[reviewIdx].adminReply}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons: Write Feedback & View All Reviews in Green & Red */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/feedback"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#0b8026] to-[#dc2626] hover:from-[#09661f] hover:to-[#b91c1c] text-white text-xs font-black transition shadow-md shadow-red-500/20 cursor-pointer"
                  >
                    <FiMessageSquare className="w-3.5 h-3.5" />
                    <span>View All Reviews &amp; Write Feedback</span>
                  </Link>

                  {currentUser?.role === 'Admin' && (
                    <Link
                      href="/dashboard/feedback"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <FiShield className="w-3.5 h-3.5 text-[#0b8026]" />
                      <span>Moderate in Admin Desk</span>
                    </Link>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 9. LOCATE US (FULL-WIDTH MAP BANNER) ---------------- */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-8 py-2 rounded-full border-2 border-[#0b8026] bg-linear-to-r from-emerald-50 via-white to-rose-50 text-slate-900 font-black text-sm tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#0b8026]"></span>
              <span>Locate Us</span>
              <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
            </span>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#0b8026] ring-4 ring-red-500/20 shadow-md bg-slate-100">
            <iframe
              title="NGO Head Office Location Map"
              src={
                settings?.googleMapEmbed ||
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113000!2d78.07!3d27.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a496c4d7e7a5%3A0x6b10b7849e79d7e0!2sAligarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000'
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
