"use client";

import React from "react";
import { PreviewSectionProps } from "@/types/memorandum-detail";

//========== Preview Section Wrapper Component ===========

const PreviewSection: React.FC<PreviewSectionProps> = ({
  sectionNumber,
  title,
  children,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-6">
      {/* ====== Section Header ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
          <span className="text-blue-600 text-xs uppercase tracking-wider">
            Section {sectionNumber}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl text-gray-900">{title}</h2>
        <div className="h-1 w-20 bg-blue-600 rounded mt-2"></div>
      </div>

      {/* ====== Section Content ====== */}
      <div className="text-gray-700 text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default PreviewSection;
