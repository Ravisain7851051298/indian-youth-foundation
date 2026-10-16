'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FiImage, 
  FiVideo, 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiPlay, 
  FiX, 
  FiEye, 
  FiUploadCloud, 
  FiCalendar, 
  FiLayers,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'Child Education', label: 'Child Education' },
  { id: 'Healthcare & Blood Donation', label: 'Health & Blood Camps' },
  { id: 'Food & Ration Drives', label: 'Food & Ration Drives' },
  { id: 'Women Empowerment', label: 'Women Empowerment' },
  { id: 'Disaster Relief', label: 'Disaster Relief' },
  { id: 'Youth & Community', label: 'Youth Leadership' },
  { id: 'Tree Plantation & Green India', label: 'Green India' },
  { id: 'General', label: 'General' },
];

export default function GalleryPage() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin';

  const [activeTab, setActiveTab] = useState('all');
  const [mediaFormat, setMediaFormat] = useState('all'); // 'all' | 'photo' | 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Form State (Add / Edit)
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [mediaType, setMediaType] = useState('photo');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const filteredItems = gallery.filter((item) => {
    const isVideo =
      item.mediaType === 'video' ||
      item.category === 'video' ||
      Boolean(item.videoUrl) ||
      /\.(mp4|webm|mov)(\?.*)?$/i.test(item.url || '');

    if (mediaFormat === 'photo' && isVideo) return false;
    if (mediaFormat === 'video' && !isVideo) return false;

    if (activeTab !== 'all') {
      const cat = (item.category || '').toLowerCase();
      if (cat !== activeTab.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const caption = (item.caption || item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      return title.includes(q) || caption.includes(q) || cat.includes(q);
    }

    return true;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('photo');
    setUrl('');
    setCaption('');
    setSelectedFile(null);
    setPreviewUrl('');
    setFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setCategory(item.category || 'photo');
    setUrl(item.url || item.imageUrl || item.videoUrl || '');
    setCaption(item.caption || item.description || '');
    setSelectedFile(null);
    setPreviewUrl(item.url || item.imageUrl || '');
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
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      let mediaUrl = url;

      // Handle direct file upload if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('category', 'gallery');
        const upRes = await api.post('/upload', formData);
        if (upRes.data?.success && upRes.data?.url) {
          mediaUrl = upRes.data.url;
        }
      }

      if (!mediaUrl && category !== 'video') {
        toast.error('Please upload an image or provide an image link');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title,
        category,
        url: mediaUrl,
        imageUrl: mediaUrl,
        videoUrl: category === 'video' ? mediaUrl : '',
        caption,
        eventDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await updateGalleryItem(id, payload);
        toast.success('Gallery media updated successfully!');
      } else {
        await addGalleryItem(payload);
        toast.success('Media added to gallery successfully!');
      }

      setFormOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    try {
      const id = deleteModalItem._id || deleteModalItem.id;
      await deleteGalleryItem(id);
      toast.success('Gallery item deleted successfully');
      setDeleteModalItem(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete gallery item');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-2">
              <FiImage className="w-3.5 h-3.5 text-red-600" />
              <span>Official Media &amp; Field Archives</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Photo &amp; Video Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-2xl font-medium">
              Transparent, real-time photographic and audiovisual documentation of our grassroots drives, student scholarships, youth mentorship sessions, and disaster interventions across India.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer self-start md:self-auto shrink-0"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Media</span>
            </button>
          )}
        </div>

        {/* Search & Media Format Toolbar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search albums, activities, captions, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-red-500 font-medium text-black placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Format toggle: All | Photos | Videos */}
            <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl text-xs font-bold shadow-2xs">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'photo', label: 'Photos Only' },
                { id: 'video', label: 'Videos Only' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setMediaFormat(fmt.id)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    mediaFormat === fmt.id
                      ? 'bg-red-600 text-white font-extrabold shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-slate-500 hidden md:block">
              Showing <span className="text-black font-extrabold">{filteredItems.length}</span> items
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
            <FiLayers className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-black">No media items in this category yet</h3>
            <p className="text-xs text-slate-600">
              Check back soon for latest photographic updates or explore other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const id = item._id || item.id;
              const isVideo = item.category === 'video' || item.category === 'Video Footage' || Boolean(item.videoUrl);
              const imgSrc = getContentImageUrl(item.url || item.imageUrl);

              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Media Container */}
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      {isVideo ? (
                        item.url?.includes('embed') || item.videoUrl?.includes('embed') ? (
                          <iframe
                            src={item.url || item.videoUrl}
                            title={item.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div 
                            onClick={() => setLightboxItem(item)}
                            className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-white cursor-pointer group-hover:scale-105 transition duration-500 relative"
                          >
                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                              <FiPlay className="w-6 h-6 ml-1" />
                            </div>
                            <span className="text-xs font-bold mt-2">Play Video</span>
                          </div>
                        )
                      ) : (
                        <div 
                          className="w-full h-full cursor-pointer relative"
                          onClick={() => setLightboxItem(item)}
                        >
                          <img
                            src={imgSrc}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="p-3 rounded-full bg-white text-black shadow-lg">
                              <FiEye className="w-5 h-5 text-red-600" />
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-black font-extrabold text-[10px] shadow-xs border border-slate-200">
                        {item.category || 'Photo'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-black text-sm text-black leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      {item.caption && (
                        <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer & Admin Controls */}
                  <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold bg-slate-50/50">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.eventDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : 'Field Activity')}
                    </span>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Media Record"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-200 transition cursor-pointer"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModalItem(item)}
                          title="Delete Media Record"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition cursor-pointer"
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

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full border border-slate-200 shadow-2xl relative text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="bg-black flex items-center justify-center max-h-[70vh]">
                {lightboxItem.category === 'video' || lightboxItem.videoUrl ? (
                  <iframe
                    src={lightboxItem.url || lightboxItem.videoUrl}
                    title={lightboxItem.title}
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={getContentImageUrl(lightboxItem.url || lightboxItem.imageUrl)}
                    alt={lightboxItem.title}
                    className="max-h-[70vh] w-auto object-contain mx-auto"
                  />
                )}
              </div>

              <div className="p-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                  <span>{lightboxItem.category || 'Archive'}</span>
                </div>
                <h3 className="font-black text-lg text-black">{lightboxItem.title}</h3>
                {lightboxItem.caption && (
                  <p className="text-xs text-slate-700 leading-relaxed">{lightboxItem.caption}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Media Modal (Admin) */}
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
                  {editingItem ? 'Edit Gallery Media' : 'Add New Gallery Media'}
                </h3>
                <p className="text-xs text-slate-500">
                  Upload photographic proof or link YouTube video recordings of on-ground activities.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                  >
                    <option value="General">General Drives</option>
                    <option value="Child Education">Child Education</option>
                    <option value="Healthcare & Blood Donation">Healthcare &amp; Blood Donation</option>
                    <option value="Food & Ration Drives">Food &amp; Ration Drives</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Youth & Community">Youth &amp; Community</option>
                    <option value="Tree Plantation & Green India">Tree Plantation &amp; Green India</option>
                    <option value="Sports & Cultural">Sports &amp; Cultural</option>
                    <option value="Video Footage">Video Footage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Title / Caption *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Free Distribution of Educational Kits to 150 Children"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                  />
                </div>

                {category !== 'video' && (
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Upload Image File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <FiUploadCloud className="w-6 h-6 text-red-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-black">Click or drag image file here</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                    </div>

                    {previewUrl && (
                      <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    {category === 'video' ? 'YouTube Embed Link *' : 'Or External Image URL (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder={category === 'video' ? 'https://www.youtube.com/embed/...' : 'https://images.unsplash.com/...'}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-red-500 text-black bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Detailed Description / Location</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Organized at Govt Sr. Secondary School, Sanganer, Jaipur"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
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
                    {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload to Gallery'}
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
              <h3 className="font-black text-lg text-black">Delete Gallery Item</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to remove <strong>{deleteModalItem.title}</strong> from the public gallery?
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
