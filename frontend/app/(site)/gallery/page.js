'use client';

import React, { useState } from 'react';
import { FiImage, FiVideo, FiPlus, FiTrash2, FiPlay, FiX } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function GalleryPage() {
  const { gallery, addGalleryItem, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [activeTab, setActiveTab] = useState('photo'); // 'photo' or 'video'
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('photo');

  const filteredItems = gallery.filter(g => g.category === activeTab);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !url) return;
    await addGalleryItem({
      title,
      url,
      caption,
      category,
      eventDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setTitle('');
    setUrl('');
    setCaption('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiImage className="w-3.5 h-3.5" />
              <span>Visual Field Archives</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Photo & Video Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Moments of impact, youth empowerment, relief distributions, and community celebrations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-200 p-1 rounded-xl flex">
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'photo' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FiImage className="w-3.5 h-3.5" />
                <span>Photos</span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FiVideo className="w-3.5 h-3.5" />
                <span>YouTube Videos</span>
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Media</span>
              </button>
            )}
          </div>
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
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Add Media to Gallery</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Media Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  >
                    <option value="photo">Photo (Image URL)</option>
                    <option value="video">YouTube Embed Video URL</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Media Caption / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Study Kit Distribution 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {category === 'photo' ? 'Photo URL *' : 'YouTube Embed Link (e.g. https://www.youtube.com/embed/...) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={category === 'photo' ? 'https://images.unsplash.com/...' : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed Caption</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the activity..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
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
                    Upload Media
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                {item.category === 'video' ? (
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={item.url}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.caption}</p>
                  )}
                </div>
              </div>

              {item.eventDate && (
                <div className="px-5 pb-4 text-[11px] text-slate-400 border-t border-slate-50 pt-2 font-medium">
                  Date: {item.eventDate}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
