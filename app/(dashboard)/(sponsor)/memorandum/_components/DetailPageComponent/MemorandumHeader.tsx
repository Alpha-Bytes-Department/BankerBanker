"use client";

import React from "react";
import { MemorandumHeaderProps } from "@/types/memorandum-detail";
import { FaDownload } from "react-icons/fa6";
import { useRouter } from "next/navigation";


const MemorandumHeader: React.FC<MemorandumHeaderProps> = ({
  title,
  subtitle,
  activeTab,
  onTabChange,
}) => {
  const router=useRouter()
  return (
    <div className="mb-4 flex justify-between">
      {/* ====== Title and Subtitle ====== */}
      <div className={`mb-4 flex items-start`}>
        <div>
          <h1 className="text-xl md:text-2xl font-normal text-gray-900">
            {title}
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">{subtitle}</p>
          
        </div>
        <button onClick={()=>{
          router.push(`/memorandum/${title}/download`)
        }} className={`ml-4 px-4 py-2 cursor-pointer flex items-center bg-blue-400 text-white rounded-full duration-500 hover:bg-blue-700 transition ${activeTab === "editor" ? "hidden" : ""}`}>
          Export
          <FaDownload size={18} className="inline-block ml-2 text-white" />
        </button>
      </div>

      {/* ====== Tab Navigation ====== */}
      <div className="relative inline-flex rounded-full bg-[#ECECF0] p-1 mb-5">
        <span className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary transition-all duration-300 ease-in-out ${activeTab === "editor" ? "left-1" : "left-1/2"}`} />
        <button
          onClick={() => onTabChange("editor")}
          className={`relative z-10 px-6 py-2 rounded-full transition-colors duration-300 ${activeTab === "editor" ? "text-white" : "text-gray-600"}`}>
          Editor
        </button>
        <button
          onClick={() => onTabChange("preview")} className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${activeTab === "preview" ? "text-white" : "text-gray-600"}`}>
          Preview
        </button>
      </div>
      {/* <div className="inline-flex  rounded-full bg-gray-200 px-1 py-1 self-start">
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
      </div> */}
    </div>
  );
};

export default MemorandumHeader;
