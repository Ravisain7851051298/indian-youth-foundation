'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiActivity,
  FiBookOpen,
  FiBriefcase,
  FiHeart,
  FiShield,
  FiCheckCircle,
  FiSearch,
  FiX,
  FiArrowRight,
  FiLayers,
  FiSettings,
  FiRefreshCw,
  FiPhoneCall,
  FiUsers,
  FiExternalLink
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

const DEFAULT_FALLBACK_SERVICES = [
  {
    _id: 'srv_1',
    title: 'Shiksha Kranti - Free Slum & Rural Education',
    category: 'Education & Child Welfare',
    description: 'Providing free foundational primary education, digital learning labs, stationery kits, and school uniforms for underprivileged slum and village children.',
    features: [
      'Daily 2-Hour Evening Remedial Classes',
      'Free School Bags, Notebooks & Stationery Kits',
      'Basic Computer Literacy & Math Workshops',
      'Nutrition & Regular Health Checkup Camps'
    ],
    icon: 'FiBookOpen',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'Active'
  },
  {
    _id: 'srv_2',
    title: '24x7 Emergency Blood Donation & Helpline',
    category: 'Healthcare & Emergency Relief',
    description: 'Pan-India volunteer network connecting critically ill patients, accident victims, and thalassemia patients with verified local donors within 30 minutes.',
    features: [
      'Network of 10,000+ Verified Voluntary Blood Donors',
      '24/7 Dedicated Emergency WhatsApp & Call Desk',
      'Zero-Cost Direct Donor-Recipient Coordination',
      'Quarterly Mega Donation Drives with Civil Hospitals'
    ],
    icon: 'FiActivity',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'Active'
  },
  {
    _id: 'srv_3',
    title: 'Kaushal Vikas - Youth Skill & Career Mentorship',
    category: 'Youth Livelihood & Careers',
    description: 'Empowering unemployed youth and college students from lower-income backgrounds with market-ready IT, communication, and vocational skills.',
    features: [
      'Industry-Standard Digital Marketing & IT Modules',
      'Spoken English & Professional Interview Preparation',
      'Direct Corporate Internship & Job Placement Drives',
      '1-on-1 Mentorship Sessions with Industry Leaders'
    ],
    icon: 'FiBriefcase',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    order: 3,
    status: 'Active'
  },
  {
    _id: 'srv_4',
    title: 'Nari Samarthya - Women Vocational Self-Reliance Hub',
    category: 'Women Empowerment',
    description: 'Supporting marginalized women and homemakers through skill-based tailoring, handicrafts, organic food packing, and micro-entrepreneurship guidance.',
    features: [
      'Free Sewing, Embroidery & Textile Craft Labs',
      'Micro-finance & Self Help Group (SHG) Setup',
      'Marketplace Exhibitions for Selling Handcrafted Goods',
      'Legal Rights & Domestic Grievance Counseling'
    ],
    icon: 'FiHeart',
    image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&auto=format&fit=crop&q=80',
    order: 4,
    status: 'Active'
  },
  {
    _id: 'srv_5',
    title: 'Aapda Mitra - Rapid Disaster Relief & Food Distribution',
    category: 'Disaster Relief & Food Security',
    description: 'Immediate humanitarian crisis response providing freshly cooked meals, dry rations, clean drinking water, winter blankets, and temporary shelters.',
    features: [
      'Trained First-Responder Emergency Volunteer Teams',
      'Annapurna Mobile Kitchen for Hot Meal Distribution',
      'Sanitation, Water Purification & First-Aid Supplies',
      'Post-Crisis Rehabilitation & School Reconstruction'
    ],
    icon: 'FiShield',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    order: 5,
    status: 'Active'
  },
  {
    _id: 'srv_6',
    title: 'Harit Bharat - Tree Plantation & Clean Water Mission',
    category: 'Environment & Sanitation',
    description: 'Fostering ecological sustainability through geotagged mass tree plantations, urban cleanliness drives, pond rejuvenation, and solar awareness.',
    features: [
      'Over 50,000+ Native Trees Planted Annually',
      'Plastic-Free School & Public Market Awareness',
      'Community Rainwater Harvesting & Pond Desilting',
      'Solar Clean Energy & Eco-Friendly Village Camps'
    ],
    icon: 'FiCheckCircle',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    order: 6,
    status: 'Active'
  }
];

export default function ServicesPage() {
  const { services: contextServices, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalService, setActiveModalService] = useState(null);

  // Fetch real services from API
  const fetchServicesData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      const data = res.data?.data || res.data?.items || [];
      if (Array.isArray(data) && data.length > 0) {
        setServicesList(data);
      } else if (Array.isArray(contextServices) && contextServices.length > 0) {
        setServicesList(contextServices);
      } else {
        setServicesList(DEFAULT_FALLBACK_SERVICES);
      }
    } catch {
      if (Array.isArray(contextServices) && contextServices.length > 0) {
        setServicesList(contextServices);
      } else {
        setServicesList(DEFAULT_FALLBACK_SERVICES);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const set = new Set();
    servicesList.forEach((s) => {
      if (s.category) set.add(s.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [servicesList]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return servicesList.filter((srv) => {
      const title = (srv.title || srv.titleEn || '').toLowerCase();
      const desc = (srv.description || srv.content || '').toLowerCase();
      const cat = (srv.category || '').toLowerCase();
      const feats = Array.isArray(srv.features)
        ? srv.features.join(' ').toLowerCase()
        : String(srv.features || '').toLowerCase();

      const matchesSearch = !q || title.includes(q) || desc.includes(q) || cat.includes(q) || feats.includes(q);
      const matchesCat = selectedCategory === 'All' || (srv.category || '').toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [servicesList, searchQuery, selectedCategory]);

  const getCategoryIcon = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('edu') || c.includes('child')) return <FiBookOpen className="w-5 h-5" />;
    if (c.includes('health') || c.includes('blood') || c.includes('medic')) return <FiActivity className="w-5 h-5" />;
    if (c.includes('live') || c.includes('career') || c.includes('skill')) return <FiBriefcase className="w-5 h-5" />;
    if (c.includes('women') || c.includes('nari')) return <FiHeart className="w-5 h-5" />;
    if (c.includes('relief') || c.includes('food') || c.includes('disaster')) return <FiShield className="w-5 h-5" />;
    return <FiCheckCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Header Section */}
        <div className="relative rounded-3xl bg-linear-to-br from-red-600 via-red-700 to-rose-900 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-black/10 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <FiLayers className="w-4 h-4 text-white" />
              <span>Dedicated Social Welfare & Grassroots Missions</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Our Dedicated Social Services
            </h1>

            <p className="text-sm sm:text-base text-red-50 leading-relaxed font-normal">
              Empowering marginalized communities across India with free child education, rapid emergency blood coordination, women self-reliance vocational centers, hunger relief, and environmental action.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-black">{servicesList.length || 6}+</div>
                <div className="text-[11px] text-red-100 font-medium">Active Programs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-black">50,000+</div>
                <div className="text-[11px] text-red-100 font-medium">Beneficiaries Reached</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-black">100%</div>
                <div className="text-[11px] text-red-100 font-medium">Free Public Aid</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <div className="text-2xl font-black">24x7</div>
                <div className="text-[11px] text-red-100 font-medium">Relief Helpline</div>
              </div>
            </div>
          </div>

          {/* Admin shortcut button */}
          {isAdmin && (
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-red-100">
                Administrator mode enabled. You can manage, add, or edit services directly from the CMS.
              </span>
              <Link
                href="/dashboard/services"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-md hover:bg-red-50 transition cursor-pointer"
              >
                <FiSettings className="w-4 h-4" />
                <span>Manage Services in Admin Panel</span>
              </Link>
            </div>
          )}
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services by keyword, mission, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-black focus:outline-red-500 bg-slate-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black p-1"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchServicesData}
                title="Refresh Services"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-black hover:bg-slate-50 transition cursor-pointer"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-600' : ''}`} />
              </button>
              <span className="text-xs font-bold text-slate-500">
                Showing <strong className="text-black">{filteredServices.length}</strong> of {servicesList.length} Services
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => {
              const count = cat === 'All'
                ? servicesList.length
                : servicesList.filter((s) => (s.category || '').toLowerCase() === cat.toLowerCase()).length;

              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <FiRefreshCw className="w-8 h-8 animate-spin mx-auto text-red-600" />
            <p className="text-xs font-bold text-slate-600">Loading social services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <FiActivity className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-black">No services found</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              We couldn't find any service matching your search or selected category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredServices.map((srv, index) => {
              const imageSrc = getContentImageUrl(srv.image || srv.bannerImage || srv.imageUrl || (Array.isArray(srv.images) && srv.images[0]));
              const featuresList = Array.isArray(srv.features)
                ? srv.features
                : typeof srv.features === 'string' && srv.features
                ? srv.features.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={srv._id || srv.id || index}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner Image */}
                    <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={srv.title || 'Social Service'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold">
                          <FiActivity className="w-10 h-10" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/95 text-red-700 backdrop-blur-md shadow-sm">
                          {getCategoryIcon(srv.category)}
                          <span>{srv.category || 'Social Welfare'}</span>
                        </span>
                      </div>

                      {/* Initiative Sequence */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-xs">
                          Initiative #{srv.order || index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-3.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active Public Service</span>
                        </span>
                      </div>

                      <h3 className="font-extrabold text-lg text-black leading-snug group-hover:text-red-600 transition-colors">
                        {srv.titleEn || srv.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                        {srv.description || srv.content}
                      </p>

                      {/* Key Features Highlights */}
                      {featuresList.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Key Deliverables
                          </span>
                          <div className="space-y-1">
                            {featuresList.slice(0, 3).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 font-medium">
                                <FiCheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feat}</span>
                              </div>
                            ))}
                            {featuresList.length > 3 && (
                              <span className="text-[10px] font-bold text-red-600 pl-5 block">
                                +{featuresList.length - 3} more offerings
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveModalService(srv)}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 hover:text-red-600 transition cursor-pointer"
                    >
                      <span>Explore Initiative</span>
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href="/donation"
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-extrabold text-xs transition shadow-2xs cursor-pointer"
                    >
                      <FiHeart className="w-3.5 h-3.5" />
                      <span>Support</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Service Inspection Modal */}
        {activeModalService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
              <button
                onClick={() => setActiveModalService(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer z-10"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* Modal Banner Photo */}
              {(activeModalService.image || activeModalService.bannerImage || activeModalService.imageUrl) && (
                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden relative border border-slate-200">
                  <img
                    src={getContentImageUrl(activeModalService.image || activeModalService.bannerImage || activeModalService.imageUrl)}
                    alt={activeModalService.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-red-700 backdrop-blur-md shadow-sm">
                      {activeModalService.category || 'Social Service'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                      ● Active Initiative
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Social Welfare Initiative #{activeModalService.order || 1}
                </span>
                <h2 className="text-2xl font-black text-black mt-1 leading-snug">
                  {activeModalService.titleEn || activeModalService.title}
                </h2>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">Program Overview & Mission</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {activeModalService.description || activeModalService.content}
                </p>
              </div>

              {/* Complete Features */}
              {(() => {
                const fList = Array.isArray(activeModalService.features)
                  ? activeModalService.features
                  : typeof activeModalService.features === 'string' && activeModalService.features
                  ? activeModalService.features.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
                  : [];

                if (fList.length === 0) return null;

                return (
                  <div>
                    <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2.5">
                      Key Highlights & What We Provide
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {fList.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-red-50/60 border border-red-100 text-xs text-slate-800">
                          <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-semibold">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FiUsers className="w-4 h-4 text-red-500" />
                  <span>Serving communities with zero user fee</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/donation"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition text-center cursor-pointer"
                  >
                    Support / Sponsor Cause
                  </Link>
                  <button
                    onClick={() => setActiveModalService(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Call to Action / Support Strip */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl font-extrabold text-black">
              Want to Request a Welfare Camp in Your Area or Volunteer?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Our ground team collaborates with schools, rural panchayats, and youth clubs to organize free health checkups, blood donation drives, and career workshops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/volunteer-registration"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-extrabold text-xs transition"
            >
              Join as Volunteer
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition"
            >
              Contact Welfare Desk
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
