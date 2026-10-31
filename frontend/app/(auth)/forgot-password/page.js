'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiKey } from 'react-icons/fi';
import api from '@/services/api';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanId = (identifier || '').trim();
    if (!cleanId) {
      setError('Please enter your registered email address or mobile number.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const res = await api.post('/auth/forgot-password', {
        email: cleanId,
        identifier: cleanId
      });

      if (res.data?.success) {
        setMessage(res.data.message || 'Email ID par mail send successfully.');
      } else {
        setError(res.data?.message || 'Unable to process request.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send reset link. Please verify your details or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 shadow-lg shadow-emerald-700/10">
            <FiKey className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-3xl font-extrabold text-black tracking-tight">Forgot Password</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your registered Email or Mobile Number to reset your account password.
          </p>
        </div>

        <div className="mt-8 bg-white border border-gray-200 py-8 px-6 shadow-xl rounded-3xl sm:px-10">
          {message ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <FiCheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-extrabold text-black">Mail Sent Successfully</h3>
              
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-sm text-emerald-900 leading-relaxed font-bold">
                  {message}
                </p>
              </div>

              {/* SPAM / JUNK FOLDER NOTICE */}
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 text-xs text-amber-900 text-left space-y-1 shadow-xs">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                  <FiAlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>जरूरी सूचना: स्पैम (Spam) फ़ोल्डर चेक करें</span>
                </div>
                <p className="leading-relaxed text-[11.5px] text-amber-800">
                  Gmail सुरक्षा नियमों के कारण पासवर्ड रीसेट लिंक अक्सर <strong>Spam / Junk</strong> फ़ोल्डर में पहुँचता है। यदि Inbox में न दिखे तो कृपया अपना <strong>Spam फ़ोल्डर</strong> अवश्य देखें।
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm transition shadow-md"
                >
                  Return to Sign In
                </Link>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 block w-full py-1.5 transition cursor-pointer"
                >
                  Enter a different email or phone number
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email, 10-digit mobile, or Member ID"
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Enter either your registered email address (e.g. <code>xyz@gmail.com</code>) or your 10-digit mobile number.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-700/20 text-sm font-bold text-white bg-[#0b8026] hover:bg-[#08661e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? 'Sending Mail...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-black transition"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
