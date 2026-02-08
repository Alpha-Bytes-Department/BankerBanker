"use client";

import React from "react";
import { PropertyStats } from "@/types/memorandum-detail";

/* ========================================
   A4 COVER PAGE — Print-Optimized
   ========================================
   A4 printable area (with 10mm margins):  ~190mm × 277mm
   At 96 DPI: ~718px × 1046px
   Cover is a single full page — page-break-after ensures the
   next section starts on a fresh page.
======================================== */

interface PDFCoverPageProps {
  presentedBy: string;
  confidential: boolean;
  investmentOpportunity: string;
  propertyName: string;
  location: string;
  stats: PropertyStats;
  offeringDate: string;
  heroImage?: string;
}

const PDFCoverPage: React.FC<PDFCoverPageProps> = ({
  presentedBy,
  confidential,
  investmentOpportunity,
  propertyName,
  location,
  stats,
  offeringDate,
  heroImage,
}) => {
  return (
    <section
      className="relative w-full print-avoid-break"
      style={{
        minHeight: "277mm",
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* Background with gradient — inline styles for print reliability */}
      <div
        className="absolute inset-0 rounded-none"
        style={
          {
            backgroundImage: heroImage
              ? `linear-gradient(135deg, rgba(13,53,130,0.92) 0%, rgba(30,90,180,0.88) 50%, rgba(13,53,130,0.94) 100%), url(${heroImage})`
              : `linear-gradient(135deg, #0D3582 0%, #1E5AB4 50%, #0D3582 100%)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          } as React.CSSProperties
        }
      />

      {/* Content overlay */}
      <div
        className="relative z-10 flex flex-col justify-between h-full px-8 py-10 md:px-12 md:py-14"
        style={{ minHeight: "277mm" }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start">
          <div
            className="text-white text-xs tracking-widest uppercase px-4 py-2 rounded"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            Presented by {presentedBy}
          </div>
          {confidential && (
            <div
              className="text-white text-xs tracking-wider uppercase px-4 py-2 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              Confidential
            </div>
          )}
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-white/80 text-xs uppercase tracking-[0.35em] mb-3">
            {investmentOpportunity}
          </p>
          <div
            className="w-20 h-[2px] mx-auto mb-6"
            style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
          />
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {propertyName}
          </h1>
          {location && (
            <p className="text-white/90 text-lg md:text-xl mb-8">{location}</p>
          )}

          {/* Stat cards — flex row, max 4 cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 w-full max-w-[600px]">
            {[
              { label: "Property Type", value: stats.propertyType },
              { label: "Units", value: stats.units },
              { label: "Year Built", value: stats.yearBuilt },
              { label: "Occupancy", value: `${stats.occupancy}%` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 min-w-[120px] max-w-[140px] rounded-md px-4 py-4 text-center"
                style={
                  {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(6px)",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  } as React.CSSProperties
                }
              >
                <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-white text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end text-white/70 text-xs">
          <span>{offeringDate}</span>
          <span>FOR QUALIFIED INVESTORS ONLY</span>
        </div>
      </div>
    </section>
  );
};

export default PDFCoverPage;
