'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FiCalendar, 
  FiPlus, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle, 
  FiX, 
  FiEdit2, 
  FiTrash2, 
  FiUploadCloud,
  FiUsers,
  FiPhone,
  FiMail,
  FiUserCheck,
  FiMessageSquare,
  FiSearch,
  FiShare2
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import EventImageCarousel from '@/components/site/EventImageCarousel';
import api from '@/services/api';

export default function EventPage() {
  const { events, setEvents, addEvent, updateEvent, deleteEvent, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin';

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  // Join Event Modal State
  const [joinModalEvent, setJoinModalEvent] = useState(null);
  const [joinForm, setJoinForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [isJoining, setIsJoining] = useState(false);

  // Admin View Joined Users Modal State
  const [attendeesModalEvent, setAttendeesModalEvent] = useState(null);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [removingAttendeeId, setRemovingAttendeeId] = useState(null);

  // Form Fields for Create / Edit Event
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-14');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('Aligarh, Uttar Pradesh');
  const [locationAddress, setLocationAddress] = useState('Krishna Vihar Pala Road Aligarh, Uttar Pradesh');
  
  // Up to 5 images management
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00 AM');
    setLocation('Aligarh, Uttar Pradesh');
    setLocationAddress('Krishna Vihar Pala Road Aligarh, Uttar Pradesh');
    setExistingImages([]);
    setNewFiles([]);
    setNewFilePreviews([]);
    setImageUrlInput('');
    setFormOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingItem(evt);
    setTitle(evt.title || '');
    setDescription(evt.description || '');
    setDate(evt.date ? evt.date.slice(0, 10) : new Date().toISOString().split('T')[0]);
    setTime(evt.time || '10:00 AM');
    setLocation(evt.location || '');
    setLocationAddress(evt.locationAddress || '');
    
    // Extract up to 5 existing images
    let imgs = [];
    if (Array.isArray(evt.images) && evt.images.length > 0) {
      imgs = evt.images.filter(Boolean);
    } else if (evt.image || evt.imageUrl) {
      imgs = [evt.image || evt.imageUrl];
    }
    setExistingImages(imgs.slice(0, 5));
    setNewFiles([]);
    setNewFilePreviews([]);
    setImageUrlInput('');
    setFormOpen(true);
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentTotal = existingImages.length + newFiles.length;
    const remainingSlots = 5 - currentTotal;

    if (remainingSlots <= 0) {
      toast.error('Maximum 5 images allowed per event');
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    setNewFiles((prev) => [...prev, ...filesToAdd]);

    const previews = filesToAdd.map((file) => URL.createObjectURL(file));
    setNewFilePreviews((prev) => [...prev, ...previews]);

    if (files.length > remainingSlots) {
      toast(`Only ${remainingSlots} photo(s) added. Max 5 images limit.`);
    }

    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const currentTotal = existingImages.length + newFiles.length;
    if (currentTotal >= 5) {
      toast.error('Maximum 5 images allowed per event');
      return;
    }
    setExistingImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewFilePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim()) {
      toast.error('Title, date, and location are required');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload new image files
      const uploadedUrls = [];
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'events');
        const upRes = await api.post('/upload', formData);
        if (upRes.data?.success && upRes.data?.url) {
          uploadedUrls.push(upRes.data.url);
        }
      }

      // Combine existing and newly uploaded images (max 5)
      const finalImages = [...existingImages, ...uploadedUrls].slice(0, 5);
      const primaryImage = finalImages[0] || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800';

      const payload = {
        title: title.trim(),
        titleHi: title.trim(),
        description: description.trim(),
        descriptionHi: description.trim(),
        date,
        time,
        location: location.trim(),
        locationAddress: locationAddress.trim(),
        images: finalImages,
        image: primaryImage,
        imageUrl: primaryImage,
        isUpcoming: true
      };

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        const res = await updateEvent(id, payload);
        toast.success('Event updated successfully!');
      } else {
        await addEvent(payload);
        toast.success('New event created successfully with up to 5 photos!');
      }

      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    try {
      const id = deleteModalItem._id || deleteModalItem.id;
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      setDeleteModalItem(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete event');
    }
  };

  // Open Join Event Modal for public visitor or logged in user
  const openJoinModal = (evt) => {
    setJoinModalEvent(evt);
    setJoinForm({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      message: ''
    });
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!joinForm.name.trim() || !joinForm.phone.trim()) {
      toast.error('Full Name and Phone Number are required to join the event');
      return;
    }

    try {
      setIsJoining(true);
      const evtId = joinModalEvent._id || joinModalEvent.id;
      const res = await api.post(`/events/${evtId}/join`, joinForm);

      if (res.data?.success) {
        toast.success(res.data.message || 'Successfully joined event!');

        // Update local events state with the new attendee
        if (setEvents) {
          setEvents((prev) =>
            prev.map((e) =>
              (e._id === evtId || e.id === evtId)
                ? {
                    ...e,
                    attendees: res.data.event?.attendees || [
                      ...(e.attendees || []),
                      { name: joinForm.name, phone: joinForm.phone, email: joinForm.email, registeredAt: new Date() }
                    ],
                    attendeeCount: res.data.attendeeCount || ((e.attendees?.length || 0) + 1)
                  }
                : e
            )
          );
        }
        setJoinModalEvent(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to join event');
    } finally {
      setIsJoining(false);
    }
  };

  // Admin removes attendee
  const handleRemoveAttendee = async (attendeeId) => {
    if (!attendeesModalEvent) return;
    try {
      setRemovingAttendeeId(attendeeId);
      const evtId = attendeesModalEvent._id || attendeesModalEvent.id;
      const res = await api.delete(`/events/${evtId}/attendees/${attendeeId}`);

      if (res.data?.success) {
        toast.success('Attendee removed');
        const updatedAttendees = attendeesModalEvent.attendees.filter(
          (a) => (a._id || a.id) !== attendeeId
        );
        setAttendeesModalEvent((prev) => ({
          ...prev,
          attendees: updatedAttendees
        }));

        if (setEvents) {
          setEvents((prev) =>
            prev.map((e) =>
              (e._id === evtId || e.id === evtId)
                ? { ...e, attendees: updatedAttendees, attendeeCount: updatedAttendees.length }
                : e
            )
          );
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove attendee');
    } finally {
      setRemovingAttendeeId(null);
    }
  };

  const filteredAttendees = (attendeesModalEvent?.attendees || []).filter((att) => {
    const q = attendeeSearch.toLowerCase();
    return (
      (att.name || '').toLowerCase().includes(q) ||
      (att.phone || '').toLowerCase().includes(q) ||
      (att.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
              <FiCalendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Foundation Summits &amp; Ground Drives</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Events &amp; Community Conferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-2xl font-medium">
              Join our nationwide youth conferences, educational seminars, mega blood donation camps, and grassroots leadership workshops.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer self-start md:self-auto shrink-0"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Event (Up to 5 Photos)</span>
            </button>
          )}
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <FiCalendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-black">No upcoming events scheduled right now</h3>
            <p className="text-xs text-slate-600">
              Please check back soon or follow our social announcements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => {
              const id = evt._id || evt.id;
              const attendeeCount = evt.attendees ? evt.attendees.length : (evt.attendeeCount || 0);

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Event Image Auto Slideshow (Up to 5 Photos) */}
                    <EventImageCarousel
                      images={evt.images}
                      fallbackImage={evt.image || evt.imageUrl}
                      title={evt.title}
                      className="h-56"
                      badgeText={evt.date || 'Upcoming'}
                    />

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                          <FiUsers className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{attendeeCount} Registered</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-600 font-bold">
                          <FiClock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{evt.time || '10:00 AM'}</span>
                        </span>
                      </div>

                      <h3 className="font-black text-base text-black leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
                        {evt.description}
                      </p>

                      {/* Location & Detailed Venue Address */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-start gap-2 text-xs text-slate-700 font-semibold">
                          <FiMapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-black font-bold block">{evt.location}</span>
                            {evt.locationAddress && (
                              <span className="text-[11px] text-slate-500 font-medium block leading-snug">
                                {evt.locationAddress}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 pt-0 space-y-3">
                    <button
                      type="button"
                      onClick={() => openJoinModal(evt)}
                      className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-700/20 hover:scale-101 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FiUserCheck className="w-4 h-4" />
                      <span>Join / Register for Event</span>
                    </button>

                    {isAdmin && (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                        <button
                          type="button"
                          onClick={() => setAttendeesModalEvent(evt)}
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                        >
                          <FiUsers className="w-3.5 h-3.5" />
                          <span>View Joined Users ({attendeeCount})</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(evt)}
                            title="Edit Event"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition cursor-pointer"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteModalItem(evt)}
                            title="Delete Event"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- 1. USER JOIN EVENT REGISTRATION MODAL ---------------- */}
        {joinModalEvent && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setJoinModalEvent(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setJoinModalEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
                  <FiCalendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Official Event Attendance</span>
                </span>
                <h3 className="font-black text-xl text-black">
                  Join: {joinModalEvent.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
                  <span>📅 {joinModalEvent.date}</span>
                  <span>⏰ {joinModalEvent.time || '10:00 AM'}</span>
                  <span>📍 {joinModalEvent.location}</span>
                </div>
                {joinModalEvent.locationAddress && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Venue: {joinModalEvent.locationAddress}
                  </p>
                )}
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={joinForm.name}
                    onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={joinForm.phone}
                      onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={joinForm.email}
                      onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Note / Message (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Any questions, volunteer interest, or special requirements..."
                    value={joinForm.message}
                    onChange={(e) => setJoinForm({ ...joinForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setJoinModalEvent(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isJoining}
                    className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isJoining ? 'Confirming...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- 2. ADMIN VIEW JOINED USERS MODAL ---------------- */}
        {attendeesModalEvent && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setAttendeesModalEvent(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl relative text-black space-y-5 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setAttendeesModalEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="shrink-0 pr-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
                  <FiUsers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Joined Participants Roster</span>
                </span>
                <h3 className="font-black text-xl text-black">
                  {attendeesModalEvent.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Total Registrations: <strong className="text-emerald-800 font-black">{attendeesModalEvent.attendees?.length || 0}</strong> • {attendeesModalEvent.date} ({attendeesModalEvent.location})
                </p>
              </div>

              {/* Search Filter for Attendees */}
              <div className="relative shrink-0">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search registered attendees by name, phone, or email..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 text-black placeholder:text-slate-400 bg-slate-50"
                />
              </div>

              {/* Attendees List / Table */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {filteredAttendees.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <FiUsers className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-bold text-black">No attendees found</p>
                    <p className="text-[11px]">When users join this event, their registration details will appear here.</p>
                  </div>
                ) : (
                  filteredAttendees.map((att, idx) => {
                    const attId = att._id || att.id || idx;
                    const cleanPhone = (att.phone || '').replace(/[^0-9]/g, '');

                    return (
                      <div
                        key={attId}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-black">{att.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {att.registeredAt ? new Date(att.registeredAt).toLocaleDateString('en-IN') : 'Recent'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-[11px]">
                            <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                              <FiPhone className="w-3 h-3 text-emerald-700" />
                              <span>{att.phone}</span>
                            </span>
                            {att.email && (
                              <span className="flex items-center gap-1">
                                <FiMail className="w-3 h-3 text-slate-400" />
                                <span>{att.email}</span>
                              </span>
                            )}
                          </div>

                          {att.message && (
                            <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 mt-1">
                              "{att.message}"
                            </p>
                          )}
                        </div>

                        {/* Quick Contact & Removal Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <span>WhatsApp</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttendee(attId)}
                            disabled={removingAttendeeId === attId}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Remove Attendee"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAttendeesModalEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 3. CREATE / EDIT EVENT MODAL (UP TO 5 PHOTOS) ---------------- */}
        {formOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative text-black space-y-4 my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setFormOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-black text-lg text-black">
                  {editingItem ? 'Edit Foundation Event' : 'Create New Foundation Event'}
                </h3>
                <p className="text-xs text-slate-500">
                  Upload up to 5 photos with auto slideshow display on frontend, set venue address, and track participants.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Youth Leadership Summit 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Date *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Time</label>
                    <input
                      type="text"
                      placeholder="10:00 AM - 04:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">City / Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aligarh, Uttar Pradesh"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Detailed Venue / Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Youth Community Hall, Civil Lines"
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                    />
                  </div>
                </div>

                {/* Multiple Event Images (Up to 5) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-700 font-bold">
                      Upload Event Photos (Up to 5 Images):
                    </label>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {existingImages.length + newFiles.length} / 5 photos selected
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFilesChange}
                      disabled={existingImages.length + newFiles.length >= 5}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                    />
                    <FiUploadCloud className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                    <p className="text-xs font-bold text-black">
                      {existingImages.length + newFiles.length >= 5 ? 'Max 5 images reached' : 'Click to select multiple photos (max 5)'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP (These will automatically rotate in frontend slideshow)</p>
                  </div>

                  {/* Preview of Selected and Existing Images */}
                  {(existingImages.length > 0 || newFilePreviews.length > 0) && (
                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {existingImages.map((imgUrl, idx) => (
                        <div key={`exist-${idx}`} className="relative h-16 rounded-xl overflow-hidden border border-slate-200 group">
                          <img
                            src={imgUrl}
                            alt={`Event Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition cursor-pointer"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {newFilePreviews.map((preview, idx) => (
                        <div key={`new-${idx}`} className="relative h-16 rounded-xl overflow-hidden border-2 border-emerald-400 group">
                          <img
                            src={preview}
                            alt={`New Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewFile(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition cursor-pointer"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Or Add Photo via URL */}
                  {existingImages.length + newFiles.length < 5 && (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Or paste external photo URL..."
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Detailed Event Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about objectives, guest speakers, schedule, and participation guidelines..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-600 text-black bg-slate-50"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- 4. DELETE MODAL (ADMIN) ---------------- */}
        {deleteModalItem && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteModalItem(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
                <FiTrash2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-black">Delete Event</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <strong>{deleteModalItem.title}</strong>?
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
