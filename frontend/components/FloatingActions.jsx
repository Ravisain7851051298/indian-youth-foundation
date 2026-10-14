'use client';

import React from 'react';
import Link from 'next/link';
import { FiPhone, FiGift } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNGO } from '../context/NGOContext';

export default function FloatingActions() {
  const { settings } = useNGO();
  const whatsappNum = settings?.whatsapp?.replace(/[^0-9]/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to know more about Indian Youth Foundation, social welfare initiatives, and membership.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 no-print">
      {/* Floating Call Button */}
      <a
        href={`tel:${settings?.phone || '+919876543210'}`}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/40 hover:scale-110 transition-all cursor-pointer"
        title="Call NGO Helpline"
      >
        <FiPhone className="w-5 h-5" />
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:shadow-emerald-500/40 hover:scale-110 transition-all cursor-pointer relative group"
        title="Chat with us on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
        <FaWhatsapp className="w-7 h-7" />
      </a>
    </div>
  );
}
