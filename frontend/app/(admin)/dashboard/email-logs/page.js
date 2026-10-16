'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiMail,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiArrowLeft,
  FiSearch
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmailLogs } from '@/store/ngoSlice';

export default function EmailLogsPage() {
  const dispatch = useDispatch();
  const { emailLogs, loading } = useSelector((state) => state.ngo);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEmailLogs());
  }, [dispatch]);

  const filteredLogs = (emailLogs || []).filter(log =>
    (log.to && log.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.subject && log.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FiMail className="text-red-600 w-5 h-5" />
            Automated Email Dispatch Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit log of all 80G tax receipts, appointment letters, and certificates delivered to users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(fetchEmailLogs())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5 text-red-600" />
            <span>Refresh</span>
          </button>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-red-600 transition px-2 py-1"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by recipient email or subject..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900"
          />
        </div>
        <div className="text-xs text-slate-500 px-3 whitespace-nowrap">
          Total Logs: <strong className="text-slate-900">{filteredLogs.length}</strong>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Log ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No emails dispatched yet. As soon as you approve an application or donation, the audit record will appear here.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Delivered</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.to}</td>
                    <td className="py-3.5 px-4 text-slate-800">{log.subject}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                      {new Date(log.sentAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">{log._id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
