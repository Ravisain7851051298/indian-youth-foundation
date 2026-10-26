'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FiUserPlus,
  FiUploadCloud,
  FiCheckCircle,
  FiCreditCard,
  FiArrowLeft,
  FiInfo,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera
} from 'react-icons/fi';
import { useNGO } from '@/context/NGOContext';
import api from '@/services/api';
import { getContentImageUrl } from '@/lib/authApi';

export default function CoordinatorAddMemberPage() {
  const router = useRouter();
  const { currentUser } = useNGO();
  const isCoordinator = currentUser?.role === 'Coordinator' || currentUser?.isCoordinator;

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '2000-01-01',
    address: '',
    district: currentUser?.district || 'Aligarh',
    state: currentUser?.state || 'Uttar Pradesh',
    designation: 'Active Social Worker',
    planId: '',
    feeAmount: 250,
    paymentMethod: 'UPI',
    utrNumber: '',
    paymentScreenshot: '',
    photoUrl: '',
    notes: ''
  });

  const [uploadingField, setUploadingField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans');
        const list = res.data?.plans || res.data?.data || [];
        setPlans(list);
        if (list.length > 0) {
          setFormData(prev => ({
            ...prev,
            planId: list[0]._id || list[0].id,
            feeAmount: list[0].price || list[0].fee || 250
          }));
        }
      } catch (err) {
        console.warn('Note fetching plans:', err.message);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan change
  const handlePlanChange = (selectedPlanId) => {
    const selected = plans.find(p => (p._id || p.id) === selectedPlanId);
    setFormData(prev => ({
      ...prev,
      planId: selectedPlanId,
      feeAmount: selected ? (selected.price || selected.fee || 250) : prev.feeAmount
    }));
  };

  // Upload file helper
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let category = 'documents';
    if (fieldName === 'photoUrl' || fieldName === 'photo') {
      category = 'profiles';
    } else if (fieldName === 'paymentScreenshot' || fieldName === 'receipt') {
      category = 'payments';
    }

    const uploadFormData = new FormData();
    uploadFormData.append('category', category);
    uploadFormData.append('file', file);

    try {
      setUploadingField(fieldName);
      let res;
      try {
        res = await api.post(`/upload?category=${category}`, uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-category': category,
            'x-upload-category': category
          }
        });
      } catch (e1) {
        res = await api.post(`/uploads?category=${category}`, uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-category': category,
            'x-upload-category': category
          }
        });
      }
      const fileUrl = res.data?.url || res.data?.fileUrl || res.data?.filePath || '';
      setFormData(prev => ({ ...prev, [fieldName]: fileUrl }));
      toast.success(`${fieldName === 'paymentScreenshot' ? 'Payment screenshot' : fieldName === 'photoUrl' ? 'Profile photo' : 'Document'} uploaded!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter the full legal name of the member.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error('Please provide at least an email or mobile phone number.');
      return;
    }
    if (!formData.planId) {
      toast.error('Please select a membership plan.');
      return;
    }
    if (!formData.utrNumber.trim() && !formData.paymentScreenshot) {
      toast.error('Payment UTR transaction number or screenshot proof is mandatory for trustee verification.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/coordinators/add-member', formData);
      toast.success(res.data?.message || 'New member application submitted! Awaiting final Trustee Admin approval.', { duration: 6000 });
      router.push('/profile/my-members');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCoordinator) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-black text-black">Coordinator Portal Access Required</h2>
        <p className="text-xs text-slate-700 font-medium">
          Only appointed Coordinators have the authority to enroll new members directly.
        </p>
        <Link href="/profile" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs inline-block">
          Return to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/profile/coordinator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:underline mb-2"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Coordinator Hub</span>
          </Link>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
            <FiUserPlus className="text-purple-700" />
            <span>Enroll New Member</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Register an executive member under your coordination. The application will be submitted directly to Trustee Administration for final verification and ID card issuance.
          </p>
        </div>

        <div className="bg-purple-100 text-purple-900 px-3.5 py-1.5 rounded-2xl border border-purple-300 text-xs font-black self-start sm:self-auto">
          Enrolling as: {currentUser?.name}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-950">
        <FiInfo className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed font-medium">
          <strong className="font-extrabold text-purple-900">Statutory Notice on Member Approvals:</strong> Members enrolled by coordinators are tagged as <span className="underline decoration-purple-600 font-bold">&quot;Added by Coordinator: {currentUser?.name}&quot;</span> in the Admin Approvals Center. The Trustee Admin will verify the payment screenshot and application details before issuing the official Member ID and dual-sided identity credentials.
        </div>
      </div>

      {/* Enrollment Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Section 1: Member Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiUser className="text-purple-700 w-4 h-4" />
            <span>1. Personal &amp; Demographic Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-black mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amit Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="member@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Designation</label>
              <input
                type="text"
                placeholder="Active Social Worker"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">District / City</label>
              <input
                type="text"
                placeholder="Aligarh"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">State</label>
              <input
                type="text"
                placeholder="Uttar Pradesh"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Street / Sector / Pin Code"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Membership Plan & Payment Verification */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiCreditCard className="text-purple-700 w-4 h-4" />
            <span>2. Membership Plan &amp; Contribution Payment</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-black mb-1">Select Membership Plan *</label>
              {plansLoading ? (
                <div className="py-2.5 text-slate-400 font-bold">Loading plans...</div>
              ) : (
                <select
                  value={formData.planId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
                >
                  {plans.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.title || p.name} (₹{p.price || p.fee || 250})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Contribution Fee (INR) *</label>
              <input
                type="number"
                required
                value={formData.feeAmount}
                onChange={(e) => setFormData({ ...formData, feeAmount: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-bold"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="Bank Transfer">NEFT / RTGS / IMPS</option>
                <option value="Cash">Cash (Collected by Coordinator)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-black mb-1">Payment UTR / Transaction Reference Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 429381749102 or CASH-RECEIPT-REF"
                value={formData.utrNumber}
                onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-1">Payment Screenshot Upload</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  id="screenshot-upload"
                  onChange={(e) => handleFileUpload(e, 'paymentScreenshot')}
                  className="hidden"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="w-full px-3 py-2.5 rounded-xl border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-800 text-center font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <FiUploadCloud className="w-4 h-4 text-purple-700" />
                  <span>{uploadingField === 'paymentScreenshot' ? 'Uploading...' : (formData.paymentScreenshot ? '✓ Screenshot Attached' : 'Attach Proof Screenshot')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Member Photograph */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiCamera className="text-purple-700 w-4 h-4" />
            <span>3. Member Formal Photograph</span>
          </h3>

          <div className="text-xs">
            <label className="block font-bold text-black mb-1">Member Passport Photo</label>
            <input
              type="file"
              accept="image/*"
              id="photo-upload"
              onChange={(e) => handleFileUpload(e, 'photoUrl')}
              className="hidden"
            />
            <label
              htmlFor="photo-upload"
              className="w-full px-3 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50 text-slate-700 font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <FiCamera className="w-4 h-4 text-purple-700" />
              <span>{uploadingField === 'photoUrl' ? 'Uploading photo...' : (formData.photoUrl ? '✓ Passport Photo Attached' : 'Upload Formal Member Photo')}</span>
            </label>
          </div>
        </div>

        {/* Section 4: Coordinator Remarks */}
        <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
          <label className="block font-bold text-black">Coordinator Notes / Recommendation</label>
          <textarea
            rows={2}
            placeholder="Special recommendation or notes regarding this member's social profile..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-black bg-slate-50 focus:outline-purple-500"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <Link
            href="/profile/coordinator"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || !!uploadingField}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-purple-700/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiCheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Enrolling & Submitting to Admin...' : 'Submit Member Application for Admin Approval'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
