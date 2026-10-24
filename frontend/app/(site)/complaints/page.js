'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiSend, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiMessageSquare,
  FiUploadCloud,
  FiImage,
  FiVideo,
  FiX,
  FiShield,
  FiPlay
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function ComplaintsPage() {
  const { complaints, setComplaints, addComplaint, updateComplaintStatus, currentUser } = useNGO();
  const isAdminOrTeam = currentUser?.role === 'Admin' || currentUser?.role === 'TeamMember' || currentUser?.role === 'SuperAdmin';

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [memberId, setMemberId] = useState(currentUser?.membershipId || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  // Media upload states: Image & Video
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Admin resolution state
  const [resolvingId, setResolvingId] = useState(null);
  const [resNote, setResNote] = useState('');

  // Fetch grievances directly from API on mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        const list = res.data?.grievances || res.data?.data || [];
        if (Array.isArray(list) && setComplaints) {
          setComplaints(list);
        }
      } catch (err) {
        console.warn('Grievances fetch note:', err?.message);
      }
    };
    fetchComplaints();
  }, [setComplaints]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Image size exceeds 20MB limit');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 60 * 1024 * 1024) {
        toast.error('Video size exceeds 60MB limit');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !subject.trim() || !description.trim()) {
      toast.error('Name, phone number, subject, and description are required');
      return;
    }

    try {
      setIsUploading(true);
      let uploadedImageUrl = '';
      let uploadedVideoUrl = '';

      // 1. Upload Image file if selected
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('category', 'complaints');
        imgData.append('file', imageFile);
        const res = await api.post('/upload?category=complaints', imgData, {
          headers: { 'x-category': 'complaints', 'x-upload-category': 'complaints' }
        });
        if (res.data?.success && res.data?.url) {
          uploadedImageUrl = res.data.url;
        }
      }

      // 2. Upload Video file if selected
      if (videoFile) {
        const vidData = new FormData();
        vidData.append('category', 'complaints');
        vidData.append('file', videoFile);
        const res = await api.post('/upload?category=complaints', vidData, {
          headers: { 'x-category': 'complaints', 'x-upload-category': 'complaints' }
        });
        if (res.data?.success && res.data?.url) {
          uploadedVideoUrl = res.data.url;
        }
      }

      const attachments = [uploadedImageUrl, uploadedVideoUrl].filter(Boolean);

      const payload = {
        name: name.trim(),
        memberName: name.trim(),
        phone: phone.trim(),
        memberPhone: phone.trim(),
        email: email.trim(),
        memberEmail: email.trim(),
        memberId: memberId.trim(),
        subject: subject.trim(),
        message: description.trim(),
        description: description.trim(),
        imageUrl: uploadedImageUrl,
        videoUrl: uploadedVideoUrl,
        attachment: attachments[0] || '',
        attachments
      };

      const res = await api.post('/complaints', payload);
      if (res.data?.success) {
        setTicketNo(res.data.grievance?.ticketNumber || 'REGISTERED');
        setSubmitted(true);
        toast.success(res.data.message || 'Grievance submitted successfully!');

        // Update local context complaints list
        if (setComplaints) {
          setComplaints((prev) => [res.data.grievance, ...(prev || [])]);
        }

        setName(currentUser?.name || '');
        setPhone(currentUser?.phone || '');
        setEmail(currentUser?.email || '');
        setMemberId(currentUser?.membershipId || '');
        setSubject('');
        setDescription('');
        removeImage();
        removeVideo();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit grievance');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!resNote.trim()) {
      toast.error('Please enter an answer / resolution remark');
      return;
    }
    try {
      const res = await api.put(`/complaints/${id}`, {
        status: 'resolved',
        adminAnswer: resNote.trim(),
        resolutionNotes: resNote.trim(),
        resolution: resNote.trim()
      });

      if (res.data?.success) {
        toast.success('Grievance answered and marked resolved!');
        if (setComplaints) {
          setComplaints((prev) =>
            prev.map((c) => (c._id === id || c.id === id ? res.data.grievance : c))
          );
        }
        setResolvingId(null);
        setResNote('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update grievance');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <FiAlertCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Public Grievance &amp; Redressal Help Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Grievance Redressal &amp; Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Members, volunteers, and citizens can report local community issues, request emergency assistance, and attach photo or video proof.
          </p>
        </div>

        {/* Submission Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-12">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-3">
              <FiCheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-black text-lg">Your grievance has been registered successfully!</h3>
              <p className="text-xs text-emerald-700 font-medium">
                Official Ticket Number: <strong className="font-mono text-emerald-900">{ticketNo}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Our central grievance redressal board will inspect the attached evidence and post an official reply.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Submit Another Inquiry / Grievance
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium text-black bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Mobile Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium text-black bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium text-black bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Membership ID (If Applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. BYK-MEM-101"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium text-black bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Subject / Grievance Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent requirement for free medical checkup / Slum school kits"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium text-black bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Detailed Description of Problem / Request *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe the exact ground location, urgency, and background details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 font-medium text-black bg-slate-50"
                />
              </div>

              {/* ---------------- IMAGE & VIDEO FILE UPLOADS ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                {/* 1. Image Upload Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 text-center space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-black">
                      <FiImage className="w-4 h-4 text-emerald-700" />
                      <span>Attach Photo Proof (Optional)</span>
                    </span>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {imagePreview ? (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200">
                      <img src={imagePreview} alt="Proof Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <FiUploadCloud className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-slate-800 block">Click to select photo</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 20MB)</span>
                    </label>
                  )}
                </div>

                {/* 2. Video Upload Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 text-center space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-black">
                      <FiVideo className="w-4 h-4 text-emerald-700" />
                      <span>Attach Video Proof (Optional)</span>
                    </span>
                    {videoFile && (
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {videoPreview ? (
                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
                      <video src={videoPreview} controls className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <label className="block p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                      <FiUploadCloud className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-slate-800 block">Click to select video</span>
                      <span className="text-[10px] text-slate-400">MP4, WEBM, MOV (Max 60MB)</span>
                    </label>
                  )}
                </div>

              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiSend className="w-4 h-4" />
                <span>{isUploading ? 'Uploading Media & Submitting...' : 'Submit Grievance / Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* ---------------- RECENTLY TRACKED INQUIRIES & REPLIES ---------------- */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-black flex items-center gap-2">
              <FiClock className="text-emerald-700" />
              <span>Recently Tracked Inquiries &amp; Official Answers</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Total Inquiries: {complaints.length}
            </span>
          </div>

          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 text-slate-500 text-xs">
                <FiMessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-black">No grievances submitted yet</p>
                <p className="text-[11px]">Any submitted complaints and official admin replies will be displayed here.</p>
              </div>
            ) : (
              complaints.map((c) => {
                const id = c._id || c.id;
                const statusStr = (c.status || 'pending').toLowerCase();
                const isResolved = statusStr === 'resolved' || statusStr === 'closed';
                const isInProgress = statusStr === 'in_progress';

                const photoProof = c.imageUrl || (c.attachment && !c.attachment.endsWith('.mp4') ? c.attachment : '');
                const videoProof = c.videoUrl || (c.attachment && (c.attachment.endsWith('.mp4') || c.attachment.endsWith('.webm')) ? c.attachment : '');

                return (
                  <div
                    key={id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 shadow-sm transition space-y-4 text-xs"
                  >
                    {/* Top Row: Ticket & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mr-2">
                          #{c.ticketNumber || (id ? id.slice(-6).toUpperCase() : 'GRV')}
                        </span>
                        <h3 className="font-black text-sm text-black inline-block">{c.subject}</h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isInProgress
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {c.status || 'Pending Review'}
                      </span>
                    </div>

                    {/* Complainant Info & Message */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px]">
                        <span>Complainant: <strong className="text-black">{c.name || c.memberName}</strong></span>
                        {c.phone && (
                          <span>
                            Phone:{' '}
                            <strong className="text-black">
                              {isAdminOrTeam
                                ? c.phone
                                : c.phone.length > 5
                                ? `${c.phone.slice(0, 3)}****${c.phone.slice(-3)}`
                                : '******'}
                            </strong>
                          </span>
                        )}
                        {c.createdAt && <span>Date: {new Date(c.createdAt).toLocaleDateString('en-IN')}</span>}
                      </div>

                      <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        {c.description || c.message}
                      </p>
                    </div>

                    {/* Attached Photo & Video Proof Preview */}
                    {(photoProof || videoProof) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {photoProof && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                              <FiImage className="w-3 h-3 text-emerald-700" />
                              <span>Attached Photo Proof</span>
                            </span>
                            <a
                              href={getContentImageUrl(photoProof)}
                              target="_blank"
                              rel="noreferrer"
                              className="block h-36 rounded-xl overflow-hidden border border-slate-200 group relative"
                            >
                              <img
                                src={getContentImageUrl(photoProof)}
                                alt="Grievance Evidence"
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-xs">
                                Click to View Full Photo
                              </div>
                            </a>
                          </div>
                        )}

                        {videoProof && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                              <FiVideo className="w-3 h-3 text-emerald-700" />
                              <span>Attached Video Evidence</span>
                            </span>
                            <div className="h-36 rounded-xl overflow-hidden border border-slate-200 bg-black">
                              <video
                                src={getContentImageUrl(videoProof)}
                                controls
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Official Admin Answer / Resolution Box */}
                    {(c.adminAnswer || c.resolutionNotes) ? (
                      <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
                        <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold">
                          <span className="flex items-center gap-1.5">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Official Redressal Answer / Action Taken</span>
                          </span>
                          {c.resolvedBy && (
                            <span className="text-[10px] text-emerald-700">Answered by: {c.resolvedBy}</span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                          {c.adminAnswer || c.resolutionNotes}
                        </p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                        <FiClock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Awaiting management review and official board answer.</span>
                      </div>
                    )}

                    {/* Admin Inline Answer Action */}
                    {isAdminOrTeam && (
                      <div className="pt-2 border-t border-slate-100">
                        {resolvingId === id ? (
                          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                            <label className="font-bold text-black block">Write Official Answer / Resolution:</label>
                            <textarea
                              rows={3}
                              placeholder="Type administrative action taken, contact made, or resolution..."
                              value={resNote}
                              onChange={(e) => setResNote(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-black bg-white focus:outline-emerald-600 font-medium"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setResolvingId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleResolve(id)}
                                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
                              >
                                Post Answer &amp; Mark Resolved
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setResolvingId(id);
                              setResNote(c.adminAnswer || c.resolutionNotes || '');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                          >
                            <FiMessageSquare className="w-3.5 h-3.5" />
                            <span>{c.adminAnswer ? 'Update Official Answer' : 'Post Official Answer'}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
