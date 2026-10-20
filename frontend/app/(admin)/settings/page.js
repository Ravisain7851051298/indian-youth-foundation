'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiSettings,
  FiSave,
  FiCheckCircle,
  FiImage,
  FiShield,
  FiPhone,
  FiCreditCard,
  FiArrowLeft,
  FiUploadCloud,
  FiCompass,
  FiSend,
  FiMail,
  FiAlertCircle,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiFileText,
  FiExternalLink,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { settings, updateSettings, testEmailSettings, currentUser, uploadFile } = useNGO();
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

  const [activeTab, setActiveTab] = useState('branding');
  const [uploadingField, setUploadingField] = useState(null);
  const [testReceiverEmail, setTestReceiverEmail] = useState('');
  const [testingMail, setTestingMail] = useState(false);
  const [mailTestResult, setMailTestResult] = useState(null);

  const [form, setForm] = useState({
    ngoNameHi: settings?.ngoNameHi || 'युवा क्रांति दल',
    ngoName: settings?.ngoName || 'Yuva Kranti Dal',
    taglineHi: settings?.taglineHi || 'Dedicated to Youth Empowerment & Nation Building',
    tagline: settings?.tagline || 'Empowering Youth, Transforming Society, Nation First',
    logoUrl: settings?.logoUrl || '',
    officialSealUrl: settings?.officialSealUrl || '',
    presidentSignatureUrl: settings?.presidentSignatureUrl || '',
    presidentName: settings?.presidentName || 'Ravi Saini (National President & Trustee)',
    registrationNo: settings?.registrationNo || 'REG/2021/NGO/DEL/8741',
    panNo: settings?.panNo || 'AAATB4321Q',
    nitiAayogDarpanId: settings?.nitiAayogDarpanId || 'RJ/2022/0319482',
    csr1No: settings?.csr1No || 'CSR00049281',
    exemption12A: settings?.exemption12A || 'CIT(EXEMP)/12A/2021-22/A-492',
    exemption80G: settings?.exemption80G || 'CIT(EXEMP)/80G/2021-22/G-881',
    phone: settings?.phone || '+91 93196 98759',
    whatsapp: settings?.whatsapp || '+919319698759',
    facebook: settings?.facebook || 'https://facebook.com',
    twitter: settings?.twitter || 'https://x.com',
    instagram: settings?.instagram || 'https://instagram.com',
    youtube: settings?.youtube || 'https://youtube.com',
    linkedin: settings?.linkedin || 'https://linkedin.com',
    telegram: settings?.telegram || '',
    email: settings?.email || 'ravisain75688@gmail.com',
    newsTickerText: settings?.newsTickerText || 'युवा क्रांति दल में आपका स्वागत है • निःशुल्क सदस्यता एवं समाज सेवा अभियान • हेल्पलाइन: +919319698759',
    address: settings?.address || 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh',
    googleMapEmbed: settings?.googleMapEmbed || '',
    accountName: settings?.bankDetails?.accountName || 'YUVA KRANTI DAL',
    accountNumber: settings?.bankDetails?.accountNumber || '50200088991234',
    ifscCode: settings?.bankDetails?.ifscCode || 'HDFC0001234',
    bankName: settings?.bankDetails?.bankName || 'HDFC Bank Ltd.',
    branch: settings?.bankDetails?.branch || 'Aligarh Main Branch, UP',
    upiId: settings?.upiId || 'bharatiyauva@okhdfcbank',
    upiQrImage: settings?.upiQrImage || '',
    membershipFee: settings?.membershipFee || 250,
    aboutHeading: settings?.aboutHeading || 'About Yuva Kranti Dal',
    aboutSubtitle: settings?.aboutSubtitle || 'A Government-Recognized Youth Social Welfare Movement Dedicated to Nation Building',
    aboutStory: settings?.aboutStory || '',
    missionStatement: settings?.missionStatement || '',
    visionStatement: settings?.visionStatement || '',
    footerDescription: settings?.footerDescription || '',
    footerCopyright: settings?.footerCopyright || '',
    whoWeAreHeading: settings?.whoWeAreHeading || 'Who We Are — The Pulse of Yuva Kranti Dal',
    whoWeAreSubtitle: settings?.whoWeAreSubtitle || 'A Catalyst for Grassroots Youth Empowerment, Civil Welfare & Nation Building',
    whoWeAreStory: settings?.whoWeAreStory || 'Founded by passionate young patriots and grassroots social activists, Yuva Kranti Dal was born from a deep conviction: that India\'s greatest reservoir of untapped power is its youth. Guided by the ethos of "Nation First, Society Always", we bridge the chasm between compassionate intent and concrete ground action.',
    whoWeAreVision: settings?.whoWeAreVision || 'To foster an empowered, educated, and self-reliant India where proactive youth leadership eliminates socioeconomic disparities, champions community brotherhood, and builds a prosperous nation.',
    whoWeAreMission: settings?.whoWeAreMission || 'To channel the vibrant energy, intellect, and civic dedication of Indian youth into measurable grassroots social welfare initiatives, ensuring quality education for every underprivileged child, immediate healthcare access, women economic self-reliance, and disaster relief.',
    whoWeAreValues: settings?.whoWeAreValues || 'Nation First: Every action is dedicated to national strength and social harmony.\nIntegrity & Transparency: 100% statutory adherence, audited accounts, and public receipts.\nYouth Leadership: Placing young changemakers in driving seats of community solutions.\nEmpathy in Action: Rapid, unconditional grassroots aid for every vulnerable citizen.',
    whoWeAreBannerUrl: settings?.whoWeAreBannerUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
    privacyPolicyTitle: settings?.privacyPolicyTitle || 'Privacy Policy & Data Security',
    privacyPolicySubtitle: settings?.privacyPolicySubtitle || 'Yuva Kranti Dal is dedicated to maintaining full transparency, safeguarding donor privacy, and protecting personal data.',
    privacyLastUpdated: settings?.privacyLastUpdated || 'October 2026',
    privacyPolicyContent: settings?.privacyPolicyContent || '## 1. Information We Collect\nWhen you interact with Yuva Kranti Dal through donations, membership registrations, volunteer drives, or contact inquiries, we collect information necessary to fulfill our statutory non-profit functions.',
    termsTitle: settings?.termsTitle || 'Terms & Conditions of Service',
    termsSubtitle: settings?.termsSubtitle || 'Rules, guidelines, and legal agreements governing the use of the Yuva Kranti Dal website, online donations, and member services.',
    termsEffectiveDate: settings?.termsEffectiveDate || 'October 2026',
    termsContent: settings?.termsContent || '## 1. Acceptance of Terms\nBy accessing, browsing, registering as a member, or donating on this website, you agree to be legally bound by these Terms and Conditions and our Privacy Policy.',
    smtpHost: settings?.smtpHost || 'smtp.gmail.com',
    smtpPort: settings?.smtpPort || 587,
    smtpUser: settings?.smtpUser || 'ravisain75688@gmail.com',
    smtpPass: settings?.smtpPass || 'wmth wfbo khov uugu',
    smtpFromName: settings?.smtpFromName || 'Yuva Kranti Dal',
    adminSecretKey: settings?.adminSecretKey || 'ravi123',
    heroSlides: settings?.heroSlides || []
  });

  // Keep form in sync when settings are loaded from server without wiping edited or existing fields
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setForm(prev => ({
        ...prev,
        ...settings,
        ngoName: settings.ngoName || prev.ngoName || 'Yuva Kranti Dal',
        ngoNameHi: settings.ngoNameHi || prev.ngoNameHi || 'युवा क्रांति दल',
        email: settings.email || prev.email || 'ravisain75688@gmail.com',
        adminSecretKey: settings.adminSecretKey !== undefined ? settings.adminSecretKey : prev.adminSecretKey,
        smtpPass: settings.smtpPass !== undefined ? settings.smtpPass : prev.smtpPass,
        smtpUser: settings.smtpUser || prev.smtpUser || 'ravisain75688@gmail.com',
        smtpHost: settings.smtpHost || prev.smtpHost || 'smtp.gmail.com',
        smtpPort: settings.smtpPort || prev.smtpPort || 587,
        smtpFromName: settings.smtpFromName || prev.smtpFromName || 'Yuva Kranti Dal',
        accountName: settings.bankDetails?.accountName ?? prev.accountName,
        accountNumber: settings.bankDetails?.accountNumber ?? prev.accountNumber,
        ifscCode: settings.bankDetails?.ifscCode ?? prev.ifscCode,
        bankName: settings.bankDetails?.bankName ?? prev.bankName,
        branch: settings.bankDetails?.branch ?? prev.branch,
        heroSlides: settings?.heroSlides || prev.heroSlides || [],
      }));
    }
  }, [settings]);

  const [initialFormJson, setInitialFormJson] = useState("");
  const isDirty = initialFormJson ? JSON.stringify(form) !== initialFormJson : false;

  useEffect(() => {
    if (settings && !initialFormJson) {
      setInitialFormJson(JSON.stringify(form));
    }
  }, [settings, form, initialFormJson]);

  const [saved, setSaved] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    try {
      setIsSaving(true);
      const res = await updateSettings({
        ...form,
        bankDetails: {
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
          branch: form.branch
        }
      });
      if (!res.success) {
        toast.error(res.message || "Failed to save settings!");
        return;
      }
      setInitialFormJson(JSON.stringify(form));
      toast.success(res.message || "Settings saved successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testReceiverEmail || !testReceiverEmail.trim()) {
      toast.error('Please enter a recipient email address to send the diagnostic test.');
      return;
    }
    const cleanPass = (form.smtpPass || '').trim();
    if (cleanPass && (cleanPass.includes('•') || cleanPass.includes('*'))) {
      toast.error('Masked bullet dots (••••) cannot be used. Type your 16-character Google App Password or leave blank to use the active server password.');
      return;
    }
    setTestingMail(true);
    setMailTestResult(null);
    try {
      const res = await testEmailSettings({
        smtpHost: form.smtpHost,
        smtpPort: form.smtpPort,
        smtpUser: form.smtpUser,
        smtpPass: form.smtpPass,
        smtpFromName: form.smtpFromName,
        testReceiverEmail: testReceiverEmail.trim(),
        adminSecretKey: form.adminSecretKey
      });
      setMailTestResult(res);
      if (res?.success) {
        toast.success(res.message || 'SMTP Connection & Delivery Test Passed!');
      } else {
        toast.error(res?.message || 'SMTP Connection Test Failed');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'SMTP diagnostic request encountered a failure.';
      setMailTestResult({
        success: false,
        message: errMsg
      });
      toast.error(errMsg);
    } finally {
      setTestingMail(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-sm">
            <FiShield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-600 mt-2">
            Only designated NGO Administrators have permission to modify brand identity, bank details, and statutory settings.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold transition hover:bg-emerald-800 shadow-md shadow-emerald-700/20"
          >
            Login as Administrator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FiSettings className="text-emerald-700 w-5 h-5" />
            Contact & NGO Master Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete dynamic CRUD: Logo, Official Seal, Signatures, Contact Info, Bank/UPI, About Us & Mission/Vision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isDirty ? "No modifications to save" : "Save All Settings"}
          >
            <FiSave className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : !isDirty ? "No Changes to Save" : "Save All Settings"}</span>
          </button>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition px-2 py-1"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {saved && (
        <div className="mx-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! Changes are immediately live across Navbar, Footer, Receipts, and ID Cards.</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'branding' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          1. Logo, Seal &amp; Signature
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('statutory')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'statutory' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          2. Statutory 12A / 80G &amp; PAN
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'contact' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          3. Contact &amp; Head Office
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bank')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'bank' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          4. Bank Details &amp; UPI QR
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whoWeAre')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'whoWeAre' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          5. &quot;Who We Are&quot; Page CMS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('legalCms')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'legalCms' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          6. Privacy &amp; Terms CMS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'about' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          7. About Us Story
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('carousel')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'carousel' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          8. Hero Carousel Slides
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('smtp')}
          className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
            activeTab === 'smtp' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20' : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          9. SMTP Email Server &amp; Security
        </button>
      </div>

      <form onSubmit={handleSave} className="mx-3 space-y-4 text-xs">
          {/* TAB 1: BRANDING, LOGO, SEAL, SIGNATURE */}
          {activeTab === 'branding' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-black flex items-center gap-2 border-b pb-3">
                <FiImage className="text-emerald-700" />
                <span>1. Organization Branding, Official Stamp & Signatures</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">NGO Full English Name *</label>
                  <input
                    type="text"
                    required
                    name="ngoName"
                    value={form.ngoName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">NGO Name in Hindi *</label>
                  <input
                    type="text"
                    required
                    name="ngoNameHi"
                    value={form.ngoNameHi}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Official Tagline (English)</label>
                  <input
                    type="text"
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Membership / Registration Fee (₹)</label>
                  <input
                    type="number"
                    name="membershipFee"
                    value={form.membershipFee}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-black"
                  />
                </div>
              </div>

              {/* 3 Verification Assets: Logo, Seal, Signature with File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                {/* 1. Official Logo */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-black block text-xs">Official Logo</label>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-black"
                  />
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition shadow-md shadow-emerald-700/20">
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

              {/* National President & Signatory Name */}
              <div className="pt-4 border-t border-slate-200">
                <label className="font-bold text-black block mb-1">
                  National President / Authorized Admin Signatory Name *
                </label>
                <input
                  type="text"
                  name="presidentName"
                  value={form.presidentName}
                  onChange={handleChange}
                  placeholder="Ravi Saini (National President & Trustee)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                />
                <span className="text-[10px] text-gray-600 mt-1 block">
                  This official signatory name dynamically prints beneath the digital signatures and trust seal across all Certificates, ID Cards, and Offer/Appointment Letters.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: STATUTORY COMPLIANCES */}
          {activeTab === 'statutory' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-black flex items-center gap-2 border-b pb-3">
                <FiShield className="text-emerald-700" />
                <span>2. Statutory Registrations & Tax Exemption Numbers</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Registration / Trust Deed No.</label>
                  <input
                    type="text"
                    name="registrationNo"
                    value={form.registrationNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">NITI Aayog Darpan ID</label>
                  <input
                    type="text"
                    name="nitiAayogDarpanId"
                    value={form.nitiAayogDarpanId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    name="panNo"
                    value={form.panNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono uppercase text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="font-bold text-black block mb-1">Section 12A Order Number</label>
                  <input
                    type="text"
                    name="exemption12A"
                    value={form.exemption12A}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Section 80G Approval Number</label>
                  <input
                    type="text"
                    name="exemption80G"
                    value={form.exemption80G}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">CSR-1 Registration Number</label>
                  <input
                    type="text"
                    name="csr1No"
                    value={form.csr1No}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & HEAD OFFICE */}
          {activeTab === 'contact' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-black flex items-center gap-2 border-b pb-3">
                <FiPhone className="text-emerald-700" />
                <span>3. Contact Numbers, Email & Head Office Location</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Helpline Phone Number *</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">WhatsApp Helpline *</label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
              </div>

              {/* Dedicated Social Media Accounts Link Section */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <FiSend className="w-4 h-4 text-emerald-700" />
                    <span>Official Social Media Accounts Links</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    Live on Top Header &amp; Footer
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Enter your NGO’s official social profile URLs. These links will automatically connect to all social buttons across the header top bar, footer, and contact sections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Facebook */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Facebook Page URL</label>
                    <input
                      type="url"
                      name="facebook"
                      value={form.facebook || ''}
                      onChange={handleChange}
                      placeholder="https://facebook.com/your-ngo-page"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Instagram Profile URL</label>
                    <input
                      type="url"
                      name="instagram"
                      value={form.instagram || ''}
                      onChange={handleChange}
                      placeholder="https://instagram.com/your-ngo-handle"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      name="youtube"
                      value={form.youtube || ''}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>

                  {/* X (Twitter) */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">X (Twitter) Profile URL</label>
                    <input
                      type="url"
                      name="twitter"
                      value={form.twitter || ''}
                      onChange={handleChange}
                      placeholder="https://x.com/yourhandle"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">LinkedIn Page URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={form.linkedin || ''}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/your-ngo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>

                  {/* Telegram / Channel */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Telegram Channel / Group URL</label>
                    <input
                      type="url"
                      name="telegram"
                      value={form.telegram || ''}
                      onChange={handleChange}
                      placeholder="https://t.me/yourchannel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Header Top Announcement Ticker Message */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-black text-xs text-[#0b8026] flex items-center gap-1.5">
                    <FiSend className="w-3.5 h-3.5" />
                    <span>Header Top Message / News &amp; Updates Marquee Ticker</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Live on Website Top Header
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  This text runs continuously in the top green banner next to &quot;News &amp; Updates&quot;. You can update announcements, helplines, or breaking news directly from here.
                </p>
                <textarea
                  rows={2}
                  name="newsTickerText"
                  value={form.newsTickerText || ''}
                  onChange={handleChange}
                  placeholder="Welcome to Samasya Samadhan Parishad (SSP) • Free Membership & Social Welfare Mission • Helpline: +919319698759"
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#0b8026] text-xs font-semibold text-slate-900 bg-white shadow-2xs"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Head Office Full Address *</label>
                <textarea
                  rows={2}
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-black"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Google Maps Embed URL</label>
                <input
                  type="text"
                  name="googleMapEmbed"
                  value={form.googleMapEmbed}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px] text-black"
                />
              </div>
            </div>
          )}

          {/* TAB 4: BANK & UPI DETAILS */}
          {activeTab === 'bank' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-black flex items-center gap-2 border-b pb-3">
                <FiCreditCard className="text-emerald-700" />
                <span>4. Bank Account Details & UPI Donation QR Code</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Bank Account Holder Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={form.accountName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={form.ifscCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Branch Name</label>
                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <label className="font-bold text-black block mb-1">Official UPI VPA ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-black block mb-1">UPI QR Code Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="upiQrImage"
                      placeholder="QR code image URL"
                      value={form.upiQrImage}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-black"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs whitespace-nowrap shadow-md shadow-emerald-700/20">
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

          {/* TAB 5: "WHO WE ARE" PAGE CMS */}
          {activeTab === 'whoWeAre' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-black flex items-center gap-2">
                    <FiUsers className="text-emerald-700" />
                    <span>5. &quot;Who We Are&quot; Dynamic Page Management</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live content editor for the dedicated public page (/who-we-are). Changes are reflected instantly.
                  </p>
                </div>
                <Link
                  href="/who-we-are"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition"
                >
                  <FiExternalLink className="w-3.5 h-3.5" />
                  <span>Preview &quot;Who We Are&quot; Page</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Page Main Heading *</label>
                  <input
                    type="text"
                    required
                    name="whoWeAreHeading"
                    value={form.whoWeAreHeading}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Page Subtitle / Tagline *</label>
                  <input
                    type="text"
                    required
                    name="whoWeAreSubtitle"
                    value={form.whoWeAreSubtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>
              </div>

              {/* Banner Image URL & Uploader */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-black block text-xs">Who We Are Showcase Banner Image</label>
                  {form.whoWeAreBannerUrl && (
                    <img src={form.whoWeAreBannerUrl} alt="Banner Preview" className="w-16 h-9 rounded-lg object-cover border" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="whoWeAreBannerUrl"
                    placeholder="Banner Image URL or upload below"
                    value={form.whoWeAreBannerUrl}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-black"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-md shadow-emerald-700/20 whitespace-nowrap">
                    <FiUploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingField === 'whoWeAreBannerUrl' ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('whoWeAreBannerUrl', e)}
                    />
                  </label>
                </div>
              </div>

              {/* Comprehensive Who We Are Narrative Story */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-black block">
                    Comprehensive Narrative Story &amp; Identity *
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Supports paragraphs, **bold text**, and markdown headings
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  name="whoWeAreStory"
                  value={form.whoWeAreStory}
                  onChange={handleChange}
                  placeholder="Enter the complete foundational story..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed text-black font-normal"
                />
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Who We Are — Mission</label>
                  <textarea
                    rows={4}
                    name="whoWeAreMission"
                    value={form.whoWeAreMission}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black leading-relaxed"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Who We Are — Vision</label>
                  <textarea
                    rows={4}
                    name="whoWeAreVision"
                    value={form.whoWeAreVision}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black leading-relaxed"
                  />
                </div>
              </div>

              {/* Core Values & Ideology */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-black block">Core Values &amp; Non-Negotiable Ideology</label>
                  <span className="text-[10px] text-slate-500">Each point on a new line</span>
                </div>
                <textarea
                  rows={4}
                  name="whoWeAreValues"
                  value={form.whoWeAreValues}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black leading-relaxed font-normal"
                />
              </div>
            </div>
          )}

          {/* TAB 6: PRIVACY POLICY & TERMS AND CONDITIONS CMS */}
          {activeTab === 'legalCms' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div className="border-b pb-4">
                <h2 className="text-base font-extrabold text-black flex items-center gap-2">
                  <FiFileText className="text-emerald-700" />
                  <span>6. Dynamic Legal CMS: Privacy Policy &amp; Terms of Service</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full control over legal clauses, compliance guidelines, 80G tax rules, and donor data protections.
                </p>
              </div>

              {/* SECTION A: PRIVACY POLICY CMS */}
              <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-emerald-700 w-5 h-5" />
                    <h3 className="text-sm font-black text-slate-900">Privacy Policy Page Settings (/privacy-policy)</h3>
                  </div>
                  <Link
                    href="/privacy-policy"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-emerald-700 hover:text-emerald-800 font-bold text-xs border border-slate-200 shadow-2xs"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Privacy Policy</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-black block mb-1">Privacy Page Title</label>
                    <input
                      type="text"
                      name="privacyPolicyTitle"
                      value={form.privacyPolicyTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Last Updated &amp; Verified Date</label>
                    <input
                      type="text"
                      name="privacyLastUpdated"
                      value={form.privacyLastUpdated}
                      onChange={handleChange}
                      placeholder="e.g. October 2026"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Privacy Page Subtitle</label>
                  <input
                    type="text"
                    name="privacyPolicySubtitle"
                    value={form.privacyPolicySubtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-black block">Privacy Policy Content Clauses &amp; Sections</label>
                    <span className="text-[10px] text-slate-500 font-mono">Supports ## Headings, - Bullets, **Bold**</span>
                  </div>
                  <textarea
                    rows={12}
                    name="privacyPolicyContent"
                    value={form.privacyPolicyContent}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs text-black leading-relaxed"
                  />
                </div>
              </div>

              {/* SECTION B: TERMS AND CONDITIONS CMS */}
              <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-emerald-700 w-5 h-5" />
                    <h3 className="text-sm font-black text-slate-900">Terms &amp; Conditions Page Settings (/terms)</h3>
                  </div>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-emerald-700 hover:text-emerald-800 font-bold text-xs border border-slate-200 shadow-2xs"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Terms &amp; Conditions</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-black block mb-1">Terms Page Title</label>
                    <input
                      type="text"
                      name="termsTitle"
                      value={form.termsTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Effective Date</label>
                    <input
                      type="text"
                      name="termsEffectiveDate"
                      value={form.termsEffectiveDate}
                      onChange={handleChange}
                      placeholder="e.g. October 2026"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Terms Page Subtitle</label>
                  <input
                    type="text"
                    name="termsSubtitle"
                    value={form.termsSubtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-black block">Terms &amp; Conditions Clauses &amp; Legal Text</label>
                    <span className="text-[10px] text-slate-500 font-mono">Supports ## Headings, - Bullets, **Bold**</span>
                  </div>
                  <textarea
                    rows={12}
                    name="termsContent"
                    value={form.termsContent}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs text-black leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DYNAMIC ABOUT US STORY & MISSION/VISION */}
          {activeTab === 'about' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-black flex items-center gap-2 border-b pb-3">
                <FiCompass className="text-emerald-700" />
                <span>7. Dynamic About Us Story &amp; Mission / Vision Statements</span>
              </h2>

              <div>
                <label className="font-bold text-black block mb-1">About Us Main Heading</label>
                <input
                  type="text"
                  name="aboutHeading"
                  value={form.aboutHeading}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">About Us Subtitle</label>
                <input
                  type="text"
                  name="aboutSubtitle"
                  value={form.aboutSubtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Comprehensive About Us Story</label>
                <textarea
                  rows={4}
                  name="aboutStory"
                  value={form.aboutStory}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed text-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-bold text-black block mb-1">Statutory Mission Statement</label>
                  <textarea
                    rows={3}
                    name="missionStatement"
                    value={form.missionStatement}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Vision Statement</label>
                  <textarea
                    rows={3}
                    name="visionStatement"
                    value={form.visionStatement}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: HERO CAROUSEL SLIDES MANAGEMENT */}
          {activeTab === 'carousel' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-black flex items-center gap-2">
                    <FiImage className="text-emerald-700" />
                    <span>8. Home Hero Carousel Slides &amp; Banners</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload, preview, update, reorder or delete slides on the homepage hero carousel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newSlide = {
                      title: 'Empowering Communities Across India',
                      subtitle: 'Transforming lives through grassroots education, healthcare, and social support.',
                      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&auto=format&fit=crop&q=80',
                      tag: 'Social Impact Movement',
                      ctaPrimaryText: 'Donate Now',
                      ctaPrimaryLink: '/donation',
                      ctaSecondaryText: 'Join as Member',
                      ctaSecondaryLink: '/members',
                      highlight: 'Dedicated To Youth Empowerment & Social Welfare'
                    };
                    setForm(prev => ({
                      ...prev,
                      heroSlides: [...(prev.heroSlides || []), newSlide]
                    }));
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add New Slide</span>
                </button>
              </div>

              {(!form.heroSlides || form.heroSlides.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <FiImage className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-semibold">No custom carousel slides added yet. The default foundation slides are currently displayed.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        heroSlides: [
                          {
                            title: 'Empowering Youth, Transforming Society, Nation First',
                            subtitle: 'Yuva Kranti Dal (युवा क्रांति दल) is a premier 12A & 80G certified NGO mobilizing young leaders for free child literacy, emergency healthcare, and rural empowerment.',
                            imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&auto=format&fit=crop&q=80',
                            tag: 'National Youth Movement',
                            ctaPrimaryText: 'Donate Online (Instant 80G)',
                            ctaPrimaryLink: '/donation',
                            ctaSecondaryText: 'Join as Member (Get ID Card)',
                            ctaSecondaryLink: '/members',
                            highlight: 'Over 25,000+ Underprivileged Beneficiaries Across India',
                          },
                          {
                            title: '100% Transparent Giving with Section 80G Tax Exemption',
                            subtitle: 'Your contribution funds school books, student scholarships, emergency blood delivery, and women vocational centers. Claim 50% tax deduction with instant receipts.',
                            imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&auto=format&fit=crop&q=80',
                            tag: '50% Income Tax Exemption',
                            ctaPrimaryText: 'Contribute to a Campaign',
                            ctaPrimaryLink: '/campaigns',
                            ctaSecondaryText: 'Inspect Legal Certificates',
                            ctaSecondaryLink: '/certificates',
                            highlight: 'Instant 80G Form 10BD Eligible Receipts Generated',
                          },
                          {
                            title: '24/7 Voluntary Blood Network & Emergency Relief Helpline',
                            subtitle: 'Connecting critical hospital patients with verified voluntary donors across districts in real time. Over 1,800 emergency units arranged with zero donor charges.',
                            imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&auto=format&fit=crop&q=80',
                            tag: 'Emergency Relief Care',
                            ctaPrimaryText: 'Emergency Blood Support',
                            ctaPrimaryLink: '/complaints',
                            ctaSecondaryText: 'Apply as Volunteer',
                            ctaSecondaryLink: '/volunteer',
                            highlight: 'Zero Administrative Fee Deductions • Real Ground Relief',
                          }
                        ]
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-50 transition cursor-pointer shadow-xs"
                  >
                    <span>Load Default 3 Slides to Edit</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {form.heroSlides.map((slide, sIdx) => (
                    <div key={sIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs relative">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                        <span className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs">
                            {sIdx + 1}
                          </span>
                          Slide #{sIdx + 1} {slide.title ? `– ${slide.title.slice(0, 30)}...` : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove Slide #${sIdx + 1}?`)) {
                              setForm(prev => ({
                                ...prev,
                                heroSlides: prev.heroSlides.filter((_, i) => i !== sIdx)
                              }));
                            }
                          }}
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Delete Slide</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        {/* Slide Image Preview & Upload */}
                        <div className="md:col-span-4 space-y-2">
                          <label className="font-bold text-slate-800 block text-xs">Slide Image / Banner *</label>
                          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-16/10 bg-slate-200 flex items-center justify-center group shadow-xs">
                            {slide.imageUrl ? (
                              <img
                                src={slide.imageUrl}
                                alt={`Slide ${sIdx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600';
                                }}
                              />
                            ) : (
                              <FiImage className="w-8 h-8 text-slate-400" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <label className="flex-1 cursor-pointer">
                              <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-xl shadow-xs transition">
                                <FiUploadCloud className="w-4 h-4 text-emerald-700" />
                                <span>{uploadingField === `slide_${sIdx}` ? 'Uploading...' : 'Upload Image'}</span>
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setUploadingField(`slide_${sIdx}`);
                                  try {
                                    const res = await uploadFile(file);
                                    if (res.success && res.url) {
                                      setForm(prev => {
                                        const updated = [...prev.heroSlides];
                                        updated[sIdx] = { ...updated[sIdx], imageUrl: res.url };
                                        return { ...prev, heroSlides: updated };
                                      });
                                      toast.success('Slide image uploaded successfully!');
                                    } else {
                                      toast.error(res.message || 'Upload failed');
                                    }
                                  } catch (err) {
                                    toast.error('Upload error');
                                  } finally {
                                    setUploadingField(null);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <input
                            type="text"
                            placeholder="Or paste image URL"
                            value={slide.imageUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm(prev => {
                                const updated = [...prev.heroSlides];
                                updated[sIdx] = { ...updated[sIdx], imageUrl: val };
                                return { ...prev, heroSlides: updated };
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px] text-slate-800 bg-white"
                          />
                        </div>

                        {/* Slide Details */}
                        <div className="md:col-span-8 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="font-bold text-slate-700 block text-[11px] mb-1">Slide Tag / Category</label>
                              <input
                                type="text"
                                placeholder="e.g. National Youth Movement"
                                value={slide.tag || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.heroSlides];
                                    updated[sIdx] = { ...updated[sIdx], tag: val };
                                    return { ...prev, heroSlides: updated };
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-slate-700 block text-[11px] mb-1">Bottom Highlight Pill</label>
                              <input
                                type="text"
                                placeholder="e.g. Over 25,000+ Underprivileged Beneficiaries"
                                value={slide.highlight || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.heroSlides];
                                    updated[sIdx] = { ...updated[sIdx], highlight: val };
                                    return { ...prev, heroSlides: updated };
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white text-slate-900"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block text-[11px] mb-1">Main Slide Heading / Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Empowering Youth, Transforming Society, Nation First"
                              value={slide.title || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm(prev => {
                                  const updated = [...prev.heroSlides];
                                  updated[sIdx] = { ...updated[sIdx], title: val };
                                  return { ...prev, heroSlides: updated };
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold bg-white text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block text-[11px] mb-1">Slide Subtitle / Description</label>
                            <textarea
                              rows={2}
                              placeholder="e.g. Yuva Kranti Dal is a premier 12A & 80G certified NGO mobilizing young leaders..."
                              value={slide.subtitle || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setForm(prev => {
                                  const updated = [...prev.heroSlides];
                                  updated[sIdx] = { ...updated[sIdx], subtitle: val };
                                  return { ...prev, heroSlides: updated };
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white text-slate-900"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="font-bold text-[11px] text-emerald-700 block">Primary Action Button</span>
                              <input
                                type="text"
                                placeholder="Button Text (e.g. Donate Online)"
                                value={slide.ctaPrimaryText || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.heroSlides];
                                    updated[sIdx] = { ...updated[sIdx], ctaPrimaryText: val };
                                    return { ...prev, heroSlides: updated };
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-900"
                              />
                              <input
                                type="text"
                                placeholder="Button Link (e.g. /donation)"
                                value={slide.ctaPrimaryLink || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.heroSlides];
                                    updated[sIdx] = { ...updated[sIdx], ctaPrimaryLink: val };
                                    return { ...prev, heroSlides: updated };
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-900"
                              />
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                              <span className="font-bold text-[11px] text-slate-700 block">Secondary Action Button</span>
                              <input
                                type="text"
                                placeholder="Button Text (e.g. Join as Member)"
                                value={slide.ctaSecondaryText || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.heroSlides];
                                    updated[sIdx] = { ...updated[sIdx], ctaSecondaryText: val };
                                    return { ...prev, heroSlides: updated };
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-900"
                              />
                              <input
                                type="text"
                                placeholder="Button Link (e.g. /members)"
                                value={slide.ctaSecondaryLink || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm(prev => {
                                    const updated = [...prev.heroSlides];
                                    updated[sIdx] = { ...updated[sIdx], ctaSecondaryLink: val };
                                    return { ...prev, heroSlides: updated };
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SMTP EMAIL CONFIGURATION & ADMIN SECRET KEY */}
          {activeTab === 'smtp' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-base font-extrabold text-black flex items-center gap-2">
                  <FiShield className="text-emerald-700" />
                  <span>8. Dynamic SMTP Email Server &amp; Security Settings</span>
                </h2>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Statutory Automated Dispatch
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 leading-relaxed text-xs flex items-start gap-2.5">
                <FiShield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Protected Security Vault:</strong> Your SMTP App Password and Super Admin Secret Key are securely encrypted and shielded from public API endpoints. To keep your current functioning credentials unchanged, simply leave those fields blank.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed text-xs">
                <strong>Zero-Fraud Email Architecture:</strong> When the Trustee Admin verifies a donation or approves a membership, the system automatically dispatches the official 80G Tax Exemption Receipt (with unique registration serial number) or formal Appointment Letter directly from the official Trust email address configured below.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">SMTP Host</label>
                  <input
                    type="text"
                    name="smtpHost"
                    value={form.smtpHost}
                    onChange={handleChange}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Default: smtp.gmail.com</span>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">SMTP Port</label>
                  <select
                    name="smtpPort"
                    value={form.smtpPort}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                  >
                    <option value="">Select SMTP Port</option>
                    <option value="587">587 (SSL/TLS - Recommended)</option>
                    <option value="465">465 (SSL - Older standard)</option>
                    <option value="25">25 (Unencrypted - Avoid)</option>
                  </select>
                  <span className="text-[10px] text-gray-500 mt-1 block">Standard TLS Port: 587 (or 465 for SSL)</span>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Official SMTP Email Address</label>
                  <input
                    type="email"
                    name="smtpUser"
                    value={form.smtpUser}
                    onChange={handleChange}
                    placeholder="e.g. yourorg@gmail.com (leave blank to keep current)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-black"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-black block text-xs">SMTP App Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showSmtpPass ? 'text' : 'password'}
                      name="smtpPass"
                      value={form.smtpPass}
                      onChange={handleChange}
                      placeholder="Leave blank to keep existing password"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-black text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPass(!showSmtpPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
                      title={showSmtpPass ? 'Hide Password' : 'Show Password'}
                    >
                      {showSmtpPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    {form.smtpPass ? (
                      <span className="text-emerald-700 font-bold">New password entered. Save settings to apply.</span>
                    ) : (
                      'Leave blank to keep existing configured App Password. Type new 16-character password to change.'
                    )}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-black block mb-1">Email Sender Display Title (From Name)</label>
                  <input
                    type="text"
                    name="smtpFromName"
                    value={form.smtpFromName}
                    onChange={handleChange}
                    placeholder="Yuva Kranti Dal"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-black"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    The organization name displayed in the recipient's inbox (e.g. &quot;Yuva Kranti Dal&quot;).
                  </span>
                </div>
              </div>

              {/* ---------------- LIVE SMTP DIAGNOSTIC TESTING DESK ---------------- */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 text-white space-y-4 shadow-xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-700/20 text-emerald-400 rounded-xl">
                      <FiMail className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white flex items-center gap-2">
                        <span className='text-white'>Live SMTP Connection &amp; Delivery Tester</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Real-Time Testing
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Test your credentials configured above by immediately dispatching a diagnostic email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Recipient Test Email Address *
                    </label>
                    <input
                      type="email"
                      value={testReceiverEmail}
                      onChange={(e) => setTestReceiverEmail(e.target.value)}
                      placeholder="Enter receiver email address (e.g. yourname@gmail.com)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={testingMail || !testReceiverEmail}
                    className={`w-full sm:w-auto mt-auto sm:self-end px-6 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${testingMail || !testReceiverEmail
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      : 'bg-linear-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white shadow-emerald-950/50'
                      }`}
                  >
                    {testingMail ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying &amp; Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        <span>Send Test Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Diagnostic Results Banner */}
                {mailTestResult && (
                  <div
                    className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5 transition ${mailTestResult.success
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'
                      }`}
                  >
                    {mailTestResult.success ? (
                      <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className={`font-bold text-sm ${mailTestResult.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {mailTestResult.success ? 'SMTP Verification Succeeded!' : 'SMTP Connection Failed'}
                      </div>
                      <p className="text-xs leading-relaxed opacity-95">
                        {mailTestResult.message}
                      </p>
                      {mailTestResult.result?.messageId && (
                        <div className="font-mono text-[10px] text-emerald-400 opacity-90">
                          Message-ID: {mailTestResult.result.messageId}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="font-bold text-black block mb-1">Super Admin Secret Key (x-admin-secret-key)</label>
                <input
                  type="text"
                  name="adminSecretKey"
                  value={form.adminSecretKey}
                  onChange={handleChange}
                  placeholder="Leave blank to keep existing secret key / Type new secret key to change"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono bg-slate-50 text-black text-xs"
                />
                <span className="text-[10px] text-gray-600 mt-1 block">
                  Protected master secret key. Leave blank to keep existing key unchanged, or enter a new secret key to update.
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-gray-600 font-semibold">
              * Any modifications saved here take effect immediately across the public website and dynamic generators.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/30 transition cursor-pointer"
            >
              <FiSave className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
  );
}
