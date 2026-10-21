'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function GoogleTranslate() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize hidden Google Translate Element once
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'hi,en,bn,te,mr,ta,ur,gu,pa,kn,ml',
              autoDisplay: false,
            },
            'google_translate_hidden_element'
          );
        } catch (e) {
          console.error('Google Translate Init error:', e);
        }
      }
    };

    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  // Set Google translate cookie and trigger select change
  const changeLanguage = (langCode) => {
    setSelectedLang(langCode);
    setIsOpen(false);

    try {
      // Set the googtrans cookie for both root and current domain
      const cookieValue = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/;`;

      // Try directly targeting the hidden combo box
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        // If combo isn't populated yet, reload to let the cookie take effect cleanly
        window.location.reload();
      }
    } catch (err) {
      console.error('Language change error:', err);
    }
  };

  const activeLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden Official Mount Node */}
      <div id="google_translate_hidden_element" className="hidden" />

      {/* Modern Compact Custom Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 lg:py-2 rounded-full border border-slate-300 hover:border-[#0b8026] bg-slate-50 hover:bg-emerald-50/50 text-slate-800 text-md font-bold transition shadow-2xs cursor-pointer group"
        aria-label="Select Language"
      >
        <FiGlobe className="w-3.5 h-3.5 text-[#0b8026] group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-semibold">{activeLangObj.native}</span>
        <FiChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-[#0b8026] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Translate Website
          </div>
          <div className="max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-left transition cursor-pointer ${isSelected
                    ? 'bg-emerald-50 text-[#0b8026] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-black'
                    }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({lang.label})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
