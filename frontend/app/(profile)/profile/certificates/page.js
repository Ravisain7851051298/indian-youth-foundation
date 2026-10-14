'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FiAward, 
  FiCheckCircle, 
  FiExternalLink, 
  FiPrinter, 
  FiHeart, 
  FiUserPlus, 
  FiCreditCard,
  FiFileText
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ProfileCertificatesPage() {
  const { currentUser } = useNGO();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchMyCertificates = async () => {
      try {
        setLoading(true);
        setHasError(false);
        const res = await api.get('/certificates');
        if (isMounted && res.data?.success) {
          setCertificates(res.data.certificates || []);
        }
      } catch (err) {
        console.warn('Certificate fetch note (handled gracefully):', err?.response?.status || err.message);
        if (isMounted) {
          // If status is 403 or empty, fail gracefully without breaking UI
          setHasError(err?.response?.status === 403);
          setCertificates([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMyCertificates();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = (cert) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Honor - ${cert.certificateId || ''}</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #000; text-align: center; }
            .cert-box { border: 8px double #dc2626; padding: 40px; border-radius: 20px; max-width: 800px; margin: auto; }
            h1 { color: #dc2626; font-size: 32px; margin-bottom: 5px; text-transform: uppercase; }
            h2 { color: #000; font-size: 22px; margin-top: 0; }
            p { font-size: 16px; line-height: 1.6; color: #111; }
            .badge { display: inline-block; padding: 6px 16px; background: #fee2e2; color: #991b1b; font-weight: bold; border-radius: 20px; }
            .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <h1>INDIAN YOUTH FOUNDATION</h1>
            <p>12A & 80G Certified Non-Governmental Organization</p>
            <div class="badge">Certificate ID: ${cert.certificateId || ''}</div>
            <h2>${cert.title || 'Certificate of Appreciation'}</h2>
            <p>Conferred upon</p>
            <h2 style="font-size: 26px; font-weight: 900;">${cert.recipientName || currentUser?.name || 'Honored Contributor'}</h2>
            <p>${cert.reason || 'In recognition of outstanding dedication, selfless social service, and participation in youth welfare programs.'}</p>
            <div class="footer">
              <div style="text-align: left;">
                <strong>Date:</strong> ${new Date(cert.issueDate || cert.createdAt || '2026-01-01').toLocaleDateString()}<br/>
                <strong>Status:</strong> Digitally Verifiable
              </div>
              <div style="text-align: right;">
                <strong>${cert.issuedBy || 'National Executive Trustee'}</strong><br/>
                Indian Youth Foundation
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const isDonor = currentUser?.role?.toLowerCase() === 'donor';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
            <FiAward className="w-3.5 h-3.5 text-red-600" />
            <span>Honors & Recognitions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Awarded Certificates of Honor
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Official digitally verifiable certificates conferred by Indian Youth Foundation leadership.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs font-bold text-black flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading certificate records...</span>
        </div>
      ) : certificates.length === 0 ? (
        <div className="space-y-6">
          {/* Dedicated Inspiring Donor Card */}
          {isDonor ? (
            <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-red-200 text-center max-w-2xl mx-auto shadow-sm space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner border border-red-200">
                <FiHeart className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-800 inline-block">
                  Honored Donor & Patron
                </span>
                <h3 className="text-xl font-black text-black">
                  Thank You for Powering Our Mission!
                </h3>
                <p className="text-xs text-black leading-relaxed max-w-lg mx-auto font-medium">
                  As an esteemed <strong>Donor</strong>, your financial contributions directly empower our education, health, and blood donation drives on the ground.
                  Official certificates of honor are awarded for volunteer service and drive participation. Your <strong>80G Tax Exemption Receipts</strong> are available under your Donations portal.
                </p>
              </div>

              {/* Action Buttons for Donors */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/profile/donations"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <FiFileText className="w-4 h-4" />
                  <span>View 80G Receipts & Donations</span>
                </Link>
                <Link
                  href="/profile/apply-volunteer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center gap-2"
                >
                  <FiUserPlus className="w-4 h-4 text-red-600" />
                  <span>Join as Volunteer</span>
                </Link>
                <Link
                  href="/profile/apply-member"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-black font-bold text-xs hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center gap-2"
                >
                  <FiCreditCard className="w-4 h-4 text-red-600" />
                  <span>Become a Member</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto shadow-2xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
                <FiAward className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-black">No Certificates Conferred Yet</h3>
              <p className="text-xs text-black leading-relaxed font-medium">
                Certificates of Appreciation and National Youth Service are conferred by the National Trustee upon active participation in blood donation drives, educational campaigns, and youth outreach initiatives.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  href="/profile/apply-volunteer"
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-md"
                >
                  Apply as Active Volunteer
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    ID: {cert.certificateId}
                  </span>
                  <span className="text-[10px] text-black font-semibold">
                    {new Date(cert.issueDate || cert.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-black text-black">{cert.title}</h3>
                {cert.titleHi && (
                  <p className="text-xs text-red-600 font-bold mt-0.5">{cert.titleHi}</p>
                )}

                <p className="text-xs text-black font-medium mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
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
                    <div className="font-bold text-black">Issued By: {cert.issuedBy}</div>
                    <div className="text-emerald-700 font-black flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3 text-emerald-600" /> Verifiable
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/verify/certificate/${cert.certificateId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-black text-xs font-bold transition flex items-center gap-1"
                    title="Public Verification"
                  >
                    <FiExternalLink className="w-3.5 h-3.5 text-black" />
                  </a>
                  <button
                    onClick={() => handlePrint(cert)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
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
