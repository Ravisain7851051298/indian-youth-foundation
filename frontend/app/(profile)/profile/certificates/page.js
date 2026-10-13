'use client';

import React, { useEffect, useState } from 'react';
import { FiAward, FiDownload, FiCheckCircle, FiExternalLink, FiPrinter } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ProfileCertificatesPage() {
  const { currentUser, settings } = useNGO();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchMyCertificates = async () => {
      try {
        setLoading(true);
        const res = await api.get('/certificates');
        if (res.data.success) {
          setCertificates(res.data.certificates || []);
        }
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCertificates();
  }, []);

  const handlePrint = (cert) => {
    setSelectedCert(cert);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <FiAward className="w-3.5 h-3.5" />
            <span>Honors & Recognitions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Awarded Certificates of Honor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official digitally verifiable certificates conferred by Indian Youth Foundation leadership.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-400">
          Loading certificate records...
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Certificates Conferred Yet</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Certificates of Appreciation and National Youth Service are conferred by the National Trustee upon participation in blood donation drives, educational campaigns, and youth outreach initiatives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                    ID: {cert.certificateId}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(cert.issueDate || cert.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">{cert.title}</h3>
                <p className="text-xs text-orange-600 font-bold mt-0.5">{cert.titleHi}</p>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {cert.reason}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {cert.qrCodeUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cert.qrCodeUrl} alt="QR" className="w-10 h-10 rounded border border-slate-200" />
                  )}
                  <div className="text-[10px]">
                    <div className="font-bold text-slate-900">Issued By: {cert.issuedBy}</div>
                    <div className="text-emerald-600 font-bold flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> Verifiable
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/verify/certificate/${cert.certificateId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handlePrint(cert)}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer"
                  >
                    <FiPrinter className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
