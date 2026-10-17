'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  FiHeart, 
  FiShield, 
  FiCheckCircle, 
  FiLock, 
  FiFileText, 
  FiUploadCloud, 
  FiLogIn, 
  FiUserPlus, 
  FiClock, 
  FiAlertTriangle,
  FiTrash2,
  FiTarget,
  FiHash,
  FiCopy,
  FiCheck,
  FiLayers
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useNGO } from '@/context/NGOContext';

function DonationContent() {
  const { settings, campaigns, recordDonation, currentUser, login } = useNGO();
  const searchParams = useSearchParams();
  const campaignQuery = searchParams.get('campaign') || searchParams.get('campaignId') || searchParams.get('id');

  const [selectedCampaign, setSelectedCampaign] = useState(campaignQuery || 'general');
  const [copiedId, setCopiedId] = useState(false);
  const [amount, setAmount] = useState(1100);
  const [donorName, setDonorName] = useState(() => currentUser?.name || '');
  const [donorPhone, setDonorPhone] = useState(() => currentUser?.phone || '');
  const [donorEmail, setDonorEmail] = useState(() => currentUser?.email || '');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState(() => currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI QR Transfer');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Synchronize campaign selection with query params (?campaign=..., ?campaignId=..., ?id=...)
  useEffect(() => {
    const rawParam = searchParams.get('campaign') || searchParams.get('campaignId') || searchParams.get('id');
    if (rawParam) {
      if (campaigns && campaigns.length > 0) {
        const found = campaigns.find(c => 
          c._id === rawParam || 
          c.id === rawParam || 
          String(c._id) === String(rawParam) || 
          c.title?.toLowerCase() === rawParam.toLowerCase()
        );
        if (found) {
          setSelectedCampaign(found._id || found.id);
        } else {
          setSelectedCampaign(rawParam);
        }
      } else {
        setSelectedCampaign(rawParam);
      }
    }
  }, [searchParams, campaigns]);

  // Resolve currently attached crowdfunding campaign object
  const currentCampaign = campaigns?.find(c => 
    c._id === selectedCampaign || 
    c.id === selectedCampaign || 
    String(c._id) === String(selectedCampaign)
  );

  const handleCopyCampaignId = (id) => {
    if (!id) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Under-review submitted donation confirmation state
  const [submittedDonation, setSubmittedDonation] = useState(null);

  // Quick inline login state for unauthenticated users ("least action")
  const [quickIdentifier, setQuickIdentifier] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);
  const [quickLoginError, setQuickLoginError] = useState('');

  const quickAmounts = [500, 1100, 2100, 5100, 11000];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScreenshotFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setScreenshotFileName(file.name);
  };

  const handleRemoveScreenshot = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setScreenshotFile(null);
    setScreenshotFileName('');
    const input = document.getElementById('donationScreenshotInput');
    if (input) input.value = '';
  };


  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setQuickLoginLoading(true);
    setQuickLoginError('');

    const res = await login(quickIdentifier.trim(), quickPassword);
    setQuickLoginLoading(false);

    if (res.success) {
      setDonorName(res.user.name || '');
      setDonorEmail(res.user.email || '');
      setDonorPhone(res.user.phone || '');
      if (res.user.address) setAddress(res.user.address);
    } else {
      setQuickLoginError(res.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Authentication Required: Please sign in or create an account to submit your contribution for verification.');
      return;
    }

    if (!amount || amount < 10) {
      setError('Please enter a valid donation amount of at least ₹10.');
      return;
    }

    if (!transactionId.trim()) {
      setError('Please enter the UPI Transaction ID / Bank UTR Number from your payment app.');
      return;
    }

    if (!screenshotFile) {
      setError('Please upload the payment transfer screenshot for Trustee bank reconciliation.');
      return;
    }

    setLoading(true);

    const campObj = campaigns.find(c => c._id === selectedCampaign || c.id === selectedCampaign || String(c._id) === String(selectedCampaign));
    const finalCampaignId = campObj ? (campObj._id || campObj.id) : (selectedCampaign === 'general' ? 'general' : selectedCampaign);
    const campaignTitle = campObj ? campObj.title : (selectedCampaign === 'general' ? 'General NGO Social Welfare Fund' : 'General Welfare Fund');

    const formData = new FormData();
    formData.append('donorName', donorName || currentUser?.name || 'Generous Contributor');
    formData.append('donorPhone', donorPhone || currentUser?.phone || '9876543210');
    formData.append('donorEmail', donorEmail || currentUser?.email || 'donor@byk.org');
    formData.append('panNumber', panNumber ? panNumber.toUpperCase().trim() : '');
    formData.append('amount', String(amount));
    formData.append('campaignId', finalCampaignId);
    formData.append('campaignTitle', campaignTitle);
    formData.append('transactionId', transactionId.trim());
    formData.append('paymentMethod', paymentMethod);
    formData.append('address', address || currentUser?.address || '');
    formData.append('category', 'payments');
    formData.append('screenshot', screenshotFile);
    formData.append('paymentScreenshot', screenshotFile);

    const res = await recordDonation(formData);
    setLoading(false);

    if (res.success) {
      setSubmittedDonation({
        donorName: donorName || currentUser?.name || 'Generous Contributor',
        donorEmail: donorEmail || currentUser?.email || 'donor@byk.org',
        amount: Number(amount),
        campaignId: finalCampaignId,
        campaignTitle,
        transactionId: transactionId.trim(),
        date: new Date()
      });

      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setError(res.message || 'Error occurred while submitting donation. Please check your network and session.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <FiShield className="w-3.5 h-3.5 text-emerald-700" />
            <span>Section 80G Certified Non-Profit • 50% Income Tax Exemption</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Support Our Mission &amp; Receive Verified 80G Tax Receipt
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-2">
            Every contribution directly funds child literacy, youth skill development, and emergency medical relief with 100% statutory transparency.
          </p>
        </div>

        {/* ---------------- 1. SUBMITTED CONFIRMATION SCREEN (UNDER REVIEW) ---------------- */}
        {submittedDonation ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-600 shadow-xl max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-600/25">
                <FiClock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 inline-block">
                  Application Under Review
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-black">
                  Payment Submitted for Trustee Verification!
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Thank you, <strong>{submittedDonation.donorName}</strong>. Your payment proof for contribution of <strong>₹{Number(submittedDonation.amount).toLocaleString('en-IN')}</strong> has been submitted to the Trustee Verification Desk.
                </p>
              </div>
            </div>

            {/* Submission Summary Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block font-medium">Bank UTR / Transaction ID:</span>
                  <strong className="font-mono text-emerald-700 font-black text-sm">{submittedDonation.transactionId}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Cause Earmarked:</span>
                  <strong className="text-black">{submittedDonation.campaignTitle}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Attached Crowdfunding Campaign ID:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <strong className="font-mono text-slate-800 text-xs bg-slate-200 px-2.5 py-1 rounded-lg inline-block select-all">
                      {submittedDonation.campaignId && submittedDonation.campaignId !== 'general' ? `#${submittedDonation.campaignId}` : 'General NGO Fund (Unrestricted)'}
                    </strong>
                    {submittedDonation.campaignId && submittedDonation.campaignId !== 'general' && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Attached
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Registered Contributor Email:</span>
                  <strong className="text-black">{submittedDonation.donorEmail}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Submission Timestamp:</span>
                  <span className="text-slate-700">{new Date(submittedDonation.date).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Crowdfunding Real-Time Auto-Credit Notice */}
            {submittedDonation.campaignId && submittedDonation.campaignId !== 'general' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FiTarget className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-emerald-950 text-xs">
                    Crowdfunding Database Auto-Update Guarantee
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Once the Trustee Verification Desk validates your transfer and mints your 80G tax receipt, this donation of <strong>₹{Number(submittedDonation.amount).toLocaleString('en-IN')}</strong> will automatically be credited to Crowdfunding Campaign <strong className="font-mono text-emerald-800">#{submittedDonation.campaignId}</strong>, incrementing its raised amount and donor tally live in the database.
                  </p>
                </div>
              </div>
            )}

            {/* Statutory Process Explanation */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 space-y-2">
              <div className="font-black flex items-center gap-1.5 text-emerald-950">
                <FiClock className="w-4 h-4 text-emerald-700" />
                <span>Statutory 80G Receipt Issuance Workflow:</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                In compliance with Central Board of Direct Taxes (CBDT) and Form 10BD norms, no official 80G tax receipt is issued automatically.
                Our administrative accounting committee verifies your payment screenshot and UTR number against bank ledgers.
              </p>
              <div className="pt-1 space-y-1 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span><strong>Audit Reconciliation:</strong> Your payment UTR is cross-verified with bank account statements.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span><strong>Email Dispatch:</strong> Upon approval, your digitally stamped 80G Tax Receipt is automatically emailed to <strong>{submittedDonation.donorEmail}</strong>.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span><strong>Profile Download:</strong> You can download or print your official receipt anytime from your <strong>Profile Receipts Tab</strong>.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/profile/donations"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 text-center transition flex items-center justify-center gap-2"
              >
                <FiFileText className="w-4 h-4" />
                <span>View Receipts in My Profile →</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmittedDonation(null);
                  setTransactionId('');
                  setScreenshotFile(null);
                  setPreviewUrl('');
                  setScreenshotFileName('');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-black font-bold text-xs text-center transition"
              >
                Make Another Contribution
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- 2. DONATION FORM & BANK / QR SIDE-BY-SIDE ---------------- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Donation Container (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* UNAUTHENTICATED STATE: LEAST ACTION AUTH GATE */}
              {!currentUser ? (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-md space-y-6">
                  
                  <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0">
                      <FiLock className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-black">
                        Donor Authentication Required (80G Tax Compliance)
                      </h2>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        To prevent financial fraud and automatically link your official <strong>Section 80G tax deduction receipts</strong> to your profile, please authenticate before contributing.
                      </p>
                    </div>
                  </div>

                  {/* Instant Inline Sign In Form (Least Action - No Page Nav Required!) */}
                  <form onSubmit={handleQuickLogin} className="space-y-3.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs">
                    <span className="font-bold text-black text-xs block mb-1">
                      Quick Sign In to Continue Donation
                    </span>

                    {quickLoginError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                        {quickLoginError}
                      </div>
                    )}

                    <div>
                      <label className="font-bold text-black block mb-1">Email or Mobile Number</label>
                      <input
                        type="text"
                        required
                        placeholder="name@domain.com or 98XXXXXXXX"
                        value={quickIdentifier}
                        onChange={(e) => setQuickIdentifier(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium text-black"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-black block mb-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={quickPassword}
                        onChange={(e) => setQuickPassword(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium text-black"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quickLoginLoading}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiLogIn className="w-3.5 h-3.5" />
                      <span>{quickLoginLoading ? 'Verifying...' : 'Sign In & Unlock Donation'}</span>
                    </button>
                  </form>

                  {/* Or Create New Account */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <span className="text-slate-600">First-time donor?</span>
                    <Link
                      href="/register?redirect=/donation"
                      className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      <FiUserPlus className="w-3.5 h-3.5" />
                      <span>Create User Account (Instant 80G Access) →</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* AUTHENTICATED STATE: SEAMLESS DONATION FORM WITH PAYMENT SCREENSHOT & UTR */
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  
                  {/* Authenticated Contributor Trust Banner */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FiCheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-black">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-emerald-800">
                          {currentUser.email} • Authenticated 80G Contributor
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      Active Session
                    </span>
                  </div>

                  {error && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <FiAlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <h2 className="text-lg font-extrabold text-black flex items-center gap-2">
                    <FiHeart className="text-emerald-700" />
                    <span>Submit Donation Details &amp; Payment Proof</span>
                  </h2>

                  <form onSubmit={handleDonate} className="space-y-4 text-xs">
                    {/* Attached Crowdfunding Campaign Card & Details */}
                    {currentCampaign ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white border-2 border-emerald-500/50 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                            <FiTarget className="w-3.5 h-3.5" />
                            <span>Crowdfunding Campaign Attached</span>
                          </div>

                          {/* Attached Campaign ID Badge with One-Click Copy */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-mono shadow-xs">
                            <FiHash className="w-3 h-3 text-emerald-400" />
                            <span className="text-slate-400 font-sans font-medium text-[10px]">ID:</span>
                            <span className="font-bold text-emerald-300 select-all">
                              {currentCampaign._id || currentCampaign.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCampaignId(currentCampaign._id || currentCampaign.id)}
                              className="ml-1 text-slate-300 hover:text-white transition cursor-pointer p-0.5 rounded"
                              title="Copy Campaign ID"
                            >
                              {copiedId ? (
                                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <FiCopy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                            {currentCampaign.category || 'Youth & Education Drive'}
                          </div>
                          <h3 className="text-sm sm:text-base font-black text-black mt-0.5">
                            {currentCampaign.title}
                          </h3>
                          {currentCampaign.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                              {currentCampaign.description}
                            </p>
                          )}
                        </div>

                        {/* Live Crowdfunding Target & Progress */}
                        <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-emerald-200 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-black">
                              ₹{Number(currentCampaign.raisedAmount || 0).toLocaleString('en-IN')}{' '}
                              <span className="text-slate-500 font-normal text-[11px]">
                                raised of ₹{Number(currentCampaign.goalAmount || 0).toLocaleString('en-IN')} goal
                              </span>
                            </span>
                            <span className="text-emerald-700 font-black">
                              {Math.min(100, Math.round(((Number(currentCampaign.raisedAmount || 0)) / (Number(currentCampaign.goalAmount) || 1)) * 100))}%
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.round(((Number(currentCampaign.raisedAmount || 0)) / (Number(currentCampaign.goalAmount) || 1)) * 100))}%`
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                              Trustee Verified Drive
                            </span>
                            <span className="font-bold text-slate-800">
                              {currentCampaign.donorCount || 0} generous supporters
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-950 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <FiShield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>
                            Upon Trustee approval of this donation, this campaign's database total will be credited with your <strong>₹{Number(amount || 0).toLocaleString('en-IN')}</strong> contribution.
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* General Fund Status Banner */
                      <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <FiShield className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="text-slate-700">
                            Selected Fund: <strong>General NGO Social Welfare Fund</strong> (Unrestricted pool)
                          </span>
                        </div>
                        <span className="text-[10px] bg-white border border-slate-300 font-mono text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                          ID: GENERAL
                        </span>
                      </div>
                    )}

                    {/* Cause Picker Dropdown */}
                    <div>
                      <label className="font-bold text-black block mb-1">
                        Select Cause / Crowdfunding Campaign
                      </label>
                      <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                      >
                        <option value="general">🌐 General NGO Social Welfare Fund (Unrestricted)</option>
                        {campaigns.map((c) => (
                          <option key={c._id || c.id} value={c._id || c.id}>
                            🎯 [ID: #{(c._id || c.id).slice(-6)}] {c.title}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Select an urgent crowdfunding drive or leave as general welfare fund. The Campaign ID is attached automatically.
                      </span>
                    </div>

                    {/* Amount Picker */}
                    <div>
                      <label className="font-bold text-black block mb-1">Donation Amount (INR)</label>
                      <div className="grid grid-cols-5 gap-2 mb-2">
                        {quickAmounts.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                              amount === amt 
                                ? 'bg-emerald-700 text-white shadow-xs' 
                                : 'bg-slate-100 text-black hover:bg-slate-200'
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 text-sm font-bold text-black bg-white"
                      />
                    </div>

                    {/* Donor Name & Mobile (Pre-filled for Least Action) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-black block mb-1">Donor Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-black block mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                        />
                      </div>
                    </div>

                    {/* PAN & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-black block mb-1">
                          PAN Card Number (Required for 80G Tax Exemption)
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="ABCDE1234F"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 uppercase font-mono font-bold text-black bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-black block mb-1">Registered Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="donor@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 font-medium text-black bg-white"
                        />
                      </div>
                    </div>

                    {/* Step 2: Bank UTR & Screenshot Upload */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3.5">
                      <span className="font-bold text-black text-xs block">
                        Payment Proof &amp; Verification Details
                      </span>

                      <div>
                        <label className="block font-bold text-black mb-1">
                          UPI Transaction ID / Bank UTR Reference Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 429188291039 or UPI/429188..."
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 font-mono text-xs bg-white text-black font-bold"
                        />
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Found on GooglePay, PhonePe, Paytm, or your bank debit confirmation screen.
                        </span>
                      </div>

                      {/* Payment Screenshot Upload */}
                      <div>
                        <label className="block font-bold text-black mb-1">
                          Upload Payment Transfer Screenshot (PNG / JPG) *
                        </label>
                        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-4 text-center transition bg-white">
                          <input
                            type="file"
                            accept="image/*"
                            id="donationScreenshotInput"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          {!previewUrl ? (
                            <label htmlFor="donationScreenshotInput" className="cursor-pointer space-y-1 block">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl">
                                <FiUploadCloud />
                              </div>
                              <span className="text-xs font-bold text-emerald-700 hover:underline block">
                                Click to select payment screenshot
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                PNG, JPG or JPEG up to 15MB
                              </span>
                            </label>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={previewUrl}
                                  alt="Payment Screenshot Preview"
                                  className="w-24 h-24 object-cover rounded-lg border border-slate-300 shadow-sm"
                                />
                                <div className="text-left flex-1 space-y-1">
                                  <div className="text-xs font-bold text-black">
                                    {screenshotFileName || 'Payment Transfer Screenshot'}
                                  </div>
                                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                                    <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Ready for submission</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleRemoveScreenshot}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                                  >
                                    <FiTrash2 className="w-3.5 h-3.5" />
                                    <span>Remove Screenshot</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>Submitting for verification...</span>
                      ) : (
                        <>
                          <FiHeart className="w-4 h-4 fill-white" />
                          <span>Submit ₹{amount} Contribution for Trustee Verification</span>
                        </>
                      )}
                    </button>

                    <div className="text-center text-[11px] text-slate-500 pt-1">
                      Receipt will be issued following bank reconciliation &amp; sent directly to <strong>{donorEmail || 'your email'}</strong>.
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Direct Bank & UPI Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white text-black p-6 rounded-3xl border-2 border-slate-200 shadow-xl text-center">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Step 1: Scan &amp; Pay via UPI
                </span>
                <h3 className="text-base font-extrabold text-black mt-1">
                  Indian Youth Foundation Official QR
                </h3>

                <div className="my-4 p-2.5 bg-white rounded-2xl inline-block shadow-md border border-slate-200">
                  <img
                    src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bharatiyauva@okhdfcbank'}
                    alt="UPI QR Code"
                    className="w-44 h-44 rounded-xl"
                  />
                </div>

                <div>
                  <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 inline-block">
                    {settings?.upiId || 'bharatiyauva@okhdfcbank'}
                  </div>
                </div>

                {/* Earmarked Allocation Badge */}
                <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Earmarked Allocation:</span>
                    <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold shrink-0">
                      {currentCampaign ? `#${(currentCampaign._id || currentCampaign.id).slice(-6)}` : 'GENERAL'}
                    </span>
                  </div>
                  <div className="font-bold text-black truncate">
                    {currentCampaign ? currentCampaign.title : 'General NGO Social Welfare Fund'}
                  </div>
                  {currentCampaign && (
                    <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                      <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Campaign ID #{currentCampaign._id || currentCampaign.id} attached</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
                  After payment, enter your Transaction UTR and upload screenshot on the left to submit for verification.
                </p>
              </div>

              {/* Official Bank Account Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-extrabold text-black text-sm">Official Society Bank Account</h4>
                <div className="text-slate-700">Account Name: <strong className="text-black">{settings?.bankDetails?.accountName || 'INDIAN YOUTH FOUNDATION SANSTHA'}</strong></div>
                <div className="text-slate-700">Account Number: <strong className="text-black font-mono font-bold">{settings?.bankDetails?.accountNumber || '50200088991234'}</strong></div>
                <div className="text-slate-700">IFSC Code: <strong className="text-black font-mono font-bold">{settings?.bankDetails?.ifscCode || 'HDFC0001234'}</strong></div>
                <div className="text-slate-700">Bank: <strong className="text-black">{settings?.bankDetails?.bankName || 'HDFC Bank Ltd.'} ({settings?.bankDetails?.branch || 'Aligarh Main Branch'})</strong></div>
              </div>
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
