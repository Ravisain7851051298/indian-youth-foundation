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
  FiUploadCloud 
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function EventPage() {
  const { events, addEvent, updateEvent, deleteEvent, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin';

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-14');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('Krishna Vihar Pala Road Aligarh, Uttar Pradesh');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00 AM');
    setLocation('Krishna Vihar Pala Road Aligarh, Uttar Pradesh');
    setImage('');
    setSelectedFile(null);
    setPreviewUrl('');
    setFormOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingItem(evt);
    setTitle(evt.title || '');
    setDescription(evt.description || '');
    setDate(evt.date ? evt.date.slice(0, 10) : new Date().toISOString().split('T')[0]);
    setTime(evt.time || '10:00 AM');
    setLocation(evt.location || '');
    setImage(evt.image || evt.imageUrl || '');
    setSelectedFile(null);
    setPreviewUrl(evt.image || evt.imageUrl || '');
    setFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim()) {
      toast.error('Title, date, and location are required');
      return;
    }

    try {
      setIsSubmitting(true);
      let mediaUrl = image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('category', 'events');
        const upRes = await api.post('/upload', formData);
        if (upRes.data?.success && upRes.data?.url) {
          mediaUrl = upRes.data.url;
        }
      }

      const payload = {
        title,
        titleHi: title,
        description,
        descriptionHi: description,
        date,
        time,
        location,
        image: mediaUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        imageUrl: mediaUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
        isUpcoming: true
      };

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await updateEvent(id, payload);
        toast.success('Event updated successfully!');
      } else {
        await addEvent(payload);
        toast.success('New event created successfully!');
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

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiCalendar className="w-3.5 h-3.5 text-red-600" />
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer self-start md:self-auto shrink-0"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Event</span>
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
              const img = getContentImageUrl(evt.image || evt.imageUrl);

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-red-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={img || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600'}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                        {evt.date || 'Upcoming'}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-black text-base text-black leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4">
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
                      <span className="flex items-center gap-1.5 truncate max-w-[170px]" title={evt.location}>
                        <FiMapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-800">
                        <FiClock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{evt.time || '10:00 AM'}</span>
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create / Edit Modal (Admin) */}
        {formOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setFormOpen(false)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative text-black space-y-4"
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
                  {editingItem ? 'Edit Official Event' : 'Create New Official Event'}
                </h3>
                <p className="text-xs text-slate-500">
                  Publish summits, youth conventions, and on-ground community drives.
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Time</label>
                    <input
                      type="text"
                      placeholder="10:00 AM - 04:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Venue / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Foundation Auditorium, Krishna Vihar, Aligarh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Upload Event Cover Photo</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud className="w-6 h-6 text-red-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-black">Click to upload photo file</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP</p>
                  </div>

                  {previewUrl && (
                    <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={getContentImageUrl(previewUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Or External Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Detailed Event Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about guests, objectives, agenda, and participation requirements..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
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
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal (Admin) */}
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
