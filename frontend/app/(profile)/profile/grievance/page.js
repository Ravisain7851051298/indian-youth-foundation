'use client';

import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiSend, FiCheckCircle, FiClock, FiMessageSquare } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';

export default function ProfileGrievancePage() {
  const { currentUser } = useNGO();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    subject: '',
    message: ''
  });

  const isFormValid = (form.subject || '').trim().length > 0 && (form.message || '').trim().length > 0;

  useEffect(() => {
    let active = true;
    const loadGrievances = async () => {
      try {
        const res = await api.get('/grievances');
        if (active && res.data.success) {
          setGrievances(res.data.grievances || []);
        }
      } catch (err) {
        console.warn('Grievance fetch notice:', err?.response?.status || err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadGrievances();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      setErrorMsg('Please enter both subject and message description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const payload = {
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        subject: form.subject,
        message: form.message
      };

      const res = await api.post('/grievances', payload);
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Grievance submitted successfully!');
        setForm({ subject: '', message: '' });
        fetchGrievances();
      } else {
        setErrorMsg(res.data.message || 'Failed to submit grievance.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error submitting grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
            <FiAlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Helpdesk &amp; Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Grievance Redressal &amp; Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-black font-medium mt-1">
            Submit issues regarding membership cards, appointment letters, or event coordination directly to Trust leadership.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs sticky top-6">
            <h2 className="text-base font-black text-black mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-red-600" />
              <span>Submit New Grievance</span>
            </h2>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="font-bold text-black block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ID Card spelling correction"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-black bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue or assistance required in detail..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed text-black bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || submitting}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold transition flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <FiSend className="w-4 h-4" />
                <span>
                  {submitting 
                    ? 'Submitting Ticket...' 
                    : (!isFormValid 
                        ? 'Fill Subject & Description to Submit' 
                        : 'Submit Grievance')}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* History Listing */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-black text-black">Your Past Tickets &amp; Inquiries</h2>

          {loading ? (
            <div className="p-8 text-center text-xs font-bold text-black">Loading tickets...</div>
          ) : grievances.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center shadow-2xs">
              <FiCheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-sm font-black text-black">No Open Grievances</h3>
              <p className="text-xs text-black font-medium mt-1">You have no active complaints or pending redressal requests.</p>
            </div>
          ) : (
            grievances.map((g) => (
              <div key={g._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                    #{g.ticketNumber}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${g.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : g.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                    {g.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-black text-black text-sm">{g.subject}</h3>
                <p className="text-xs text-black leading-relaxed bg-slate-50 p-3 rounded-xl font-medium border border-slate-100">
                  {g.message}
                </p>

                {g.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs">
                    <div className="font-bold mb-1 flex items-center gap-1 text-[11px]">
                      <FiCheckCircle className="text-emerald-600" />
                      <span>Resolution by {g.resolvedBy || 'Trustee Redressal Officer'}:</span>
                    </div>
                    <p>{g.resolutionNotes}</p>
                  </div>
                )}

                <div className="text-[10px] text-black font-medium flex items-center gap-1 pt-1">
                  <FiClock className="w-3 h-3 text-red-600" />
                  <span>Submitted on {new Date(g.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
