'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiCreditCard, 
  FiUploadCloud, 
  FiCheck, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiTrash2
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/store/planSlice';
import { submitMembershipApplication, clearAppStatus } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';

export default function ApplyMembershipPage() {
  const dispatch = useDispatch();
  const { plans } = useSelector((state) => state.plans);
  const { loading: submitting } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / PhonePe / GPay');
  const [notes, setNotes] = useState('');
  
  // Single-API upload state: raw file stored locally until form submission
  const [selectedRawFile, setSelectedRawFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const effectivePlanId = selectedPlanId || plans[0]?._id;
  const selectedPlan = plans.find(p => p._id === effectivePlanId) || plans[0];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setFormError('Screenshot file size must be under 15MB.');
      return;
    }

    setFormError('');
    setSelectedRawFile(file);
    setFileName(file.name);

    // Immediate local preview without separate premature upload network request
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  };

  const handleRemoveScreenshot = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedRawFile(null);
    setFileName('');
    setFormError('');
    const input = document.getElementById('screenshotInput');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      setFormError('Please select a membership plan');
      return;
    }
    if (!transactionId && !selectedRawFile) {
      setFormError('Please provide your Transaction UTR or select a payment screenshot');
      return;
    }

    setFormError('');

    try {
      // Single-API call: package all application data + payment screenshot into one FormData payload
      const formData = new FormData();
      formData.append('planId', selectedPlan._id);
      formData.append('planName', selectedPlan.name || selectedPlan.title || 'Membership Plan');
      formData.append('feeAmount', selectedPlan.fee || selectedPlan.price || 250);
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      formData.append('utrNumber', transactionId);
      formData.append('notes', notes);
      formData.append('category', 'payments');
      if (selectedRawFile) {
        formData.append('file', selectedRawFile);
        formData.append('paymentScreenshot', selectedRawFile);
      }

      await dispatch(submitMembershipApplication(formData)).unwrap();

      setFormSubmitted(true);
      setTimeout(() => dispatch(clearAppStatus()), 6000);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : (err?.message || 'Failed to submit application'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-black text-black flex items-center gap-2">
          <FiCreditCard className="text-red-600 w-5 h-5" />
          <span>Apply for Verified Trust Membership</span>
        </h2>
        <p className="text-xs text-black mt-1 font-medium">
          Select your custom membership plan, contribute via Trust UPI QR, and submit payment proof for Trustee verification in a single step.
        </p>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          {formError}
        </div>
      )}

      {/* Success Banner */}
      {formSubmitted && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 text-black space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 font-black text-base text-red-800">
            <FiCheckCircle className="w-5 h-5 text-red-600" />
            <span>Membership Application Successfully Submitted!</span>
          </div>
          <p className="text-xs text-black leading-relaxed font-medium">
            Thank you, <strong className="text-black">{currentUser?.name}</strong>. Your payment proof (UTR: <code className="font-bold text-red-700">{transactionId || 'Attached Screenshot'}</code>) has been submitted to the Trustee Verification Desk.
            Following bank ledger reconciliation, your official <strong>Letter of Appointment</strong> and <strong>Dual-Sided ID Card</strong> will unlock automatically and be emailed to <code className="font-bold text-black">{currentUser?.email}</code>.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-md"
            >
              Back to Profile Overview
            </Link>
            <Link
              href="/profile/id-card"
              className="px-4 py-2 rounded-xl bg-white text-black border border-slate-300 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition"
            >
              Check ID Card Status
            </Link>
          </div>
        </div>
      )}

      {/* Fraud Prevention Statutory Notice */}
      <div className="bg-red-50/50 border border-red-200 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-black">
        <FiAlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-black text-black">Statutory Notice &amp; Anti-Fraud Advisory</strong>
          <p className="text-black leading-relaxed font-medium">
            Indian Youth Foundation is a government-registered charitable trust (Section 12A &amp; 80G Certified).
            To prevent fraud, all contributions are validated against bank account statements before credentials are generated.
            Forged or counterfeit payment screenshots will lead to immediate permanent account debarment and statutory reporting.
          </p>
        </div>
      </div>

      {/* Step 1: Select Plan */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
          <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
          <span>Select Your Membership Tier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isSelected = effectivePlanId === plan._id;
            return (
              <div
                key={plan._id}
                onClick={() => setSelectedPlanId(plan._id)}
                className={`cursor-pointer rounded-3xl p-5 border transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-500/20 bg-red-50/30 shadow-md'
                    : 'border-slate-200 bg-white hover:border-red-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                      {plan.duration || 'Annual'}
                    </span>
                    {plan.popular && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-black text-base mt-1">{plan.name || plan.title}</h4>
                  <div className="my-3">
                    <span className="text-2xl font-black text-black">₹{Number(plan.fee || plan.price || 0).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-black font-semibold"> / {plan.duration}</span>
                  </div>
                  <p className="text-xs text-black font-medium mb-4">{plan.description}</p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    {(Array.isArray(plan.perks) ? plan.perks : []).map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-black font-medium">
                        <FiCheck className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className={`w-full py-2 rounded-xl text-center text-xs font-bold transition ${
                    isSelected ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-black hover:bg-slate-200'
                  }`}>
                    {isSelected ? '✓ Selected Plan' : 'Select This Plan'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Payment Details (UPI QR & Bank Transfer) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
          <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
          <span>Transfer Membership Contribution (₹{Number(selectedPlan?.fee || selectedPlan?.price || 250).toLocaleString('en-IN')})</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* UPI QR Display */}
          <div className="text-center md:border-r md:border-slate-100 md:pr-8">
            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-red-500 shadow-sm mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Indian%20Youth%20Foundation%26cu=INR'}
                alt="Trust Official UPI QR"
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-black uppercase tracking-wider block">Scan via Any UPI App</span>
              <p className="font-mono font-black text-black text-xs bg-slate-100 py-1.5 px-3 rounded-xl inline-block border border-slate-200">
                {settings?.upiId || 'bharatiyauva@okhdfcbank'}
              </p>
              <p className="text-[11px] text-black font-medium">Paytm • PhonePe • GooglePay • BHIM UPI</p>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-black text-sm pb-2 border-b border-slate-100">
              Official Trust Bank Account Details
            </h4>
            <div>
              <span className="text-black font-semibold block">Account Name</span>
              <strong className="text-black text-sm font-black">
                {settings?.bankDetails?.accountName || 'INDIAN YOUTH FOUNDATION SANSTHA'}
              </strong>
            </div>
            <div>
              <span className="text-black font-semibold block">Bank Name</span>
              <strong className="text-black">{settings?.bankDetails?.bankName || 'HDFC Bank Ltd.'}</strong>
            </div>
            <div>
              <span className="text-black font-semibold block">Account Number</span>
              <strong className="font-mono text-black text-sm">
                {settings?.bankDetails?.accountNumber || '50200088991234'}
              </strong>
            </div>
            <div>
              <span className="text-black font-semibold block">IFSC Code</span>
              <strong className="font-mono text-black">
                {settings?.bankDetails?.ifscCode || 'HDFC0001234'}
              </strong>
            </div>
            <div>
              <span className="text-black font-semibold block">Head Office Location</span>
              <span className="text-black font-medium">Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Single API Upload Screenshot & Enter UTR Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
          <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
          <span>Submit Payment Proof for Verification</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                UPI Transaction ID / Bank UTR Number *
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 429188291039 or UPI/429188..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-black bg-white"
              />
              <span className="text-[10px] text-black font-medium mt-1 block">
                Found on your GooglePay/PhonePe/Bank debit confirmation screen.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white"
              >
                <option value="UPI / PhonePe / GPay">UPI / PhonePe / GPay</option>
                <option value="Paytm Wallet / UPI">Paytm Wallet / UPI</option>
                <option value="IMPS / NEFT Bank Transfer">IMPS / NEFT Bank Transfer</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          {/* Screenshot Selection with Local Preview & Remove Option (Single-API) */}
          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Upload Payment Transfer Screenshot (PNG / JPG) *
            </label>

            {!selectedRawFile ? (
              <div className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center transition bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  id="screenshotInput"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="screenshotInput" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl shadow-xs">
                    <FiUploadCloud className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-red-600 hover:underline block">
                      Click to select payment screenshot image
                    </span>
                    <span className="text-xs text-black font-medium block mt-1">
                      PNG, JPG or JPEG up to 15MB • Uploaded with application in a single API call
                    </span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black">Selected Screenshot:</span>
                    <span className="text-xs font-mono text-red-700 font-bold">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Change Screenshot</span>
                  </button>
                </div>

                {previewUrl && (
                  <div className="relative max-w-sm mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Payment Screenshot Preview"
                      className="w-full max-h-56 object-contain rounded-lg mx-auto"
                    />
                    <div className="mt-2 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg">
                      ✓ Screenshot attached and ready to submit
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Special Notes / Address Confirmation</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Enrolled for Aligarh youth welfare chapter..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-black font-semibold">
              Selected: <strong className="text-red-700 font-bold">{selectedPlan?.name || selectedPlan?.title}</strong> (₹{selectedPlan?.fee || selectedPlan?.price || 250})
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application for Trustee Verification'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
