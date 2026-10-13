'use client';

import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiMapPin, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function EventPage() {
  const { events, addEvent, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-14');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('Krishna Vihar Pala Road Aligarh, Uttar Pradesh');
  const [image, setImage] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !date || !location) return;
    await addEvent({
      title,
      titleHi: title,
      description,
      descriptionHi: description,
      date,
      time,
      location,
      image: image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      isUpcoming: true
    });
    setTitle('');
    setDescription('');
    setImage('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Conferences & Ground Drives</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming & Past Events
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              National youth conventions, emergency blood donation camps, seminars, and plantation rallies.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          )}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Add Official Event</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Youth Leadership Convention 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Time</label>
                    <input
                      type="text"
                      placeholder="10:00 AM - 04:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Krishna Vihar Pala Road Aligarh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Outline the schedule, guests, and volunteer responsibilities..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => (
            <div
              key={evt._id || evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={evt.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600'}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    {evt.date}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate max-w-[160px] font-medium">{evt.location}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <FiClock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{evt.time || '10:00 AM'}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
