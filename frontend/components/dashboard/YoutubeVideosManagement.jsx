'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiVideo,
  FiPlus,
  FiTrash2,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiArrowUp,
  FiArrowDown,
  FiPlay,
  FiExternalLink
} from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { useNGO } from '@/context/NGOContext';
import { getYoutubeEmbedUrl } from '@/lib/youtube';

export default function YoutubeVideosManagement() {
  const { settings, updateSettings } = useNGO();

  const [videos, setVideos] = useState(
    settings?.youtubeVideos && settings.youtubeVideos.length > 0
      ? settings.youtubeVideos
      : [
          {
            title: 'समस्या समाधान परिषद (SSP) के राष्ट्रीय अध्यक्ष श्री...',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          {
            title: 'समस्या समाधान परिषद (SSP) के पदाधिकारी एवं सामाजिक कार्य...',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings?.youtubeVideos && Array.isArray(settings.youtubeVideos)) {
      setVideos(settings.youtubeVideos);
    }
  }, [settings]);

  // Helper to extract clean youtube embed url
  const formatYtEmbed = (url) => getYoutubeEmbedUrl(url);

  const handleAddVideo = () => {
    setVideos([
      ...videos,
      {
        title: '',
        url: ''
      }
    ]);
  };

  const handleRemoveVideo = (index) => {
    setVideos(videos.filter((_, idx) => idx !== index));
  };

  const handleVideoChange = (index, field, value) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };
    setVideos(updated);
  };

  const handleMove = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= videos.length) return;
    const updated = [...videos];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setVideos(updated);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    // Clean videos list: filter out empty urls
    const cleanVideos = videos.filter((v) => (v.url || '').trim().length > 0);

    try {
      setIsSaving(true);
      setSavedSuccess(false);

      const res = await updateSettings({
        youtubeVideos: cleanVideos
      });

      if (res?.success) {
        setSavedSuccess(true);
        toast.success('YouTube videos saved and updated live on homepage!');
      } else {
        toast.error(res?.message || 'Failed to save videos');
      }
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 text-slate-800 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#d50000] text-xs font-black mb-2 border border-red-200">
            <FaYoutube className="w-3.5 h-3.5 text-[#d50000]" />
            <span>Homepage Video Showcase</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            YouTube Videos Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, reorder, and update YouTube video links and descriptions displayed in the video gallery on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/#youtube-videos"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>View on Home</span>
          </Link>
          <button
            type="button"
            onClick={handleAddVideo}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Video</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b8026] hover:bg-[#09661f] text-white text-xs font-black shadow-md shadow-[#0b8026]/20 transition disabled:opacity-50 cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Live'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>YouTube video links updated successfully! Changes are immediately live on the homepage.</span>
        </div>
      )}

      {/* Video Cards List */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <FaYoutube className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-900">No YouTube Videos Added</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Add your official awareness videos, speeches, and news broadcasts so visitors can watch them on the homepage.
            </p>
            <button
              type="button"
              onClick={handleAddVideo}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0b8026] text-white text-xs font-bold shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add First Video</span>
            </button>
          </div>
        ) : (
          videos.map((vid, idx) => {
            const embedSrc = formatYtEmbed(vid.url);

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-[#0b8026]/50 transition grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
              >
                {/* Video Preview on Left */}
                <div className="md:col-span-5 aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-2xs border border-slate-200">
                  {embedSrc ? (
                    <iframe
                      src={embedSrc}
                      title={vid.title || `Video Preview ${idx + 1}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                      <FaYoutube className="w-8 h-8 text-red-500 mb-1" />
                      <span>Enter video link to preview</span>
                    </div>
                  )}
                </div>

                {/* Form Inputs on Right */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Video #{idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                      >
                        <FiArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === videos.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                      >
                        <FiArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(idx)}
                        title="Delete Video"
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      Video Title / Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={vid.title}
                      onChange={(e) => handleVideoChange(idx, 'title', e.target.value)}
                      placeholder="e.g. समस्या समाधान परिषद (SSP) के राष्ट्रीय अध्यक्ष श्री..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0b8026] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      YouTube URL (Watch, Share, or Embed Link) *
                    </label>
                    <div className="relative">
                      <FaYoutube className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-600 w-4 h-4" />
                      <input
                        type="url"
                        required
                        value={vid.url}
                        onChange={(e) => handleVideoChange(idx, 'url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b8026]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {videos.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={handleAddVideo}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Another Video</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[#0b8026] hover:bg-[#09661f] text-white text-xs font-black shadow-lg shadow-[#0b8026]/20 transition disabled:opacity-50 cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All YouTube Videos'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
