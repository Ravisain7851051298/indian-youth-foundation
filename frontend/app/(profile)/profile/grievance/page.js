'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  FiAlertCircle, 
  FiSend, 
  FiCheckCircle, 
  FiClock, 
  FiMessageSquare, 
  FiUploadCloud, 
  FiX, 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiRefreshCw,
  FiFilter,
  FiEye,
  FiExternalLink,
  FiUser,
  FiShield,
  FiInbox,
  FiCheck,
  FiHelpCircle
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

const CATEGORIES = [
  'ID Card Issue / Spelling Correction',
  'Appointment Letter Inquiry',
  'Certificate / Award Verification',
  'Donation & 80G Tax Receipt',
  'Volunteer Wing Coordination',
  'General Inquiry / Suggestion'
];

export default function ProfileGrievancePage() {
  const { currentUser } = useNGO();
  const fileInputRef = useRef(null);

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'in_progress' | 'resolved'
  const [previewMedia, setPreviewMedia] = useState(null); // { url, type, title }

  const [form, setForm] = useState({
    category: CATEGORIES[0],
    subject: '',
    message: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(''); // 'image' | 'video' | 'pdf'

  // Load grievances and past inquiries function
  const loadGrievances = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const params = {};
      if (currentUser?.email) params.email = currentUser.email;
      if (currentUser?.phone) params.phone = currentUser.phone;

      const res = await api.get('/grievances', { params });
      if (res.data?.success) {
        setGrievances(Array.isArray(res.data.grievances) ? res.data.grievances : []);
      }
    } catch (err) {
      console.warn('Grievance fetch notice:', err?.response?.status || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser?.email, currentUser?.phone]);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  // Handle file selection (Images & Videos)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Selected file exceeds 15MB limit. Please upload a compressed image or video.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);

    if (file.type.startsWith('video/')) {
      setFileType('video');
      setFilePreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('image/')) {
      setFileType('image');
      setFilePreview(URL.createObjectURL(file));
    } else if (file.type === 'application/pdf') {
      setFileType('pdf');
      setFilePreview(file.name);
    } else {
      setFileType('other');
      setFilePreview(file.name);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (filePreview && (fileType === 'image' || fileType === 'video')) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setFileType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isFormValid = (form.subject || '').trim().length >= 3 && (form.message || '').trim().length >= 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMsg('Please enter both subject and detailed description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      const formData = new FormData();
      formData.append('name', currentUser?.name || 'Verified User');
      formData.append('email', currentUser?.email || '');
      formData.append('phone', currentUser?.phone || '');
      formData.append('memberId', currentUser?.memberId || currentUser?.volunteerId || '');
      formData.append('subject', `[${form.category}] ${form.subject.trim()}`);
      formData.append('message', form.message.trim());

      if (selectedFile) {
        formData.append('attachment', selectedFile);
      }

      const res = await api.post('/grievances', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        const ticketNum = res.data.grievance?.ticketNumber;
        setSuccessMsg(
          ticketNum 
            ? `Enquiry ticket #${ticketNum} submitted successfully! The Trust Administration has been notified.`
            : (res.data.message || 'Grievance submitted successfully!')
        );
        setForm({
          category: CATEGORIES[0],
          subject: '',
          message: ''
        });
        removeSelectedFile();
        
        // Optimistically update list and refresh from server
        if (res.data.grievance) {
          setGrievances(prev => [res.data.grievance, ...prev.filter(g => g._id !== res.data.grievance._id)]);
        }
        await loadGrievances(true);
      } else {
        setErrorMsg(res.data?.message || 'Failed to submit grievance.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error submitting grievance.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = grievances.length;
    const pending = grievances.filter(g => g.status === 'pending').length;
    const inProgress = grievances.filter(g => g.status === 'in_progress').length;
    const resolved = grievances.filter(g => g.status === 'resolved').length;
    return { total, pending, inProgress, resolved };
  }, [grievances]);

  const filteredGrievances = grievances.filter(g => {
    if (activeFilter === 'all') return true;
    return g.status === activeFilter;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* ----------------- 1. TOP HEADER BANNER ----------------- */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            <FiShield className="w-3.5 h-3.5 text-red-600" />
            <span>Direct Trustee Redressal Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Grievance Redressal &amp; Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl">
            Have an issue with your Member ID Card, Appointment Letter, 80G Tax Receipt, or Volunteer Wing drive?
            Submit a ticket directly to Trust Leadership for priority resolution.
          </p>
        </div>

        {/* User Identity Chip & Refresh Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-xs">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Active Profile</span>
            <span className="font-black text-black truncate block max-w-[170px]">
              {currentUser?.name || 'Verified User'}
            </span>
          </div>

          <button
            onClick={() => loadGrievances(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition border border-slate-300 shadow-2xs cursor-pointer"
            title="Refresh Inquiries"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-red-600' : 'text-slate-600'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* ----------------- 2. FIRST ELEMENT: SUBMISSION FORM (FULL WIDTH SPACIOUS CARD) ----------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-lg border border-red-200 shadow-2xs">
              <FiMessageSquare className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-black">Submit New Grievance / Inquiry</h2>
              <p className="text-xs text-slate-600 font-medium">
                Fill out the details below. Our administrative desk responds within 24-48 working hours.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
            <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Confidential
          </span>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-black text-emerald-950 block">Ticket Registered Successfully</span>
                <span>{successMsg}</span>
              </div>
            </div>
            <button
              onClick={() => setSuccessMsg('')}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-sm shrink-0 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <FiAlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-rose-950 block">Unable to Submit</span>
                <span>{errorMsg}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-rose-700 hover:text-rose-900 font-bold text-sm shrink-0 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="font-bold text-black block mb-1.5">
                Inquiry Category <span className="text-red-600">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="font-bold text-black block mb-1.5">
                Subject Summary <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Spelling error in Name on official ID Card"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white font-medium"
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-black">
                Detailed Description / Problem Statement <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">
                {form.message.length} characters
              </span>
            </div>
            <textarea
              required
              rows={4}
              placeholder="Explain what assistance or correction is needed in detail. Mention correct spelling, transaction dates, or specific issues..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed text-black bg-white font-medium"
            />
          </div>

          {/* Photo / Video / Document Upload Box */}
          <div>
            <label className="font-bold text-black block mb-1">
              Attach Supporting Photo / Video Proof (Optional)
            </label>
            <p className="text-[11px] text-slate-600 mb-2">
              Attach a screenshot, transaction receipt, ID photo, or short video clip (Supported: JPG, PNG, WEBP, MP4, MOV, PDF up to 15MB).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="grievance-file-upload-input"
            />

            {!selectedFile ? (
              <label
                htmlFor="grievance-file-upload-input"
                className="flex flex-col sm:flex-row items-center justify-center gap-3 p-5 border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl bg-slate-50/70 hover:bg-red-50/30 cursor-pointer transition text-center sm:text-left group"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition shadow-xs">
                  <FiUploadCloud className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <span className="text-xs font-black text-black block">
                    Click to browse and upload Image or Video proof
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Upload ID card screenshot, bank UTR proof, or video testimony
                  </span>
                </div>
              </label>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    {fileType === 'video' ? (
                      <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                        <FiVideo className="w-5 h-5" />
                      </div>
                    ) : fileType === 'image' ? (
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                        <FiImage className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                        <FiFileText className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-black text-black block truncate max-w-sm" title={selectedFile.name}>
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {fileType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="text-slate-500 hover:text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-50 text-xs font-bold transition flex items-center gap-1 border border-slate-200"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Image Live Preview */}
                {fileType === 'image' && filePreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-white flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filePreview}
                      alt="Selected upload preview"
                      className="max-h-44 object-contain rounded-xl"
                    />
                  </div>
                )}

                {/* Video Live Preview */}
                {fileType === 'video' && filePreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-52 bg-black">
                    <video
                      src={filePreview}
                      controls
                      className="max-h-52 w-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <FiHelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Replies and resolution notes will appear in your past enquiries history below.</span>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer shrink-0"
            >
              {submitting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket &amp; Evidence...</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>
                    {!isFormValid 
                      ? 'Fill Subject & Description to Submit' 
                      : (selectedFile ? 'Submit Inquiry with Media' : 'Submit Grievance Ticket')}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ----------------- 3. SECOND ELEMENT: PAST ENQUIRIES & GRIEVANCES HISTORY (GOOD DESIGN) ----------------- */}
      <div className="space-y-6">
        {/* History Section Header & Summary Stats */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black tracking-tight">
                  Your Past Enquiries &amp; Grievances
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-100 text-red-800">
                  {stats.total} {stats.total === 1 ? 'Record' : 'Records'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Real-time tracking of inquiry tickets, attached evidence, and official administrative answers.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto">
              {[
                { key: 'all', label: 'All', count: stats.total },
                { key: 'pending', label: 'Pending', count: stats.pending },
                { key: 'in_progress', label: 'In Progress', count: stats.inProgress },
                { key: 'resolved', label: 'Resolved', count: stats.resolved }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === key
                      ? 'bg-white text-black shadow-2xs'
                      : 'text-slate-600 hover:text-black hover:bg-white/60'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeFilter === key ? 'bg-slate-200 text-black' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4 Quick Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Tickets</span>
              <span className="text-lg font-black text-black block mt-0.5">{stats.total}</span>
              <span className="text-[10px] text-slate-500 font-medium">All time raised</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-700 block">Pending Review</span>
              <span className="text-lg font-black text-amber-900 block mt-0.5">{stats.pending}</span>
              <span className="text-[10px] text-amber-700 font-medium">In administrative queue</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
              <span className="text-[10px] font-bold uppercase text-blue-700 block">In Progress</span>
              <span className="text-lg font-black text-blue-900 block mt-0.5">{stats.inProgress}</span>
              <span className="text-[10px] text-blue-700 font-medium">Under active audit</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">Resolved / Redressed</span>
              <span className="text-lg font-black text-emerald-900 block mt-0.5">{stats.resolved}</span>
              <span className="text-[10px] text-emerald-700 font-medium">Solution provided</span>
            </div>
          </div>
        </div>

        {/* Tickets Cards Listing */}
        {loading ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center shadow-xs">
            <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-slate-700">Loading your enquiries history...</p>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center shadow-xs space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto text-2xl border border-slate-200 shadow-inner">
              <FiInbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-black text-black">
              {activeFilter === 'all' ? 'No Enquiries or Grievances Found' : `No ${activeFilter.replace('_', ' ')} Tickets`}
            </h3>
            <p className="text-xs text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              {activeFilter === 'all'
                ? 'You have not submitted any complaints or helpdesk tickets yet. Use the form above to submit your inquiry with optional photo or video proof.'
                : `There are currently no tickets matching the "${activeFilter.replace('_', ' ')}" status filter.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGrievances.map((g) => {
              const hasVideo = !!g.videoUrl || (g.attachment && /\.(mp4|webm|mov|mkv)$/i.test(g.attachment));
              const hasImage = !!g.imageUrl || (g.attachment && /\.(png|jpe?g|gif|webp)$/i.test(g.attachment));
              const mediaUrl = g.videoUrl || g.imageUrl || g.attachment;

              return (
                <div
                  key={g._id || g.ticketNumber}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-4"
                >
                  {/* Top Bar: Ticket Number, Date, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
                        #{g.ticketNumber || 'TICKET'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(g.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      g.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : g.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {g.status === 'in_progress' ? 'In Progress' : (g.status || 'Pending')}
                    </span>
                  </div>

                  {/* Subject */}
                  <div>
                    <h3 className="text-base font-black text-black leading-snug">
                      {g.subject}
                    </h3>
                  </div>

                  {/* Message Body */}
                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Submitted Inquiry / Grievance Statement:
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {g.message || g.description}
                    </p>
                  </div>

                  {/* Attached Media Display (Image / Video) */}
                  {mediaUrl && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                        {hasVideo ? <FiVideo className="text-indigo-600" /> : <FiImage className="text-emerald-600" />}
                        <span>Attached Supporting Evidence:</span>
                      </span>

                      {hasVideo ? (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-lg bg-black">
                          <video
                            src={getContentImageUrl(mediaUrl)}
                            controls
                            className="w-full max-h-64 object-contain"
                          />
                        </div>
                      ) : hasImage ? (
                        <div className="inline-block">
                          <button
                            type="button"
                            onClick={() => setPreviewMedia({
                              url: getContentImageUrl(mediaUrl),
                              type: 'image',
                              title: g.subject
                            })}
                            className="group relative rounded-2xl overflow-hidden border border-slate-200 block shadow-2xs hover:shadow-md transition cursor-pointer max-w-md"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getContentImageUrl(mediaUrl)}
                              alt="Attached proof"
                              className="max-h-48 object-contain rounded-2xl group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <FiEye className="w-4 h-4" />
                              <span>View Full Evidence</span>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <a
                          href={getContentImageUrl(mediaUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-bold border border-slate-200 transition"
                        >
                          <FiFileText className="w-4 h-4" />
                          <span>Download / View Document Attachment</span>
                          <FiExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Admin Resolution & Reply Section */}
                  {(g.resolutionNotes || g.adminAnswer) && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-2 mt-3">
                      <div className="font-bold flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-emerald-200/60">
                        <span className="flex items-center gap-1.5 text-emerald-900 font-black">
                          <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Official Trustee Redressal &amp; Answer:</span>
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                          <span>By: {g.resolvedBy || 'Trustee Administration'}</span>
                          {g.resolvedAt && (
                            <span>• {new Date(g.resolvedAt).toLocaleDateString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed whitespace-pre-wrap">
                        {g.resolutionNotes || g.adminAnswer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ----------------- 4. FULLSCREEN MEDIA PREVIEW MODAL ----------------- */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-black text-slate-900 text-sm truncate max-w-[85%]">
                {previewMedia.title || 'Attached Evidence Proof'}
              </h4>
              <button
                onClick={() => setPreviewMedia(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewMedia.url}
                alt="Enlarged evidence"
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewMedia(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
