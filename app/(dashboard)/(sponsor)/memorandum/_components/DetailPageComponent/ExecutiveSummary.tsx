"use client";

import React, { useState } from "react";
import { ExecutiveSummaryProps } from "@/types/memorandum-detail";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import { PiSparkle } from "react-icons/pi";

//========== Executive Summary Component ===========

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  content,
  isAiGenerated,
  onEdit,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Executive Summary saved:", editedContent);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl text-gray-900">
            Executive Summary
          </h3>
          {/* ====== AI Generated Badge ====== */}
          {isAiGenerated && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              <PiSparkle className="w-3 h-3 font-bold" />
              AI Generated
            </span>
          )}
        </div>

        {/* ====== Action Buttons ====== */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <FiEdit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
              >
                <FiCheck className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* ====== Content Section ====== */}
      {!isEditing ? (
        <div className="text-gray-700 text-sm md:text-base leading-relaxed">
          {editedContent}
        </div>
      ) : (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base resize-y"
          placeholder="Enter executive summary..."
        />
      )}
    </div>
  );
};

export default ExecutiveSummary;
