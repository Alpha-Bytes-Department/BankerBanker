"use client";

import React, { useState } from "react";
import {
  MarketSummaryProps,
  MarketSummaryData,
  MarketIndicator,
} from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiEdit, FiCheck, FiX, FiPlus, FiTrash2 } from "react-icons/fi";

//========== Market Summary Component ===========

const MarketSummary: React.FC<MarketSummaryProps> = ({
  data,
  isAiGenerated,
  onEdit,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<MarketSummaryData>(data);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Validate: Check if description or any indicator field is empty
    const hasEmptyDescription = editedData.description.trim() === "";
    const hasEmptyIndicators = editedData.keyIndicators.some(
      (indicator) =>
        indicator.label.trim() === "" || indicator.value.trim() === ""
    );

    if (hasEmptyDescription || hasEmptyIndicators) {
      alert("Please fill in all fields before saving.");
      return;
    }

    setIsEditing(false);
    console.log("Market Summary saved:", editedData);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(data);
  };

  const handleDescriptionChange = (value: string) => {
    setEditedData({ ...editedData, description: value });
  };

  const handleAddIndicator = () => {
    setEditedData({
      ...editedData,
      keyIndicators: [...editedData.keyIndicators, { label: "", value: "" }],
    });
  };

  const handleRemoveIndicator = (index: number) => {
    setEditedData({
      ...editedData,
      keyIndicators: editedData.keyIndicators.filter((_, i) => i !== index),
    });
  };

  const handleIndicatorChange = (
    index: number,
    field: keyof MarketIndicator,
    value: string
  ) => {
    const updated = [...editedData.keyIndicators];
    updated[index] = { ...updated[index], [field]: value };
    setEditedData({ ...editedData, keyIndicators: updated });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl text-gray-900">Market Summary</h3>
          {/* ====== AI Generated Badge ====== */}
          {isAiGenerated && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              <PiSparkle className="w-3 h-3" />
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

      {/* ====== Description Section ====== */}
      {!isEditing ? (
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
          {editedData.description}
        </p>
      ) : (
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={editedData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
          />
        </div>
      )}

      {/* ====== Key Market Indicators ====== */}
      <div className="mt-4">
        <h4 className="text-base text-gray-900 mb-3">Key market indicators:</h4>
        {!isEditing ? (
          <div className="space-y-2">
            {editedData.keyIndicators.map((indicator, index) => (
              <div
                key={index}
                className="flex gap-2 text-sm md:text-base text-gray-700"
              >
                <span className="text-gray-900">•</span>
                <p className="flex-1">
                  <span>{indicator.label}:</span> {indicator.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {editedData.keyIndicators.map((indicator, index) => (
              <div key={index} className="flex gap-2 items-start">
                <span className="text-gray-900 mt-2">•</span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={indicator.label}
                    onChange={(e) =>
                      handleIndicatorChange(index, "label", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={indicator.value}
                    onChange={(e) =>
                      handleIndicatorChange(index, "value", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Value"
                  />
                </div>
                <button
                  onClick={() => handleRemoveIndicator(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                  type="button"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddIndicator}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              type="button"
            >
              <FiPlus className="w-4 h-4" />
              Add Indicator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketSummary;
