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

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/grievances');
      if (res.data.success) {
        setGrievances(res.data.grievances || []);
      }
    } catch (err) {
      console.error('Failed to load grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
            <FiAlertCircle className="w-3.5 h-3.5" />
            <span>Helpdesk & Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Grievance Redressal & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit issues regarding membership cards, appointment letters, or event coordination directly to Trust leadership.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
            <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-orange-600" />
              <span>Submit New Grievance</span>
            </h2>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ID Card spelling correction"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue or assistance required in detail..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer disabled:opacity-50"
              >
                <FiSend className="w-4 h-4" />
                <span>{submitting ? 'Submitting Ticket...' : 'Submit Grievance'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* History Listing */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">Your Past Tickets & Inquiries</h2>

          {loading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-400">Loading tickets...</div>
          ) : grievances.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center shadow-sm">
              <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Open Grievances</h3>
              <p className="text-xs text-slate-500 mt-1">You have no active complaints or pending redressal requests.</p>
            </div>
          ) : (
            grievances.map((g) => (
              <div key={g._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                    #{g.ticketNumber}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    g.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : g.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 text-sm">{g.subject}</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
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

                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                  <FiClock className="w-3 h-3" />
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
