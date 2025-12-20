"use client";

import React, { useState } from "react";
import { AreaOverviewProps, AreaOverviewData } from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";

//========== Area Overview Component ===========

const AreaOverview: React.FC<AreaOverviewProps> = ({
  data,
  isAiGenerated,
  onEdit,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<AreaOverviewData>(data);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Area Overview saved:", editedData);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(data);
  };

  const handleFieldChange = (field: keyof AreaOverviewData, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl text-gray-900">Area Overview</h3>
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
        <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed">
          <p>{editedData.description}</p>
          <p>{editedData.neighborhoodDescription}</p>
          <p>{editedData.localAmenities}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editedData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Neighborhood Description
            </label>
            <textarea
              value={editedData.neighborhoodDescription}
              onChange={(e) =>
                handleFieldChange("neighborhoodDescription", e.target.value)
              }
              className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Local Amenities
            </label>
            <textarea
              value={editedData.localAmenities}
              onChange={(e) =>
                handleFieldChange("localAmenities", e.target.value)
              }
              className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaOverview;
