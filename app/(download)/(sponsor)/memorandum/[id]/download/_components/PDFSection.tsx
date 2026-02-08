"use client";

import React from "react";

/* ========================================
   PDF SECTION WRAPPER
   ========================================
   Each section starts on a new page via print-page-break.
   Content within avoids splitting via print-avoid-break.
   Borders are omitted for clean PDF output.
======================================== */

interface PDFSectionProps {
  sectionNumber: number;
  title: string;
  children: React.ReactNode;
  /** If true, this section does NOT force a new page (use for combining sections) */
  noPageBreak?: boolean;
}

const PDFSection: React.FC<PDFSectionProps> = ({
  sectionNumber,
  title,
  children,
  noPageBreak = false,
}) => {
  return (
    <section
      className={`bg-white ${noPageBreak ? "" : "print-page-break"}`}
      style={
        noPageBreak ? {} : { pageBreakBefore: "always", breakBefore: "page" }
      }
    >
      {/* Section Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="h-1 w-10 rounded"
            style={{ backgroundColor: "#0D4DA5" }}
          />
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "#0D4DA5" }}
          >
            Section {sectionNumber}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div
          className="h-[3px] w-16 rounded mt-1"
          style={{ backgroundColor: "#0D4DA5" }}
        />
      </div>

      {/* Section Content — no borders, no shadow */}
      <div className="text-gray-700 text-[11px] leading-relaxed">
        {children}
      </div>
    </section>
  );
};

export default PDFSection;
