'use client';

import React from 'react';
import { FiCheckCircle, FiChevronRight } from 'react-icons/fi';

/**
 * Parses and cleanly renders dynamic markdown-like CMS text with headings,
 * bullet lists, numbered lists, bold text, and paragraphs.
 */
export default function ContentRenderer({ content, className = '' }) {
  if (!content || typeof content !== 'string') return null;

  const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Split content into major blocks separated by blank lines
  const blocks = content.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  let sectionCounter = 0;

  return (
    <div className={`space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        // Block is an H1 or H2 heading (starts with # or ##)
        if (block.startsWith('# ') || block.startsWith('## ')) {
          sectionCounter += 1;
          const headingText = block.replace(/^#{1,2}\s+/, '');
          return (
            <div key={bIdx} className="pt-3 border-t border-slate-100 first:border-0 first:pt-0">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs shadow-red-600/30">
                  {sectionCounter}
                </span>
                <span>{renderFormattedText(headingText)}</span>
              </h2>
            </div>
          );
        }

        // Block is an H3 heading (starts with ###)
        if (block.startsWith('### ')) {
          const headingText = block.replace(/^###\s+/, '');
          return (
            <h3 key={bIdx} className="text-sm sm:text-base font-bold text-slate-900 pt-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded-full inline-block" />
              <span>{renderFormattedText(headingText)}</span>
            </h3>
          );
        }

        // Block is a list (all or most lines start with - or *)
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        const isBulletList = lines.every(l => l.startsWith('- ') || l.startsWith('* '));
        const isNumberedList = lines.every(l => /^\d+\.\s+/.test(l));

        if (isBulletList) {
          return (
            <ul key={bIdx} className="space-y-2 pl-1">
              {lines.map((line, lIdx) => {
                const itemText = line.replace(/^[-*]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-slate-700">
                    <FiChevronRight className="w-3.5 h-3.5 text-red-600 mt-1 shrink-0" />
                    <span className="leading-relaxed">{renderFormattedText(itemText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={bIdx} className="space-y-2 pl-1">
              {lines.map((line, lIdx) => {
                const itemText = line.replace(/^\d+\.\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-slate-700">
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {lIdx + 1}
                    </span>
                    <span className="leading-relaxed">{renderFormattedText(itemText)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Blockquote
        if (block.startsWith('> ')) {
          const quoteText = block.replace(/^>\s+/, '').replace(/\n>\s+/g, '\n');
          return (
            <div key={bIdx} className="p-4 rounded-2xl bg-red-50/70 border-l-4 border-red-600 text-slate-800 italic">
              {renderFormattedText(quoteText)}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={bIdx} className="text-slate-700 leading-relaxed font-normal">
            {renderFormattedText(block)}
          </p>
        );
      })}
    </div>
  );
}
