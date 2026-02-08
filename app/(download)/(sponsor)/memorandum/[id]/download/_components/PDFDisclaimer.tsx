"use client";

import React from "react";
import PDFSection from "./PDFSection";
import { DisclaimerData } from "@/types/memorandum-detail";

/* ========================================
   DISCLAIMER — Print-Optimized
   ========================================
   Notices box + info cards in flex row.
======================================== */

interface PDFDisclaimerProps {
  data: DisclaimerData;
}

const iconEmoji: Record<string, string> = {
  lock: "🔒",
  shield: "🛡️",
  file: "📄",
};

const PDFDisclaimer: React.FC<PDFDisclaimerProps> = ({ data }) => {
  return (
    <PDFSection sectionNumber={12} title="Disclaimer & Disclosures">
      {/* Main disclaimer box */}
      <div
        className="rounded-md px-5 py-4 mb-5 print-avoid-break"
        style={{
          backgroundColor: "#FEF2F2",
          border: "1px solid #FECACA",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚠️</span>
          <span className="text-[10px] text-red-600 uppercase tracking-wider font-semibold">
            Important Notice
          </span>
        </div>

        <div className="space-y-3">
          {data.mainNotices.map((notice, i) => (
            <div key={i}>
              <h4 className="text-[11px] font-semibold text-gray-900 mb-1">
                {notice.title}
              </h4>
              <p className="text-[10px] text-gray-700 leading-relaxed">
                {notice.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info cards — flex row */}
      <div className="flex gap-4 print-avoid-break">
        {data.cards.map((card) => (
          <div
            key={card.id}
            className="flex-1 rounded-md px-4 py-4"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <span className="text-xl block mb-2">
              {iconEmoji[card.icon] || "ℹ️"}
            </span>
            <h4 className="text-[11px] font-semibold text-gray-900 mb-1">
              {card.title}
            </h4>
            <p className="text-[9px] text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </PDFSection>
  );
};

export default PDFDisclaimer;
