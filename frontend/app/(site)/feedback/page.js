'use client';

import React, { useState } from 'react';
import { FiMessageSquare, FiStar, FiPlus, FiTrash2, FiUser, FiCheckCircle } from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';

export default function FeedbackPage() {
  const { feedbacks, addFeedback, deleteFeedback, currentUser } = useNGO();
  const isAdmin = currentUser?.role === 'Admin';

  const [name, setName] = useState('');
  const [role, setRole] = useState('Donor & Well-wisher');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;
    addFeedback({
      name,
      role,
      comment,
      rating: Number(rating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setName('');
    setComment('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2 border border-red-200">
            <FiMessageSquare className="w-3.5 h-3.5 text-red-600" />
            <span>Community Voice & Trust</span>
          </div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Reviews & Donor Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-black/80 mt-1">
            Real feedback from our regular donors, volunteers, CSR partners, and community members.
          </p>
        </div>

        {/* Feedback Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto mb-12">
          <h3 className="font-extrabold text-base text-black mb-4">
            Share Your Experience or Testimonial
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl text-center text-xs">
              <FiCheckCircle className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-sm">Thank You! Your testimonial has been recorded.</div>
              <p className="text-gray-600 mt-1">Your feedback inspires our youth volunteers and helps maintain transparency.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 inline-block text-red-600 font-bold hover:underline cursor-pointer"
              >
                Submit another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-black block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Manish Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-red-500 font-medium text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Your Affiliation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Regular Donor / Volunteer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-red-500 font-medium text-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1 cursor-pointer transition ${
                        rating === star ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-xs' : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      <FiStar className={`w-3.5 h-3.5 ${rating >= star ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
                      <span>{star} Stars</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-black block mb-1">Your Feedback / Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your experience with Indian Youth Foundation's activities..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl border-gray-300 focus:outline-red-500 font-medium text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>

        {/* Feedbacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-red-300 hover:shadow-lg transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: fb.rating || 5 }).map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-black/80 leading-relaxed italic">
                  "{fb.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-extrabold text-black">{fb.name}</h4>
                  <span className="text-[11px] text-gray-500 font-medium">{fb.role} • {fb.date}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteFeedback(fb.id)}
                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete review"
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
