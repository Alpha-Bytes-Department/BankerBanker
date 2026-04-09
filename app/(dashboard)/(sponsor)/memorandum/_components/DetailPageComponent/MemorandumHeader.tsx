"use client";

import React from "react";
import { MemorandumHeaderProps } from "@/types/memorandum-detail";
import { FaDownload } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const MemorandumHeader: React.FC<MemorandumHeaderProps> = ({
  memorandumId,
  title,
  subtitle,
  status,
  
  activeTab,
  onTabChange,
  canPublish = false,
  isPublishing = false,
  onPublish,
  onExport,
}) => {
  const router = useRouter();

  const statusClassName =
    status === "Published"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Generating"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : status === "Failed"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      {/* ====== Title and Subtitle ====== */}
      <div className="mb-4 flex items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-normal text-gray-900">
            {title}
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">{subtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusClassName}`}
            >
              Status: {status || "Draft"}
            </span>
           
          </div>
        </div>

        <div className="ml-0 mt-3 flex items-center gap-2 md:ml-4 md:mt-0">
          {activeTab === "preview" && canPublish && onPublish ? (
            <button
              onClick={onPublish}
              disabled={isPublishing}
              className="px-4 py-2 cursor-pointer flex items-center bg-emerald-600 text-white rounded-full duration-300 hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          ) : null}

          <button
            onClick={() => {
              if (onExport) {
                onExport();
                return;
              }

              if (!memorandumId) return;
              router.push(`/memorandum/${memorandumId}/download`);
            }}
            disabled={!memorandumId && !onExport}
            className={`px-4 py-2 cursor-pointer flex items-center bg-blue-400 text-white rounded-full duration-500 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === "editor" ? "hidden" : ""}`}
          >
            Export
            <FaDownload size={18} className="inline-block ml-2 text-white" />
          </button>
        </div>
      </div>

      {/* ====== Tab Navigation ====== */}
      <div className="relative inline-flex rounded-full bg-[#ECECF0] p-1 mb-5">
        <span
          className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary transition-all duration-300 ease-in-out ${activeTab === "editor" ? "left-1" : "left-1/2"}`}
        />
        <button
          onClick={() => onTabChange("editor")}
          className={`relative z-10 px-6 py-2 rounded-full transition-colors duration-300 ${activeTab === "editor" ? "text-white" : "text-gray-600"}`}
        >
          Editor
        </button>
        <button
          onClick={() => onTabChange("preview")}
          className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${activeTab === "preview" ? "text-white" : "text-gray-600"}`}
        >
          Preview
        </button>
      </div>
    
    </div>
  );
};

export default MemorandumHeader;
