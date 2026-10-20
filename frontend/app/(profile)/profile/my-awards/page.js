'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiAward,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiShare2,
  FiPrinter,
  FiEye,
  FiX,
  FiHeart,
  FiUserPlus,
  FiCreditCard,
  FiExternalLink
} from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import { useNGO } from '@/context/NGOContext';
import { getContentImageUrl } from '@/lib/authApi';
import api from '@/services/api';

const TIER_THEMES = {
  Gold: {
    badgeBg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600',
    ringColor: 'border-amber-400',
    cardBorder: 'border-amber-300',
    pillBg: 'bg-amber-100 text-amber-900 border-amber-300',
    glow: 'shadow-amber-500/20 shadow-lg',
    ribbon: 'from-amber-600 to-yellow-600',
    accentText: 'text-amber-800'
  },
  Silver: {
    badgeBg: 'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500',
    ringColor: 'border-slate-300',
    cardBorder: 'border-slate-300',
    pillBg: 'bg-slate-100 text-slate-800 border-slate-300',
    glow: 'shadow-slate-400/20 shadow-md',
    ribbon: 'from-slate-600 to-slate-700',
    accentText: 'text-slate-800'
  },
  Bronze: {
    badgeBg: 'bg-gradient-to-br from-amber-700 via-orange-800 to-amber-900',
    ringColor: 'border-orange-400',
    cardBorder: 'border-orange-300',
    pillBg: 'bg-orange-100 text-orange-900 border-orange-300',
    glow: 'shadow-orange-600/20 shadow-md',
    ribbon: 'from-orange-800 to-amber-900',
    accentText: 'text-orange-900'
  },
  Platinum: {
    badgeBg: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600',
    ringColor: 'border-cyan-300',
    cardBorder: 'border-cyan-200',
    pillBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    glow: 'shadow-cyan-500/25 shadow-lg',
    ribbon: 'from-cyan-700 to-blue-800',
    accentText: 'text-cyan-900'
  },
  Diamond: {
    badgeBg: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-indigo-600',
    ringColor: 'border-purple-300',
    cardBorder: 'border-purple-200',
    pillBg: 'bg-purple-100 text-purple-900 border-purple-300',
    glow: 'shadow-purple-500/25 shadow-lg',
    ribbon: 'from-purple-700 to-indigo-800',
    accentText: 'text-purple-900'
  }
};

export default function MyAwardsPage() {
  const { currentUser, settings } = useNGO();
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const res = await api.get('/awards/my-awards');
        if (isMounted && res.data?.success) {
          setAwards(res.data.awards || []);
        }
      } catch (err) {
        console.warn('Failed to fetch personal awards:', err?.message);
        if (isMounted) setAwards([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAwards();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPoints = awards.reduce((sum, item) => sum + (item.award?.points || 0), 0);

  const handleShare = (badge) => {
    const text = `I am honored to have received the official "${badge.award?.title || 'Honor Badge'}" (${badge.badgeNumber}) from Yuva Kranti Dal for youth service and community development!`;
    if (navigator.share) {
      navigator.share({
        title: badge.award?.title,
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId(badge._id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handlePrintCitation = (badge) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const theme = TIER_THEMES[badge.award?.tier] || TIER_THEMES.Gold;
    const recipient = badge.user?.name || currentUser?.name || 'Honored Recipient';
    const awardTitle = badge.award?.title || 'Honorary Award Badge';
    const dateFormatted = new Date(badge.awardedDate || badge.createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const logoSrc = getContentImageUrl(settings?.logoUrl) || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=120';
    const presidentName = settings?.presidentName || 'Ravi Saini (National President & Board of Trustees)';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Award of Distinction - ${badge.badgeNumber}</title>
          <style>
            @page { size: landscape A4; margin: 0; }
            * { box-sizing: border-box; }
            body {
              font-family: 'Times New Roman', serif, system-ui;
              margin: 0;
              padding: 32px;
              background: #fff;
              color: #0f172a;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .cert-card {
              border: 10px double #991b1b;
              padding: 36px 48px;
              background: #fafaf9;
              max-width: 950px;
              width: 100%;
              text-align: center;
              position: relative;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #b45309;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .logo { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; }
            .org-title { font-size: 26px; font-weight: 900; color: #991b1b; margin: 0; }
            .org-sub { font-size: 12px; color: #475569; margin: 4px 0 0; }
            .badge-num { font-size: 13px; font-weight: bold; color: #b45309; font-family: monospace; margin: 8px 0; }
            .honor-title {
              font-size: 32px;
              font-weight: 900;
              color: #991b1b;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin: 12px 0 4px;
            }
            .tier-tag {
              display: inline-block;
              background: #fef3c7;
              border: 1px solid #d97706;
              color: #92400e;
              font-weight: bold;
              font-size: 12px;
              padding: 4px 16px;
              border-radius: 20px;
              margin-bottom: 16px;
            }
            .recipient-label { font-size: 14px; font-style: italic; color: #64748b; margin-bottom: 4px; }
            .recipient-name {
              font-size: 32px;
              font-weight: 900;
              color: #0f172a;
              text-decoration: underline;
              margin: 6px 0 16px;
            }
            .citation {
              font-size: 14px;
              line-height: 1.6;
              color: #334155;
              max-width: 750px;
              margin: 0 auto 24px;
              background: #fff;
              padding: 14px;
              border: 1px dashed #cbd5e1;
              border-radius: 8px;
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid #e2e8f0;
              padding-top: 18px;
            }
            .footer-col { text-align: left; font-size: 12px; color: #475569; }
            .footer-sign { text-align: right; font-size: 12px; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <div class="cert-card">
            <div class="header">
              <img src="${logoSrc}" class="logo" alt="Logo" />
              <div>
                <h1 class="org-title">${settings?.ngoName || 'YUVA KRANTI DAL'}</h1>
                <p class="org-sub">Registered Public Charitable Trust • 12A & 80G Certified • National Youth Excellence Wing</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 10px; color: #64748b;">OFFICIAL HONOR ID</div>
                <div class="badge-num">${badge.badgeNumber}</div>
              </div>
            </div>

            <div class="honor-title">${awardTitle}</div>
            <div class="tier-tag">${badge.award?.tier || 'Gold'} Tier • ${badge.award?.category || 'Youth Service'}</div>

            <div class="recipient-label">This national honor and badge of distinction is proudly presented to</div>
            <div class="recipient-name">${recipient}</div>

            <div class="citation">
              ${badge.citationReason || badge.award?.description || 'In recognition of outstanding dedication, exemplary leadership, and selfless service towards societal welfare and youth empowerment.'}
            </div>

            <div class="footer">
              <div class="footer-col">
                <strong>Date Awarded:</strong> ${dateFormatted}<br/>
                <strong>Authorized By:</strong> ${badge.awardedBy || 'National Governing Council'}
              </div>
              <div class="footer-sign">
                <div style="font-family: cursive; font-size: 18px; color: #991b1b; margin-bottom: 4px;">Ravi Saini</div>
                ${presidentName}<br/>
                <span style="font-size: 10px; font-weight: normal; color: #64748b;">National President & Board of Trustees</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* ----------------- TOP HERO BANNER ----------------- */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-900 via-red-800 to-black text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-red-950">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <FiStar className="w-3.5 h-3.5 text-amber-400" />
              <span>National Honors &amp; Recognition Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              My Awards &amp; Badges of Honor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Official distinctions conferred by the Yuva Kranti Dal Board of Trustees for exceptional leadership, social service, volunteer action, and charitable dedication.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block">Earned Badges</span>
              <span className="text-2xl font-black text-amber-400">{awards.length}</span>
            </div>
            {totalPoints > 0 && (
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center min-w-[100px]">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block">Honor Points</span>
                <span className="text-2xl font-black text-emerald-400">{totalPoints}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- AWARDS CONTENT ----------------- */}
      {loading ? (
        <div className="p-16 text-center text-xs font-bold text-black flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading your honors and badges...</span>
        </div>
      ) : awards.length === 0 ? (
        /* Empty State with Action Pathways */
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center max-w-2xl mx-auto shadow-2xs space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-200 shadow-inner">
            <FiAward className="w-10 h-10 text-amber-600" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 inline-block border border-amber-200">
              Honors Showcase
            </span>
            <h2 className="text-xl font-black text-black">
              No Award Badges Conferred Yet
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto font-medium">
              Honor badges are presented by administrators and trustees to active volunteers, lifetime members, blood donors, and project champions for outstanding dedication.
            </p>
          </div>

          {/* How to earn badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-xs font-black text-black">Volunteer in Field Drives</h3>
              <p className="text-[11px] text-slate-600 font-medium">Participate in blood camps, relief missions, and youth rallies.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-xs font-black text-black">Lead Projects</h3>
              <p className="text-[11px] text-slate-600 font-medium">Coordinate chapter activities, education campaigns, or tree plantations.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-xs font-black text-black">Patronize Causes</h3>
              <p className="text-[11px] text-slate-600 font-medium">Support community welfare drives as a recurring patron or life member.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/profile/apply-volunteer"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Apply for Field Volunteering</span>
            </Link>
            <Link
              href="/profile/apply-member"
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-md flex items-center gap-2"
            >
              <FiCreditCard className="w-4 h-4" />
              <span>Become a Life Member</span>
            </Link>
          </div>
        </div>
      ) : (
        /* ----------------- BADGES GRID ----------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((badge) => {
            const tier = badge.award?.tier || 'Gold';
            const theme = TIER_THEMES[tier] || TIER_THEMES.Gold;
            const dateStr = new Date(badge.awardedDate || badge.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={badge._id}
                className={`bg-white rounded-3xl border ${theme.cardBorder} p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl ${theme.glow}`}
              >
                {/* Top Corner Decorative Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${theme.badgeBg} opacity-10 rounded-bl-full pointer-events-none`} />

                <div>
                  {/* Badge Header Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.pillBg}`}>
                      {tier} Tier
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {badge.badgeNumber}
                    </span>
                  </div>

                  {/* Medallion Display */}
                  <div className="flex flex-col items-center text-center my-4">
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-full ${theme.badgeBg} p-1 shadow-lg flex items-center justify-center text-white ring-4 ${theme.ringColor}/30`}>
                        <div className="w-full h-full rounded-full border-2 border-white/60 flex items-center justify-center text-3xl font-black bg-white/10 backdrop-blur-xs">
                          {badge.award?.badgeIcon === 'shield' ? (
                            <FiShield className="w-10 h-10 drop-shadow" />
                          ) : badge.award?.badgeIcon === 'heart' ? (
                            <FiHeart className="w-10 h-10 drop-shadow" />
                          ) : badge.award?.badgeIcon === 'star' ? (
                            <FiStar className="w-10 h-10 drop-shadow" />
                          ) : (
                            <FiAward className="w-10 h-10 drop-shadow" />
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-amber-300 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-amber-400 uppercase tracking-widest whitespace-nowrap shadow-xs">
                        Official Badge
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-black mt-4 leading-snug">
                      {badge.award?.title || 'Honorary Award Badge'}
                    </h3>
                    <span className="text-[11px] font-bold text-red-700 mt-0.5">
                      {badge.award?.category || 'Community Service'}
                    </span>
                  </div>

                  {/* Citation narrative */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium mt-2">
                    <p className="line-clamp-3">
                      &quot;{badge.citationReason || badge.award?.description || 'Awarded for exceptional service and leadership in social welfare initiatives.'}&quot;
                    </p>
                  </div>
                </div>

                {/* Footer Controls & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 font-medium">
                    <div className="text-black font-bold">Conferred On:</div>
                    <div>{dateStr}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedAward(badge)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Inspect Citation"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handlePrintCitation(badge)}
                      className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Print Award Certificate"
                    >
                      <FiPrinter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShare(badge)}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Share Badge"
                    >
                      <FiShare2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {copiedId === badge._id && (
                  <div className="absolute inset-x-4 bottom-16 bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-xl text-center shadow-lg transition">
                    Copied award text to clipboard!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- INSPECT AWARD MODAL ----------------- */}
      {selectedAward && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-300 my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-900 to-black text-white p-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FiAward className="w-5 h-5 text-amber-400" />
                <span className="font-black text-sm">Official Conferred Honor</span>
              </div>
              <button
                onClick={() => setSelectedAward(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-3">
                <div className="relative inline-block mx-auto">
                  <div className={`w-28 h-28 rounded-full ${TIER_THEMES[selectedAward.award?.tier]?.badgeBg || 'bg-amber-500'} p-1.5 shadow-xl flex items-center justify-center text-white ring-4 border-amber-300/40`}>
                    <div className="w-full h-full rounded-full border-2 border-white/60 flex items-center justify-center text-4xl font-black bg-white/10 backdrop-blur-xs">
                      {selectedAward.award?.badgeIcon === 'shield' ? (
                        <FiShield className="w-12 h-12" />
                      ) : selectedAward.award?.badgeIcon === 'heart' ? (
                        <FiHeart className="w-12 h-12" />
                      ) : selectedAward.award?.badgeIcon === 'star' ? (
                        <FiStar className="w-12 h-12" />
                      ) : (
                        <FiAward className="w-12 h-12" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 inline-block">
                    {selectedAward.award?.tier || 'Gold'} Tier Distinction
                  </span>
                  <h2 className="text-2xl font-black text-black">
                    {selectedAward.award?.title}
                  </h2>
                  <p className="text-xs font-mono font-bold text-amber-800">
                    Badge Conformance No: {selectedAward.badgeNumber}
                  </p>
                </div>
              </div>

              {/* Recipient Details & Citation */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Official Citation of Honor</div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {selectedAward.citationReason || selectedAward.award?.description || 'Presented in high esteem for commendable service towards youth upliftment and civic betterment.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Conferred Upon</span>
                  <span className="font-black text-black">{selectedAward.user?.name || currentUser?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Conferred Date</span>
                  <span className="font-black text-black">
                    {new Date(selectedAward.awardedDate || selectedAward.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Issuing Authority</span>
                  <span className="font-bold text-slate-800">{selectedAward.awardedBy || 'National Governing Council'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Category</span>
                  <span className="font-bold text-slate-800">{selectedAward.award?.category || 'Youth Service'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handlePrintCitation(selectedAward)}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FiPrinter className="w-4 h-4" />
                  <span>Print Formal Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedAward(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
