"use client";

import React, { useState } from "react";
import { FinancingSummaryProps } from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";

//========== Financing Summary Component ===========

const FinancingSummary: React.FC<FinancingSummaryProps> = ({
  content,
  onEdit,
  onAiGenerate,
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
    console.log("Financing Summary saved:", editedContent);
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
        <h3 className="text-lg md:text-xl text-gray-900">Financing Summary</h3>

        <div className="flex items-center gap-5">
          {/* ====== Action Buttons ====== */}
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <FiEdit className="w-4 h-4" />
                Edit
              </button>
              {onAiGenerate && (
                <button
                  onClick={onAiGenerate}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm px-3 py-1.5 rounded-full border border-blue-200"
                >
                  <PiSparkle className="w-4 h-4" />
                  AI Generate
                </button>
              )}
            </>
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
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          {editedContent}
        </p>
      ) : (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
          placeholder="Enter financing summary..."
        />
      )}
    </div>
  );
};

export default FinancingSummary;
