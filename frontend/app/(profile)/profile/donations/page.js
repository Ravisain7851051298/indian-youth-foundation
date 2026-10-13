'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiHeart, 
  FiDownload, 
  FiCheckCircle, 
  FiClock, 
  FiPrinter, 
  FiUploadCloud, 
  FiAlertTriangle, 
  FiFileText,
  FiShield
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonations, submitDonation } from '@/store/donationSlice';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ProfileDonationsPage() {
  const dispatch = useDispatch();
  const { donations } = useSelector((state) => state.donations);
  const { currentUser, settings } = useNGO();

  const [modalReceipt, setModalReceipt] = useState(null);
  const [donateModal, setDonateModal] = useState(false);
  const [donateForm, setDonateForm] = useState({
    amount: 1100,
    panNumber: '',
    campaignTitle: 'General Social Welfare Fund',
    paymentMethod: 'UPI QR Transfer',
    transactionId: '',
    paymentScreenshot: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  // Filter donations belonging to this user
  const userDonations = donations.filter(d => 
    (currentUser?.email && d.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
    (currentUser?.phone && d.donorPhone === currentUser.phone)
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setDonateForm(prev => ({ ...prev, paymentScreenshot: res.data.url }));
      }
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (!donateForm.amount || donateForm.amount < 10) {
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(submitDonation({
        donorName: currentUser?.name || 'Supporter',
        donorEmail: currentUser?.email || 'donor@byk.org',
        donorPhone: currentUser?.phone || '9876543210',
        panNumber: donateForm.panNumber,
        amount: Number(donateForm.amount),
        campaignTitle: donateForm.campaignTitle,
        paymentMethod: donateForm.paymentMethod,
        transactionId: donateForm.transactionId,
        paymentScreenshot: donateForm.paymentScreenshot
      })).unwrap();

      setDonateModal(false);
      setSubmittedNotice(true);
      dispatch(fetchDonations());
      setTimeout(() => setSubmittedNotice(false), 8000);
    } catch (err) {
      alert(err || 'Failed to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FiHeart className="text-rose-600 w-5 h-5" />
            <span>Contributions &amp; Statutory 80G Tax Receipts</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Section 80G tax exemption certificates are issued solely upon verification of bank transactions.
          </p>
        </div>

        <button
          onClick={() => setDonateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition self-start sm:self-auto"
        >
          <FiHeart className="w-4 h-4" />
          <span>Make a Charitable Contribution</span>
        </button>
      </div>

      {/* Submitted Notice */}
      {submittedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-900 flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Contribution received for verification! Once approved by the audit committee, your official 80G Tax Exemption Receipt will unlock and be emailed to you.
          </span>
        </div>
      )}

      {/* Anti-Fraud Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800">
          ⚖️ Statutory Tax Exemption Notice (Income Tax Act 1961 - Section 80G)
        </p>
        <p>
          Donations to Indian Youth Foundation qualify for 50% tax deduction under Section 80G.
          In compliance with Form 10BD regulations, tax receipts are generated exclusively following bank reconciliation by our accountants.
        </p>
      </div>

      {/* Donations List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt No (80G)</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Cause / Purpose</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4 text-right">Official Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {userDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No contributions recorded under this account yet. Click &ldquo;Make a Charitable Contribution&rdquo; to support our causes.
                  </td>
                </tr>
              ) : (
                userDonations.map((d) => {
                  const isApproved = d.status === 'success' && d.receiptNumber;
                  return (
                    <tr key={d._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {d.receiptNumber || 'Pending Audit'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">{d.campaignTitle}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Verified &amp; Approved</span>
                          </span>
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition"
                          >
                            <FiDownload className="w-3.5 h-3.5" />
                            <span>Download 80G Receipt</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
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
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0">
            {/* Receipt Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-orange-600" />
                <span>Official 80G Donation Receipt</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setModalReceipt(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="border-2 border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-800 relative bg-white">
              {/* Receipt Top Letterhead */}
              <div className="text-center border-b-2 border-orange-500 pb-4 space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-orange-600 uppercase tracking-wide">
                  INDIAN YOUTH FOUNDATION
                </h2>
                <h3 className="text-xs font-black text-slate-800">
                  भारतीय युवा क्रांति (राष्ट्रीय सामाजिक संगठन)
                </h3>
                <p className="text-[10px] text-slate-600">
                  Trust Reg No: <strong>421/2019</strong> • NITI Aayog Darpan: <strong>{settings?.nitiAayogDarpanId || 'RJ/2022/0319482'}</strong><br/>
                  12A Reg: <strong>{settings?.exemption12A || 'CIT/12A/2021'}</strong> • 80G Approval: <strong>{settings?.exemption80G || 'CIT/80G/2021'}</strong> • PAN: <strong>{settings?.panNo || 'AAATB4321Q'}</strong>
                </p>
                <p className="text-[10px] text-slate-500">
                  Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001
                </p>
              </div>

              {/* Receipt Title */}
              <div className="bg-orange-50 border border-orange-200 text-center py-2 rounded-xl">
                <span className="text-xs font-black text-orange-900 uppercase tracking-wider">
                  STATUTORY DONATION RECEIPT (SECTION 80G EXEMPTION)
                </span>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Receipt Number:</span>
                  <strong className="font-mono text-orange-600 text-sm">{modalReceipt.receiptNumber}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Date of Donation:</span>
                  <strong className="text-slate-800">{new Date(modalReceipt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Donor Name:</span>
                  <strong className="text-slate-900 text-sm">{modalReceipt.donorName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Donor PAN Card No:</span>
                  <strong className="font-mono text-slate-800">{modalReceipt.panNumber || 'NA'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Amount Received:</span>
                  <strong className="text-base font-black text-slate-900">₹{Number(modalReceipt.amount).toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Payment Mode:</span>
                  <strong className="text-slate-800">{modalReceipt.paymentMethod}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Contribution Earmarked For:</span>
                  <strong className="text-slate-800">{modalReceipt.campaignTitle}</strong>
                </div>
              </div>

              {/* Tax Exemption Citation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                <p>✓ <strong>Income Tax Benefit:</strong> This receipt entitles the donor to deduction under Section 80G of the Income Tax Act, 1961.</p>
                <p>✓ All contributions are exclusively applied towards the charitable purposes of the Trust across India.</p>
              </div>

              {/* Seal, Signature & QR Verification */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-center">
                  <QRCodeSVG
                    value={`https://bharatiyayuvakranti.org/verify/donation/${modalReceipt.receiptNumber}`}
                    size={70}
                  />
                  <span className="text-[9px] font-bold text-slate-400 mt-1 block">Scan to Verify</span>
                </div>

                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings?.officialSealUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200'}
                    alt="Seal"
                    className="w-12 h-12 object-contain mx-auto"
                  />
                  <span className="text-[9px] font-bold text-slate-400 block">Trust Seal</span>
                </div>

                <div className="text-right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings?.presidentSignatureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt="Sign"
                    className="h-8 object-contain ml-auto"
                  />
                  <span className="text-[10px] font-bold text-slate-800 block">Authorized Trustee Signatory</span>
                  <span className="text-[9px] text-slate-400 block">National President</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- DONATE MODAL ----------------- */}
      {donateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-base">Make a Charitable Contribution</h3>
              <button
                onClick={() => setDonateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDonateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Donation Amount (₹ INR) *</label>
                <div className="flex gap-2 mb-2">
                  {[500, 1100, 2100, 5100, 11000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonateForm(prev => ({ ...prev, amount: amt }))}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                        donateForm.amount === amt
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Donor PAN Number (Required for 80G Exemption)</label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={donateForm.panNumber}
                  onChange={(e) => setDonateForm(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono uppercase"
                />
              </div>

              {/* UPI QR Display */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Scan Official UPI QR to Pay
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Indian%20Youth%20Foundation%26cu=INR'}
                  alt="UPI QR"
                  className="w-36 h-36 mx-auto object-contain bg-white p-2 rounded-xl border border-slate-200"
                />
                <span className="font-mono text-xs font-bold text-slate-800 block">
                  {settings?.upiId || 'bharatiyauva@okhdfcbank'}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction UTR / Reference ID *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter UPI reference UTR..."
                  value={donateForm.transactionId}
                  onChange={(e) => setDonateForm(prev => ({ ...prev, transactionId: e.target.value }))}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Payment Screenshot (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs"
                />
                {donateForm.paymentScreenshot && (
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">✓ Screenshot attached</span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDonateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md shadow-rose-600/20"
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
