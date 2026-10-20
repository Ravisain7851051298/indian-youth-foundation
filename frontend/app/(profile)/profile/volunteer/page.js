'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiUserCheck, 
  FiShield, 
  FiAward, 
  FiCheckCircle, 
  FiHeart, 
  FiClock, 
  FiArrowRight, 
  FiUserPlus,
  FiActivity,
  FiPhone,
  FiExternalLink
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { useSelector } from 'react-redux';

export default function ProfileVolunteerPage() {
  const { currentUser, settings } = useNGO();
  const reduxUser = useSelector((state) => state.auth?.user);
  const effectiveUser = reduxUser || currentUser;

  const isVolunteer = (
    effectiveUser?.role === 'Volunteer' || 
    effectiveUser?.isVolunteer || 
    effectiveUser?.volunteerApplication?.status === 'approved' ||
    effectiveUser?.volunteerApplication?.status === 'pending'
  );

  const volunteerApp = effectiveUser?.volunteerApplication;
  const volunteerId = effectiveUser?.volunteerId || volunteerApp?.volunteerId || (effectiveUser?.role === 'Volunteer' ? effectiveUser?.memberId : null);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold mb-2 border border-indigo-200">
            <FiUserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Grassroots Social Welfare Wing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Grassroots Volunteer Service Profile
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Community service assignments, volunteer ID credentials, field drive participation, and honors.
          </p>
        </div>

        {isVolunteer && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/profile/id-card?type=volunteer"
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <FiShield className="w-4 h-4" />
              <span>Volunteer ID Card</span>
            </Link>
            <Link
              href="/profile/certificates"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <FiAward className="w-4 h-4" />
              <span>Drive Certificates</span>
            </Link>
          </div>
        )}
      </div>

      {/* ----------------- VOLUNTEER STATUS DISPLAY ----------------- */}
      {isVolunteer ? (
        <div className="space-y-6">
          {/* Volunteer Hero Banner */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs inline-block">
                  Active Volunteer Contributor
                </span>
                <h2 className="text-xl sm:text-2xl font-black">
                  {effectiveUser?.name}
                </h2>
                <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
                  Thank you for serving on the frontlines of humanitarian action! As an authorized volunteer of <strong>Yuva Kranti Dal</strong>, you lead blood donation helplines, free child teaching classes, and relief distribution.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-indigo-200 block">Volunteer Badge ID</span>
                <span className="text-xl font-mono font-black text-white block mt-0.5">
                  {volunteerId || 'VOL-ACTIVE'}
                </span>
                <span className="text-[10px] text-indigo-200 mt-1 inline-flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3 text-emerald-300" /> Grassroots Authorized
                </span>
              </div>
            </div>
          </div>

          {/* Volunteer Service Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Service Focus</span>
              <span className="font-black text-black text-sm mt-1 block truncate" title={volunteerApp?.skills || 'Child Education & Blood Drives'}>
                {volunteerApp?.skills || 'Child Education & Blood Drives'}
              </span>
              <span className="text-[11px] text-indigo-600 font-bold mt-1 block">Active Field Drive</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Volunteer Availability</span>
              <span className="font-black text-black text-sm mt-1 block">
                {volunteerApp?.availability || 'Weekends & Outreach Drives'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Flexible Scheduling</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Assigned Division</span>
              <span className="font-black text-indigo-700 text-sm mt-1 block">
                {effectiveUser?.district || 'Aligarh'}, {effectiveUser?.state || 'Uttar Pradesh'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Northern Regional Wing</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-bold block text-[10px] uppercase">Blood Group &amp; Donor Status</span>
              <span className="font-mono font-black text-red-600 text-sm mt-1 block">
                {effectiveUser?.bloodGroup || 'O+'} (Verified)
              </span>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Emergency Roster Sync</span>
            </div>
          </div>

          {/* Volunteer Actions & Certificates */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-black text-black text-base flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Volunteer Credentials &amp; Certifications</span>
              <span className="text-xs text-slate-500 font-normal">Official Digital Verification</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiShield className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Official Volunteer Identity Card</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Carry your digital volunteer badge for ground authentication during hospital blood drives, municipal relief camps, and school education projects.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/id-card?type=volunteer"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Open Volunteer ID Card</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-black text-sm">Volunteer Certificates of Appreciation</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Official Certificates of Honor issued by the National Executive Trustee for selfless volunteer hours, emergency response, and social impact.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/profile/certificates"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Awarded Certificates</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ----------------- NOT A VOLUNTEER YET (ENROLMENT INFO) ----------------- */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-indigo-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl shrink-0 border border-indigo-200 shadow-inner">
                  <FiUserPlus className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Youth Volunteer Wing
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• Open Enrolment</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-black">
                    Join the Grassroots Volunteer Movement
                  </h2>
                  <p className="text-xs text-black leading-relaxed max-w-2xl font-medium">
                    Volunteer with Yuva Kranti Dal to bring real change at the grassroots level: free child slum teaching, 24x7 blood bank helplines, tree plantations, and emergency relief drives.
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <Link
                  href="/profile/apply-volunteer"
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Apply as Volunteer Now</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Volunteer Activities Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 font-black">
                  <FiHeart className="w-4 h-4 text-red-600" />
                  <span>24x7 Emergency Blood Roster</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Respond to urgent critical hospital blood requests across district networks and save innocent lives.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 font-black">
                  <FiActivity className="w-4 h-4 text-indigo-600" />
                  <span>Free Slum Child Education</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Teach basic literacy, arithmetic, and digital education to underprivileged street and slum children.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 font-black">
                  <FiAward className="w-4 h-4 text-amber-600" />
                  <span>Certificates &amp; National Honors</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Earn digitally verifiable Certificates of Honor from the Board of Trustees recognized for CVs and careers.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium">
                No compulsory fees. 100% voluntary service for community empowerment.
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/volunteer"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-black font-bold text-xs hover:bg-slate-50 transition"
                >
                  Volunteer Program Info
                </Link>
                <Link
                  href="/profile/apply-volunteer"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <span>Fill Volunteer Form</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
