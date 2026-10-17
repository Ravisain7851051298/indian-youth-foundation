'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiUploadCloud,
  FiImage,
  FiVideo,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import toast from 'react-hot-toast';

export default function ManageContentPage() {
  const { settings, updateSettings, currentUser, uploadFile } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [activeTab, setActiveTab] = useState('carousel');
  const [uploadingField, setUploadingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    newsTickerText: settings?.newsTickerText || 'समस्या समाधान परिषद (SSP) में आपका स्वागत है • निःशुल्क सदस्यता एवं समाज सेवा अभियान • हेल्पलाइन: +919319698759',
    heroSlides: settings?.heroSlides || [],
    homeAboutTitle: settings?.homeAboutTitle || 'About Us',
    homeAboutStory: settings?.homeAboutStory || 'Samasya Samadhan Parishadh (SSP) is a passionate advocate for positive change, dedicated to making a tangible difference in the world. Since our inception [Year], we have been driven by a singular mission: to empower individuals and communities to thrive through sustainable development initiatives, education, healthcare access, and environmental stewardship.',
    homeOurValues: settings?.homeOurValues || 'At Samasya Samadhan Parishadh (SSP), our core values of compassion, integrity, and inclusivity guide everything we do. We believe in the power of collaboration and collective action to address pressing global challenges and create lasting impact.',
    homeOurImpact: settings?.homeOurImpact || 'Through strategic partnerships, grassroots initiatives, and the dedication of our team, we have achieved significant milestones in [mention specific areas of impact]. Our work has touched the lives of [number] individuals and continues to inspire positive change worldwide.',
    homeJoinUs: settings?.homeJoinUs || 'Join us in our mission to create a brighter, more equitable world for all. Together, we can make a difference.',
    presidentMessageTitle: settings?.presidentMessageTitle || 'President Message',
    presidentPhotoUrl: settings?.presidentPhotoUrl || '',
    presidentMessageContent: settings?.presidentMessageContent || `Dear Friends,\n\nIt is with great pride and humility that I address you as the President of Samasya Samadhan Parishadh (SSP). Since our founding 2022, our organization has been driven by a simple yet profound belief: that every individual, regardless of circumstance, deserves the opportunity to thrive.\n\nAt Samasya Samadhan Parishadh (SSP), we are not just dreamers; we are doers. We roll up our sleeves and work tirelessly to turn our vision of a better world into reality. From providing access to education and healthcare to championing environmental sustainability and social justice, our efforts are guided by a deep commitment to making a meaningful difference in the lives of others.\n\nBut we cannot do it alone. Our success is built on the support of passionate individuals like you—individuals who share our values and our vision for a brighter future. Together, we can amplify our impact and create lasting change that reverberates far beyond our borders.\n\nAs we look to the future, I am filled with hope and optimism. The challenges we face are great, but so too is our resolve to overcome them. With your continued support, I am confident that we can build a world where every person has the opportunity to flourish and thrive.\n\nThank you for your unwavering commitment to our cause. Together, we are truly making a difference.\n\nWarm regards,\n\nSamasya Samadhan Parishadh (SSP)`,
    youtubeVideos: settings?.youtubeVideos || [
      {
        title: 'समस्या समाधान परिषद (SSP) के राष्ट्रीय अध्यक्ष श्री...',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'समस्या समाधान परिषद (SSP) के सामाजिक कार्य...',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    objectives: settings?.objectives || [
      {
        title: 'SOCIAL WELFARE',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
        link: '/services'
      },
      {
        title: 'HEALTH & RESEARCH',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600',
        link: '/services'
      },
      {
        title: 'EDUCATION & TRAINING',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600',
        link: '/services'
      },
      {
        title: 'HUMAN RIGHTS',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
        link: '/who-we-are'
      },
      {
        title: 'ANTI CRIME',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        link: '/complaints'
      }
    ]
  });

  useEffect(() => {
    if (settings) {
      setForm(prev => ({
        ...prev,
        newsTickerText: settings.newsTickerText ?? prev.newsTickerText,
        heroSlides: settings.heroSlides?.length ? settings.heroSlides : prev.heroSlides,
        homeAboutTitle: settings.homeAboutTitle ?? prev.homeAboutTitle,
        homeAboutStory: settings.homeAboutStory ?? prev.homeAboutStory,
        homeOurValues: settings.homeOurValues ?? prev.homeOurValues,
        homeOurImpact: settings.homeOurImpact ?? prev.homeOurImpact,
        homeJoinUs: settings.homeJoinUs ?? prev.homeJoinUs,
        presidentMessageTitle: settings.presidentMessageTitle ?? prev.presidentMessageTitle,
        presidentPhotoUrl: settings.presidentPhotoUrl ?? prev.presidentPhotoUrl,
        presidentMessageContent: settings.presidentMessageContent ?? prev.presidentMessageContent,
        youtubeVideos: settings.youtubeVideos?.length ? settings.youtubeVideos : prev.youtubeVideos,
        objectives: settings.objectives?.length ? settings.objectives : prev.objectives
      }));
    }
  }, [settings]);

  // Robust YouTube embed URL converter
  const formatYtEmbed = (url) => {
    if (!url) return '';
    try {
      if (url.includes('embed/')) return url;
      const match = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/watch\?v=)([^#&?]*).*/);
      return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : url;
    } catch {
      return url;
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateSettings(form);
      if (res?.success) {
        toast.success('Home Page Content updated successfully!');
      } else {
        toast.error(res?.message || 'Failed to update content');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
          <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900">Administrator Access Required</h2>
          <p className="text-xs text-slate-600 mt-2">Only administrators can manage homepage content.</p>
          <Link
            href="/login"
            className="mt-5 inline-block px-5 py-2.5 bg-green-700 text-white rounded-xl text-xs font-bold"
          >
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Banner Header */}
      <div className="bg-white p-4 rounded-b-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
            Home Page Content &amp; Media Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full dynamic CMS for Hero Carousel, News Ticker, About Us, President Message, Objectives &amp; YouTube Videos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md shadow-green-700/20 transition cursor-pointer disabled:opacity-50"
          >
            <FiSave className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save All Content'}</span>
          </button>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-green-700 transition px-2 py-1"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'carousel', label: '1. Carousel Slides' },
          { id: 'ticker', label: '2. News & Updates Ticker' },
          { id: 'about', label: '3. About Us & Values' },
          { id: 'president', label: '4. President Message' },
          { id: 'objectives', label: '5. Our Objectives' },
          { id: 'youtube', label: '6. YouTube Videos' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs font-black ${
              activeTab === t.id
                ? 'bg-green-700 text-white shadow-md shadow-green-700/20'
                : 'bg-slate-100 text-slate-700 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-3 space-y-4">
        {/* TAB 1: CAROUSEL SLIDES */}
        {activeTab === 'carousel' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-sm text-black">Hero Carousel Banners</h3>
                <p className="text-xs text-slate-500">Add, edit, upload images, or delete homepage banner slides.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newSlide = {
                    title: 'Samasya Samadhan Parishad (SSP)',
                    subtitle: 'Dedicated to sustainable development initiatives, education, healthcare, and social empowerment.',
                    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920',
                    tag: 'National Social Welfare',
                    ctaPrimaryText: 'Donate Us',
                    ctaPrimaryLink: '/donation',
                    ctaSecondaryText: 'Member Apply',
                    ctaSecondaryLink: '/members',
                    highlight: 'Empowering Communities Across India'
                  };
                  setForm(prev => ({
                    ...prev,
                    heroSlides: [...prev.heroSlides, newSlide]
                  }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="space-y-5">
              {form.heroSlides.map((slide, sIdx) => (
                <div key={sIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-extrabold text-xs text-slate-800">
                      Slide #{sIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete Slide #${sIdx + 1}?`)) {
                          setForm(prev => ({
                            ...prev,
                            heroSlides: prev.heroSlides.filter((_, i) => i !== sIdx)
                          }));
                        }
                      }}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-4 space-y-2">
                      <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                        {slide.imageUrl ? (
                          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FiImage className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <label className="block cursor-pointer">
                        <span className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:text-green-700 shadow-2xs">
                          <FiUploadCloud className="w-3.5 h-3.5 text-green-700" />
                          <span>{uploadingField === `slide_${sIdx}` ? 'Uploading...' : 'Upload Image'}</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingField(`slide_${sIdx}`);
                            try {
                              const res = await uploadFile(file);
                              if (res?.success && res.url) {
                                setForm(prev => {
                                  const updated = [...prev.heroSlides];
                                  updated[sIdx] = { ...updated[sIdx], imageUrl: res.url };
                                  return { ...prev, heroSlides: updated };
                                });
                                toast.success('Image uploaded!');
                              }
                            } catch (err) {
                              toast.error('Upload failed');
                            } finally {
                              setUploadingField(null);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or Image URL"
                        value={slide.imageUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm(prev => {
                            const updated = [...prev.heroSlides];
                            updated[sIdx] = { ...updated[sIdx], imageUrl: val };
                            return { ...prev, heroSlides: updated };
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div className="md:col-span-8 space-y-2">
                      <div>
                        <label className="font-bold text-[11px] text-slate-700 block mb-0.5">Slide Title</label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm(prev => {
                              const updated = [...prev.heroSlides];
                              updated[sIdx] = { ...updated[sIdx], title: val };
                              return { ...prev, heroSlides: updated };
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[11px] text-slate-700 block mb-0.5">Slide Subtitle</label>
                        <textarea
                          rows={2}
                          value={slide.subtitle || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm(prev => {
                              const updated = [...prev.heroSlides];
                              updated[sIdx] = { ...updated[sIdx], subtitle: val };
                              return { ...prev, heroSlides: updated };
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NEWS & UPDATES TICKER */}
        {activeTab === 'ticker' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-black border-b pb-2">News &amp; Updates Marquee Ticker</h3>
            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">
                Announcement Ticker Text (displayed in red banner with scrolling animation)
              </label>
              <textarea
                rows={3}
                value={form.newsTickerText}
                onChange={(e) => setForm(prev => ({ ...prev, newsTickerText: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-green-600 bg-white"
                placeholder="Enter moving news ticker text..."
              />
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT US & VALUES */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-black border-b pb-2">About Us Section Content</h3>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Main Heading</label>
              <input
                type="text"
                value={form.homeAboutTitle}
                onChange={(e) => setForm(prev => ({ ...prev, homeAboutTitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">About Us Intro Story</label>
              <textarea
                rows={3}
                value={form.homeAboutStory}
                onChange={(e) => setForm(prev => ({ ...prev, homeAboutStory: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Our Values</label>
              <textarea
                rows={3}
                value={form.homeOurValues}
                onChange={(e) => setForm(prev => ({ ...prev, homeOurValues: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Our Impact</label>
              <textarea
                rows={3}
                value={form.homeOurImpact}
                onChange={(e) => setForm(prev => ({ ...prev, homeOurImpact: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-xs text-slate-700 block mb-1">Join Us Callout</label>
              <textarea
                rows={2}
                value={form.homeJoinUs}
                onChange={(e) => setForm(prev => ({ ...prev, homeJoinUs: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>
        )}

        {/* TAB 4: PRESIDENT MESSAGE */}
        {activeTab === 'president' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-black text-sm text-black border-b pb-2">President Message &amp; Photo</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* President Photo Upload */}
              <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-center">
                <span className="font-bold text-xs text-slate-700 block">President Photo / Official Portrait</span>
                <div className="w-44 h-44 mx-auto rounded-2xl overflow-hidden border-2 border-green-700 p-1 bg-white shadow-sm flex items-center justify-center">
                  {form.presidentPhotoUrl ? (
                    <img
                      src={getContentImageUrl(form.presidentPhotoUrl)}
                      alt="President Portrait"
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.jpeg';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FiImage className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-medium">Defaulting to Seal/Logo</span>
                    </div>
                  )}
                </div>

                <label className="block cursor-pointer">
                  <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow-sm transition">
                    <FiUploadCloud className="w-4 h-4" />
                    <span>{uploadingField === 'presidentPhoto' ? 'Uploading...' : 'Upload President Photo'}</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingField('presidentPhoto');
                      try {
                        const res = await uploadFile(file);
                        if (res?.success && res.url) {
                          setForm(prev => ({ ...prev, presidentPhotoUrl: res.url }));
                          toast.success('President Photo uploaded!');
                        } else {
                          toast.error('Upload failed');
                        }
                      } catch (err) {
                        toast.error('Upload error');
                      } finally {
                        setUploadingField(null);
                      }
                    }}
                  />
                </label>

                <input
                  type="text"
                  placeholder="Or paste Photo URL"
                  value={form.presidentPhotoUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, presidentPhotoUrl: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              {/* President Content & Title */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Section Title</label>
                  <input
                    type="text"
                    value={form.presidentMessageTitle}
                    onChange={(e) => setForm(prev => ({ ...prev, presidentMessageTitle: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">President Full Letter / Speech</label>
                  <textarea
                    rows={12}
                    value={form.presidentMessageContent}
                    onChange={(e) => setForm(prev => ({ ...prev, presidentMessageContent: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-serif leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OBJECTIVES */}
        {activeTab === 'objectives' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-sm text-black">Our Objectives Cards (5 Pillars)</h3>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    objectives: [
                      ...prev.objectives,
                      {
                        title: 'NEW OBJECTIVE',
                        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
                        link: '/services'
                      }
                    ]
                  }));
                }}
                className="flex items-center gap-1 px-3 py-1 bg-green-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                <FiPlus className="w-3 h-3" />
                <span>Add Objective</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {form.objectives.map((obj, oIdx) => (
                <div key={oIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-700">#{oIdx + 1} {obj.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          objectives: prev.objectives.filter((_, i) => i !== oIdx)
                        }));
                      }}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    <img src={obj.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>

                  <label className="block cursor-pointer">
                    <span className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 hover:text-green-700 shadow-2xs">
                      <FiUploadCloud className="w-3 h-3 text-green-700" />
                      <span>{uploadingField === `obj_${oIdx}` ? 'Uploading...' : 'Upload Image'}</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingField(`obj_${oIdx}`);
                        try {
                          const res = await uploadFile(file);
                          if (res?.success && res.url) {
                            setForm(prev => {
                              const updated = [...prev.objectives];
                              updated[oIdx] = { ...updated[oIdx], imageUrl: res.url };
                              return { ...prev, objectives: updated };
                            });
                            toast.success('Image uploaded!');
                          }
                        } catch (err) {
                          toast.error('Upload failed');
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Title"
                    value={obj.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm(prev => {
                        const updated = [...prev.objectives];
                        updated[oIdx] = { ...updated[oIdx], title: val };
                        return { ...prev, objectives: updated };
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold uppercase bg-white"
                  />

                  <input
                    type="text"
                    placeholder="Link (e.g. /services)"
                    value={obj.link || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm(prev => {
                        const updated = [...prev.objectives];
                        updated[oIdx] = { ...updated[oIdx], link: val };
                        return { ...prev, objectives: updated };
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: YOUTUBE VIDEOS */}
        {activeTab === 'youtube' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-sm text-black">YouTube Embedded Videos</h3>
              <button
                type="button"
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    youtubeVideos: [
                      ...prev.youtubeVideos,
                      {
                        title: 'New YouTube Video',
                        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                      }
                    ]
                  }));
                }}
                className="flex items-center gap-1 px-3 py-1 bg-green-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                <FiPlus className="w-3 h-3" />
                <span>Add Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.youtubeVideos.map((vid, vIdx) => (
                <div key={vIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-800">Video #{vIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          youtubeVideos: prev.youtubeVideos.filter((_, i) => i !== vIdx)
                        }));
                      }}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="aspect-16/9 rounded-xl overflow-hidden bg-black border border-slate-300 relative">
                    {formatYtEmbed(vid.url) ? (
                      <iframe
                        src={formatYtEmbed(vid.url)}
                        title={vid.title || `Video ${vIdx + 1}`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs p-4 text-center">
                        Enter a YouTube video URL below to preview
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-[11px] text-slate-700 block mb-0.5">Video Title</label>
                    <input
                      type="text"
                      placeholder="e.g. समस्या समाधान परिषद (SSP) कार्य..."
                      value={vid.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm(prev => {
                          const updated = [...prev.youtubeVideos];
                          updated[vIdx] = { ...updated[vIdx], title: val };
                          return { ...prev, youtubeVideos: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[11px] text-slate-700 block mb-0.5">
                      YouTube URL (Watch link, Share link, or Embed URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={vid.url || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm(prev => {
                          const updated = [...prev.youtubeVideos];
                          updated[vIdx] = { ...updated[vIdx], url: val };
                          return { ...prev, youtubeVideos: updated };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-xs shadow-lg shadow-green-700/25 transition cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Home Page Content'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
