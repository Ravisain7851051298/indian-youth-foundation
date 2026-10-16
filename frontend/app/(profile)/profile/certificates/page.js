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
  FiFileText,
  FiDownload,
  FiUserCheck,
  FiFilter,
  FiShield,
  FiX,
  FiEye,
  FiCheck
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function ProfileCertificatesPage() {
  const { currentUser, settings } = useNGO();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'volunteer', 'member', 'awards'
  const [previewCert, setPreviewCert] = useState(null);

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

  // Helper to categorize a certificate
  const getCertCategory = (cert) => {
    const text = `${cert.category || ''} ${cert.title || ''} ${cert.reason || ''}`.toLowerCase();
    if (text.includes('volunteer') || text.includes('drive') || text.includes('camp') || text.includes('field') || text.includes('relief')) {
      return 'volunteer';
    }
    if (text.includes('member') || text.includes('membership') || text.includes('council') || text.includes('trustee')) {
      return 'member';
    }
    return 'awards';
  };

  const volunteerCerts = certificates.filter(c => getCertCategory(c) === 'volunteer');
  const memberCerts = certificates.filter(c => getCertCategory(c) === 'member');
  const otherCerts = certificates.filter(c => getCertCategory(c) === 'awards');

  const filteredCerts = certificates.filter(c => {
    if (filter === 'volunteer') return getCertCategory(c) === 'volunteer';
    if (filter === 'member') return getCertCategory(c) === 'member';
    if (filter === 'awards') return getCertCategory(c) === 'awards';
    return true;
  });

  const handlePrint = (cert) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const logoSrc = getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
    const sealSrc = getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
    const sigSrc = getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
    const presidentName = settings?.presidentName || cert.issuedBy || 'Ravi Saini (National President & Trustee)';
    const dateFormatted = new Date(cert.issueDate || cert.createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Appreciation - ${cert.certificateId || ''}</title>
          <style>
            @page { size: landscape A4; margin: 0; }
            * { box-sizing: border-box; }
            body { 
              font-family: 'Times New Roman', serif, system-ui; 
              margin: 0; 
              padding: 24px; 
              background: #fdfbf7; 
              color: #0f172a; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh;
            }
            .cert-outer {
              border: 8px solid #7f1d1d;
              outline: 3px solid #d97706;
              padding: 28px 40px;
              background: #fff;
              position: relative;
              max-width: 1050px;
              width: 100%;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              text-align: center;
            }
            .corner {
              position: absolute;
              width: 24px;
              height: 24px;
              border: 2px solid #b45309;
              background: #fef3c7;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #b45309;
            }
            .tl { top: 6px; left: 6px; }
            .tr { top: 6px; right: 6px; }
            .bl { bottom: 6px; left: 6px; }
            .br { bottom: 6px; right: 6px; }
            .header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
            .logo-img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #7f1d1d; }
            .shield-box { border: 2px solid #b45309; background: #fef3c7; padding: 6px 12px; border-radius: 8px; text-align: center; }
            .shield-title { font-size: 11px; font-weight: bold; color: #9a3412; }
            .shield-sub { font-size: 9px; color: #475569; }
            h1 { font-size: 26px; color: #7f1d1d; margin: 0; letter-spacing: 1px; font-weight: 900; }
            h2 { font-size: 14px; color: #0f172a; margin: 4px 0; font-weight: bold; }
            .meta { font-size: 10px; color: #64748b; margin: 0; }
            .ribbon {
              background: #7f1d1d;
              color: #ffffff;
              padding: 8px 30px;
              display: inline-block;
              font-size: 16px;
              font-weight: bold;
              letter-spacing: 1.5px;
              margin: 14px auto 8px;
              border: 1px solid #fde047;
              border-radius: 4px;
            }
            .cert-id { font-size: 11px; font-weight: bold; color: #b45309; font-family: monospace; }
            .presentation { font-size: 13px; font-style: italic; color: #475569; margin: 12px 0 4px; }
            .recipient { font-size: 30px; font-weight: 900; color: #0f172a; margin: 6px 0; text-decoration: underline; text-decoration-color: #d97706; }
            .role { font-size: 13px; font-weight: bold; color: #059669; margin-bottom: 8px; }
            .reason { font-size: 13px; line-height: 1.5; color: #334155; max-width: 800px; margin: 0 auto 16px; }
            .footer-row { display: flex; align-items: flex-end; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 10px; }
            .sign-img { height: 42px; object-fit: contain; }
            .seal-img { width: 68px; height: 68px; object-fit: contain; }
          </style>
        </head>
        <body>
          <div class="cert-outer">
            <div class="corner tl">✦</div>
            <div class="corner tr">✦</div>
            <div class="corner bl">✦</div>
            <div class="corner br">✦</div>

            <div class="header-row">
              <img src="${logoSrc}" class="logo-img" alt="Logo" />
              <div>
                <h1>${settings?.ngoName || 'INDIAN YOUTH FOUNDATION'}</h1>
                <h2>${settings?.ngoNameHi || 'भारतीय युवा क्रांति (राष्ट्रीय सामाजिक न्यास)'}</h2>
                <p class="meta">Registered Public Charitable Trust • Reg. No: ${settings?.registrationNo || '421/2019'} • 12A & 80G Certified NGO</p>
                <p class="meta">NITI Aayog Darpan ID: ${settings?.nitiAayogDarpanId || 'RJ/2022/0319482'} • PAN: ${settings?.panNo || 'AAATB4321Q'}</p>
              </div>
              <div class="shield-box">
                <div class="shield-title">12A / 80G</div>
                <div class="shield-sub">VERIFIED TRUST</div>
              </div>
            </div>

            <div class="ribbon">${cert.title || 'CERTIFICATE OF APPRECIATION & CITATION'}</div>
            <div class="cert-id">Official Conformance No: ${cert.certificateId || ''}</div>

            <div class="presentation">This certificate of honor is proudly and gratefully conferred upon</div>
            <div class="recipient">${cert.recipientName || currentUser?.name || 'Honored Contributor'}</div>
            <div class="role">[ ${cert.roleOrDesignation || 'Active Social Worker'} ]</div>
            <div class="reason">${cert.reason || 'In recognition of outstanding dedication, exemplary leadership, and selfless service towards societal welfare and youth empowerment.'}</div>

            <div class="footer-row">
              <div style="text-align: left;">
                <div style="font-size: 11px; font-weight: bold; color: #0f172a;">Date of Conformance:</div>
                <div style="font-size: 11px; color: #475569;">${dateFormatted}</div>
                <div style="font-size: 10px; color: #059669; font-weight: bold; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span>Digitally Authenticated</span>
                </div>
              </div>

              <div>
                <img src="${sealSrc}" class="seal-img" alt="Seal" />
                <div style="font-size: 9px; font-weight: bold; color: #7f1d1d; text-transform: uppercase;">Official Seal</div>
              </div>

              <div style="text-align: right;">
                <img src="${sigSrc}" class="sign-img" alt="Signature" /><br/>
                <strong style="font-size: 12px; color: #0f172a;">${presidentName}</strong><br/>
                <span style="font-size: 10px; color: #475569;">National President & Board of Trustees</span>
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
    }, 400);
  };

  const isDonor = currentUser?.role?.toLowerCase() === 'donor';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
            <FiAward className="w-3.5 h-3.5 text-amber-600" />
            <span>Honors &amp; Citations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Awarded Certificates of Honor
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Official digitally verifiable certificates conferred for volunteer service, membership leadership, and community relief drives.
          </p>
        </div>

        {certificates.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-bold">Total Conferred:</span>
            <span className="font-mono font-black text-amber-600 text-sm">{certificates.length}</span>
          </div>
        )}
      </div>

      {/* ----------------- CATEGORY FILTER TABS ----------------- */}
      {certificates.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${filter === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            <FiFilter className="w-3.5 h-3.5" />
            <span>All Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setFilter('volunteer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${filter === 'volunteer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200'
              }`}
          >
            <FiUserCheck className="w-3.5 h-3.5" />
            <span>Volunteer Certificates ({volunteerCerts.length})</span>
          </button>

          <button
            onClick={() => setFilter('member')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${filter === 'member'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
          >
            <FiCreditCard className="w-3.5 h-3.5" />
            <span>Member Certificates ({memberCerts.length})</span>
          </button>

          {otherCerts.length > 0 && (
            <button
              onClick={() => setFilter('awards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${filter === 'awards'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                }`}
            >
              <FiAward className="w-3.5 h-3.5" />
              <span>Citations &amp; Awards ({otherCerts.length})</span>
            </button>
          )}
        </div>
      )}

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
                  Honored Donor &amp; Patron
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
                  <span>View 80G Receipts &amp; Donations</span>
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
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <FiAward className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-black">No Certificates Conferred Yet</h3>
              <p className="text-xs text-black leading-relaxed font-medium">
                Official certificates are conferred for field volunteer drives, emergency blood donations, or constitutional membership milestones by the Board of Trustees.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/profile/apply-volunteer"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-md"
                >
                  Apply as Field Volunteer
                </Link>
                <Link
                  href="/profile/apply-member"
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-md"
                >
                  Apply for Membership
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Certificate Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCerts.map((cert) => {
            const cat = getCertCategory(cert);
            const isVolunteerBadge = cat === 'volunteer';
            const isMemberBadge = cat === 'member';

            return (
              <div
                key={cert._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-28 h-28 ${isVolunteerBadge ? 'bg-indigo-500/10' : (isMemberBadge ? 'bg-emerald-500/10' : 'bg-amber-500/10')
                  } rounded-bl-full pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                        ID: {cert.certificateId}
                      </span>
                      {isVolunteerBadge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                          <FiUserCheck className="w-3 h-3 text-indigo-600" />
                          <span>Volunteer Service</span>
                        </span>
                      )}
                      {isMemberBadge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <FiCreditCard className="w-3 h-3 text-emerald-600" />
                          <span>Member Honor</span>
                        </span>
                      )}
                      {!isVolunteerBadge && !isMemberBadge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <FiAward className="w-3 h-3 text-amber-600" />
                          <span>Citation</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">
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

                  <p className="text-xs text-slate-700 font-medium mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
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

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      title="View Full Certificate"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <a
                      href={`/api/certificates/${cert.certificateId || cert._id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Download Official PDF Certificate"
                    >
                      <FiDownload className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                    <button
                      onClick={() => handlePrint(cert)}
                      className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Print Certificate"
                    >
                      <FiPrinter className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/verify/certificate/${cert.certificateId}`}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-black text-xs font-bold transition flex items-center gap-1"
                      title="Public Verification"
                    >
                      <FiExternalLink className="w-3.5 h-3.5 text-black" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== LUXURY CERTIFICATE PREVIEW MODAL ===================== */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-300 my-auto">
            {/* Modal Control Bar */}
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiAward className="w-5 h-5 text-amber-400" />
                <span className="font-black text-xs sm:text-sm">
                  Official Conferred Citation: <span className="font-mono text-amber-300">{previewCert.certificateId}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/api/certificates/${previewCert.certificateId || previewCert._id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <button
                  onClick={() => handlePrint(previewCert)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Framed Certificate Canvas */}
            <div className="p-4 sm:p-8 bg-amber-50/30 overflow-x-auto">
              <div className="min-w-[680px] bg-white border-8 border-red-900 outline-4 outline-amber-600 rounded-lg p-8 sm:p-10 relative text-center shadow-lg">
                {/* 4 Corner Medallions */}
                <div className="absolute top-2 left-2 w-6 h-6 border border-amber-600 bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">✦</div>
                <div className="absolute top-2 right-2 w-6 h-6 border border-amber-600 bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">✦</div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border border-amber-600 bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">✦</div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border border-amber-600 bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">✦</div>

                {/* Top Row: Logo, NGO Titles, Shield */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-amber-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120'}
                    alt="Logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-900 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-black text-red-900 tracking-wide font-serif">
                      {settings?.ngoName || 'INDIAN YOUTH FOUNDATION'}
                    </h2>
                    <h3 className="text-sm font-bold text-slate-800 font-sans">
                      {settings?.ngoNameHi || 'भारतीय युवा क्रांति (राष्ट्रीय सामाजिक न्यास)'}
                    </h3>
                    <p className="text-[10px] text-slate-600 font-medium">
                      Registered Public Charitable Trust • Reg. No: {settings?.registrationNo || '421/2019'} • 12A &amp; 80G Certified NGO
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      NITI Aayog Darpan ID: {settings?.nitiAayogDarpanId || 'RJ/2022/0319482'} • PAN: {settings?.panNo || 'AAATB4321Q'}
                    </p>
                  </div>

                  {/* Trust Shield */}
                  <div className="w-16 h-18 bg-amber-100 border-2 border-amber-600 rounded-b-2xl p-1.5 shadow-sm text-center flex flex-col justify-center">
                    <FiShield className="w-5 h-5 text-amber-700 mx-auto" />
                    <span className="text-[9px] font-black text-red-900 block leading-tight">12A / 80G</span>
                    <span className="text-[8px] font-bold text-amber-800 block">VERIFIED</span>
                  </div>
                </div>

                {/* Ribbon Title */}
                <div className="inline-block bg-red-900 text-white font-serif font-bold text-base px-8 py-2 rounded-md shadow border border-amber-400 mb-2 tracking-wider">
                  {previewCert.title || 'CERTIFICATE OF APPRECIATION & CITATION'}
                </div>

                <div className="text-[11px] font-mono font-bold text-amber-800 mb-3">
                  Official Conformance No: {previewCert.certificateId}
                </div>

                {/* Presentation */}
                <p className="text-xs italic text-slate-600 mb-1">
                  This certificate of honor is proudly and gratefully conferred upon
                </p>

                {/* Recipient */}
                <h1 className="text-3xl font-black text-slate-900 font-serif tracking-wide my-1">
                  {previewCert.recipientName || currentUser?.name || 'Honored Contributor'}
                </h1>
                <div className="w-48 h-0.5 bg-amber-500 mx-auto mb-2" />

                {/* Designation */}
                <div className="text-xs font-bold text-emerald-800 mb-3">
                  [ {previewCert.roleOrDesignation || 'Active Social Worker'} ]
                </div>

                {/* Reason */}
                <p className="text-xs text-slate-700 leading-relaxed max-w-xl mx-auto mb-6 px-4">
                  {previewCert.reason || 'In recognition of outstanding dedication, exemplary leadership, and selfless service towards societal welfare and youth empowerment.'}
                </p>

                {/* Authentication Footer: QR, Seal, Signature */}
                <div className="pt-4 border-t border-slate-200 flex items-end justify-between px-4">
                  <div className="text-left flex items-center gap-2">
                    <div className="p-1.5 bg-white border border-amber-300 rounded-lg shadow-xs">
                      <QRCodeSVG
                        value={`https://bharatiyayuvakranti.org/verify/certificate/${previewCert.certificateId}`}
                        size={64}
                      />
                    </div>
                    <div className="text-[9px] text-slate-600">
                      <div className="font-bold text-slate-900">Date:</div>
                      <div>
                        {new Date(previewCert.issueDate || previewCert.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-emerald-700 font-black flex items-center gap-0.5 mt-0.5">
                        <FiCheck className="w-3 h-3 text-emerald-600" /> Real-Time Verified
                      </div>
                    </div>
                  </div>

                  {/* Center: Official Seal */}
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.officialSealUrl) || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                      alt="Official Seal"
                      className="w-14 h-14 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200';
                      }}
                    />
                    <span className="text-[9px] font-bold text-red-900 uppercase tracking-wider mt-1 block">
                      Trust Official Seal
                    </span>
                  </div>

                  {/* Right: President Signature & Name */}
                  <div className="text-right">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getContentImageUrl(settings?.presidentSignatureUrl) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                      alt="Signature"
                      className="h-9 object-contain ml-auto"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                      }}
                    />
                    <div className="mt-0.5">
                      <div className="text-xs font-black text-slate-900">
                        {settings?.presidentName || previewCert.issuedBy || 'Ravi Saini (National President & Trustee)'}
                      </div>
                      <div className="text-[9px] text-slate-600 font-bold">
                        National President &amp; Board of Trustees
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
