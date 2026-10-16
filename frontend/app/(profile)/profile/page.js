'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FiUser, 
  FiCreditCard, 
  FiFileText, 
  FiAward, 
  FiHeart, 
  FiShield, 
  FiArrowRight,
  FiUploadCloud,
  FiCheckCircle,
  FiCheck,
  FiDownload,
  FiPrinter,
  FiExternalLink,
  FiUserCheck,
  FiUserPlus,
  FiClock,
  FiMail
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ProfileOverviewPage() {
  const { currentUser, settings, refreshUser } = useNGO();
  const [certificates, setCertificates] = useState([]);
  const [certsLoading, setCertsLoading] = useState(true);

  useEffect(() => {
    if (refreshUser) refreshUser();

    let isMounted = true;
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates');
        if (isMounted && res.data?.success) {
          setCertificates(res.data.certificates || []);
        }
      } catch (err) {
        console.warn('Note fetching certificates on profile overview:', err.message);
      } finally {
        if (isMounted) setCertsLoading(false);
      }
    };

    fetchCertificates();
    return () => { isMounted = false; };
  }, [refreshUser]);

  const isVerified = currentUser?.status === 'active';
  const isPending = currentUser?.status === 'pending';

  // Membership status detection (strictly prevent donor ID BYK-DON- from being treated as member)
  const isMember = Boolean(
    currentUser?.role === 'Member' || 
    currentUser?.role === 'Admin' || 
    (currentUser?.isMember && !currentUser?.memberId?.startsWith('BYK-DON-')) ||
    (currentUser?.membershipApplication?.status === 'approved') ||
    (currentUser?.memberId && (currentUser.memberId.startsWith('BYK-MEM-') || currentUser.memberId.startsWith('MEM-')))
  );
  const memberApp = currentUser?.membershipApplication;

  // Volunteer status detection
  const isVolunteer = Boolean(
    currentUser?.role === 'Volunteer' || 
    currentUser?.isVolunteer || 
    currentUser?.volunteerApplication?.status === 'approved' || 
    currentUser?.volunteerApplication?.status === 'pending' ||
    (currentUser?.volunteerId && !currentUser?.volunteerId?.startsWith('BYK-DON-'))
  );
  const volunteerApp = currentUser?.volunteerApplication;

  return (
    <div className="space-y-8">
      {/* ----------------- TOP STATUS HERO BANNER ----------------- */}
      {isPending ? (
        <div className="bg-red-50/60 border-2 border-red-300 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                <FiClock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-200 text-red-900 inline-block">
                  Statutory Verification Desk
                </span>
                <h2 className="text-lg sm:text-xl font-black text-black">
                  Application Under Review by Trustees
                </h2>
                <p className="text-xs text-black leading-relaxed max-w-2xl font-medium">
                  <strong>Zero-Fraud Institutional Policy:</strong> To protect the legal integrity of Indian Youth Foundation (12A &amp; 80G Certified NGO), official credentials (ID Cards, Formal Appointment Letters, or Certificates) are validated against bank ledgers by the administrative committee.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/profile/apply-member"
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiUploadCloud className="w-4 h-4" />
                <span>Upload Payment Proof</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                <FiCheckCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 inline-block">
                  Verified Active Credentials
                </span>
                <h2 className="text-lg sm:text-xl font-black text-black">
                  Welcome, {currentUser?.name}!
                </h2>
                <p className="text-xs text-black leading-relaxed max-w-2xl font-medium">
                  Your appointment as <strong>{currentUser?.designation || 'Active Social Worker'}</strong> has been officially approved by the National Executive Council.
                  Your digital ID card, appointment letter, and awarded certificates are active and verified.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Link
                href="/profile/id-card"
                className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiShield className="w-4 h-4" />
                <span>Open Digital ID Card</span>
              </Link>
              <Link
                href="/profile/certificates"
                className="px-5 py-2.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FiAward className="w-4 h-4" />
                <span>My Certificates ({certificates.length})</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 4 QUICK ACCESS ACTION CARDS ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Certificates */}
        <Link
          href="/profile/certificates"
          className="bg-white p-5 rounded-3xl border-2 border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-amber-200">
            <FiAward className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-black text-sm">My Certificates</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
              {certificates.length} Issued
            </span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium mt-1">
            {certificates.length > 0 
              ? `${certificates.length} National citations awarded & verifiable` 
              : 'Appreciation honors issued by Board of Trustees'}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-700">
            <span>View Certificates</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 2: Membership Status */}
        <Link
          href="/profile/member"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiCreditCard className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-black text-sm">Membership</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isMember ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
              {isMember ? 'Active' : 'Not Joined'}
            </span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium mt-1">
            {isMember ? (currentUser?.membershipPlan || 'Official Foundation Member') : 'Constitutional membership with digital ID card'}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>{isMember ? 'Membership Hub' : 'Learn & Apply'}</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 3: Volunteer Wing */}
        <Link
          href="/profile/volunteer"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiUserCheck className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-black text-sm">Volunteer Wing</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isVolunteer ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
              {isVolunteer ? 'Enrolled' : 'Not Joined'}
            </span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium mt-1">
            {isVolunteer ? 'Active in field outreach & blood helplines' : 'Participate in drives, education & relief'}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>{isVolunteer ? 'Volunteer Hub' : 'Join Wing'}</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 4: 80G Receipts */}
        <Link
          href="/profile/donations"
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-red-400 shadow-xs hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition border border-red-200">
            <FiHeart className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-black text-black text-sm">80G Receipts</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
              Tax Exempt
            </span>
          </div>
          <p className="text-[11px] text-slate-700 font-medium mt-1">
            Download verified 80G tax exemption receipts for IT returns.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600">
            <span>View Receipts</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* ----------------- SECTION 1: MY CERTIFICATES DISPLAY ----------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
              <FiAward className="w-3.5 h-3.5 text-amber-600" />
              <span>Official Honors & Citations</span>
            </div>
            <h3 className="text-xl font-black text-black tracking-tight">
              My Conferred Certificates
            </h3>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              When Trustees or Admin issue a certificate, it is automatically sent to your registered email with high-res PDF attached and saved here.
            </p>
          </div>

          <Link
            href="/profile/certificates"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Certificates Portal</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {certsLoading ? (
          <div className="py-8 text-center text-xs text-slate-600 font-bold flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Checking certificate registry...</span>
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-amber-50/40 rounded-2xl p-6 border border-amber-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl">
              <FiAward className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-black">No Certificates Conferred Yet</h4>
            <p className="text-xs text-slate-700 max-w-lg mx-auto font-medium leading-relaxed">
              Certificates of Appreciation, National Youth Service, and Drive Leadership are awarded by the Board of Trustees for participation in blood helplines, slum education, and social drives.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-amber-900 font-bold">
              <FiMail className="w-3.5 h-3.5 text-amber-700" />
              <span>Notifications will arrive at: {currentUser?.email}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert._id || cert.certificateId}
                className="bg-amber-50/20 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      {cert.certificateId || cert.certificateNo}
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      {new Date(cert.issueDate || cert.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-black leading-snug">
                    {cert.title}
                  </h4>
                  {cert.titleHi && (
                    <p className="text-xs text-amber-800 font-bold mt-0.5">{cert.titleHi}</p>
                  )}
                  <p className="text-[11px] text-slate-700 font-medium mt-2 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-xl border border-amber-100">
                    {cert.reason}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">
                    {cert.issuedBy || 'National Executive Council'}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/certificates/${cert.certificateId || cert._id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-slate-900 text-white font-bold text-[11px] flex items-center gap-1 transition"
                      title="Download PDF"
                    >
                      <FiDownload className="w-3 h-3" />
                      <span>PDF</span>
                    </a>
                    <Link
                      href="/profile/certificates"
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      <FiPrinter className="w-3 h-3" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ----------------- AFFILIATION HUBS (NESTED PAGES NAVIGATION) ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Hub Card */}
        <div className={`bg-white rounded-3xl p-6 sm:p-7 border-2 ${isMember ? 'border-emerald-200 shadow-sm' : 'border-slate-200 shadow-2xs'} flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-200">
                <FiCreditCard className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isMember ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                {isMember ? 'Active Member' : 'Open Enrolment'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-black">Foundation Membership Hub</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isMember 
                  ? `Enrolled as ${currentUser?.membershipPlan || 'Official Foundation Member'}. View your statutory voting rights, appointment letter, and ID card.`
                  : 'Join as an official verified member of Indian Youth Foundation. Receive official photo ID card, appointment letter, and governance voting rights.'
                }
              </p>
            </div>

            {isMember && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Membership ID</span>
                  <span className="font-mono font-black text-red-600 text-xs block mt-0.5">{currentUser?.memberId || 'Verification in progress'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Status</span>
                  <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 justify-end mt-0.5">
                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <Link
              href="/profile/member"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
            >
              <span>{isMember ? 'Open Membership Profile' : 'Explore Membership'}</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
            {!isMember && (
              <Link
                href="/profile/apply-member"
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:border-red-400 hover:text-red-600 text-black font-bold text-xs transition shrink-0"
              >
                Apply
              </Link>
            )}
          </div>
        </div>

        {/* Volunteer Hub Card */}
        <div className={`bg-white rounded-3xl p-6 sm:p-7 border-2 ${isVolunteer ? 'border-indigo-200 shadow-sm' : 'border-slate-200 shadow-2xs'} flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-200">
                <FiUserCheck className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isVolunteer ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'}`}>
                {isVolunteer ? 'Active Volunteer' : 'Join Network'}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-black">Grassroots Volunteer Wing</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isVolunteer 
                  ? 'Authorized volunteer for field outreach, slum child education, and emergency blood donation helplines.'
                  : 'Empower communities through grassroots action. Participate in relief drives, earn Certificates of Appreciation, and receive a volunteer badge.'
                }
              </p>
            </div>

            {isVolunteer && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Volunteer Wing</span>
                  <span className="font-bold text-black text-xs block mt-0.5">{currentUser?.designation || 'Youth Social Contributor'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">District</span>
                  <span className="font-bold text-indigo-700 text-xs block mt-0.5">{currentUser?.district || 'Aligarh'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <Link
              href="/profile/volunteer"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
            >
              <span>{isVolunteer ? 'Open Volunteer Profile' : 'Explore Volunteer Wing'}</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ----------------- REGISTRATION & TRUST METADATA CARD ----------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <h3 className="font-black text-black text-sm mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Official Trust Enrolment Profile</span>
          <span className="text-xs font-normal text-slate-700 font-medium">
            Registered Head Office: Krishna Vihar Pala Road Aligarh
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-slate-500 font-bold block">Full Legal Name</span>
            <span className="font-bold text-black text-sm mt-0.5 block">{currentUser?.name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block">Registered Email</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.email}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block">Verified Mobile</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.phone}</span>
          </div>
          {isMember && (
            <div>
              <span className="text-slate-500 font-bold block">Official Member ID</span>
              <span className="font-mono font-bold text-red-600 mt-0.5 block">
                {currentUser?.memberId && !currentUser?.memberId.startsWith('BYK-DON-') ? currentUser.memberId : (currentUser?.membershipApplication?.assignedMemberId || 'BYK-MEM-PENDING')}
              </span>
            </div>
          )}
          {isVolunteer && (
            <div>
              <span className="text-slate-500 font-bold block">Official Volunteer ID</span>
              <span className="font-mono font-bold text-indigo-700 mt-0.5 block">
                {currentUser?.volunteerId && !currentUser?.volunteerId.startsWith('BYK-DON-') 
                  ? currentUser.volunteerId 
                  : (currentUser?.volunteerApplication?.assignedVolunteerId || `BYK-VOL-${currentUser?.phone ? currentUser.phone.slice(-4) : '2026'}`)}
              </span>
            </div>
          )}
          {!isMember && !isVolunteer && (
            <div>
              <span className="text-slate-500 font-bold block">User Reference ID</span>
              <span className="font-mono font-bold text-slate-700 mt-0.5 block">
                {currentUser?.memberId || 'REG-USER'}
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-500 font-bold block">Blood Group</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.bloodGroup || 'O+'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block">Designation / Role</span>
            <span className="font-bold text-black mt-0.5 block">{currentUser?.designation || (isVolunteer ? 'Active Volunteer' : currentUser?.role)}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block">District / State</span>
            <span className="font-bold text-black mt-0.5 block">
              {currentUser?.district || 'Aligarh'}, {currentUser?.state || 'Uttar Pradesh'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block">Verification Status</span>
            <span className={`inline-flex items-center gap-1.5 mt-0.5 font-bold ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isVerified ? (
                <>
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified by Trustee Board</span>
                </>
              ) : (
                <>
                  <FiClock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Audit Clearance Pending</span>
                </>
              )}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block">Statutory Act Registration</span>
            <span className="font-bold text-black mt-0.5 block">
              {settings?.registrationNo || '421/2019'} (12A &amp; 80G Certified)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
