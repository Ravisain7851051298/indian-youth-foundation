'use client';

import React from 'react';
import Link from 'next/link';
import { FiFileText, FiShield, FiCheckCircle, FiAlertTriangle, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function TermsPage() {
  const { settings } = useNGO();

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 font-extrabold text-xs mb-3">
            <FiFileText className="w-4 h-4 text-red-600" />
            <span>Legal Agreement &amp; Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Terms &amp; Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-2xl mx-auto">
            Rules, guidelines, and legal agreements governing the use of the Indian Youth Foundation website, online donations, and member services.
          </p>
          <div className="text-[11px] text-slate-500 mt-2">
            Effective Date: October 2026 • Statutory Non-Profit Jurisdiction
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p>
              By accessing, browsing, registering as a member, or donating on this website (<strong>bharatiyayuvakranti.org</strong>), you agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not accept these terms, you should discontinue using this portal.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Online Donations &amp; 80G Tax Receipts</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>All donations contributed through this portal are applied directly towards humanitarian relief, child education, healthcare assistance, and community welfare programs.</li>
              <li>Donations are eligible for 50% income tax deduction under Section 80G of the Indian Income Tax Act, 1961 (Approval Order: <strong>{settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881'}</strong>).</li>
              <li>To receive a valid Section 80G tax certificate, donors must provide their valid Indian Permanent Account Number (PAN) and postal address during payment.</li>
              <li>Official digitally verified donation receipts bearing unique receipt numbers and QR codes are issued immediately upon successful transaction completion.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs">3</span>
              <span>Non-Refundable Donation Policy</span>
            </h2>
            <p>
              As donations are voluntary charitable contributions committed promptly towards ongoing social causes and emergency supplies, they are generally <strong>non-refundable</strong>. However, in verified instances of technical error (such as erroneous double deductions through the payment gateway), a written refund request can be filed within 7 calendar days at <strong>{settings?.email || 'samasyasamadhanparishad@gmail.com'}</strong> accompanied by transaction proof.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs">4</span>
              <span>Code of Conduct for Members &amp; Volunteers</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Every registered Member and Volunteer must conduct themselves in alignment with the national ideals and peaceful constitution of the Foundation.</li>
              <li>Official Member ID Cards, Appointment Letters, and certificates issued by the Foundation remain the intellectual property of Indian Youth Foundation.</li>
              <li>Members are strictly prohibited from using foundation identification, seals, or letterheads for personal commercial exploitation, unauthorized political lobbying, or illegal activities. Any misuse results in immediate termination of membership and criminal prosecution.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs">5</span>
              <span>Protection of Official Logo, Seals &amp; Signatures</span>
            </h2>
            <p>
              All trademarks, logos, official stamps/seals, digital signatures of executive trustees, website graphics, and software workflows displayed across this portal are exclusively owned by Indian Youth Foundation. Unauthorized reproduction, modification, or counterfeit duplication is actionable under Indian Copyright and Intellectual Property laws.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs">6</span>
              <span>Governing Law &amp; Legal Jurisdiction</span>
            </h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute or arbitration, the courts having jurisdiction in <strong>Aligarh, Uttar Pradesh</strong> shall have exclusive jurisdiction.
            </p>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 font-medium mt-4">
              <div className="flex items-center gap-2 text-slate-800">
                <FiMail className="w-4 h-4 text-red-600 shrink-0" />
                <span>Contact Email: <a href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`} className="text-red-600 font-bold underline">{settings?.email || 'samasyasamadhanparishad@gmail.com'}</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <FiPhone className="w-4 h-4 text-red-600 shrink-0" />
                <span>Telephone: <a href={`tel:${settings?.phone || '+91 93196 98759'}`} className="text-black font-bold">{settings?.phone || '+91 93196 98759'}</a></span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <FiMapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Registered Office: {settings?.address || 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh'}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
