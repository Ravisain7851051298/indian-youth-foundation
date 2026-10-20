'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiCalendar, 
  FiUser, 
  FiArrowLeft, 
  FiShare2, 
  FiClock, 
  FiTag, 
  FiEye,
  FiBookOpen,
  FiChevronRight
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

export default function BlogDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { blogs } = useNGO();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const blogId = resolvedParams?.id;

  useEffect(() => {
    if (!blogId) return;

    // First check existing blogs in context
    const found = blogs?.find(b => (b._id || b.id) === blogId);
    if (found) {
      setBlog(found);
      setLoading(false);
      return;
    }

    // Otherwise fetch directly from backend API
    api.get(`/news/${blogId}`)
      .then(res => {
        if (res.data?.success && (res.data?.data || res.data?.news)) {
          setBlog(res.data.data || res.data.news);
        } else if (res.data?.title) {
          setBlog(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to load news article:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [blogId, blogs]);

  const shareWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = encodeURIComponent(`📰 *${blog?.title}*\n\nRead official press release on Yuva Kranti Dal portal:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-emerald-800">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold">Loading news bulletin...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-lg">
          <FiBookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h2 className="text-xl font-black text-slate-900">Article Not Found</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            The requested news release or bulletin may have been removed or updated.
          </p>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to News &amp; Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = getContentImageUrl(blog.image || blog.imageUrl);
  const formattedDate = blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Official Update');
  const relatedBlogs = blogs?.filter(b => (b._id || b.id) !== blogId)?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
          <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
          <FiChevronRight className="w-3.5 h-3.5" />
          <Link href="/blogs" className="hover:text-emerald-700 transition">News &amp; Blogs</Link>
          <FiChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-800 truncate max-w-50 sm:max-w-xs">{blog.title}</span>
        </nav>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          
          {/* Header Metadata */}
          <div className="p-6 sm:p-10 pb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200">
                Official Press Bulletin
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <FiCalendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <FiUser className="w-3.5 h-3.5 text-emerald-700" />
                <span>{blog.author || 'Editorial Desk'}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-tight">
              {blog.title}
            </h1>
          </div>

          {/* Featured Image */}
          {imageSrc && (
            <div className="w-full max-h-115 bg-slate-100 overflow-hidden relative">
              <img
                src={imageSrc}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Body */}
          <div className="p-6 sm:p-10 pt-8 space-y-6">
            <div className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed whitespace-pre-line space-y-4">
              {blog.content || blog.description || blog.summary}
            </div>

            {/* Hindi Translation content if available */}
            {blog.contentHi && blog.contentHi !== blog.content && (
              <div className="mt-8 p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <h3 className="font-extrabold text-sm text-emerald-900 uppercase tracking-wide">
                  हिंदी विवरण (Hindi Summary)
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                  {blog.contentHi}
                </p>
              </div>
            )}

            {/* Sharing Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Share Article:</span>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200 cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>All News &amp; Updates</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Related News Cards */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12 space-y-5">
            <h3 className="text-lg font-black text-slate-900">More Updates &amp; Press Releases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedBlogs.map((item, idx) => {
                const rImg = getContentImageUrl(item.image || item.imageUrl);
                const rId = item._id || item.id;
                return (
                  <Link
                    key={rId || idx}
                    href={`/blogs/${rId}`}
                    className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {rImg && (
                        <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                          <img
                            src={rImg}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {item.content || item.summary}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 mt-3 flex items-center gap-1">
                      <span>Read Story</span>
                      <FiChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
