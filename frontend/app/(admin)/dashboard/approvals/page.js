'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiClock, 
  FiCreditCard, 
  FiUserCheck, 
  FiHeart, 
  FiExternalLink,
  FiAlertCircle,
  FiFileText,
  FiMail,
  FiShield
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMemberApplications, 
  fetchVolunteerApplications, 
  approveMembershipApplication, 
  rejectMembershipApplication,
  approveVolunteerApplication,
  rejectVolunteerApplication
} from '@/store/applicationSlice';
import { 
  fetchDonations, 
  approveDonation, 
  rejectDonation 
} from '@/store/donationSlice';

export default function ApprovalsPage() {
  const dispatch = useDispatch();
  const { memberApplications, volunteerApplications, loading: appLoading, successMessage: appSuccess } = useSelector((state) => state.applications);
  const { donations, loading: donLoading, successMessage: donSuccess } = useSelector((state) => state.donations);

  const [activeTab, setActiveTab] = useState('members');
  const [previewImage, setPreviewImage] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, type: '', id: '', reason: '' });
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    dispatch(fetchMemberApplications());
    dispatch(fetchVolunteerApplications());
    dispatch(fetchDonations());
  }, [dispatch]);

  const pendingMembers = memberApplications.filter(a => a.status === 'pending');
  const pendingVolunteers = volunteerApplications.filter(a => a.status === 'pending');
  const pendingDonations = donations.filter(d => d.status === 'pending');

  const handleApproveMember = async (id) => {
    try {
      const res = await dispatch(approveMembershipApplication(id)).unwrap();
      setActionNotice(res.message || 'Membership approved! Appointment letter and ID card emailed.');
      setTimeout(() => setActionNotice(null), 5000);
      dispatch(fetchMemberApplications());
    } catch (err) {
      alert(err || 'Failed to approve membership');
    }
  };

  const handleApproveVolunteer = async (id) => {
    try {
      const res = await dispatch(approveVolunteerApplication(id)).unwrap();
      setActionNotice(res.message || 'Volunteer approved! Offer letter auto-emailed.');
      setTimeout(() => setActionNotice(null), 5000);
      dispatch(fetchVolunteerApplications());
    } catch (err) {
      alert(err || 'Failed to approve volunteer');
    }
  };

  const handleApproveDonation = async (id) => {
    try {
      const res = await dispatch(approveDonation(id)).unwrap();
      setActionNotice(res.message || 'Donation verified! Official 80G Tax Receipt generated and auto-emailed.');
      setTimeout(() => setActionNotice(null), 5000);
      dispatch(fetchDonations());
    } catch (err) {
      alert(err || 'Failed to approve donation');
    }
  };

  const submitReject = async () => {
    const { type, id, reason } = rejectModal;
    try {
      if (type === 'member') {
        await dispatch(rejectMembershipApplication({ id, reason })).unwrap();
        dispatch(fetchMemberApplications());
      } else if (type === 'volunteer') {
        await dispatch(rejectVolunteerApplication({ id, reason })).unwrap();
        dispatch(fetchVolunteerApplications());
      } else if (type === 'donation') {
        await dispatch(rejectDonation({ id, reason })).unwrap();
        dispatch(fetchDonations());
      }
      setRejectModal({ open: false, type: '', id: '', reason: '' });
      setActionNotice('Application marked as rejected.');
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      alert(err || 'Error rejecting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Statutory Anti-Fraud Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FiShield className="text-orange-600 w-5 h-5" />
            <span>Trustee Approval & Statutory Verification Center</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Zero-Fraud Policy: ID cards, appointment letters, and 80G tax receipts are issued ONLY upon manual verification of bank receipts and transaction UTRs.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-bold text-slate-600 hover:text-orange-600 transition flex items-center gap-1"
        >
          ← Back to Dashboard Overview
        </Link>
      </div>

      {/* Success Notification Alert */}
      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 3 Verification Category Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition ${
            activeTab === 'members'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FiCreditCard className="w-4 h-4" />
          <span>Membership Applications</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'members' ? 'bg-orange-800 text-white' : 'bg-orange-100 text-orange-700 font-bold'
          }`}>
            {pendingMembers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition ${
            activeTab === 'volunteers'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FiUserCheck className="w-4 h-4" />
          <span>Volunteer Applications</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'volunteers' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-700 font-bold'
          }`}>
            {pendingVolunteers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition ${
            activeTab === 'donations'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <FiHeart className="w-4 h-4" />
          <span>80G Donations Pending</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'donations' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700 font-bold'
          }`}>
            {pendingDonations.length}
          </span>
        </button>
      </div>

      {/* ----------------- TAB 1: MEMBERSHIP APPLICATIONS ----------------- */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Pending Member Applications ({pendingMembers.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Approving automatically mints Member ID, dual-sided ID card, appointment letter and emails the member.
            </span>
          </div>

          {pendingMembers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                ✓
              </div>
              <h4 className="font-bold text-slate-800 text-sm">All Membership Applications Cleared</h4>
              <p className="text-xs text-slate-500 mt-1">There are no pending membership applications waiting for review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingMembers.map((app) => (
                <div 
                  key={app._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-orange-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">
                        {app.planName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        ₹{Number(app.feeAmount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Applied: {new Date(app.appliedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">{app.name}</h4>
                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span>📧 {app.email}</span>
                        <span>📱 {app.phone}</span>
                        <span>Method: {app.paymentMethod || 'UPI'}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Transaction UTR / Ref: </span>
                        <span className="font-mono font-bold text-slate-800">{app.transactionId || 'None Provided'}</span>
                      </div>
                      {app.paymentScreenshot && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(app.paymentScreenshot)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition border border-orange-200"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>View Payment Screenshot</span>
                        </button>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        Note: &ldquo;{app.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveMember(app._id)}
                      className="w-full px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Approve & Email Letter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectModal({ open: true, type: 'member', id: app._id, reason: '' })}
                      className="w-full px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <FiXCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 2: VOLUNTEER APPLICATIONS ----------------- */}
      {activeTab === 'volunteers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Pending Volunteer Applications ({pendingVolunteers.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Upon approval, official volunteer offer letter & ID badge are generated and emailed.
            </span>
          </div>

          {pendingVolunteers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                ✓
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Pending Volunteer Enrolments</h4>
              <p className="text-xs text-slate-500 mt-1">All volunteer applications have been reviewed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingVolunteers.map((app) => (
                <div 
                  key={app._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                        Volunteer Wing
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Applied: {new Date(app.appliedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">{app.name}</h4>
                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span>📧 {app.email}</span>
                        <span>📱 {app.phone}</span>
                        <span>Availability: <strong>{app.availability || 'Weekends'}</strong></span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1">
                      <p><strong>Skills & Expertise:</strong> {app.skills || 'Community Social Work'}</p>
                      <p><strong>Areas of Interest:</strong> {app.interests || 'Education & Child Welfare'}</p>
                      {app.idProofUrl && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setPreviewImage(app.idProofUrl)}
                            className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline text-xs"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View Submitted ID Document</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveVolunteer(app._id)}
                      className="w-full px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Approve & Email Offer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectModal({ open: true, type: 'volunteer', id: app._id, reason: '' })}
                      className="w-full px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <FiXCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 3: DONATIONS PENDING APPROVAL ----------------- */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Pending 80G Donations ({pendingDonations.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Verifying assigns official 80G receipt number, updates campaign total, and auto-emails receipt to donor.
            </span>
          </div>

          {pendingDonations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                ✓
              </div>
              <h4 className="font-bold text-slate-800 text-sm">All Donations Verified</h4>
              <p className="text-xs text-slate-500 mt-1">There are no pending donations awaiting verification.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingDonations.map((d) => (
                <div 
                  key={d._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Verification Pending
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Date: {new Date(d.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900">{d.donorName}</h4>
                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span>📧 {d.donorEmail}</span>
                        <span>📱 {d.donorPhone}</span>
                        <span>Donor PAN: <strong className="font-mono text-slate-800">{d.panNumber || 'NA'}</strong></span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium">Cause / Fund: </span>
                        <strong className="text-slate-800">{d.campaignTitle}</strong>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          Payment Ref: {d.paymentId || 'UPI Direct'} ({d.paymentMethod})
                        </div>
                      </div>

                      {d.paymentScreenshot && (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(d.paymentScreenshot)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition border border-blue-200"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>View Transfer Proof</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveDonation(d._id)}
                      className="w-full px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Approve & Issue 80G Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectModal({ open: true, type: 'donation', id: d._id, reason: '' })}
                      className="w-full px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <FiXCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- PAYMENT SCREENSHOT MODAL ----------------- */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <span>Payment Screenshot Proof</span>
              </h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Payment proof screenshot"
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- REJECTION REASON MODAL ----------------- */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h4 className="font-black text-slate-900 text-sm">
              Confirm Rejection & Specify Audit Reason
            </h4>
            <p className="text-xs text-slate-500">
              Please enter the reason for rejecting this application (e.g. invalid UTR, payment amount mismatch, blurry proof).
            </p>
            <textarea
              rows={3}
              value={rejectModal.reason}
              onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for audit record..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModal({ open: false, type: '', id: '', reason: '' })}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
