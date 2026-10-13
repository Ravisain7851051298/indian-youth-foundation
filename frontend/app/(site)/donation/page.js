'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  FiHeart, 
  FiShield, 
  FiPrinter, 
  FiCheckCircle, 
  FiDownload, 
  FiLock,
  FiCreditCard,
  FiFileText,
  FiShare2,
  FiX
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useNGO } from '@/context/NGOContext';

function DonationContent() {
  const { settings, campaigns, recordDonation, donations, currentUser } = useNGO();
  const searchParams = useSearchParams();
  const receiptQuery = searchParams.get('receipt');
  const campaignQuery = searchParams.get('campaign');

  const [selectedCampaign, setSelectedCampaign] = useState(campaignQuery || 'general');
  const [amount, setAmount] = useState(1100);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [issuedReceipt, setIssuedReceipt] = useState(null);

  const receiptRef = useRef(null);

  // If URL has ?receipt=..., load existing receipt
  useEffect(() => {
    if (receiptQuery && donations.length) {
      const found = donations.find(d => d.receiptNumber === receiptQuery);
      if (found) setIssuedReceipt(found);
    }
  }, [receiptQuery, donations]);

  const quickAmounts = [500, 1100, 2100, 5100, 11000];

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      alert('Please enter a minimum donation of ₹10');
      return;
    }

    setLoading(true);

    const campObj = campaigns.find(c => c._id === selectedCampaign || c.id === selectedCampaign);
    const campaignTitle = campObj ? campObj.title : 'General NGO Social Welfare Fund';

    const donationData = {
      donorName: donorName || 'Generous Well-wisher',
      donorPhone: donorPhone || '9876543210',
      donorEmail: donorEmail || 'donor@byk.org',
      panNumber: panNumber ? panNumber.toUpperCase() : '',
      amount: Number(amount),
      campaignId: selectedCampaign,
      campaignTitle,
      paymentId: `pay_RZP_${Date.now()}`,
      orderId: `ord_${Date.now()}`,
      paymentMethod: paymentMethod === 'UPI' ? 'Razorpay UPI' : 'Credit/Debit Card / NetBanking',
      address
    };

    const res = await recordDonation(donationData);
    setLoading(false);

    if (res.success) {
      setIssuedReceipt(res.donation);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      alert(res.message || 'Error occurred while processing donation');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <FiShield className="w-3.5 h-3.5" />
            <span>Section 80G Approved • 50% Income Tax Exemption</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Support Our Cause & Receive Instant 80G Receipt
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Every contribution directly funds child literacy, youth skill development, and emergency medical relief with 100% statutory transparency.
          </p>
        </div>

        {/* 1. DONATION RECEIPT MODAL / VIEW (If issued) */}
        {issuedReceipt ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 no-print">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-base">
                <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Donation Received Successfully! Official 80G Receipt Generated.</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition"
                >
                  <FiPrinter className="w-3.5 h-3.5" />
                  <span>Print / Save 80G Receipt</span>
                </button>
                <button
                  onClick={() => setIssuedReceipt(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Make Another Donation
                </button>
              </div>
            </div>

            {/* PRINTABLE OFFICIAL 80G RECEIPT */}
            <div
              ref={receiptRef}
              className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-slate-300 shadow-xl max-w-3xl mx-auto text-slate-900 font-sans print-card-container"
            >
              {/* Receipt Header */}
              <div className="border-b-2 border-orange-600 pb-4 text-center">
                <div className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">
                  OFFICIAL DONATION RECEIPT UNDER SECTION 80G OF INCOME TAX ACT, 1961
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {settings?.ngoName || 'INDIAN YOUTH FOUNDATION'}
                </h2>
                <div className="text-xs font-semibold text-slate-500 tracking-wider">
                  {settings?.ngoNameHi || 'Bharatiya Yuva Kranti'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Registered Office: {settings?.address} | Phone: {settings?.phone}
                </div>
              </div>

              {/* Tax & Registration Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-200 my-4 text-slate-600">
                <div>
                  <span className="block text-slate-400">80G Order No:</span>
                  <strong className="text-slate-800 font-mono">{settings?.exemption80G}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">12A Reg No:</span>
                  <strong className="text-slate-800 font-mono">{settings?.exemption12A}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Society PAN:</span>
                  <strong className="text-slate-800 font-mono">{settings?.panNo}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">NITI Aayog ID:</span>
                  <strong className="text-slate-800 font-mono">{settings?.nitiAayogDarpanId}</strong>
                </div>
              </div>

              {/* Receipt Details Box */}
              <div className="flex justify-between items-center text-xs font-semibold my-4 pb-2 border-b border-slate-100">
                <div>
                  Receipt Number: <span className="text-orange-600 font-mono font-bold">{issuedReceipt.receiptNumber}</span>
                </div>
                <div>
                  Issue Date: <span className="font-bold">{new Date(issuedReceipt.date || Date.now()).toLocaleDateString('en-US')}</span>
                </div>
              </div>

              {/* Donor Table */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Donor Full Name:</span>
                  <span className="col-span-2 font-bold text-slate-900 text-sm">{issuedReceipt.donorName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Donor PAN Card No:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-800">
                    {issuedReceipt.panNumber || 'NA (Required for 80G Tax Deduction)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Contact Details:</span>
                  <span className="col-span-2 text-slate-700">{issuedReceipt.donorPhone} | {issuedReceipt.donorEmail}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Cause / Project:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{issuedReceipt.campaignTitle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Payment Gateway ID:</span>
                  <span className="col-span-2 font-mono text-[11px] text-slate-600">{issuedReceipt.paymentMethod} ({issuedReceipt.paymentId})</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-emerald-800 font-bold block">Donation Amount Received:</span>
                    <span className="text-2xl font-black text-emerald-700">₹{Number(issuedReceipt.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-xs text-emerald-800 font-medium font-mono">INR {issuedReceipt.amount} Only</span>
                </div>
              </div>

              {/* Legal Notice */}
              <p className="text-[10px] text-slate-500 text-justify mt-6 border-t border-slate-100 pt-3">
                * This receipt qualifies for a 50% deduction in taxable income under Section 80G of the Income Tax Act, 1961. The donor may reference this receipt number and the Society PAN when filing their annual income tax returns.
              </p>

              {/* QR Code and Signatures */}
              <div className="mt-8 pt-4 flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <QRCodeSVG 
                    value={`https://bharatiyayuvakranti.org/verify/donation/${issuedReceipt.receiptNumber}`}
                    size={75}
                    level="M"
                  />
                  <div className="text-[9px] text-slate-400">
                    <div className="font-bold text-slate-700">Digitally Authenticated</div>
                    <div>Scan QR to verify on portal</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-serif italic text-xs text-slate-600">Rekha Choudhary</div>
                  <div className="border-t border-slate-300 pt-0.5 text-[10px] font-bold text-slate-700">
                    Authorized Treasurer / Secretary
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* 2. DONATION FORM & BANK / QR SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <FiHeart className="text-orange-600" />
              <span>Make a Contribution</span>
            </h2>

            <form onSubmit={handleDonate} className="space-y-4 text-xs">
              {/* Campaign Picker */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Cause / Drive</label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                >
                  <option value="general">General NGO Social Welfare Fund</option>
                  {campaigns.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Picker */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Donation Amount (INR)</label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                        amount === amt 
                          ? 'bg-orange-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="10"
                  required
                  placeholder="Or enter custom amount in INR"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 text-sm font-bold"
                />
              </div>

              {/* Donor Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Donor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Phone (for SMS Receipt) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* PAN & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    PAN Card Number (Required for 80G Tax Exemption)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="donor@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                    />
                    <span>UPI (GPay / PhonePe / Paytm)</span>
                  </label>
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    paymentMethod === 'Card' ? 'border-orange-500 bg-orange-50 text-orange-900 font-bold' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                    />
                    <span>Debit/Credit Card / NetBanking</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition cursor-pointer"
              >
                {loading ? 'Verifying payment...' : `Donate ₹${amount} Securely & Generate 80G Receipt`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
                <FiLock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Payment • Instant Tax Certificate</span>
              </div>
            </form>
          </div>

          {/* Direct Bank & UPI Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl text-center">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Direct UPI QR Payment
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">
                Scan with Any UPI App
              </h3>

              <div className="my-4 p-2.5 bg-white rounded-2xl inline-block shadow-md">
                <img
                  src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                  alt="UPI QR Code"
                  className="w-44 h-44 rounded-xl"
                />
              </div>

              <div className="font-mono text-xs font-bold text-orange-300 bg-slate-800 py-1.5 px-3 rounded-lg inline-block">
                {settings?.upiId}
              </div>

              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                After direct UPI transfer, you can also share your transaction ID or screenshot on WhatsApp at <strong>{settings?.phone}</strong> to receive your 80G tax certificate.
              </p>
            </div>

            {/* Bank Accounts */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">Official Society Bank Account</h4>
              <div className="text-slate-600">Account Name: <strong className="text-slate-900">{settings?.bankDetails?.accountName}</strong></div>
              <div className="text-slate-600">Account Number: <strong className="text-slate-900 font-mono font-bold">{settings?.bankDetails?.accountNumber}</strong></div>
              <div className="text-slate-600">IFSC Code: <strong className="text-slate-900 font-mono font-bold">{settings?.bankDetails?.ifscCode}</strong></div>
              <div className="text-slate-600">Bank: <strong className="text-slate-900">{settings?.bankDetails?.bankName} ({settings?.bankDetails?.branch})</strong></div>
            </div>
          </div>
        </div>

        {/* 3. IF ADMIN: SHOW RECENT DONATIONS TABLE & EXCEL BACKUP */}
        {currentUser?.role === 'Admin' && (
          <div className="mt-16 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs no-print">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Administrator 80G Tax Donation Log</h3>
                <p className="text-xs text-slate-500">Record of all online and direct donations received with tax receipts</p>
              </div>
              <a
                href="/api/donations/export/excel"
                target="_blank"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
              >
                <FiDownload className="w-3.5 h-3.5" />
                <span>Download Excel Log</span>
              </a>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Receipt No.</th>
                    <th className="py-2.5 px-3">Donor Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">PAN</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Cause</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((d) => (
                    <tr key={d._id || d.receiptNumber} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-orange-600">{d.receiptNumber}</td>
                      <td className="py-2.5 px-3 font-bold">{d.donorName}</td>
                      <td className="py-2.5 px-3">{d.donorPhone}</td>
                      <td className="py-2.5 px-3 font-mono">{d.panNumber || 'NA'}</td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-700">₹{Number(d.amount).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-slate-600">{d.campaignTitle}</td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => setIssuedReceipt(d)}
                          className="text-orange-600 font-bold hover:underline cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DonationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading donation portal...</div>}>
      <DonationContent />
    </Suspense>
  );
}
