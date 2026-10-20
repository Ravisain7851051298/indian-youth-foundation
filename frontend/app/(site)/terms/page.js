'use client';

import React from 'react';
import Link from 'next/link';
import { FiFileText, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import ContentRenderer from '@/components/ContentRenderer';

export default function TermsPage() {
  const { settings } = useNGO();

  const defaultTermsContent = `## 1. Acceptance of Terms
By accessing, browsing, registering as a member, or donating on this website, you agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms, you should discontinue using this portal.

## 2. Online Donations & 80G Tax Receipts
- All donations contributed through this portal are applied directly towards humanitarian relief, child education, healthcare assistance, and community welfare programs.
- Donations are eligible for 50% income tax deduction under Section 80G of the Indian Income Tax Act, 1961 (Approval Order: **${settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881'}**).
- To receive a valid Section 80G tax certificate, donors must provide their valid Indian Permanent Account Number (PAN) and postal address during payment.
- Official digitally verified donation receipts bearing unique receipt numbers and QR codes are issued immediately upon successful transaction completion.

## 3. Non-Refundable Donation Policy
As donations are voluntary charitable contributions committed promptly towards ongoing social causes and emergency supplies, they are generally **non-refundable**. However, in verified instances of technical error (such as erroneous double deductions through the payment gateway), a written refund request can be filed within 7 calendar days accompanied by transaction proof.

## 4. Code of Conduct for Members & Volunteers
- Every registered Member and Volunteer must conduct themselves in alignment with the national ideals and peaceful constitution of the Foundation.
- Official Member ID Cards, Appointment Letters, and certificates issued by the Foundation remain the intellectual property of Yuva Kranti Dal.
- Members are strictly prohibited from using foundation identification, seals, or letterheads for personal commercial exploitation, unauthorized political lobbying, or illegal activities. Any misuse results in immediate termination of membership and criminal prosecution.

## 5. Protection of Official Logo, Seals & Signatures
All trademarks, logos, official stamps/seals, digital signatures of executive trustees, website graphics, and software workflows displayed across this portal are exclusively owned by Yuva Kranti Dal. Unauthorized reproduction, modification, or counterfeit duplication is actionable under Indian Copyright and Intellectual Property laws.

## 6. Governing Law & Legal Jurisdiction
These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute or arbitration, the courts having jurisdiction in **Aligarh, Uttar Pradesh** shall have exclusive jurisdiction.`;

  const activeContent = settings?.termsContent || defaultTermsContent;

  return (
    <div className="min-h-screen bg-slate-50 py-16 selection:bg-emerald-600 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-3 border border-emerald-200">
            <FiFileText className="w-4 h-4 text-emerald-700" />
            <span>Legal Agreement &amp; Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            {settings?.termsTitle || 'Terms & Conditions of Service'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-2xl mx-auto font-medium">
            {settings?.termsSubtitle || 'Rules, guidelines, and legal agreements governing the use of the Yuva Kranti Dal website, online donations, and member services.'}
          </p>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Effective Date: {settings?.termsEffectiveDate || 'October 2026'} • Statutory Non-Profit Jurisdiction
          </div>
        </div>

        {/* Dynamic Content Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <ContentRenderer content={activeContent} />

          {/* Legal Contact Card */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-3">
              Official Legal &amp; Administrative Correspondence
            </h3>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5 font-medium text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <FiMail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Contact Email: <a href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`} className="text-emerald-700 font-bold underline">{settings?.email || 'samasyasamadhanparishad@gmail.com'}</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <FiPhone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Telephone: <a href={`tel:${settings?.phone || '+91 93196 98759'}`} className="text-black font-bold">{settings?.phone || '+91 93196 98759'}</a></span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <FiMapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Registered Office: {settings?.address || 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition"
          >
            ← Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
