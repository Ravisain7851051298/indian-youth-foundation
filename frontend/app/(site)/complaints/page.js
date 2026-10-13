'use client';

import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiSend, FiUser, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function ComplaintsPage() {
  const { complaints, addComplaint, updateComplaintStatus, currentUser } = useNGO();
  const isAdminOrTeam = currentUser?.role === 'Admin' || currentUser?.role === 'TeamMember';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [memberId, setMemberId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Admin resolution state
  const [resolvingId, setResolvingId] = useState(null);
  const [resNote, setResNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !subject || !description) return;
    await addComplaint({
      memberName: name,
      memberPhone: phone,
      memberEmail: email,
      memberId,
      subject,
      description
    });
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMemberId('');
    setSubject('');
    setDescription('');
  };

  const handleResolve = async (id) => {
    if (!resNote) return;
    await updateComplaintStatus(id, 'resolved', resNote);
    setResolvingId(null);
    setResNote('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
            <FiAlertCircle className="w-3.5 h-3.5" />
            <span>Public Grievance & Inquiries</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Grievance Redressal & Help Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Members, volunteers, and citizens can submit inquiries, local issues, or assistance requests.
          </p>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-12">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center">
              <FiCheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-extrabold text-base">Your grievance / inquiry has been registered successfully!</h3>
              <p className="text-xs mt-1 text-emerald-700">Our core management team will investigate and follow up shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Membership ID (If Registered)</label>
                  <input
                    type="text"
                    placeholder="e.g. BYK-MEM-101"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject / Issue Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Request to establish local tailoring training unit"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description of Problem / Request *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe the exact details, location, and requirement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-orange-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <FiSend className="w-4 h-4" />
                <span>Submit Grievance / Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Complaints Status & List */}
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <FiClock className="text-orange-500" />
            <span>Recently Tracked Inquiries & Status</span>
          </h2>

          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">{c.subject}</span>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      c.status === 'resolved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : (c.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')
                    }`}>
                      {c.status === 'resolved' ? 'Resolved' : (c.status === 'in_progress' ? 'Under Review' : 'Pending')}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{c.description}</p>
                  <div className="text-[11px] text-slate-400 mt-2 font-medium">
                    Reported by: <strong className="text-slate-700">{c.memberName}</strong> ({c.memberPhone}) | ID: {c.memberId || 'General Public'}
                  </div>

                  {c.resolutionNotes && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px]">
                      <strong>Management Resolution Note:</strong> {c.resolutionNotes}
                    </div>
                  )}
                </div>

                {/* If Admin or TeamMember: Resolve button */}
                {isAdminOrTeam && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    {c.status !== 'resolved' && (
                      resolvingId === c._id ? (
                        <div className="w-full flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter official resolution notes..."
                            value={resNote}
                            onChange={(e) => setResNote(e.target.value)}
                            className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                          />
                          <button
                            onClick={() => handleResolve(c._id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingId(c._id)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] transition cursor-pointer"
                        >
                          Resolve Grievance
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
