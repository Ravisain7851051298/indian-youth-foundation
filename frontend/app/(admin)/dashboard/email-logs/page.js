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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-black flex items-center gap-2">
            <FiMail className="text-red-600 w-5 h-5" />
            <span>Automated Email Dispatch Audit Trail</span>
          </h2>
          <p className="text-xs text-gray-700 mt-1 font-medium">
            Real-time audit log of all 80G tax receipts, appointment letters, and certificates delivered to users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(fetchEmailLogs())}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-black border border-slate-200 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FiRefreshCw className="w-3.5 h-3.5 text-red-600" />
            <span>Refresh Logs</span>
          </button>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-black hover:text-red-600 transition"
          >
            ← Overview
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by recipient email or subject..."
          className="w-full text-xs pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs text-black"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
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
            <tbody className="divide-y divide-slate-100 font-medium text-black">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No emails dispatched yet. As soon as you approve an application or donation, the audit record will appear here.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-red-50/30 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Delivered</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-black">{log.to}</td>
                    <td className="py-3.5 px-4 text-black">{log.subject}</td>
                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap text-[11px]">
                      {new Date(log.sentAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500">{log._id}</td>
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
