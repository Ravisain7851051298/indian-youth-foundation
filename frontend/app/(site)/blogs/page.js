'use client';

import React, { useState } from 'react';
import { FiFileText, FiPlus, FiCalendar, FiUser, FiShare2, FiX } from 'react-icons/fa';
import { FiCalendar as FiCal, FiPlus as FiPl, FiFileText as FiFile, FiX as FiClose } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNGO } from '@/context/NGOContext';

export default function BlogsPage() {
  const { blogs, addBlog, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Editorial Desk, Indian Youth Foundation');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    await addBlog({
      title,
      titleHi: title,
      content,
      contentHi: content,
      image: image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
      author
    });
    setTitle('');
    setContent('');
    setImage('');
    setShowAdd(false);
  };

  const shareWhatsApp = (item) => {
    const text = `*${item.title}*\n${item.content}\n\nRead more at: https://bharatiyayuvakranti.org/blogs`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiFile className="w-3.5 h-3.5" />
              <span>Press Releases & Impact Articles</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              News & Media Updates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Field reports, media coverage, and editorial insights from Indian Youth Foundation.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <FiPl className="w-4 h-4" />
              <span>Publish Article</span>
            </button>
          )}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiClose className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Publish News Article</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Article Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1,500 Underprivileged Children Receive Educational Kits"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Feature Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Author / Correspondent</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Story Content *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write detailed report..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <div
              key={b._id || b.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={b.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <FiCal className="w-3 h-3 text-orange-400" />
                    <span>{b.date}</span>
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                    {b.content}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] truncate max-w-[160px] font-medium text-slate-600">{b.author}</span>
                  <button
                    onClick={() => shareWhatsApp(b)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] cursor-pointer transition"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
