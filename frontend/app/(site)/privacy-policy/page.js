'use client';

import React from 'react';
import Link from 'next/link';
import { FiShield, FiLock, FiCheckCircle, FiFileText, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function PrivacyPolicyPage() {
  const { settings } = useNGO();

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs mb-3">
            <FiShield className="w-4 h-4" />
            <span>Statutory Compliance & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            Indian Youth Foundation (Bharatiya Yuva Kranti) is dedicated to maintaining full transparency, safeguarding donor privacy, and protecting personal data.
          </p>
          <div className="text-[11px] text-slate-400 mt-2">
            Last Updated & Verified: October 2026 • Valid for All Online Donations & Member Registrations
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Information We Collect</span>
            </h2>
            <p>
              When you interact with Indian Youth Foundation through donations, membership registrations, volunteer drives, or contact inquiries, we collect information necessary to fulfill our statutory non-profit functions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Personal Identity:</strong> Full name, date of birth, gender, blood group, and residential address.</li>
              <li><strong>Contact Information:</strong> Verified mobile phone number, WhatsApp contact, and email address.</li>
              <li><strong>Statutory Tax Data (for 80G Receipts):</strong> Permanent Account Number (PAN Card No.) and postal address, mandatory under the Income Tax Act, 1961 (Form 10BD reporting).</li>
              <li><strong>Payment Transaction Data:</strong> Unique transaction ID, payment method (UPI, Netbanking, Debit/Credit Card), timestamp, and donation amount. We do NOT store credit card numbers, CVVs, or net banking passwords on our servers.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs">2</span>
              <span>How We Use Your Information</span>
            </h2>
            <p>
              All personal and financial details collected by the Foundation are used strictly for legitimate charitable administration:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Generating and delivering instant, digitally signed Section 80G tax exemption donation receipts.</li>
              <li>Issuing verified digital membership ID cards, appointment letters, and appreciation certificates.</li>
              <li>Reporting donor contribution records to the Income Tax Department via Form 10BD for donor tax deductions.</li>
              <li>Communicating program updates, emergency blood donation appeals, and humanitarian relief bulletins.</li>
              <li>Investigating grievances, feedback, and community service inquiries submitted to the administration.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs">3</span>
              <span>Payment Gateway Security & Encryption</span>
            </h2>
            <p>
              Online payments on this portal are processed via Reserve Bank of India (RBI) authorized payment gateways (including Razorpay & UPI rails) utilizing industry-grade 256-bit SSL encryption. Indian Youth Foundation adheres to PCI-DSS compliance standards ensuring seamless, tamper-proof electronic transactions.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs">4</span>
              <span>Non-Disclosure & Data Confidentiality</span>
            </h2>
            <p>
              We enforce a strict non-disclosure policy. Indian Youth Foundation does <strong>never rent, sell, trade, or commercially share</strong> our donor or member records with any third-party marketing agency. Information is disclosed solely when mandated by Indian law or competent regulatory bodies (e.g., Income Tax Department, NITI Aayog).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs">5</span>
              <span>Your Rights & Grievance Redressal</span>
            </h2>
            <p>
              Donors and registered members maintain the right to review their records, request correction of inaccurate details, or download their cumulative donation statements. For questions or grievance escalation:
            </p>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 font-medium">
              <div className="flex items-center gap-2 text-slate-800">
                <FiMail className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Grievance Email: <a href={`mailto:${settings?.email || 'samasyasamadhanparishad@gmail.com'}`} className="text-orange-600 font-bold underline">{settings?.email || 'samasyasamadhanparishad@gmail.com'}</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <FiPhone className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Helpline: <a href={`tel:${settings?.phone || '+91 93196 98759'}`} className="text-slate-900 font-bold">{settings?.phone || '+91 93196 98759'}</a></span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <FiMapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>Head Office: {settings?.address || 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh'}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
