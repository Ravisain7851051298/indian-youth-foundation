'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiActivity, 
  FiCheckCircle, 
  FiArrowLeft, 
  FiHeart, 
  FiUsers, 
  FiChevronRight,
  FiShare2,
  FiPhoneCall,
  FiBookOpen,
  FiLayers
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function ServiceDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { services, settings } = useNGO();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const serviceId = resolvedParams?.id;

  useEffect(() => {
    if (!serviceId) return;

    // Check existing services in context first
    const found = services?.find(s => (s._id || s.id) === serviceId);
    if (found) {
      setService(found);
      setLoading(false);
      return;
    }

    // Otherwise fetch directly from backend API
    api.get(`/services/${serviceId}`)
      .then(res => {
        if (res.data?.success && (res.data?.data || res.data?.item)) {
          setService(res.data.data || res.data.item);
        } else if (res.data?.title) {
          setService(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to load service detail:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serviceId, services]);

  const shareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = encodeURIComponent(`🤝 *${service?.titleEn || service?.title}*\n\nExplore this humanitarian initiative by Yuva Kranti Dal:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-emerald-800">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold">Loading service initiative...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-lg">
          <FiActivity className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h2 className="text-xl font-black text-slate-900">Service Not Found</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            The requested social welfare program may have been reorganized.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to All Services</span>
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = getContentImageUrl(service.image || service.bannerImage || service.imageUrl);
  const featuresList = Array.isArray(service.features)
    ? service.features
    : typeof service.features === 'string' && service.features
      ? service.features.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

  const otherServices = services?.filter(s => (s._id || s.id) !== serviceId)?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
          <FiChevronRight className="w-3.5 h-3.5" />
          <Link href="/services" className="hover:text-emerald-700 transition">Our Services</Link>
          <FiChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-800 truncate max-w-50 sm:max-w-xs">{service.titleEn || service.title}</span>
        </nav>

        {/* Main Service Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          
          {/* Hero Banner */}
          {imageSrc ? (
            <div className="w-full h-64 sm:h-80 md:h-96 relative bg-slate-900 overflow-hidden">
              <img
                src={imageSrc}
                alt={service.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-extrabold uppercase tracking-wide backdrop-blur-xs">
                  {service.category || 'Humanitarian Initiative'}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  {service.titleEn || service.title}
                </h1>
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-10 pb-6 border-b border-slate-100 bg-linear-to-r from-emerald-800 to-green-700 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wide backdrop-blur-xs mb-3">
                {service.category || 'Humanitarian Initiative'}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                {service.titleEn || service.title}
              </h1>
            </div>
          )}

          {/* Details Body */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Overview Section */}
            <div>
              <h2 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-2">
                Program Mission &amp; Overview
              </h2>
              <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                {service.description || service.content}
              </div>
            </div>

            {/* Key Deliverables & Highlights */}
            {featuresList.length > 0 && (
              <div>
                <h2 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-3">
                  Key Deliverables &amp; Community Offerings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {featuresList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs sm:text-sm text-slate-800 font-semibold"
                    >
                      <FiCheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Helpline & Action Callouts */}
            <div className="p-6 rounded-2xl bg-linear-to-br from-emerald-700 to-green-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-black text-white">Want to support or volunteer in this cause?</h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Contribute with 80G tax exemption or join as an active district volunteer.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                <Link
                  href="/donation"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <FiHeart className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                  <span>Donate to Initiative</span>
                </Link>
                <Link
                  href="/apply-volunteer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-400 transition flex items-center gap-1.5"
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Join as Volunteer</span>
                </Link>
              </div>
            </div>

            {/* Sharing & Back Link */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Share Program:</span>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200 cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Explore All Services</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Other Welfare Programs */}
        {otherServices.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Explore Other Humanitarian Programs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherServices.map((srv, idx) => {
                const sImg = getContentImageUrl(srv.image || srv.bannerImage || srv.imageUrl);
                const sId = srv._id || srv.id;
                return (
                  <Link
                    key={sId || idx}
                    href={`/services/${sId}`}
                    className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {sImg && (
                        <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                          <img
                            src={sImg}
                            alt={srv.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase">
                        {srv.category || 'Service'}
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-0.5 group-hover:text-emerald-700 transition">
                        {srv.titleEn || srv.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {srv.description || srv.content}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 mt-3 flex items-center gap-1">
                      <span>View Program Details</span>
                      <FiChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
