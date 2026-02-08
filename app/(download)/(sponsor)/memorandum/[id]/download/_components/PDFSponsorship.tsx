"use client";

import React from "react";
import PDFSection from "./PDFSection";
import { SponsorshipData } from "@/types/memorandum-detail";

/* ========================================
   SPONSORSHIP — Print-Optimized
   ========================================
   Company card + 3 stat cards in flex row.
======================================== */

interface PDFSponsorshipProps {
  data: SponsorshipData;
}

const PDFSponsorship: React.FC<PDFSponsorshipProps> = ({ data }) => {
  return (
    <PDFSection sectionNumber={11} title="Sponsorship">
      {/* Company header */}
      <div className="flex items-center gap-4 mb-5 print-avoid-break">
        <div
          className="w-14 h-14 rounded-md flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{ backgroundColor: "#0D4DA5" }}
        >
          {data.companyName.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {data.companyName}
          </h3>
          <p className="text-[10px] text-gray-500">{data.description}</p>
        </div>
      </div>

      {/* Stat cards — flex row */}
      <div className="flex gap-4 print-avoid-break">
        <div
          className="flex-1 rounded-md px-4 py-5 text-center"
          style={{ backgroundColor: "#EFF6FF" }}
        >
          <p className="text-2xl font-bold mb-1" style={{ color: "#0D4DA5" }}>
            {data.totalAssets}
          </p>
          <p className="text-[9px] text-gray-600">
            Total Assets Under Management
          </p>
        </div>
        <div
          className="flex-1 rounded-md px-4 py-5 text-center"
          style={{ backgroundColor: "#F0FDF4" }}
        >
          <p className="text-2xl font-bold mb-1" style={{ color: "#16A34A" }}>
            {data.propertiesManaged}
          </p>
          <p className="text-[9px] text-gray-600">Properties Managed</p>
        </div>
        <div
          className="flex-1 rounded-md px-4 py-5 text-center"
          style={{ backgroundColor: "#FAF5FF" }}
        >
          <p className="text-2xl font-bold mb-1" style={{ color: "#7C3AED" }}>
            {data.yearEstablished}
          </p>
          <p className="text-[9px] text-gray-600">Year Established</p>
        </div>
      </div>
    </PDFSection>
  );
};

export default PDFSponsorship;
