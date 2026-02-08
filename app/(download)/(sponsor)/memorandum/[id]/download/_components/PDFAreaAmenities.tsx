"use client";

import React from "react";
import PDFSection from "./PDFSection";
import { AreaAmenitiesData } from "@/types/memorandum-detail";

/* ========================================
   AREA AMENITIES — Print-Optimized
   ========================================
   Hero image + amenity cards in 2×2 flex grid on one page.
   Icons replaced with text labels for print reliability.
======================================== */

interface PDFAreaAmenitiesProps {
  data: AreaAmenitiesData;
}

const iconLabel: Record<string, string> = {
  golf: "⛳",
  school: "🎓",
  shopping: "🛒",
  hospital: "🏥",
};

const categoryColor: Record<string, { bg: string; text: string }> = {
  Recreation: { bg: "#F3E8FF", text: "#7C3AED" },
  Education: { bg: "#DBEAFE", text: "#1D4ED8" },
  Shopping: { bg: "#DCFCE7", text: "#16A34A" },
  Healthcare: { bg: "#FEE2E2", text: "#DC2626" },
};

const PDFAreaAmenities: React.FC<PDFAreaAmenitiesProps> = ({ data }) => {
  return (
    <PDFSection sectionNumber={10} title="Area Amenities">
      <p className="text-[10px] text-gray-500 mb-3">
        Nearby points of interest and community amenities
      </p>

      {/* Hero image */}
      <div
        className="w-full rounded-md mb-5 print-avoid-break"
        style={
          {
            height: "160px",
            backgroundImage: `url(${data.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          } as React.CSSProperties
        }
      />

      {/* Amenity cards — 2-col flex grid */}
      <div className="flex flex-wrap gap-3">
        {data.amenities.map((a) => {
          const colors = categoryColor[a.category] || {
            bg: "#F3F4F6",
            text: "#374151",
          };
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-md px-3 py-3 print-avoid-break"
              style={{
                flex: "1 1 calc(50% - 6px)",
                minWidth: "200px",
                backgroundColor: "#F9FAFB",
              }}
            >
              <span className="text-xl shrink-0">
                {iconLabel[a.icon] || "📍"}
              </span>
              <div>
                <p className="text-[11px] font-semibold text-gray-900">
                  {a.name}
                </p>
                <span
                  className="inline-block text-[8px] px-2 py-[2px] rounded mt-1"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {a.category}
                </span>
                <div className="flex gap-3 mt-1 text-[9px] text-gray-500">
                  <span>📍 {a.distance}</span>
                  {a.rating && <span>⭐ {a.rating}/10</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PDFSection>
  );
};

export default PDFAreaAmenities;
