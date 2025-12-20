"use client";

import React from "react";
import { TableOfContentsProps } from "@/types/memorandum-detail";

//========== Table of Contents Component ===========

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 mb-6">
      {/* ====== Header Section ====== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
          <span className="text-blue-600 text-xs uppercase tracking-wider">
            Contents
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl text-gray-900">
          Table of Contents
        </h2>
      </div>

      {/* ====== Contents List ====== */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors cursor-pointer ${
              index !== items.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            {/* ====== Item Number and Title ====== */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-blue-100 text-blue-600 rounded-full text-sm md:text-base flex-shrink-0">
                {item.id}
              </div>
              <span className="text-gray-900 text-sm md:text-base">
                {item.title}
              </span>
            </div>

            {/* ====== Page Number ====== */}
            <span className="text-gray-500 text-sm md:text-base">
              {item.pageNumber}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContents;
