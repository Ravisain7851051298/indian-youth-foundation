'use client';

import React, { useState } from 'react';
import { FiUserCheck, FiPlus, FiTrash2, FiPhone, FiMail, FiShield, FiX } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function TeamMembersPage() {
  const { teamMembers, addTeamMember, deleteTeamMember, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');

  const defaultTeam = teamMembers?.length ? teamMembers : [
    {
      name: 'Dr. Vikram Sharma',
      role: 'Founder & National President',
      phone: '+91 98765 43210',
      email: 'president@bharatiyayuvakranti.org',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Leading youth empowerment, child literacy, and social reform movements for over 15 years.'
    },
    {
      name: 'Rajesh Kumar Verma',
      role: 'General Secretary & Executive Director',
      phone: '+91 98765 43211',
      email: 'team@bharatiyayuvakranti.org',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      bio: 'Head of state-wide execution, community field operations, and statutory transparency.'
    },
    {
      name: 'Ms. Rekha Choudhary',
      role: 'National Treasurer & Legal Compliance Head',
      phone: '+91 98765 43213',
      email: 'treasurer@bharatiyayuvakranti.org',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      bio: 'Overseeing Section 12A & 80G statutory financial audits, donor transparency, and CSR funds.'
    }
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !role) return;
    addTeamMember({
      name,
      role,
      phone,
      email,
      bio,
      photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
    });
    setName('');
    setRole('');
    setPhone('');
    setEmail('');
    setBio('');
    setPhoto('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-1">
              <FiUserCheck className="w-3.5 h-3.5" />
              <span>Leadership & Core Governance</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Management & Board Members
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Guiding visionaries, executive directors, and national policy makers of Indian Youth Foundation.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          )}
        </div>

        {/* Add Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
              <button 
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">Add Management Team Member</h3>
              <form onSubmit={handleAdd} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Vikram Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Role / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Vice President / Advisory Board"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="team@example.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brief Bio</label>
                  <textarea
                    rows={2}
                    placeholder="Short summary of background & role in NGO"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-slate-300 focus:outline-orange-500 font-medium"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaultTeam.map((m, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-slate-200 text-center hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <img
                  src={m.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                  alt={m.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto mb-5 border-4 border-orange-100 shadow-md group-hover:scale-105 transition-transform"
                />
                <h3 className="text-lg font-black text-slate-900">{m.name}</h3>
                <span className="text-xs font-bold text-orange-600 block mt-1">{m.role}</span>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed font-normal">{m.bio}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <FiPhone className="w-3.5 h-3.5 text-orange-500" />
                  <span>{m.phone}</span>
                </span>
                {isAdmin && (
                  <button
                    onClick={() => deleteTeamMember(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete member"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
