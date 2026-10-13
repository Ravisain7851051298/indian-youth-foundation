'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiCreditCard, 
  FiUploadCloud, 
  FiCheck, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiShield, 
  FiInfo,
  FiFileText
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/store/planSlice';
import { submitMembershipApplication, clearAppStatus } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ApplyMembershipPage() {
  const dispatch = useDispatch();
  const { plans, loading: plansLoading } = useSelector((state) => state.plans);
  const { loading: submitting, successMessage, error } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / PhonePe / GPay');
  const [notes, setNotes] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0]._id);
    }
  }, [plans, selectedPlanId]);

  const selectedPlan = plans.find(p => p._id === selectedPlanId) || plans[0];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setScreenshotUrl(res.data.url);
        setScreenshotFile(file.name);
      } else {
        alert(res.data.message || 'Upload failed');
      }
    } catch (err) {
      alert('Failed to upload screenshot. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      alert('Please select a membership plan');
      return;
    }
    if (!transactionId && !screenshotUrl) {
      alert('Please provide your Transaction UTR or upload a payment screenshot');
      return;
    }

    try {
      await dispatch(submitMembershipApplication({
        planId: selectedPlan._id,
        planName: selectedPlan.name,
        feeAmount: selectedPlan.fee,
        paymentMethod,
        transactionId,
        paymentScreenshot: screenshotUrl,
        notes
      })).unwrap();

      setFormSubmitted(true);
      setTimeout(() => dispatch(clearAppStatus()), 6000);
    } catch (err) {
      alert(err || 'Failed to submit application');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <FiCreditCard className="text-orange-600 w-5 h-5" />
          <span>Apply for Verified Trust Membership</span>
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Select your custom membership plan, contribute via Trust UPI QR, and submit payment proof for Trustee verification.
        </p>
      </div>

      {/* Success Banner */}
      {formSubmitted && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-emerald-900 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-black text-base text-emerald-800">
            <FiCheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Membership Application Successfully Submitted!</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Thank you, <strong>{currentUser?.name}</strong>. Your payment proof (UTR: <code>{transactionId || 'Uploaded Screenshot'}</code>) has been submitted to the Trustee Verification Desk.
            Following bank ledger reconciliation, your official <strong>Letter of Appointment</strong> and <strong>Dual-Sided ID Card</strong> will unlock automatically and be emailed to <code>{currentUser?.email}</code>.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
            >
              Back to Profile Overview
            </Link>
            <Link
              href="/profile/id-card"
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 border border-emerald-300 font-bold text-xs hover:bg-emerald-50 transition"
            >
              Check ID Card Status
            </Link>
          </div>
        </div>
      )}

      {/* Fraud Prevention Statutory Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 flex items-start gap-3.5 text-xs text-amber-900">
        <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-black text-amber-950">Statutory Notice &amp; Anti-Fraud Advisory</strong>
          <p className="text-slate-600 leading-relaxed">
            Indian Youth Foundation is a government-registered charitable trust (Section 12A &amp; 80G Certified).
            To prevent fraud, all contributions are validated against bank account statements before credentials are generated.
            Forged or counterfeit payment screenshots will lead to immediate permanent account debarment and statutory reporting.
          </p>
        </div>
      </div>

      {/* Step 1: Select Plan */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
          <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[11px]">1</span>
          <span>Select Your Membership Tier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan._id;
            return (
              <div
                key={plan._id}
                onClick={() => setSelectedPlanId(plan._id)}
                className={`cursor-pointer rounded-3xl p-5 border transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                      {plan.duration || 'Annual'}
                    </span>
                    {plan.popular && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-600 text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-slate-900 text-base mt-1">{plan.name}</h4>
                  <div className="my-3">
                    <span className="text-2xl font-black text-slate-900">₹{Number(plan.fee).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-500 font-medium"> / {plan.duration}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{plan.description}</p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    {(Array.isArray(plan.perks) ? plan.perks : []).map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <FiCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className={`w-full py-2 rounded-xl text-center text-xs font-bold transition ${
                    isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
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
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
          <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[11px]">2</span>
          <span>Transfer Membership Contribution (₹{Number(selectedPlan?.fee || 250).toLocaleString('en-IN')})</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* UPI QR Display */}
          <div className="text-center md:border-r md:border-slate-100 md:pr-8">
            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-orange-500 shadow-sm mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Indian%20Youth%20Foundation%26cu=INR'}
                alt="Trust Official UPI QR"
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Scan via Any UPI App</span>
              <p className="font-mono font-black text-slate-900 text-xs bg-slate-100 py-1.5 px-3 rounded-xl inline-block">
                {settings?.upiId || 'bharatiyauva@okhdfcbank'}
              </p>
              <p className="text-[11px] text-slate-500">Paytm • PhonePe • GooglePay • BHIM UPI</p>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100">
              Official Trust Bank Account Details
            </h4>
            <div>
              <span className="text-slate-400 block font-medium">Account Name</span>
              <strong className="text-slate-800 text-sm font-black">
                {settings?.bankDetails?.accountName || 'INDIAN YOUTH FOUNDATION SANSTHA'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Bank Name</span>
              <strong className="text-slate-800">{settings?.bankDetails?.bankName || 'HDFC Bank Ltd.'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Account Number</span>
              <strong className="font-mono text-slate-800 text-sm">
                {settings?.bankDetails?.accountNumber || '50200088991234'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">IFSC Code</span>
              <strong className="font-mono text-slate-800">
                {settings?.bankDetails?.ifscCode || 'HDFC0001234'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Head Office Location</span>
              <span className="text-slate-600">Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Upload Screenshot & Enter UTR Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
          <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[11px]">3</span>
          <span>Submit Payment Proof for Verification</span>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                UPI Transaction ID / Bank UTR Number *
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 429188291039 or UPI/429188..."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found on your GooglePay/PhonePe/Bank debit confirmation screen.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="UPI / PhonePe / GPay">UPI / PhonePe / GPay</option>
                <option value="Paytm Wallet / UPI">Paytm Wallet / UPI</option>
                <option value="IMPS / NEFT Bank Transfer">IMPS / NEFT Bank Transfer</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Upload Payment Transfer Screenshot (PNG / JPG) *
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-6 text-center transition bg-slate-50">
              <input
                type="file"
                accept="image/*"
                id="screenshotInput"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="screenshotInput" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-xl">
                  {uploadingImage ? '⏳' : <FiUploadCloud />}
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-600 hover:underline">
                    {uploadingImage ? 'Uploading screenshot...' : 'Click to select screenshot image'}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {screenshotFile ? `Selected: ${screenshotFile}` : 'PNG, JPG or JPEG up to 5MB'}
                  </span>
                </div>
              </label>

              {screenshotUrl && (
                <div className="mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl inline-block border border-emerald-200">
                  ✓ Payment screenshot uploaded and securely saved!
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Notes / Address Confirmation</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Enrolled for Aligarh youth welfare chapter..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Selected: <strong>{selectedPlan?.name}</strong> (₹{selectedPlan?.fee})
            </span>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-8 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application for Trustee Verification'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
