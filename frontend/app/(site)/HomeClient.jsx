'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/site/Hero';
import ImpactStats from '@/components/site/ImpactStats';
import HomeAbout from '@/components/site/HomeAbout';
import HomeTeamMembers from '@/components/site/HomeTeamMembers';
import EventImageCarousel from '@/components/site/EventImageCarousel';
import {
  FiHeart,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiCheckCircle,
  FiTarget,
  FiPhone,
  FiMail,
  FiStar,
  FiImage,
  FiCreditCard,
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function HomePage() {
  const {
    settings,
    campaigns,
    events,
    gallery,
    feedbacks
  } = useNGO();

  // 1. Interactive 80G Tax Savings Calculator State
  const [calcAmount, setCalcAmount] = useState(2100);

  // 2. Interactive Cause Filter State
  const [selectedCauseCategory, setSelectedCauseCategory] = useState('All');

  // 3. Interactive Pathway State (Volunteer vs Member)
  const [activePathway, setActivePathway] = useState('volunteer');

  // 4. Interactive Reviews Pagination
  const [reviewIdx, setReviewIdx] = useState(0);

  // Dynamic Impact Description Generator for Calculator
  const getImpactDescription = (amt) => {
    if (amt < 1000) {
      return 'Provides 5 complete stationery kits, textbooks, and fruit nourishment for slum children.';
    } else if (amt < 2500) {
      return 'Funds 1 full month of after-school tuition and digital literacy training for 2 girl students.';
    } else if (amt < 5500) {
      return 'Equips an entire slum learning pod with books, notebooks, school bags, and winter warmers.';
    } else if (amt < 12000) {
      return 'Sponsors 1 month of emergency blood donor mobilization and 2 free rural pediatric checkup camps.';
    } else {
      return 'Donates a complete women tailoring sewing unit creating permanent livelihood for marginalized families.';
    }
  };

  // Filter Campaigns based on category
  const filteredCampaigns = campaigns.filter((camp) => {
    if (selectedCauseCategory === 'All') return true;
    const cat = (camp.category || '').toLowerCase();
    const query = selectedCauseCategory.toLowerCase();
    return cat.includes(query) || (camp.title || '').toLowerCase().includes(query);
  });

  // Approved Reviews / Testimonials list
  const approvedReviews = (feedbacks && feedbacks.length > 0)
    ? feedbacks.filter(f => f.status === 'approved' || !f.status).slice(0, 6)
    : [
      {
        name: 'Sunil Aggarwal',
        role: 'Verified 80G Contributor',
        message: 'Transparent accounting and prompt 80G tax receipt issuance. Knowing my funds directly support slum education is truly fulfilling.',
        rating: 5,
        date: 'Oct 2026'
      },
      {
        name: 'Anjali Sharma',
        role: 'Registered Volunteer',
        message: 'The organization provided an official appointment letter, volunteer ID card, and great field exposure during relief drives.',
        rating: 5,
        date: 'Sep 2026'
      },
      {
        name: 'Vikram Rajput',
        role: 'District Member',
        message: 'Honored to hold an official membership card. The blood donor helpline coordinates with incredible speed during medical emergencies.',
        rating: 5,
        date: 'Aug 2026'
      }
    ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-red-600 selection:text-white">

      {/* ---------------- 1. DYNAMIC INTERACTIVE HERO BANNER ---------------- */}
      <Hero />

      {/* ---------------- 2. REAL-TIME IMPACT SCORECARD ---------------- */}
      <ImpactStats />

      {/* ---------------- 3. DYNAMIC ABOUT SECTION (API DATA) ---------------- */}
      <HomeAbout />

      {/* ---------------- 4. LEADERSHIP & TEAM MEMBERS DIRECTORY ---------------- */}
      <HomeTeamMembers />

      {/* ---------------- 3. INTERACTIVE 80G TAX SAVINGS & IMPACT CALCULATOR ---------------- */}
      <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiShield className="w-3.5 h-3.5 text-red-600" />
              <span>Interactive 80G Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              See How Your Contribution Doubles Its Value
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
              Every rupee donated is eligible for 50% tax deduction under Section 80G. Select an amount below to simulate your real tax savings and ground impact.<Link className='text-red-500' href={"/donation/80G"}>Read more about 80G Benefits</Link>
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-red-200 shadow-xl space-y-6">

            {/* Quick Amount Buttons */}
            <div>
              <label className="font-bold text-xs text-black block mb-2">
                Select or Customize Contribution Amount (INR):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[500, 1100, 2100, 5100, 11000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcAmount(amt)}
                    className={`py-2.5 rounded-xl font-black text-xs transition cursor-pointer ${calcAmount === amt
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-102'
                      : 'bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-red-600 border border-slate-200'
                      }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Range Slider for Granular Simulation */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Slide to adjust amount</span>
                <span className="font-mono font-bold text-black text-sm">₹{calcAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Real-time Calculation Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Donation Earmarked</span>
                <div className="text-xl sm:text-2xl font-black text-black">₹{calcAmount.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-slate-500 block">100% credited to cause</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>50% Tax Saved (80G)</span>
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-700">₹{Math.round(calcAmount * 0.5).toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-emerald-700 block">Deductible under Form 10BD</span>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 space-y-1">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider">Effective Net Cost to You</span>
                <div className="text-xl sm:text-2xl font-black text-red-700">₹{Math.round(calcAmount * 0.5).toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-red-700 block">Actual out-of-pocket</span>
              </div>
            </div>

            {/* Dynamic Tangible Impact Statement */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FiTarget className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-red-950">
                  Your Tangible On-Ground Impact with ₹{calcAmount.toLocaleString('en-IN')}:
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-medium">
                  {getImpactDescription(calcAmount)}
                </p>
              </div>
            </div>

            {/* Direct 1-Click Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant CBDT-Compliant 80G Tax Receipt emailed upon Trustee approval</span>
              </div>

              <Link
                href={`/donation?amount=${calcAmount}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/25 transition cursor-pointer text-center"
              >
                Donate ₹{calcAmount.toLocaleString('en-IN')} &amp; Claim 80G Receipt →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 4. INTERACTIVE CROWDFUNDING DRIVES ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiTarget className="w-3.5 h-3.5 text-red-600" />
                <span>Urgent Crowdfunding Drives</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Support Verified Causes &amp; Save Lives
              </h2>
            </div>

            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>Explore All {campaigns.length} Active Drives</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Cause Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {['All', 'Education', 'Health', 'Youth', 'Relief'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCauseCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${selectedCauseCategory === cat
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200'
                  }`}
              >
                {cat === 'All' ? 'All Drives' : `${cat} Causes`}
              </button>
            ))}
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(filteredCampaigns.length > 0 ? filteredCampaigns.slice(0, 3) : campaigns.slice(0, 3)).map((camp) => {
              const raised = Number(camp.raisedAmount || 0);
              const goal = Number(camp.goalAmount || 100000);
              const percent = Math.min(100, Math.round((raised / (goal || 1)) * 100));
              const banner = getContentImageUrl(camp.bannerImage || (Array.isArray(camp.images) && camp.images[0]));
              const campId = camp._id || camp.id;

              return (
                <div
                  key={campId}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-red-500 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={banner || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                      }}
                    />
                    {camp.urgent && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                        Urgent Need
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {camp.category || 'General'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Attached Campaign ID Badge */}
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-1">
                        <span>Campaign ID:</span>
                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          #{String(campId).slice(-6)}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-black line-clamp-2 leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {camp.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {/* Progress Bar */}
                      <div className="w-full bg-red-50 h-2.5 rounded-full overflow-hidden border border-red-100">
                        <div
                          className="bg-gradient-to-r from-red-600 to-rose-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs mt-2 font-semibold">
                        <span className="text-black font-bold">
                          ₹{raised.toLocaleString('en-IN')} <span className="text-slate-500 font-normal">Raised</span>
                        </span>
                        <span className="text-red-600 font-black">{percent}%</span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                        <span>Target: ₹{goal.toLocaleString('en-IN')}</span>
                        <span>{camp.donorCount || 0} Donors</span>
                      </div>

                      <Link
                        href={`/donation?campaign=${campId}`}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                      >
                        <FiHeart className="w-4 h-4 fill-white" />
                        <span>Donate with Attached ID (80G)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---------------- 5. INTERACTIVE ENGAGEMENT PATHWAYS: VOLUNTEER VS MEMBER ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiUsers className="w-3.5 h-3.5 text-red-600" />
              <span>Choose Your Social Path</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Join as a Volunteer or Certified Member
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Whether you want to contribute on weekends or lead official state campaigns with a verified ID card, we have an active role for you.
            </p>

            {/* Interactive Pathway Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setActivePathway('volunteer')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${activePathway === 'volunteer'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-slate-700 hover:text-black'
                  }`}
              >
                Field Volunteer Pathway
              </button>
              <button
                type="button"
                onClick={() => setActivePathway('member')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${activePathway === 'member'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-slate-700 hover:text-black'
                  }`}
              >
                Official Member Pathway (ID Card)
              </button>
            </div>
          </div>

          {/* Interactive Card Presentation */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
            {activePathway === 'volunteer' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black">
                    Zero Joining Fee • Flexible Field Hours
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-black">
                    Grassroots Field Volunteer Movement
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    Engage directly in child literacy shelters, disaster relief distributions, blood donor drives, and environmental tree plantations. Receive official verification, certificate of recognition, and formal offer letter.
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-slate-800 font-medium">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Official Volunteer Verification &amp; Offer Letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Digitally Verifiable Volunteer Certificate of Honor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>National Network of Like-Minded Youth Leaders</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/volunteer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition"
                    >
                      <span>Apply as Volunteer Online →</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-2xl mx-auto border border-red-200">
                    <FiUsers className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-base text-black">3,500+ Active Volunteers</h4>
                  <p className="text-xs text-slate-600">Operating across 50+ district committees nationwide with 100% voluntary dedication.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    Official Appointment Letter • Verifiable Photo ID Card
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-black">
                    Certified NGO Membership &amp; Representation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    Become an authorized representative of Bharatiya Yuva Kranti in your district. Receive an official photo ID card with QR verification, formal appointment letter, and voting rights in state advisory committees.
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-slate-800 font-medium">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>High-Resolution Photo ID Card with QR Code Authentication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Official Society Appointment Letter Signed by Trustees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Authorized District Representation &amp; Public Directory Listing</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/members"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition"
                    >
                      <span>Apply for Membership &amp; ID Card →</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-red-500/40 shadow-sm text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-2xl mx-auto border border-red-200">
                    <FiCreditCard className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-base text-black">Instant QR-Verified ID Card</h4>
                  <p className="text-xs text-slate-600">Tamper-proof digital credentials verified by government agencies and administrative bodies.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- 6. INTERACTIVE REVIEWS & FEEDBACK SHOWCASE ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiStar className="w-3.5 h-3.5 text-red-600" />
                <span>Verified Supporter Voices</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Trusted by Donors, Volunteers &amp; Communities
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/feedback"
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-red-50 text-black font-bold text-xs shadow-xs transition"
              >
                Write a Review / Feedback →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approvedReviews.map((rev, idx) => (
              <div
                key={rev._id || rev.id || idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : (rev.date || 'Verified')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-4">
                    "{rev.comment || rev.message || 'Great transparency and impactful welfare work.'}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3 mt-4">
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    {(rev.name || 'D').charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-xs text-black truncate">{rev.name || 'Generous Donor'}</h4>
                    <span className="text-[10px] text-red-600 font-semibold block truncate">
                      {rev.role || 'Verified Contributor'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------- 7. GALLERY & FIELD HIGHLIGHTS ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
                <FiImage className="w-3.5 h-3.5 text-red-600" />
                <span>Field Documentation</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Photo &amp; Video Documentation
              </h2>
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>Explore Entire Gallery ({gallery.length} items)</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(gallery.slice(0, 4).length > 0 ? gallery.slice(0, 4) : [
              { title: 'Free Education Kit Distribution', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600', category: 'Child Education' },
              { title: 'Emergency Blood Donation Camp', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600', category: 'Health' },
              { title: 'Women Tailoring & Skill Center', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600', category: 'Livelihood' },
              { title: 'Winter Blanket & Ration Relief', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600', category: 'Disaster Relief' },
            ]).map((item, idx) => (
              <Link
                key={item._id || item.id || idx}
                href="/gallery"
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 aspect-4/3 bg-slate-100 flex flex-col justify-end p-4"
              >
                <img
                  src={getContentImageUrl(item.url || item.imageUrl)}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-black/60 px-2 py-0.5 rounded-md">
                    {item.category || 'Grassroots Impact'}
                  </span>
                  <h4 className="font-bold text-xs mt-1 line-clamp-1 leading-snug text-white">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------- 8. UPCOMING EVENTS & CONFERENCES ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiCalendar className="w-3.5 h-3.5 text-red-600" />
                <span>Foundation Gatherings</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Upcoming Foundation Events &amp; Summits
              </h2>
            </div>
            <Link
              href="/event"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>Explore All Events</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((evt) => {
              const attendeeCount = evt.attendees ? evt.attendees.length : (evt.attendeeCount || 0);

              return (
                <div
                  key={evt._id || evt.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Auto Slideshow Photo Carousel (Up to 5 images) */}
                    <EventImageCarousel
                      images={evt.images}
                      fallbackImage={evt.image || evt.imageUrl}
                      title={evt.title}
                      className="h-48"
                      badgeText={evt.date || 'Upcoming'}
                    />

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-full text-[11px] border border-red-200">
                          <FiUsers className="w-3.5 h-3.5 text-red-600" />
                          <span>{attendeeCount} Registered</span>
                        </span>
                        <span className="text-slate-500 font-semibold text-[11px]">{evt.time || '10:00 AM'}</span>
                      </div>

                      <h3 className="text-base font-black text-black">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-700 mt-2 leading-relaxed line-clamp-2 font-medium">
                        {evt.description}
                      </p>

                      <div className="pt-2">
                        <div className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                          <FiMapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-black block">{evt.location || 'Foundation Head Office'}</span>
                            {evt.locationAddress && (
                              <span className="text-[11px] text-slate-500 line-clamp-1 block">
                                {evt.locationAddress}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100">
                    <Link
                      href="/event"
                      className="w-full text-center py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition block"
                    >
                      Attend / Register for Event
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 9. DIRECT UPI & BANK GIVING ---------------- */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-sm">
                <FiShield className="w-4 h-4 text-white" />
                Income Tax Exemption under Section 80G &amp; 12A
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
                Claim <span className="text-yellow-300">50% Tax Deduction</span> on Every Donation You Make!
              </h2>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                All donations to Indian Youth Foundation are eligible for 50% deduction under Section 80G of the Income Tax Act. Official digitally verified 80G receipts with unique QR verification codes are generated immediately upon donation.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-white/80 text-[11px] font-bold">80G Approval Number:</div>
                  <div className="text-white font-mono font-black mt-1 text-xs">{settings?.exemption80G || 'AABTI1234F2024'}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-white/80 text-[11px] font-bold">12A Registration Number:</div>
                  <div className="text-white font-mono font-black mt-1 text-xs">{settings?.exemption12A || '12A-DEL-2024'}</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-4">
                <Link
                  href="/donation"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-red-50 text-red-700 font-black text-xs shadow-xl transition cursor-pointer"
                >
                  Donate Online &amp; Get 80G Receipt
                </Link>
                <Link
                  href="/certificates"
                  className="px-6 py-3.5 rounded-2xl bg-red-950/40 hover:bg-red-950/60 text-white font-bold text-xs border border-white/30 transition backdrop-blur-sm cursor-pointer"
                >
                  View Statutory Certificates
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white text-black p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center border-4 border-white">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Direct UPI Giving</span>
              <h3 className="text-base font-black text-black mt-1">Scan &amp; Donate with Any UPI App</h3>
              <div className="my-5 p-3 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
                <img
                  src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                  alt="UPI Donation QR Code"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              </div>
              <p className="text-xs font-mono font-bold text-black bg-red-50 border border-red-200 px-4 py-1.5 rounded-full">
                {settings?.upiId || 'bharatiyauva@okhdfcbank'}
              </p>
              <p className="text-[11px] text-slate-600 mt-2.5 font-medium">
                Bank A/C: {settings?.bankDetails?.accountName || 'Indian Youth Foundation'} • {settings?.bankDetails?.bankName || 'State Bank of India'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 10. HEAD OFFICE & 24/7 HELPLINE ---------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Head Office &amp; Help Desk</span>
              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Visit Our National Foundation Office
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Connect with our directors and state coordinators for CSR partnerships, membership drives, and volunteer initiatives.
              </p>

              <div className="space-y-3 text-xs text-black bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm font-medium">
                <div className="flex items-start gap-2.5">
                  <FiMapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{settings?.address || 'Indian Youth Foundation Head Office, Aligarh, Uttar Pradesh'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiPhone className="w-4 h-4 text-red-600 shrink-0" />
                  <span>24x7 Helpline: <strong className="text-black">{settings?.phone || '+91 7851051298'}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiMail className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Email: <strong className="text-black">{settings?.email || 'contact@indianyouthfoundation.org'}</strong></span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/complaints"
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
                >
                  Contact Form / Inquiries
                </Link>
                <Link
                  href="/volunteer"
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-red-50 text-black font-bold text-xs border border-slate-300 transition cursor-pointer"
                >
                  Join as Volunteer
                </Link>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="lg:col-span-7 h-88 rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <iframe
                title="NGO Head Office Location Map"
                src={settings?.googleMapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112999.8824302613!2d78.0101683972656!3d27.8973944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974a4805e1b21ef%3A0xb36340c2be3a525e!2sAligarh%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
