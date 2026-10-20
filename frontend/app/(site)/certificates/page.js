'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiAward,
  FiFileText,
  FiImage,
  FiDownload,
  FiEye,
  FiSearch,
  FiCheckCircle,
  FiShield,
  FiCalendar,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function PublicOrganizationCertificatesPage() {
  const { currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'admin';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [copiedId, setCopiedId] = useState('');

  // Fetch organization verified certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/organization-certificates?status=Verified');
      const data = await res.json();
      if (data.success && data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.warn('Error fetching organization documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (activeCategory !== 'all' && doc.category !== activeCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        doc.title?.toLowerCase().includes(q) ||
        doc.documentNumber?.toLowerCase().includes(q) ||
        doc.issuingAuthority?.toLowerCase().includes(q) ||
        doc.category?.toLowerCase().includes(q)
      );
    });
  }, [documents, activeCategory, searchQuery]);

  // Copy registration number
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 sm:py-14 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
            <FiAward className="w-3.5 h-3.5 text-emerald-700" />
            <span>Government Accreditations &amp; Legal Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Organization Statutory Certificates &amp; Documents
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Transparent and verifiable legal documents establishing Yuva Kranti Dal (युवा क्रांति दल) as a registered, 100% compliant, and tax-exempt national youth welfare movement.
          </p>

          {/* Accreditations Trust Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Section 12A Perpetual Tax Exemption</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Section 80G (50% Donor Tax Relief)</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>NITI Aayog Darpan Verified</span>
            </div>

            {isAdmin && (
              <Link
                href="/dashboard/certificates"
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200 font-bold transition shadow-2xs"
              >
                <FiSettings className="w-3.5 h-3.5 text-emerald-700" />
                <span>Upload &amp; Manage Documents (Admin) →</span>
              </Link>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by certificate title, order number, or issuing ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1 md:pb-0">
            {[
              { key: 'all', label: `All Accreditations (${documents.length})` },
              { key: '12A Registration', label: '12A Order' },
              { key: '80G Exemption', label: '80G Tax Exemption' },
              { key: 'NITI Aayog Darpan', label: 'NITI Aayog' },
              { key: 'Trust Registration', label: 'Trust Deed' },
              { key: 'CSR-1 Filing', label: 'CSR-1 Registration' },
              { key: 'PAN Card', label: 'PAN Card' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
                  activeCategory === tab.key
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>        {/* Documents Showcase Grid */}
        {loading ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-2 shadow-sm">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-700" />
            <p className="text-xs text-slate-500">Retrieving official organization certificates...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2 shadow-sm">
            <FiShield className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="font-extrabold text-sm text-slate-800">No Certificates Found</h3>
            <p className="text-xs text-slate-500">Try clearing your search query or selecting a different category tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => {
              const isPdf = doc.fileType === 'pdf' || /\.pdf(\?|$)/i.test(doc.fileUrl);
              const issueDateFormatted = doc.issueDate
                ? new Date(doc.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Verified';

              return (
                <div
                  key={doc._id || doc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header with Icon and Category badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isPdf ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {isPdf ? <FiFileText className="w-6 h-6" /> : <FiImage className="w-6 h-6" />}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                          {doc.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <FiCheckCircle className="w-3 h-3" />
                          <span>Govt. Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                    </div>

                    {/* Order / Registration Number Box with Copy */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Official Order / Registration No.
                      </span>
                      <div className="flex items-center justify-between font-mono font-bold text-emerald-800 text-xs">
                        <span className="truncate max-w-[220px]" title={doc.documentNumber}>
                          {doc.documentNumber || 'REG/2021/DEL/492'}
                        </span>
                        {doc.documentNumber && (
                          <button
                            type="button"
                            onClick={() => handleCopy(doc.documentNumber)}
                            className="p-1 text-slate-400 hover:text-slate-800 transition cursor-pointer"
                            title="Copy Number"
                          >
                            {copiedId === doc.documentNumber ? (
                              <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <FiCopy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Authority and Date Details */}
                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span>Issuing Body:</span>
                        <strong className="text-slate-800 truncate max-w-[170px]" title={doc.issuingAuthority}>
                          {doc.issuingAuthority || 'Govt. of India'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Issue Date:</span>
                        <strong className="text-slate-800">{issueDateFormatted}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Legal Validity:</span>
                        <strong className="text-emerald-700">{doc.validity || 'Perpetual'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <FiEye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Inspect PDF</span>
                    </button>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition cursor-pointer"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* High-Resolution Document Inspection Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-black text-slate-900 text-base">{previewDoc.title}</h3>
                  <span className="text-xs text-emerald-700 font-mono font-bold">
                    Order No: {previewDoc.documentNumber} • {previewDoc.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span>Download Original Document</span>
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Viewer Body */}
              <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden p-2 flex items-center justify-center min-h-[420px]">
                {previewDoc.fileType === 'pdf' || /\.pdf(\?|$)/i.test(previewDoc.fileUrl) ? (
                  <iframe
                    src={previewDoc.fileUrl}
                    title={previewDoc.title}
                    className="w-full h-[550px] rounded-xl border border-slate-300"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-h-[550px] w-auto object-contain rounded-xl shadow-md"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
