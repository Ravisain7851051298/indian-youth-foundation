"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiEdit3,
  FiGlobe,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiTrash2,
  FiUploadCloud,
  FiUser
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";
import { useNGO } from "@/context/NGOContext";

export default function NgoSettingsManagement() {
  const { refreshSettings } = useNGO();
  const [activeTab, setActiveTab] = useState("identity"); // 'identity' | 'compliance' | 'contact' | 'bank' | 'signatures'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    ngoName: "",
    ngoNameHi: "",
    tagline: "",
    taglineHi: "",
    aboutStory: "",
    missionStatement: "",
    visionStatement: "",
    registrationNo: "",
    panNo: "",
    nitiAayogDarpanId: "",
    csr1No: "",
    exemption12A: "",
    exemption80G: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    googleMapEmbed: "",
    logoUrl: "",
    officialSealUrl: "",
    presidentSignatureUrl: "",
    upiId: "",
    upiQrImage: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: ""
    }
  });

  // Upload files and previews
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [sigFile, setSigFile] = useState(null);
  const [sigPreview, setSigPreview] = useState("");

  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings");
      if (res.data?.success && res.data?.settings) {
        const s = res.data.settings;
        setForm({
          ngoName: s.ngoName || "Yuva Kranti Dal",
          ngoNameHi: s.ngoNameHi || "युवा क्रांति दल",
          tagline: s.tagline || "",
          taglineHi: s.taglineHi || "",
          aboutStory: s.aboutStory || "",
          missionStatement: s.missionStatement || "",
          visionStatement: s.visionStatement || "",
          registrationNo: s.registrationNo || "",
          panNo: s.panNo || "",
          nitiAayogDarpanId: s.nitiAayogDarpanId || "",
          csr1No: s.csr1No || "",
          exemption12A: s.exemption12A || "",
          exemption80G: s.exemption80G || "",
          email: s.email || "",
          phone: s.phone || "",
          whatsapp: s.whatsapp || "",
          address: s.address || "",
          googleMapEmbed: s.googleMapEmbed || "",
          logoUrl: s.logoUrl || "",
          officialSealUrl: s.officialSealUrl || "",
          presidentSignatureUrl: s.presidentSignatureUrl || "",
          upiId: s.upiId || "",
          upiQrImage: s.upiQrImage || "",
          bankDetails: {
            accountName: s.bankDetails?.accountName || "",
            accountNumber: s.bankDetails?.accountNumber || "",
            ifscCode: s.bankDetails?.ifscCode || "",
            bankName: s.bankDetails?.bankName || "",
            branch: s.bankDetails?.branch || ""
          }
        });
      }
    } catch (err) {
      toast.error("Failed to load NGO settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let logoUrl = form.logoUrl;
      let presidentSignatureUrl = form.presidentSignatureUrl;
      let upiQrImage = form.upiQrImage;

      if (logoFile) {
        const fd = new FormData();
        fd.append("file", logoFile);
        const up = await api.post("/upload", fd);
        if (up.data?.url) logoUrl = up.data.url;
      }

      if (sigFile) {
        const fd = new FormData();
        fd.append("file", sigFile);
        const up = await api.post("/upload", fd);
        if (up.data?.url) presidentSignatureUrl = up.data.url;
      }

      if (qrFile) {
        const fd = new FormData();
        fd.append("file", qrFile);
        const up = await api.post("/upload", fd);
        if (up.data?.url) upiQrImage = up.data.url;
      }

      const payload = {
        ...form,
        logoUrl,
        presidentSignatureUrl,
        upiQrImage
      };

      const res = await api.put("/settings", payload);
      if (res.data?.success) {
        toast.success("NGO Master Settings saved successfully!");
        setLogoFile(null);
        setLogoPreview("");
        setSigFile(null);
        setSigPreview("");
        setQrFile(null);
        setQrPreview("");
        if (refreshSettings) refreshSettings();
        loadSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
            <span>Global Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">NGO Master Settings</h1>
          <p className="text-xs text-slate-700 mt-1">
            Configure legal trust credentials, 12A/80G orders, logo, signatures, and contact details.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer self-start md:self-auto"
          title="Refresh"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto gap-1">
        {[
          { id: "identity", label: "Identity & Mission" },
          { id: "compliance", label: "12A & 80G Statutory" },
          { id: "signatures", label: "Logo & Signatures" },
          { id: "bank", label: "Banking & UPI QR" },
          { id: "contact", label: "Contact & Location" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${activeTab === tab.id
                ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                : "text-slate-700 hover:text-black hover:bg-slate-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-black">
        <form onSubmit={handleSave} className="space-y-6 text-xs text-black">
          {/* TAB 1: Identity & Mission */}
          {activeTab === "identity" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-black">Brand &amp; Movement Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-black block mb-1">NGO Legal Name (English)</label>
                  <input
                    type="text"
                    required
                    value={form.ngoName}
                    onChange={(e) => setForm({ ...form, ngoName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">संगठन का नाम (Hindi)</label>
                  <input
                    type="text"
                    value={form.ngoNameHi}
                    onChange={(e) => setForm({ ...form, ngoNameHi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Tagline (English)</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">ध्येय वाक्य (Hindi)</label>
                  <input
                    type="text"
                    value={form.taglineHi}
                    onChange={(e) => setForm({ ...form, taglineHi: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-black block mb-1">Movement Overview / About Story</label>
                <textarea
                  rows={3}
                  value={form.aboutStory}
                  onChange={(e) => setForm({ ...form, aboutStory: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-black block mb-1">Official Mission Statement</label>
                  <textarea
                    rows={3}
                    value={form.missionStatement}
                    onChange={(e) => setForm({ ...form, missionStatement: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Official Vision Statement</label>
                  <textarea
                    rows={3}
                    value={form.visionStatement}
                    onChange={(e) => setForm({ ...form, visionStatement: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Statutory Compliance */}
          {activeTab === "compliance" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-black">Government &amp; Income Tax Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-black block mb-1">Societies Registration Number</label>
                  <input
                    type="text"
                    value={form.registrationNo}
                    onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Income Tax PAN Number</label>
                  <input
                    type="text"
                    value={form.panNo}
                    onChange={(e) => setForm({ ...form, panNo: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black uppercase bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Section 12A Order Number</label>
                  <input
                    type="text"
                    value={form.exemption12A}
                    onChange={(e) => setForm({ ...form, exemption12A: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Section 80G Tax Exemption Order</label>
                  <input
                    type="text"
                    value={form.exemption80G}
                    onChange={(e) => setForm({ ...form, exemption80G: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">NITI Aayog Darpan ID</label>
                  <input
                    type="text"
                    value={form.nitiAayogDarpanId}
                    onChange={(e) => setForm({ ...form, nitiAayogDarpanId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">CSR-1 Ministry Registration</label>
                  <input
                    type="text"
                    value={form.csr1No}
                    onChange={(e) => setForm({ ...form, csr1No: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Logo & Signatures */}
          {activeTab === "signatures" && (
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-black">Official Branding &amp; Dual-Sided ID Signatures</h3>

              {/* Logo Upload with Display Preview & Remove Image */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-extrabold text-black text-xs block">
                  Official NGO Crest / Logo (Display &amp; Remove Option)
                </span>
                {logoPreview || form.logoUrl ? (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <img
                      src={logoPreview || getContentImageUrl(form.logoUrl)}
                      alt="Logo Preview"
                      className="w-20 h-20 object-contain rounded-xl border border-slate-300 shadow-sm"
                    />
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-black">Active Organization Logo</div>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview("");
                          setForm((prev) => ({ ...prev, logoUrl: "" }));
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Remove Logo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                    <label className="cursor-pointer space-y-1 block">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-lg">
                        <FiUploadCloud />
                      </div>
                      <span className="text-xs font-bold text-red-600 hover:underline block">
                        Click to select new NGO Logo
                      </span>
                      <span className="text-[10px] text-slate-400 block">PNG or SVG with transparent background</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoFile(file);
                            setLogoPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* President Signature Upload with Display Preview & Remove Image */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-extrabold text-black text-xs block">
                  Authorized Signatory / President Signature (Display &amp; Remove Option)
                </span>
                {sigPreview || form.presidentSignatureUrl ? (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <img
                      src={sigPreview || getContentImageUrl(form.presidentSignatureUrl)}
                      alt="Signature Preview"
                      className="w-36 h-16 object-contain rounded-xl border border-slate-300 shadow-sm bg-white"
                    />
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-black">Active Stamp / Signature</div>
                      <button
                        type="button"
                        onClick={() => {
                          setSigFile(null);
                          setSigPreview("");
                          setForm((prev) => ({ ...prev, presidentSignatureUrl: "" }));
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Remove Signature</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                    <label className="cursor-pointer space-y-1 block">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-lg">
                        <FiUploadCloud />
                      </div>
                      <span className="text-xs font-bold text-red-600 hover:underline block">
                        Click to upload Signatory Signature
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Printed automatically on Dual-Sided ID Cards &amp; 80G Receipts
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSigFile(file);
                            setSigPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Banking & UPI QR */}
          {activeTab === "bank" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-black">Banking &amp; Real-time UPI QR Code</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-black block mb-1">Beneficiary Account Name</label>
                  <input
                    type="text"
                    value={form.bankDetails?.accountName || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountName: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={form.bankDetails?.accountNumber || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, accountNumber: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={form.bankDetails?.bankName || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, bankName: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={form.bankDetails?.ifscCode || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankDetails: { ...form.bankDetails, ifscCode: e.target.value.toUpperCase() }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-mono font-bold text-black uppercase bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-extrabold text-black block mb-1">Official UPI ID</label>
                  <input
                    type="text"
                    value={form.upiId}
                    onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
              </div>

              {/* UPI QR with Display Preview & Remove Image */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-extrabold text-black text-xs block">
                  Official UPI QR Code (Display &amp; Remove Option)
                </span>
                {qrPreview || form.upiQrImage ? (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <img
                      src={qrPreview || getContentImageUrl(form.upiQrImage)}
                      alt="UPI QR Code Preview"
                      className="w-28 h-28 object-contain rounded-xl border border-slate-300 shadow-sm"
                    />
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-black">Active Donation QR Code</div>
                      <button
                        type="button"
                        onClick={() => {
                          setQrFile(null);
                          setQrPreview("");
                          setForm((prev) => ({ ...prev, upiQrImage: "" }));
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Remove QR Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                    <label className="cursor-pointer space-y-1 block">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-lg">
                        <FiUploadCloud />
                      </div>
                      <span className="text-xs font-bold text-red-600 hover:underline block">
                        Click to select new UPI QR Image
                      </span>
                      <span className="text-[10px] text-slate-400 block">PNG, JPG or JPEG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setQrFile(file);
                            setQrPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Contact & Location */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-black">Contact Channels &amp; Map Coordinates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-black block mb-1">Official Helpline Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">WhatsApp Helpline</label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-black block mb-1">Head Office Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-extrabold text-black block mb-1">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={form.googleMapEmbed}
                    onChange={(e) => setForm({ ...form, googleMapEmbed: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save NGO Master Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
