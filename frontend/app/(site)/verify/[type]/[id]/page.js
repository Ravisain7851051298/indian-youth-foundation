'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiShield, FiXCircle, FiAward, FiHeart, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function VerificationPage() {
  const params = useParams();
  const { type, id } = params;
  const { members, certificates, donations, settings } = useNGO();

  let verified = false;
  let title = '';
  let details = null;

  if (type === 'member' || type === 'letter') {
    title = type === 'member' ? 'Official Member ID Card Verification' : 'Official Appointment Letter Verification';
    const found = members.find(m => m.memberId === id || m._id === id);
    if (found && found.status === 'active') {
      verified = true;
      details = (
        <div className="space-y-3 text-xs text-left bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3.5 mb-2">
            <img
              src={found.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={found.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-red-500 shadow-xs"
            />
            <div>
              <h4 className="font-extrabold text-base text-black">{found.name}</h4>
              <span className="text-red-600 font-bold block">{found.designation}</span>
              <div className="font-mono text-slate-500 text-[11px] font-bold">{found.memberId}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-slate-700 pt-1 border-t border-slate-200/60">
            <div>Blood Group: <strong className="text-red-600 font-bold">{found.bloodGroup}</strong></div>
            <div>Role: <strong className="text-black font-bold">{found.role}</strong></div>
            <div>State: <strong className="text-black">{found.state || 'Rajasthan'}</strong></div>
            <div>Status: <strong className="text-emerald-600 font-bold">Authorized &amp; Active</strong></div>
          </div>
        </div>
      );
    }
  } else if (type === 'certificate') {
    title = 'Certificate of Appreciation Verification';
    const found = certificates.find(c => c.certificateNo === id);
    if (found) {
      verified = true;
      details = (
        <div className="space-y-3 text-xs text-left bg-red-50/60 p-5 rounded-2xl border border-red-200">
          <div className="font-mono text-red-600 font-bold">{found.certificateNo}</div>
          <h4 className="font-extrabold text-base text-black">{found.recipientName}</h4>
          <div className="text-red-900 font-bold">{found.awardTitle}</div>
          <p className="text-slate-700 leading-relaxed">{found.description}</p>
          <div className="text-[11px] text-slate-500 font-medium">Issue Date: {found.issueDate}</div>
        </div>
      );
    }
  } else if (type === 'donation') {
    title = '80G Tax Exemption Donation Receipt Verification';
    const found = donations.find(d => d.receiptNumber === id);
    if (found) {
      verified = true;
      details = (
        <div className="space-y-3 text-xs text-left bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200">
          <div className="font-mono text-emerald-700 font-bold">{found.receiptNumber}</div>
          <h4 className="font-extrabold text-base text-black">{found.donorName}</h4>
          <div className="text-2xl font-black text-emerald-700">₹{Number(found.amount).toLocaleString('en-IN')}</div>
          <div className="text-slate-700">Donor PAN: <strong className="font-mono text-black">{found.panNumber || 'NA'}</strong></div>
          <div className="text-slate-700">Cause: <strong className="text-black">{found.campaignTitle}</strong></div>
          <div className="text-[11px] text-emerald-800 font-bold pt-1 border-t border-emerald-200">
            ✓ Genuine digital tax receipt eligible under Section 80G of Income Tax Act
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        {verified ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              <FiCheckCircle className="w-10 h-10" />
            </div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
              Verified &amp; Authentic Record
            </div>
            <h1 className="text-xl font-black text-black mb-4">{title}</h1>
            {details}
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              Organization: <strong className="text-black">{settings?.ngoName || 'Indian Youth Foundation'}</strong> | 12A &amp; 80G Certified
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
              <FiXCircle className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-black text-black">Invalid or Unverified Record!</h1>
            <p className="text-xs text-slate-700 mt-2">
              No authenticated record found for ID <strong className="font-mono text-black">{id}</strong> on our official NGO registry. This card or document may be invalid.
            </p>
          </>
        )}

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
