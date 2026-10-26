'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiCreditCard,
  FiUploadCloud,
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrash2,
  FiUser,
  FiCamera,
  FiImage
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans } from '@/store/planSlice';
import { submitMembershipApplication, clearAppStatus } from '@/store/applicationSlice';
import { useNGO } from '@/context/NGOContext';

export default function ApplyMembershipPage() {
  const dispatch = useDispatch();
  const { plans } = useSelector((state) => state.plans);
  const { loading: submitting, error: reduxError } = useSelector((state) => state.applications);
  const { currentUser, settings } = useNGO();

  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / PhonePe / GPay');

  // Guest applicant fields (active when user is not signed in)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestBloodGroup, setGuestBloodGroup] = useState('O+');
  const [guestDistrict, setGuestDistrict] = useState('Aligarh');
  const [guestState, setGuestState] = useState('Uttar Pradesh');

  // Applicant Photo State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Payment Screenshot upload state
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
  const isFormValid = !!selectedPlan && (!!transactionId.trim() || !!selectedRawFile);

  // File Handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFormError('Applicant photo size must be under 10MB.');
      return;
    }
    setFormError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoPreview('');
    setPhotoFile(null);
    const input = document.getElementById('userPhotoInput');
    if (input) input.value = '';
  };

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

    if (!currentUser && (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim())) {
      setFormError('Please enter your Full Legal Name, Email Address, and 10-digit Mobile Number.');
      return;
    }

    if (!photoFile && !currentUser?.photoUrl) {
      setFormError('Please upload your User Image / Passport Photo for ID card generation.');
      return;
    }

    if (!transactionId && !selectedRawFile) {
      setFormError('Please provide your Transaction UTR or select a payment screenshot');
      return;
    }

    setFormError('');

    try {
      const formData = new FormData();
      formData.append('name', currentUser ? currentUser.name : guestName.trim());
      formData.append('email', currentUser ? currentUser.email : guestEmail.trim());
      formData.append('phone', currentUser ? currentUser.phone : guestPhone.trim());
      formData.append('bloodGroup', currentUser?.bloodGroup || guestBloodGroup);
      formData.append('district', currentUser?.district || guestDistrict);
      formData.append('state', currentUser?.state || guestState);
      formData.append('planId', selectedPlan._id);
      formData.append('planName', selectedPlan.name || selectedPlan.title || 'Membership Plan');
      formData.append('feeAmount', selectedPlan.fee || selectedPlan.price || 250);
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      formData.append('utrNumber', transactionId);
      formData.append('category', 'applications');

      // Append Profile Photo
      if (photoFile) formData.append('photo', photoFile);

      if (selectedRawFile) {
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
          Select membership tier and submit verification details for instant Trustee review.
        </p>
      </div>

      {formSubmitted ? (
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 text-slate-900 space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
            <FiCheckCircle className="w-12 h-12" />
          </div>

          <div className="text-center space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              Application Submitted Successfully
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              सदस्यता आवेदन सफलतापूर्वक प्राप्त हुआ!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
              आपकी सदस्यता का विवरण, पहचान दस्तावेज व भुगतान रसीद सत्यापन हेतु ट्रस्टी वेरिफिकेशन डेस्क को सफलतापूर्वक भेज दी गई है।
            </p>
          </div>

          {/* Submission Details Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-bold">Applicant Name:</span>
              <span className="font-extrabold text-slate-900">{currentUser?.name || guestName}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-bold">Membership Plan:</span>
              <span className="font-extrabold text-slate-900">{selectedPlan?.name || selectedPlan?.title} (₹{selectedPlan?.fee || selectedPlan?.price || 250})</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-slate-500 font-bold">UTR / Payment Reference:</span>
              <code className="font-black text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-300">
                {transactionId || 'Payment Screenshot Attached'}
              </code>
            </div>
          </div>

          {/* Verification Protocol Notice */}
          <div className="bg-emerald-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-300 text-xs text-emerald-950 space-y-2 leading-relaxed">
            <p className="font-black text-sm text-emerald-900 flex items-center gap-2">
              <span className="text-base">📧</span> एडमिन अप्रूवल के बाद क्या होगा?
            </p>
            <p className="text-emerald-900">
              <strong>1. लॉगिन क्रेडेंशियल्स:</strong> ट्रस्टी व एडमिन द्वारा बैंक लेजर व यूटीआर वेरिफिकेशन के बाद आपके रजिस्टर्ड ईमेल (<strong className="text-black">{currentUser?.email || guestEmail}</strong>) पर आपका <strong>Portal User ID व Password</strong> स्वचालित रूप से भेज दिया जाएगा।
            </p>
            <p className="text-emerald-900">
              <strong>2. नियुक्ति पत्र व आईडी कार्ड:</strong> आधिकारिक <strong>Appointment Letter</strong> और डिजिटल क्यूआर युक्त <strong>Dual-Sided Official ID Card</strong> पीडीएफ प्रारूप में ईमेल के साथ अटैच होकर तुरंत प्राप्त होंगे।
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#0b8026] text-white font-extrabold text-xs hover:bg-[#075018] transition shadow-md hover:shadow-lg"
            >
              Back to Home
            </Link>
            <Link
              href="/login?role=member"
              className="px-6 py-3 rounded-xl bg-white text-slate-800 border border-slate-300 font-extrabold text-xs hover:bg-slate-100 transition shadow-2xs"
            >
              Go to Member Sign In
            </Link>
            <button
              type="button"
              onClick={() => {
                setFormSubmitted(false);
                setTransactionId('');
                setSelectedRawFile(null);
                setPreviewUrl('');
                setFileName('');
                setPhotoFile(null);
                setPhotoPreview('');
                setFormError('');
              }}
              className="px-6 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 font-extrabold text-xs hover:bg-red-100 transition cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Global Alert Notification */}
          {(formError || reduxError) && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-1">
              <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-black text-sm text-rose-950">आवेदन सबमिट नहीं हो सका (Submission Failed)</p>
                <p className="mt-0.5 text-xs text-rose-800 font-medium">{formError || reduxError}</p>
              </div>
            </div>
          )}

          {/* Guest Applicant Details Section */}
          {!currentUser && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-red-700">
                  This Email ID is used for all official communication
                </span>
                <Link href="/login?role=member&redirect=/apply-member" className="text-xs font-bold text-blue-600 hover:underline">
                  Already have an account? Sign in
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-black mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Name as per Aadhaar"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Credentials will be sent here"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-black mb-1">Blood Group</label>
                  <select
                    value={guestBloodGroup}
                    onChange={(e) => setGuestBloodGroup(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">District / City</label>
                  <input
                    type="text"
                    value={guestDistrict}
                    onChange={(e) => setGuestDistrict(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black mb-1">State</label>
                  <input
                    type="text"
                    value={guestState}
                    onChange={(e) => setGuestState(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: APPLICANT PHOTO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-[#0b8026] text-white flex items-center justify-center text-[11px] font-bold">1</span>
              <span>Applicant Photograph &amp; Verification</span>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
              
              {/* User Photo Upload */}
              <div>
                <label className="text-xs font-bold text-black mb-2 flex items-center gap-1.5">
                  <FiCamera className="text-[#0b8026] w-4 h-4" />
                  <span>Applicant Passport Size Photo / Profile Picture *</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Photo Preview Circle */}
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#0b8026] p-1 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Applicant Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="userPhotoInput"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <label
                        htmlFor="userPhotoInput"
                        className="px-4 py-2 rounded-xl bg-[#0b8026] hover:bg-[#075018] text-white font-bold text-xs cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                      >
                        <FiUploadCloud className="w-4 h-4" />
                        <span>{photoFile ? 'Change Photo' : 'Upload User Image'}</span>
                      </label>
                      {photoFile && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-xs transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Clear frontal passport photograph (JPG, PNG, WEBP up to 10MB). Used for printing on your official dual-sided ID card.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: SELECT MEMBERSHIP TIER */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">2</span>
              <span>Select Your Membership Tier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isSelected = effectivePlanId === plan._id;
                return (
                  <div
                    key={plan._id}
                    onClick={() => setSelectedPlanId(plan._id)}
                    className={`cursor-pointer rounded-3xl p-5 border transition flex flex-col justify-between ${isSelected
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
                      <div className={`w-full py-2 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1 ${isSelected ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-black hover:bg-slate-200'
                        }`}>
                        {isSelected ? (
                          <>
                            <FiCheck className="w-3.5 h-3.5" />
                            <span>Selected Plan</span>
                          </>
                        ) : (
                          'Select This Plan'
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT DETAILS (UPI QR & BANK TRANSFER) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">3</span>
              <span>Transfer Membership Contribution (₹{Number(selectedPlan?.fee || selectedPlan?.price || 250).toLocaleString('en-IN')})</span>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* UPI QR Display */}
              <div className="text-center md:border-r md:border-slate-100 md:pr-8">
                <div className="inline-block p-4 bg-white rounded-2xl border-2 border-red-500 shadow-sm mb-3">
                  <img
                    src={settings?.upiQrImage || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=bharatiyauva@okhdfcbank%26pn=Yuva%20Kranti%20Dal%26cu=INR'}
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
                    {settings?.bankDetails?.accountName || 'YUVA KRANTI DAL SANSTHA'}
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

          {/* STEP 4: SUBMIT PAYMENT PROOF & FINALIZE APPLICATION */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">4</span>
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
                        <img
                          src={previewUrl}
                          alt="Payment Screenshot Preview"
                          className="w-full max-h-56 object-contain rounded-lg mx-auto"
                        />
                        <div className="mt-2 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5">
                          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Screenshot attached and ready to submit</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-black font-semibold">
                  Selected: <strong className="text-red-700 font-bold">{selectedPlan?.name || selectedPlan?.title}</strong> (₹{selectedPlan?.fee || selectedPlan?.price || 250})
                </span>

                <button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting
                    ? 'Submitting Application...'
                    : (!isFormValid
                      ? 'Enter UTR or Attach Screenshot to Submit'
                      : 'Submit Application for Trustee Verification')}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
