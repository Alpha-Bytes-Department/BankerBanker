"use client";

import React, { useState } from "react";
import { PropertyHighlightsProps } from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiEdit, FiCheck, FiX, FiPlus, FiTrash2 } from "react-icons/fi";

//========== Property Highlights Component ===========

const PropertyHighlights: React.FC<PropertyHighlightsProps> = ({
  highlights,
  isAiGenerated,
  onEdit,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedHighlights, setEditedHighlights] =
    useState<string[]>(highlights);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Validate: Check if any field is empty
    const hasEmptyFields = editedHighlights.some(
      (highlight) => highlight.trim() === ""
    );

    if (hasEmptyFields) {
      alert("Please fill in all highlights before saving.");
      return;
    }

    setIsEditing(false);
    console.log("Property Highlights saved:", editedHighlights);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedHighlights(highlights);
  };

  const handleAddField = () => {
    setEditedHighlights([...editedHighlights, ""]);
  };

  const handleRemoveField = (index: number) => {
    setEditedHighlights(editedHighlights.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, value: string) => {
    const updated = [...editedHighlights];
    updated[index] = value;
    setEditedHighlights(updated);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl text-gray-900">
            Property Highlights
          </h3>
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

      {/* ====== Content Section ====== */}
      {!isEditing ? (
        <div className="space-y-3">
          {editedHighlights.map((highlight, index) => (
            <div
              key={index}
              className="flex gap-3 text-sm md:text-base text-gray-700"
            >
              <span className="text-gray-900">•</span>
              <p className="flex-1">{highlight}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {editedHighlights.map((highlight, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-gray-900 mt-2">•</span>
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                required={true}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={`Highlight ${index + 1}`}
              />
              <button
                onClick={() => handleRemoveField(index)}
                className="text-red-500 hover:text-red-700 p-2"
                type="button"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddField}
            className="flex items-center gap-2 border-2 border-blue-300 rounded-full py-0.5 px-2 bg-blue-100 shadow-md text-blue-600 hover:text-blue-700 text-sm mt-2"
            type="button"
          >
            <FiPlus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyHighlights;
