"use client";

import React from "react";
import { TableOfContentsItem } from "@/types/memorandum-detail";

/* ========================================
   TABLE OF CONTENTS — Print-Optimized
   ========================================
   Single A4 page. Max ~18 items fit comfortably.
======================================== */

interface PDFTableOfContentsProps {
  items: TableOfContentsItem[];
}

const PDFTableOfContents: React.FC<PDFTableOfContentsProps> = ({ items }) => {
  return (
    <section
      className="print-page-break print-avoid-break bg-white"
      style={{ minHeight: "277mm" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-1 w-12 rounded"
            style={{ backgroundColor: "#0D4DA5" }}
          />
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "#0D4DA5" }}
          >
            Contents
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Table of Contents</h2>
        <div
          className="h-1 w-20 rounded mt-2"
          style={{ backgroundColor: "#0D4DA5" }}
        />
      </div>

      {/* Items */}
      <div className="space-y-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center py-3 print-avoid-break"
            style={{ borderBottom: "1px solid #e5e7eb" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{
                backgroundColor: "#DBEAFE",
                color: "#0D4DA5",
              }}
            >
              {item.id}
            </div>
            <span className="ml-4 flex-1 text-sm text-gray-800 font-medium">
              {item.title}
            </span>
            <span className="text-sm text-gray-500 tabular-nums">
              {item.pageNumber}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PDFTableOfContents;
