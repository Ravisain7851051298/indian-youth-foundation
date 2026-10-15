'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiShield, 
  FiCompass, 
  FiTarget, 
  FiHeart, 
  FiUsers, 
  FiAward, 
  FiBookOpen, 
  FiActivity, 
  FiCheckCircle, 
  FiArrowRight, 
  FiDownload, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiFileText, 
  FiCalendar,
  FiExternalLink
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';

export default function AboutPage() {
  const { settings, teamMembers } = useNGO();
  const [activePillar, setActivePillar] = useState('education');

  const pillars = [
    {
      id: 'education',
      title: 'Child Literacy & Education',
      tagline: 'Bridging the educational divide for every underprivileged child',
      icon: FiBookOpen,
      metrics: '8,500+ Children Taught',
      description: 'We believe education is the single most powerful weapon to break the cycle of intergenerational poverty. Our volunteers operate evening slum education centers, provide complete academic kits, sponsor school uniforms, and arrange remedial classes for children at risk of dropping out.',
      initiatives: [
        'Free Notebooks, Stationery & School Bags Distribution',
        'Weekend Community Digital Literacy Camps',
        'Drop-out Rehabilitation & Formal School Admissions',
        'Merit Scholarships for High-Potential Rural Youth'
      ],
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'health',
      title: 'Healthcare & 24/7 Blood Network',
      tagline: 'Rapid emergency response saving lives across districts',
      icon: FiActivity,
      metrics: '1,800+ Blood Units Arranged',
      description: 'In medical emergencies, every minute matters. We run a dedicated 24x7 volunteer helpline connecting patients in critical condition with verified voluntary blood and platelet donors. Additionally, we conduct free health checkup camps, eye screening, and medicine distribution in underserved areas.',
      initiatives: [
        '24x7 Emergency Blood Donor Coordination Desk',
        'Free General Health, Pediatric & Eye Checkup Camps',
        'Emergency Medical Relief Grants for BPL Families',
        'Nutritional Kits & Health Awareness for Mothers'
      ],
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'livelihood',
      title: 'Youth Skills & Livelihoods',
      tagline: 'Empowering youngsters and women with self-reliant vocations',
      icon: FiAward,
      metrics: '2,200+ Individuals Trained',
      description: 'True transformation comes when individuals can earn a dignified livelihood. We operate vocational skill training workshops in computer operations, electrical repair, mobile servicing, and women tailoring centers that enable beneficiaries to launch self-sustaining micro-enterprises.',
      initiatives: [
        'Women Empowerment Tailoring & Sewing Centers',
        'Basic IT, Computer Application & Typing Courses',
        'Resume Building & Interview Preparation Seminars',
        'Micro-Enterprise Mentorship & Raw Material Support'
      ],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'relief',
      title: 'Disaster Relief & Civic Action',
      tagline: 'First to respond during natural disasters and extreme weather crises',
      icon: FiHeart,
      metrics: '12,000+ Relief Kits Dispatched',
      description: 'Whether during severe North Indian winter waves, flash floods, or pandemic lockdowns, our emergency youth task force is deployed on the ground to deliver warm blankets, dry ration packets, clean drinking water, and hygiene essentials to stranded families.',
      initiatives: [
        'Annual Winter Warmth: 5,000+ Blankets Distributed',
        'Dry Ration & Cooked Meal Kits During Emergencies',
        'Clean Water & Hygiene Supply In Remote Hamlets',
        'Mega Plantation Drives: 10,000+ Saplings Planted'
      ],
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const currentPillar = pillars.find(p => p.id === activePillar) || pillars[0];

  const timelineMilestones = [
    {
      year: '2021',
      title: 'Foundation & Genesis',
      desc: 'Registered officially with the Registrar of Societies. Began grassroots child literacy sessions and community food distribution in Aligarh.'
    },
    {
      year: '2022',
      title: '24/7 Blood Network Launch',
      desc: 'Launched our emergency blood donor helpline across Western Uttar Pradesh and Delhi-NCR, crossing 500 successful emergency blood transfusions.'
    },
    {
      year: '2023',
      title: '80G & 12A Central Tax Exemption',
      desc: 'Received statutory 80G tax-deductible certification and 12A registration from the Income Tax Department (CBDT), ensuring 100% transparent giving.'
    },
    {
      year: '2024',
      title: 'NITI Aayog Darpan & 25,000 Lives',
      desc: 'Enlisted on Government of India NITI Aayog NGO Darpan portal. Surpassed 25,000 cumulative beneficiaries reached through our 4 core welfare pillars.'
    },
    {
      year: '2026',
      title: 'Digital ID Cards & National Footprint',
      desc: 'Pioneered instant verifiable QR ID card issuance, appointment letters, and automated 80G tax receipt dispatch across 15+ state chapters.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* ---------------- 1. HERO HEADER ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-black shadow-xs">
              <FiShield className="w-4 h-4 text-red-600" />
              <span>National Youth Movement • Section 80G &amp; 12A Certified NGO</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-tight">
              About <span className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">Indian Youth Foundation</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              Known natively as <strong>भारतीय युवा क्रांति</strong>, we are a nationwide non-profit coalition of young leaders, social workers, and change-makers mobilizing grassroots impact for child literacy, emergency healthcare, and rural empowerment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/donation"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/25 hover:scale-102 transition cursor-pointer"
              >
                <FiHeart className="w-4 h-4 fill-white" />
                <span>Support Our Mission (80G Tax Exemption)</span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-slate-200 font-bold text-xs shadow-xs hover:scale-102 transition cursor-pointer"
              >
                <FiFileText className="w-4 h-4 text-red-600" />
                <span>View Legal Certificates</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-14">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-4xl font-black text-red-600">25,000+</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Beneficiary Lives Touched</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-4xl font-black text-slate-900">3,500+</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Volunteers with ID Cards</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-4xl font-black text-red-600">1,800+</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Emergency Blood Units Arranged</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-4xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-bold text-slate-700 mt-1">CBDT 80G Tax-Deductible</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. OUR GENESIS & FOUNDATION STORY ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                <FiCompass className="w-3.5 h-3.5 text-red-600" />
                <span>Our Heritage &amp; Genesis</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
                Born with a Conviction: Youth Can Lead India's Transformation
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                The <strong>Indian Youth Foundation</strong> was established with a singular conviction: when the passion of Indian youth is focused on nation-building, social inequities can be eradicated. What began as a small group of university volunteers teaching street children on weekends has evolved into a registered national movement.
              </p>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Today, our state committees coordinate child literacy shelters, disaster relief, tree plantations, and life-saving blood donor networks. We operate with strict corporate governance, CBDT compliance, and zero administrative wastage.
              </p>

              {/* Core Philosophy Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-1">
                  <div className="font-bold text-black text-xs flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4 text-red-600" />
                    <span>Nation First Ideology</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Instilling patriotism and civic responsibility in youth through selfless grassroots community service.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-black text-xs flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Total Financial Transparency</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Every donation is cross-verified against bank statements and backed by official 80G tax receipts.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                  alt="Indian Youth Foundation Volunteers"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-400 bg-black/40 px-2 py-0.5 rounded-md">
                      Ground Volunteer Action
                    </span>
                    <h3 className="text-lg font-black leading-snug">
                      Empowering Grassroots Communities Nationwide
                    </h3>
                    <p className="text-xs text-slate-200 font-medium">
                      Over 50+ active field centers across northern and central India.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. INTERACTIVE 4 PILLARS OF WORK ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiTarget className="w-3.5 h-3.5 text-red-600" />
              <span>Core Welfare Pillars</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Where Your Support Drives Real Change
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Explore our four core pillars of socio-economic empowerment. Select any tab below to inspect our on-ground methodology.
            </p>
          </div>

          {/* Interactive Pillar Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activePillar === pillar.id;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-102' 
                      : 'bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Interactive Showcase Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-black">
                    {currentPillar.metrics}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-black">
                  {currentPillar.title}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-red-600">
                  {currentPillar.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentPillar.description}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-black text-black uppercase tracking-wider">
                    Key On-Ground Initiatives:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    {currentPillar.initiatives.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <FiCheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Link
                    href="/donation"
                    className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Contribute to this Pillar →
                  </Link>
                  <Link
                    href="/programs"
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-bold text-xs transition"
                  >
                    View Flagship Programs
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 aspect-4/3 bg-slate-100">
                  <img
                    src={currentPillar.image}
                    alt={currentPillar.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. STATUTORY TRUST & LEGAL TRANSPARENCY ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
              <FiShield className="w-3.5 h-3.5 text-red-600" />
              <span>Government Transparency</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Statutory Accreditations &amp; Tax Exemptions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              We uphold 100% legal compliance with government authorities. Inspect our official statutory registration numbers below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 80G Exemption */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-red-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg mb-3">
                80G
              </div>
              <h4 className="font-black text-sm text-black">Section 80G Approval</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Donors are entitled to 50% income tax exemption under Section 80G of the Income Tax Act 1961.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-red-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                {settings?.exemption80G || '80G-TAX-EXEMPT-CBDT'}
              </div>
            </div>

            {/* 12A Registration */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-red-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-3">
                12A
              </div>
              <h4 className="font-black text-sm text-black">Section 12A Registration</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Registered non-profit entity status granted by the Income Tax Department for charitable welfare.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                {settings?.exemption12A || '12A-REG-VERIFIED'}
              </div>
            </div>

            {/* NITI Aayog Darpan */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-red-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-3">
                NITI
              </div>
              <h4 className="font-black text-sm text-black">NITI Aayog Darpan</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Enlisted on the Government of India NGO-Darpan portal for partnership in national social programs.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                {settings?.nitiAayogDarpanId || 'DARPAN-RJ-2024'}
              </div>
            </div>

            {/* Societies Registration */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2 hover:border-red-400 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg mb-3">
                REG
              </div>
              <h4 className="font-black text-sm text-black">Society Registration</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Statutory society charter legally enrolled under Societies Registration Act XXI of 1860.
              </p>
              <div className="pt-2 font-mono text-[11px] font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                {settings?.registrationNo || 'REG/2021/NGO/DEL/8741'}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-bold text-xs shadow-md transition"
            >
              <FiDownload className="w-4 h-4 text-red-400" />
              <span>Inspect &amp; Download Verified NGO Certificates →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 5. TIMELINE & GROWTH TRACKER ---------------- */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiCalendar className="w-3.5 h-3.5 text-red-600" />
              <span>Milestones &amp; Evolution</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
              Our Journey Over the Years
            </h2>
          </div>

          <div className="relative border-l-2 border-red-200 ml-4 sm:ml-32 space-y-10">
            {timelineMilestones.map((item, index) => (
              <div key={index} className="relative pl-6 sm:pl-8 group">
                {/* Year Marker Badge */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-red-600 border-4 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                  ✓
                </div>
                
                <div className="sm:absolute sm:-left-28 sm:top-0.5 sm:text-right">
                  <span className="font-mono text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                    {item.year}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-red-300 transition-all">
                  <h4 className="text-base font-black text-black">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 6. LEADERSHIP TEAM GLIMPSE ---------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
                <FiUsers className="w-3.5 h-3.5 text-red-600" />
                <span>Executive Council</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                Leadership, Trustees &amp; State Coordinators
              </h2>
            </div>
            <Link
              href="/team-members"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
            >
              <span>View Full Governing Body</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(teamMembers && teamMembers.length > 0 ? teamMembers.slice(0, 4) : [
              { name: 'Dr. Ravi Saini', role: 'National Founder & President', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
              { name: 'Pooja Verma', role: 'Vice President & Women Welfare', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
              { name: 'Amit Sharma', role: 'Chief Trustee & Legal Secretary', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Neha Gupta', role: 'National Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' }
            ]).map((member, idx) => (
              <div 
                key={member._id || member.id || idx}
                className="bg-slate-50 p-4 rounded-3xl border border-slate-200 text-center space-y-3 group hover:border-red-400 hover:shadow-lg transition-all"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-md bg-slate-200 border-2 border-white">
                  <img
                    src={getContentImageUrl(member.image || member.photoUrl)}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-black text-sm text-black">{member.name}</h4>
                  <p className="text-[11px] text-red-600 font-bold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 7. CALL TO ACTION ---------------- */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
            <FiHeart className="w-3.5 h-3.5" />
            <span>Join Hands in Nation Building</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Be the Catalyst of Change in Someone's Life
          </h2>

          <p className="text-xs sm:text-sm text-white/90 max-w-2xl mx-auto leading-relaxed">
            Whether you wish to offer your time as a registered volunteer, contribute a tax-exempt donation, or represent our foundation as a certified member with an official ID card — India needs you today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/volunteer"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-red-700 font-black text-xs shadow-xl transition cursor-pointer"
            >
              Apply as Volunteer (Offer Letter &amp; ID Card)
            </Link>
            <Link
              href="/donation"
              className="px-6 py-3.5 rounded-2xl bg-red-950/40 hover:bg-red-950/60 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition cursor-pointer"
            >
              Make an 80G Tax-Deductible Donation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
