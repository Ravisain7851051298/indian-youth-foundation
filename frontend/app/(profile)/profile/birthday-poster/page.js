'use client';

import React, { useRef } from 'react';
import { FiGift, FiPrinter, FiShare2, FiHeart } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function ProfileBirthdayPosterPage() {
  const { currentUser, settings } = useNGO();
  const posterRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const shareText = `Wishing a very Happy Birthday to ${currentUser?.name} (${currentUser?.designation || 'Member'}), Indian Youth Foundation (भारतीय युवा क्रांति)! 🎂🎉`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
            <FiGift className="w-3.5 h-3.5" />
            <span>Celebrations & Greetings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official Birthday Celebration Poster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized greeting card and social media banner designed with official Trust branding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <FiShare2 className="w-4 h-4 text-emerald-600" />
            <span>Share on WhatsApp</span>
          </a>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print Poster</span>
          </button>
        </div>
      </div>

      {/* The Printable Poster Container */}
      <div className="flex justify-center">
        <div
          ref={posterRef}
          className="w-full max-w-lg bg-gradient-to-b from-orange-600 via-amber-600 to-slate-900 text-white rounded-3xl shadow-2xl p-8 relative overflow-hidden border-4 border-amber-300/40"
        >
          {/* Decorative Sparkles & Rings */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Branding */}
          <div className="text-center pb-6 border-b border-white/20 relative z-10">
            <span className="text-[11px] font-black tracking-widest uppercase text-amber-200">
              {settings?.ngoName || 'INDIAN YOUTH FOUNDATION'}
            </span>
            <h2 className="text-xl font-black mt-0.5 tracking-tight text-white drop-shadow">
              {settings?.ngoNameHi || 'भारतीय युवा क्रांति'}
            </h2>
            <p className="text-[10px] text-amber-100 italic mt-1">
              &quot;सशक्त युवा, समर्थ भारत&quot; • राष्ट्र सेवा सर्वोपरि
            </p>
          </div>

          {/* Central Birthday Greeting */}
          <div className="text-center my-8 relative z-10 space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-wider text-amber-200">
              🎂 जन्मदिवस की हार्दिक शुभकामनाएं 🎂
            </div>

            <div className="relative inline-block mx-auto">
              <div className="w-36 h-36 rounded-full border-4 border-amber-300 p-1 bg-white/20 shadow-2xl mx-auto overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-lg shadow-lg">
                🎉
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                {currentUser?.name}
              </h3>
              <p className="text-sm font-bold text-amber-200 mt-0.5">
                {currentUser?.designation || 'सक्रिय सदस्य (Active Member)'}
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-black/30 border border-white/10 text-[11px] font-mono text-slate-200">
                Member ID: {currentUser?.memberId || 'BYK-MEMBER'}
              </div>
            </div>

            <p className="text-xs text-amber-100 max-w-sm mx-auto leading-relaxed pt-2">
              ईश्वर से आपके उत्तम स्वास्थ्य, दीर्घायु एवं यशस्वी जीवन की मंगल कामना करते हैं। समाज सेवा और राष्ट्र निर्माण में आपका योगदान सदैव प्रेरणादायक बना रहे।
            </p>
          </div>

          {/* Footer Wishes & Seal */}
          <div className="pt-6 border-t border-white/20 flex items-center justify-between text-[11px] relative z-10">
            <div>
              <div className="font-extrabold text-amber-200">शुभेच्छु:</div>
              <div className="font-bold text-white text-xs">समस्त पदाधिकारी एवं कार्यकर्ता</div>
              <div className="text-[10px] text-slate-300">भारतीय युवा क्रांति, प्रधान कार्यालय अलीगढ़</div>
            </div>

            <div className="text-right">
              <div className="w-12 h-12 rounded-full border border-amber-300/60 bg-white/10 flex items-center justify-center ml-auto">
                <FiHeart className="w-6 h-6 text-pink-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
