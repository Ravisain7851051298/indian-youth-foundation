'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiSettings, 
  FiSave, 
  FiCheckCircle, 
  FiImage, 
  FiShield, 
  FiPhone, 
  FiMapPin, 
  FiCreditCard, 
  FiGlobe,
  FiArrowLeft,
  FiUploadCloud,
  FiFileText,
  FiCompass,
  FiDollarSign,
  FiCheck
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function SettingsPage() {
  const { settings, updateSettings, currentUser, uploadFile } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [activeTab, setActiveTab] = useState('branding');
  const [uploadingField, setUploadingField] = useState(null);

  const [form, setForm] = useState({
    ngoNameHi: settings?.ngoNameHi || 'भारतीय युवा क्रांति',
    ngoName: settings?.ngoName || 'Indian Youth Foundation',
    taglineHi: settings?.taglineHi || 'Dedicated to Youth Empowerment & Nation Building',
    tagline: settings?.tagline || 'Empowering Youth, Transforming Society, Nation First',
    logoUrl: settings?.logoUrl || '',
    officialSealUrl: settings?.officialSealUrl || '',
    presidentSignatureUrl: settings?.presidentSignatureUrl || '',
    registrationNo: settings?.registrationNo || 'REG/2021/NGO/DEL/8741',
    panNo: settings?.panNo || 'AAATB4321Q',
    nitiAayogDarpanId: settings?.nitiAayogDarpanId || 'RJ/2022/0319482',
    csr1No: settings?.csr1No || 'CSR00049281',
    exemption12A: settings?.exemption12A || 'CIT(EXEMP)/12A/2021-22/A-492',
    exemption80G: settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881',
    phone: settings?.phone || '+91 93196 98759',
    whatsapp: settings?.whatsapp || '+919319698759',
    email: settings?.email || 'samasyasamadhanparishad@gmail.com',
    address: settings?.address || 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh',
    googleMapEmbed: settings?.googleMapEmbed || '',
    accountName: settings?.bankDetails?.accountName || 'INDIAN YOUTH FOUNDATION SANSTHA',
    accountNumber: settings?.bankDetails?.accountNumber || '50200088991234',
    ifscCode: settings?.bankDetails?.ifscCode || 'HDFC0001234',
    bankName: settings?.bankDetails?.bankName || 'HDFC Bank Ltd.',
    branch: settings?.bankDetails?.branch || 'Aligarh Main Branch, UP',
    upiId: settings?.upiId || 'bharatiyauva@okhdfcbank',
    upiQrImage: settings?.upiQrImage || '',
    membershipFee: settings?.membershipFee || 250,
    aboutHeading: settings?.aboutHeading || 'About Indian Youth Foundation (Bharatiya Yuva Kranti)',
    aboutSubtitle: settings?.aboutSubtitle || 'A Government-Recognized Youth Social Welfare Movement Dedicated to Nation Building',
    aboutStory: settings?.aboutStory || '',
    missionStatement: settings?.missionStatement || '',
    visionStatement: settings?.visionStatement || '',
    footerDescription: settings?.footerDescription || '',
    footerCopyright: settings?.footerCopyright || '',
    smtpHost: settings?.smtpHost || 'smtp.gmail.com',
    smtpPort: settings?.smtpPort || 587,
    smtpUser: settings?.smtpUser || 'samasyasamadhanparishad@gmail.com',
    smtpPass: settings?.smtpPass || '',
    adminSecretKey: settings?.adminSecretKey || 'BYK_SUPER_ADMIN_ALIGARH_SECRET_2026'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Direct file upload to backend/uploads directory
  const handleFileUpload = async (fieldName, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const res = await uploadFile(file);
      if (res.success && res.url) {
        setForm(prev => ({ ...prev, [fieldName]: res.url }));
        alert(`File uploaded successfully to ${res.url}!`);
      } else {
        alert(res.message || 'File upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateSettings({
      ...form,
      bankDetails: {
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        bankName: form.bankName,
        branch: form.branch
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <div className="text-3xl mb-3">🛡️</div>
          <h2 className="text-xl font-black text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-600 mt-2">
            Only designated NGO Administrators have permission to modify brand identity, bank details, and statutory settings.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold transition hover:bg-orange-700"
          >
            Login as Administrator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiSettings className="w-3.5 h-3.5" />
              <span>Admin Master CMS Control</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Contact & NGO Master Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Complete dynamic CRUD: Logo, Official Seal, Signatures, Contact Info, Bank/UPI, About Us & Mission/Vision. All files saved to uploads directory.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition self-start sm:self-auto"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Settings saved successfully! Changes are immediately live across Navbar, Footer, Receipts, and ID Cards.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'branding' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            1. Logo, Seal & Signature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('statutory')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'statutory' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            2. Statutory 12A / 80G & PAN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contact' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            3. Contact & Head Office
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'bank' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            4. Bank Details & UPI QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'about' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            5. About Us & Mission/Vision
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('smtp')}
            className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'smtp' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            6. SMTP Email Server & Security
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8 text-xs">
          {/* TAB 1: BRANDING, LOGO, SEAL, SIGNATURE */}
          {activeTab === 'branding' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                <FiImage className="text-orange-600" />
                <span>1. Organization Branding, Official Stamp & Signatures</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NGO Full English Name *</label>
                  <input
                    type="text"
                    required
                    name="ngoName"
                    value={form.ngoName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NGO Name in Hindi *</label>
                  <input
                    type="text"
                    required
                    name="ngoNameHi"
                    value={form.ngoNameHi}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Tagline (English)</label>
                  <input
                    type="text"
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Membership / Registration Fee (₹)</label>
                  <input
                    type="number"
                    name="membershipFee"
                    value={form.membershipFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* 3 Verification Assets: Logo, Seal, Signature with File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                {/* 1. Official Logo */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block text-xs">Official Logo</label>
                    {form.logoUrl && (
                      <img src={form.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Logo URL or upload file below"
                    name="logoUrl"
                    value={form.logoUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] transition">
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingField === 'logoUrl' ? 'Uploading...' : 'Upload Logo to uploads/'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('logoUrl', e)}
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Official Seal / Stamp */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block text-xs">Official NGO Seal / Stamp</label>
                    {form.officialSealUrl && (
                      <img src={form.officialSealUrl} alt="Seal" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Seal URL or upload file below"
                    name="officialSealUrl"
                    value={form.officialSealUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition">
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingField === 'officialSealUrl' ? 'Uploading...' : 'Upload Seal to uploads/'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('officialSealUrl', e)}
                      />
                    </label>
                  </div>
                </div>

                {/* 3. President / Secretary Signature */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 block text-xs">President Signature</label>
                    {form.presidentSignatureUrl && (
                      <img src={form.presidentSignatureUrl} alt="Signature" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Signature URL or upload file below"
                    name="presidentSignatureUrl"
                    value={form.presidentSignatureUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition">
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingField === 'presidentSignatureUrl' ? 'Uploading...' : 'Upload Signature to uploads/'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('presidentSignatureUrl', e)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATUTORY COMPLIANCES */}
          {activeTab === 'statutory' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                <FiShield className="text-orange-600" />
                <span>2. Statutory Registrations & Tax Exemption Numbers</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registration / Trust Deed No.</label>
                  <input
                    type="text"
                    name="registrationNo"
                    value={form.registrationNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NITI Aayog Darpan ID</label>
                  <input
                    type="text"
                    name="nitiAayogDarpanId"
                    value={form.nitiAayogDarpanId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    name="panNo"
                    value={form.panNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section 12A Order Number</label>
                  <input
                    type="text"
                    name="exemption12A"
                    value={form.exemption12A}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Section 80G Approval Number</label>
                  <input
                    type="text"
                    name="exemption80G"
                    value={form.exemption80G}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-orange-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CSR-1 Registration Number</label>
                  <input
                    type="text"
                    name="csr1No"
                    value={form.csr1No}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & HEAD OFFICE */}
          {activeTab === 'contact' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                <FiPhone className="text-orange-600" />
                <span>3. Contact Numbers, Email & Head Office Location</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Helpline Phone Number *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Helpline *</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Head Office Full Address *</label>
                <textarea
                  rows={2}
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Google Maps Embed URL</label>
                <input
                  type="text"
                  name="googleMapEmbed"
                  value={form.googleMapEmbed}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: BANK & UPI DETAILS */}
          {activeTab === 'bank' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                <FiCreditCard className="text-orange-600" />
                <span>4. Bank Account Details & UPI Donation QR Code</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bank Account Holder Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={form.accountName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch Name</label>
                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official UPI VPA ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block mb-1">UPI QR Code Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="upiQrImage"
                      placeholder="QR code image URL"
                      value={form.upiQrImage}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs whitespace-nowrap">
                      <span>{uploadingField === 'upiQrImage' ? 'Uploading...' : 'Upload QR'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('upiQrImage', e)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DYNAMIC ABOUT US & MISSION/VISION */}
          {activeTab === 'about' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                <FiCompass className="text-orange-600" />
                <span>5. Dynamic About Us Story & Mission / Vision Statements</span>
              </h2>

              <div>
                <label className="font-bold text-slate-700 block mb-1">About Us Main Heading</label>
                <input
                  type="text"
                  name="aboutHeading"
                  value={form.aboutHeading}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">About Us Subtitle</label>
                <input
                  type="text"
                  name="aboutSubtitle"
                  value={form.aboutSubtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Comprehensive About Us Story</label>
                <textarea
                  rows={4}
                  name="aboutStory"
                  value={form.aboutStory}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Statutory Mission Statement</label>
                  <textarea
                    rows={3}
                    name="missionStatement"
                    value={form.missionStatement}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 leading-relaxed"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vision Statement</label>
                  <textarea
                    rows={3}
                    name="visionStatement"
                    value={form.visionStatement}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SMTP EMAIL CONFIGURATION & ADMIN SECRET KEY */}
          {activeTab === 'smtp' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FiShield className="text-orange-600" />
                  <span>6. Dynamic SMTP Email Server & Security Settings</span>
                </h2>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Statutory Automated Dispatch
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed text-xs">
                <strong>Zero-Fraud Email Architecture:</strong> When the Trustee Admin verifies a donation or approves a membership, the system automatically dispatches the official 80G Tax Exemption Receipt (with unique registration serial number) or formal Appointment Letter directly from the official Trust email address configured below.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMTP Host</label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={form.smtpHost}
                    onChange={handleChange}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Default: smtp.gmail.com</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMTP Port</label>
                  <input
                    type="number"
                    name="smtpPort"
                    value={form.smtpPort}
                    onChange={handleChange}
                    placeholder="587"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Standard TLS Port: 587 (or 465 for SSL)</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official SMTP Email Address (Username)</label>
                  <input
                    type="email"
                    name="smtpUser"
                    value={form.smtpUser}
                    onChange={handleChange}
                    placeholder="samasyasamadhanparishad@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMTP App Password (Gmail 16-character App Password)</label>
                  <input
                    type="password"
                    name="smtpPass"
                    value={form.smtpPass}
                    onChange={handleChange}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Generated from Google Account → Security → App Passwords</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="font-bold text-slate-700 block mb-1">Super Admin Secret Key (x-admin-secret-key)</label>
                <input
                  type="text"
                  name="adminSecretKey"
                  value={form.adminSecretKey}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono bg-slate-50 text-slate-800"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Mandatory secret header for privileged administrative operations. Matches X_ADMIN_SECRET_KEY in .env.
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              * Any modifications saved here take effect immediately across the public website and dynamic generators.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 transition cursor-pointer"
            >
              <FiSave className="w-4 h-4" />
              <span>Save & Publish All Master Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
