'use client';

import React, { useState } from 'react';
import { FiAward, FiPlus, FiSearch, FiPrinter, FiCheckCircle, FiShield, FiX, FiDownload } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useNGO } from '@/context/NGOContext';

export default function CertificatesPage() {
  const { certificates, addCertificate, currentUser, settings } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [searchNo, setSearchNo] = useState('');
  const [showIssue, setShowIssue] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [awardTitle, setAwardTitle] = useState('Certificate of Appreciation for Social Excellence');
  const [eventOrWork, setEventOrWork] = useState('Shiksha Kranti - Child Literacy & Relief Campaign');
  const [description, setDescription] = useState('In recognition of exemplary voluntary service, dedication, and active participation in community upliftment.');

  const [selectedCert, setSelectedCert] = useState(null);

  const filteredCerts = certificates.filter(c => {
    if (!searchNo) return true;
    return (
      c.certificateNo?.toLowerCase().includes(searchNo.toLowerCase()) ||
      c.recipientName?.toLowerCase().includes(searchNo.toLowerCase()) ||
      c.recipientId?.toLowerCase().includes(searchNo.toLowerCase())
    );
  });

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!recipientName || !awardTitle) return;
    const res = await addCertificate({
      recipientName,
      recipientId,
      awardTitle,
      eventOrWork,
      issueDate: new Date().toISOString().split('T')[0],
      description
    });
    if (res.success) {
      setSelectedCert(res.certificate);
      setShowIssue(false);
      setRecipientName('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 no-print">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiAward className="w-3.5 h-3.5" />
              <span>Recognition & Verification</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Certificates of Appreciation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Verify official NGO credentials, honors, and certificates with instantaneous QR authentication.
            </p>
          </div>

          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowIssue(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Issue New Certificate</span>
              </button>
            )}
          </div>
        </div>

        {/* Certificate Modal / View */}
        {selectedCert && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 no-print">
              <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Certificate Ready to Print / Export</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* OFFICIAL PRINTABLE CERTIFICATE */}
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 via-white to-orange-50 p-10 sm:p-14 rounded-3xl border-8 border-double border-amber-600 shadow-2xl text-center relative print-card-container">
              <div className="border border-amber-300 p-8 rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                    IYF
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {settings?.ngoName || 'Indian Youth Foundation'}
                    </h2>
                    <div className="text-[10px] text-orange-700 font-bold uppercase tracking-widest mt-0.5">
                      12A & 80G Certified Non-Governmental Organization • Reg No: {settings?.registrationNo}
                    </div>
                  </div>
                </div>

                <div className="my-6">
                  <span className="text-xs uppercase font-serif tracking-widest text-amber-800 font-extrabold border-b-2 border-amber-500 pb-1">
                    CERTIFICATE OF APPRECIATION & MERIT
                  </span>
                  <div className="text-xs font-mono text-slate-500 mt-2.5 font-bold">
                    Certificate No: {selectedCert.certificateNo}
                  </div>
                </div>

                {/* Recipient */}
                <p className="text-xs text-slate-600">This certificate is proudly and honorably conferred upon:</p>
                <h3 className="text-2xl sm:text-3xl font-black text-orange-700 my-2.5 font-serif tracking-wide">
                  {selectedCert.recipientName}
                </h3>
                {selectedCert.recipientId && (
                  <span className="text-xs font-mono text-slate-500 font-bold block mb-2">
                    Member ID: {selectedCert.recipientId}
                  </span>
                )}

                <div className="max-w-xl mx-auto my-6 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                  <p>
                    In recognition of exemplary commitment, tireless voluntary service, and remarkable contribution towards <strong>"{selectedCert.awardTitle}"</strong>.
                  </p>
                  <p className="mt-2 text-center text-xs text-slate-500">
                    The foundation congratulates you and wishes you success in all future social and national endeavors.
                  </p>
                </div>

                {/* Footer QR & Signatures */}
                <div className="mt-8 pt-6 border-t border-amber-200 flex items-end justify-between text-xs">
                  <div className="flex items-center gap-3 text-left">
                    <QRCodeSVG
                      value={`https://bharatiyayuvakranti.org/verify/certificate/${selectedCert.certificateNo}`}
                      size={70}
                    />
                    <div className="text-[10px] text-slate-500">
                      <div className="font-bold text-slate-900">QR Code Verified</div>
                      <div>Issue Date: {selectedCert.issueDate}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-serif italic text-slate-800 text-sm font-semibold">Dr. Vikram Sharma</div>
                    <div className="border-t border-slate-400 pt-0.5 text-[11px] font-bold text-slate-900">
                      National President & Founder
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Issue Certificate Modal */}
        {showIssue && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setShowIssue(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Issue Appreciation Certificate</h3>
              <form onSubmit={handleIssue} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Membership ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. BYK-MEM-101"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Award Honor Title *</label>
                  <input
                    type="text"
                    required
                    value={awardTitle}
                    onChange={(e) => setAwardTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project / Campaign Name</label>
                  <input
                    type="text"
                    value={eventOrWork}
                    onChange={(e) => setEventOrWork(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Commendation Text</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssue(false)}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Issue Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 no-print">
          <div className="relative">
            <FiSearch className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Certificate Number (e.g. CERT-2026-001) or Recipient Name..."
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-orange-500 text-sm font-medium"
            />
          </div>
        </div>

        {/* Certificates List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
          {filteredCerts.map((c) => (
            <div
              key={c._id || c.certificateNo}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                    {c.certificateNo}
                  </span>
                  <span className="text-slate-400 font-medium">{c.issueDate}</span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{c.recipientName}</h3>
                <div className="text-xs font-bold text-amber-700 mt-1">{c.awardTitle}</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{c.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{c.recipientId || 'Honored Volunteer'}</span>
                <button
                  onClick={() => setSelectedCert(c)}
                  className="text-orange-600 font-bold hover:text-orange-700 cursor-pointer flex items-center gap-1 transition"
                >
                  <span>View & Print Certificate</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
