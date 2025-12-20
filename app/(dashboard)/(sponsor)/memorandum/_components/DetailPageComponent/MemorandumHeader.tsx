"use client";

import React from "react";
import { MemorandumHeaderProps } from "@/types/memorandum-detail";

//========== Memorandum Header Component ===========

const MemorandumHeader: React.FC<MemorandumHeaderProps> = ({
  title,
  subtitle,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-4 flex justify-between">
      {/* ====== Title and Subtitle ====== */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-normal text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">{subtitle}</p>
      </div>

      {/* ====== Tab Navigation ====== */}
      <div className="inline-flex  rounded-full bg-gray-200 px-1 py-1 self-start">
        <button
          onClick={() => onTabChange("editor")}
          className={`px-2 md:px-6 py-1 rounded-full transition-all ${
            activeTab === "editor"
              ? "bg-blue-800 text-white shadow-sm"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => onTabChange("preview")}
          className={`px-2 md:px-6 py-1 rounded-full transition-all ${
            activeTab === "preview"
              ? "bg-blue-800 text-white shadow-sm"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default MemorandumHeader;
