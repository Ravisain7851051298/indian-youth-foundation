'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiHeart, 
  FiDownload, 
  FiCheckCircle, 
  FiClock, 
  FiPrinter, 
  FiUploadCloud, 
  FiFileText,
  FiTrash2,
  FiXCircle
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonations, submitDonation } from '@/store/donationSlice';
import { useNGO } from '@/context/NGOContext';

export default function ProfileDonationsPage() {
  const dispatch = useDispatch();
  const { donations } = useSelector((state) => state.donations);
  const { currentUser, settings } = useNGO();

  const [modalReceipt, setModalReceipt] = useState(null);
  const [donateModal, setDonateModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [donateForm, setDonateForm] = useState({
    amount: 1100,
    panNumber: '',
    campaignTitle: 'General Social Welfare Fund',
    paymentMethod: 'UPI QR Transfer',
    transactionId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [donateError, setDonateError] = useState('');

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  // Filter donations belonging to this user
  const userDonations = donations.filter(d => 
    (currentUser?.id && (d.donor === currentUser.id || d.donor?._id === currentUser.id)) ||
    (currentUser?._id && (d.donor === currentUser._id || d.donor?._id === currentUser._id)) ||
    (currentUser?.email && (d.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase() || d.email?.toLowerCase() === currentUser.email?.toLowerCase())) ||
    (currentUser?.phone && (d.donorPhone === currentUser.phone || d.phone === currentUser.phone))
  );

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setDonateError('Screenshot file size must be under 15MB.');
      return;
    }

    setDonateError('');
    setSelectedFile(file);
    setFileName(file.name);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleRemoveScreenshot = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
    setFileName('');
    setDonateError('');
    const input = document.getElementById('donationScreenshot');
    if (input) input.value = '';
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (!donateForm.amount || donateForm.amount < 10) {
      setDonateError('Please enter a valid donation amount (minimum ₹10)');
      return;
    }

    setDonateError('');

    try {
      setSubmitting(true);
      // Single-API call: send form fields + payment screenshot directly
      const formData = new FormData();
      formData.append('donorName', currentUser?.name || 'Supporter');
      formData.append('donorEmail', currentUser?.email || 'donor@byk.org');
      formData.append('donorPhone', currentUser?.phone || '9876543210');
      formData.append('panNumber', donateForm.panNumber);
      formData.append('amount', String(donateForm.amount));
      formData.append('campaignTitle', donateForm.campaignTitle);
      formData.append('paymentMethod', donateForm.paymentMethod);
      formData.append('transactionId', donateForm.transactionId);
      formData.append('category', 'payments');
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('paymentScreenshot', selectedFile);
      }

      await dispatch(submitDonation(formData)).unwrap();

      setDonateModal(false);
      setSubmittedNotice(true);
      dispatch(fetchDonations());
      handleRemoveScreenshot();
      setTimeout(() => setSubmittedNotice(false), 8000);
    } catch (err) {
      setDonateError(typeof err === 'string' ? err : (err?.message || 'Failed to submit donation'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <FiHeart className="text-red-600 w-5 h-5" />
            <span>Contributions &amp; Statutory 80G Tax Receipts</span>
          </h2>
          <p className="text-xs text-black font-medium mt-1">
            Section 80G tax exemption certificates are issued solely upon verification of bank transactions.
          </p>
        </div>

        <button
          onClick={() => setDonateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition self-start sm:self-auto cursor-pointer"
        >
          <FiHeart className="w-4 h-4" />
          <span>Make a Charitable Contribution</span>
        </button>
      </div>

      {/* Submitted Notice */}
      {submittedNotice && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-xs text-black flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">
            Contribution received for verification! Once approved by the audit committee, your official 80G Tax Exemption Receipt will unlock and be emailed to you.
          </span>
        </div>
      )}

      {/* Anti-Fraud Notice */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-black space-y-1 shadow-2xs font-medium">
        <p className="font-black text-black">
          ⚖️ Statutory Tax Exemption Notice (Income Tax Act 1961 - Section 80G)
        </p>
        <p>
          Donations to Yuva Kranti Dal qualify for 50% tax deduction under Section 80G.
          In compliance with Form 10BD regulations, tax receipts are generated exclusively following bank reconciliation by our accountants.
        </p>
      </div>

      {/* Donations List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-black uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt No (80G)</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Cause / Purpose</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Official Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-black">
              {userDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-black font-medium">
                    No contributions recorded under this account yet. Click &ldquo;Make a Charitable Contribution&rdquo; to support our causes.
                  </td>
                </tr>
              ) : (
                userDonations.map((d) => {
                  const isApproved = (d.status === 'approved' || d.status === 'success') && Boolean(d.receiptNumber);
                  const isRejected = d.status === 'rejected';
                  return (
                    <tr key={d._id} className="hover:bg-red-50/20 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-black">
                        {d.receiptNumber || (isRejected ? 'Declined' : 'Pending Audit')}
                      </td>
                      <td className="py-3.5 px-4 font-black text-black">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-black font-semibold">{d.campaignTitle}</td>
                      <td className="py-3.5 px-4 text-black font-medium">
                        {(d.date || d.createdAt) ? new Date(d.date || d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Verified &amp; Approved</span>
                          </span>
                        ) : isRejected ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200">
                              <FiXCircle className="w-3 h-3 text-red-600" />
                              <span>Rejected</span>
                            </span>
                            {d.rejectionReason && (
                              <p className="text-[11px] text-red-600 font-bold max-w-xs leading-tight">
                                Reason: {d.rejectionReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            <FiClock className="w-3 h-3 text-amber-600" />
                            <span>Audit Verification Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isApproved ? (
                          <button
                            type="button"
                            onClick={() => setModalReceipt(d)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                          >
                            <FiDownload className="w-3.5 h-3.5" />
                            <span>Download 80G Receipt</span>
                          </button>
                        ) : isRejected ? (
                          <span className="text-[11px] text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                            Declined: {d.rejectionReason || 'Verification failed'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-black font-medium italic">
                            Receipt locked until verified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- 80G RECEIPT MODAL ----------------- */}
      {modalReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0">
            {/* Receipt Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <h3 className="font-black text-black text-base flex items-center gap-2">
                <FiFileText className="text-red-600" />
                <span>Official 80G Donation Receipt</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setModalReceipt(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-black flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="border-2 border-red-600 rounded-2xl p-6 sm:p-8 space-y-6 text-black relative bg-white">
              {/* Receipt Top Letterhead */}
              <div className="text-center border-b-2 border-red-500 pb-4 space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-red-600 uppercase tracking-wide">
                  YUVA KRANTI DAL
                </h2>
                <h3 className="text-xs font-black text-black">
                  युवा क्रांति दल (राष्ट्रीय सामाजिक संगठन)
                </h3>
                <p className="text-[10px] text-black font-medium">
                  Trust Reg No: <strong>421/2019</strong> • NITI Aayog Darpan: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br/>
                  12A Reg: <strong>{settings?.exemption12A || 'CIT/12A/2021'}</strong> • 80G Approval: <strong>{settings?.exemption80G || 'CIT/80G/2021'}</strong> • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
                </p>
                <p className="text-[10px] text-black">
                  Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001
                </p>
              </div>

              {/* Receipt Title */}
              <div className="bg-red-50 border border-red-200 text-center py-2 rounded-xl">
                <span className="text-xs font-black text-red-900 uppercase tracking-wider">
                  STATUTORY DONATION RECEIPT (SECTION 80G EXEMPTION)
                </span>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-black font-semibold block">Receipt Number:</span>
                  <strong className="font-mono text-red-600 text-sm font-black">{modalReceipt.receiptNumber}</strong>
                </div>
                <div className="text-right">
                  <span className="text-black font-semibold block">Date of Donation:</span>
                  <strong className="text-black">{(modalReceipt.date || modalReceipt.createdAt) ? new Date(modalReceipt.date || modalReceipt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</strong>
                </div>
                <div>
                  <span className="text-black font-semibold block">Donor Name:</span>
                  <strong className="text-black text-sm font-black">{modalReceipt.donorName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-black font-semibold block">Donor PAN Card No:</span>
                  <strong className="font-mono text-black font-black">{modalReceipt.panNumber || modalReceipt.pan || 'NA'}</strong>
                </div>
                <div>
                  <span className="text-black font-semibold block">Amount Received:</span>
                  <strong className="text-base font-black text-black">₹{Number(modalReceipt.amount).toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-right">
                  <span className="text-black font-semibold block">Payment Mode:</span>
                  <strong className="text-black">{modalReceipt.paymentMethod}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-black font-semibold block">Contribution Earmarked For:</span>
                  <strong className="text-black">{modalReceipt.campaignTitle}</strong>
                </div>
              </div>

              {/* Tax Exemption Citation */}
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-3 text-[11px] text-black space-y-1.5 font-medium">
                <p className="flex items-start gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Income Tax Benefit:</strong> This receipt entitles the donor to deduction under Section 80G of the Income Tax Act, 1961.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>All contributions are exclusively applied towards the charitable purposes of the Trust across India.</span>
                </p>
              </div>

              {/* Seal, Signature & QR Verification */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-center">
                  <QRCodeSVG
                    value={`https://bharatiyayuvakranti.org/verify/donation/${modalReceipt.receiptNumber}`}
                    size={70}
                  />
                  <span className="text-[9px] font-bold text-black mt-1 block">Scan to Verify</span>
                </div>

                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings?.officialSealUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                    alt="Seal"
                    className="w-12 h-12 object-contain mx-auto"
                  />
                  <span className="text-[9px] font-bold text-black block">Trust Seal</span>
                </div>

                <div className="text-right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings?.presidentSignatureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt="Sign"
                    className="h-8 object-contain ml-auto"
                  />
                  <span className="text-[10px] font-bold text-black block">Authorized Trustee Signatory</span>
                  <span className="text-[9px] text-black block">National President</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- DONATE MODAL (Single-API) ----------------- */}
      {donateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-black text-base">Make a Charitable Contribution</h3>
              <button
                onClick={() => setDonateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-black flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {donateError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {donateError}
              </div>
            )}

            <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-black mb-1">Donation Amount (₹ INR) *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[500, 1100, 2100, 5100, 11000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonateForm(prev => ({ ...prev, amount: amt }))}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer ${
                        Number(donateForm.amount) === amt
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-black border-slate-300 hover:bg-red-50'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="10"
                  value={donateForm.amount}
                  onChange={(e) => setDonateForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm text-black bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-black mb-1">Donor PAN Number (Required for 80G Exemption)</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={donateForm.panNumber}
                  onChange={(e) => setDonateForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono uppercase text-black bg-white"
                />
              </div>

              {/* UPI QR Display */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-2">
                <span className="text-[11px] font-bold text-black uppercase tracking-wider block">
                  Scan Official UPI QR to Pay
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Yuva%20Kranti%20Dal%26cu=INR'}
                  alt="UPI QR"
                  className="w-36 h-36 mx-auto object-contain bg-white p-2 rounded-xl border border-red-300 shadow-2xs"
                />
                <span className="font-mono text-xs font-bold text-black block">
                  {settings?.upiId || 'bharatiyauva@okhdfcbank'}
                </span>
              </div>

              <div>
                <label className="block font-bold text-black mb-1">Transaction UTR / Reference ID *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter UPI reference UTR..."
                  value={donateForm.transactionId}
                  onChange={(e) => setDonateForm(prev => ({ ...prev, transactionId: e.target.value }))}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-black bg-white"
                />
              </div>

              {/* Single-API File Selection */}
              <div>
                <label className="block font-bold text-black mb-1">Attach Payment Screenshot (Optional)</label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-4 text-center transition bg-slate-50">
                    <input
                      type="file"
                      id="donationScreenshot"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="donationScreenshot" className="cursor-pointer space-y-1 block">
                      <FiUploadCloud className="w-5 h-5 text-red-600 mx-auto" />
                      <span className="text-xs font-bold text-red-600 block hover:underline">
                        Select Payment Screenshot
                      </span>
                      <span className="text-[10px] text-black block">
                        Uploaded in single API request with contribution
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl}
                          alt="Screenshot"
                          className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200"
                        />
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-black block">{fileName}</span>
                        <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Ready to send with contribution</span>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDonateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-black font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-md shadow-red-600/20 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Contribution for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
