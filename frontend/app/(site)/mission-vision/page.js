'use client';

import React from 'react';
import Link from 'next/link';
import { FiCompass, FiTarget, FiShield, FiCheckCircle, FiFileText, FiDownload, FiHeart } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function MissionVisionPage() {
  const { settings, auditReports } = useNGO();

  const defaultAudits = auditReports?.length ? auditReports : [
    {
      title: 'Annual Statutory Audit Report & Balance Sheet 2024-25',
      financialYear: '2024-2025',
      fileUrl: '#',
      caName: 'S. K. Kothari & Associates (Chartered Accountants)'
    },
    {
      title: 'Annual Statutory Audit Report & Balance Sheet 2023-24',
      financialYear: '2023-2024',
      fileUrl: '#',
      caName: 'S. K. Kothari & Associates (Chartered Accountants)'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <FiCompass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Guiding Principles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Our Vision, Mission & Core Values
          </h1>
          <p className="text-xs sm:text-sm text-black/80 mt-2 font-normal">
            {settings?.tagline || 'Empowering Youth, Transforming Society, Nation First'}
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Vision */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-2xl mb-4 border border-emerald-100">
              <FiCompass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-black">Our Vision</h2>
            <p className="text-xs sm:text-sm text-black/80 mt-3 leading-relaxed">
              {settings?.visionStatement || 'To build an equitable, self-reliant, and empowered India where every young person is educated, skilled, and actively engaged in nation-building, ensuring healthcare, literacy, and dignified livelihoods reach every marginalized community.'}
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-2xl mb-4 border border-emerald-100">
              <FiTarget className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-black">Our Mission</h2>
            <p className="text-xs sm:text-sm text-black/80 mt-3 leading-relaxed">
              {settings?.missionStatement || 'To channel the constructive potential of Indian youth into transformative grassroot movements: educating slum children, providing 24x7 emergency blood relief, empowering women entrepreneurs, and spearheading environmental stewardship.'}
            </p>
          </div>
        </div>

        {/* Core Objectives */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12">
          <h2 className="text-xl font-black text-black mb-6 flex items-center gap-2">
            <FiCheckCircle className="text-emerald-700" />
            <span>Statutory Objectives of the Society</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-black">
            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
              <span className="font-black text-emerald-700 text-sm">01.</span>
              <div>
                <strong className="text-black block font-bold mb-1 text-sm">Child Literacy & Inclusive Education</strong>
                Providing free study kits, school uniforms, bridge learning courses, and tutoring for children from disadvantaged socio-economic backgrounds.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
              <span className="font-black text-emerald-700 text-sm">02.</span>
              <div>
                <strong className="text-black block font-bold mb-1 text-sm">Youth Vocational Skills & Livelihood</strong>
                Equipping unemployed youth with digital computer literacy, vocational tailoring, and placement mentorship for self-reliance.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
              <span className="font-black text-emerald-700 text-sm">03.</span>
              <div>
                <strong className="text-black block font-bold mb-1 text-sm">24x7 Emergency Voluntary Blood Donor Network</strong>
                Connecting emergency patients, thalassemia children, and disaster victims with verified blood and platelet donors.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200 flex items-start gap-3">
              <span className="font-black text-emerald-700 text-sm">04.</span>
              <div>
                <strong className="text-black block font-bold mb-1 text-sm">Climate Action & Environmental Conservation</strong>
                Planting 5,000+ native trees annually with community geotagging, water conservation drives, and plastic pollution mitigation.
              </div>
            </div>
          </div>
        </div>

        {/* Legal Accreditations & Yearly Audit Reports */}
        <div className="bg-white text-black rounded-3xl p-8 sm:p-10 border-2 border-emerald-200 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Transparency & Accreditations</span>
              <h3 className="text-xl font-black text-black mt-1">100% Verified Statutory Audits & Certifications</h3>
            </div>
            <Link
              href="/donation"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition"
            >
              Donate Online (80G Tax Exemption)
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-8">
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <div className="text-gray-600 text-[11px]">80G Tax Exemption</div>
              <div className="font-mono font-bold text-black mt-1 break-all">{settings?.exemption80G}</div>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <div className="text-gray-600 text-[11px]">12A Registration No</div>
              <div className="font-mono font-bold text-black mt-1 break-all">{settings?.exemption12A}</div>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <div className="text-gray-600 text-[11px]">NITI Aayog Darpan ID</div>
              <div className="font-mono font-bold text-black mt-1 break-all">{settings?.nitiAayogDarpanId}</div>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <div className="text-gray-600 text-[11px]">Govt. Society Reg No</div>
              <div className="font-mono font-bold text-black mt-1 break-all">{settings?.registrationNo}</div>
            </div>
          </div>

          <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
            <FiFileText className="text-emerald-700" />
            <span>Audited Financial Statements & Returns</span>
          </h4>
          <div className="space-y-3">
            {defaultAudits.map((audit, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-gray-200 text-xs"
              >
                <div>
                  <div className="font-bold text-black text-sm">{audit.title}</div>
                  <div className="text-gray-500 text-[11px] mt-0.5">Audited by: {audit.caName}</div>
                </div>
                <button
                  onClick={() => alert(`Downloading ${audit.title}...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white font-bold transition cursor-pointer border border-emerald-200"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
