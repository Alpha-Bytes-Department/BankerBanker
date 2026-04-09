"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PropertyOverviewProps } from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";
import SectionMarkdown from "./SectionMarkdown";

//========== Property Overview Component ===========

const PropertyOverview: React.FC<PropertyOverviewProps> = ({
  data,
  markdownContent,
  onEdit,
  onAiGenerate,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const fallbackContent = useMemo(
    () =>
      [
        "**Property Overview**",
        "",
        `- **Property Name:** ${data.propertyName || "N/A"}`,
        `- **Address:** ${data.address || "N/A"}`,
        `- **Zip Code:** ${data.zipCode || "N/A"}`,
        `- **Year Built:** ${data.yearBuilt || "N/A"}`,
        `- **Year Renovated:** ${data.yearRenovated || "N/A"}`,
        `- **Property Type:** ${data.propertyType || "N/A"}`,
        `- **Number of Units:** ${data.numberOfUnits || 0}`,
        `- **Rentable Area:** ${data.rentableArea?.toLocaleString() || 0} SF`,
        `- **Occupancy:** ${data.occupancy || 0}%`,
        `- **Parking Spaces:** ${data.parkingSpaces || 0}`,
      ].join("\n"),
    [data],
  );

  const [editedContent, setEditedContent] = useState(
    markdownContent?.trim() ? markdownContent : fallbackContent,
  );

  useEffect(() => {
    setEditedContent(
      markdownContent?.trim() ? markdownContent : fallbackContent,
    );
  }, [markdownContent, fallbackContent]);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedContent.trim() === "") {
      alert("Please enter property overview content before saving.");
      return;
    }

    if (onEdit) {
      await onEdit(editedContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(
      markdownContent?.trim() ? markdownContent : fallbackContent,
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* ====== Header Section ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h3 className="text-lg md:text-xl text-gray-900">Property Overview</h3>

        <div className="flex items-center gap-2">
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

      {/* ====== Property Details Grid ====== */}
      {!isEditing ? (
        <div className="bg-gray-100 p-4 rounded-lg text-sm md:text-base">
          <SectionMarkdown
            content={editedContent}
            className="text-gray-700 leading-relaxed"
          />
        </div>
      ) : (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full min-h-[220px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base resize-y"
          placeholder="Write property overview in markdown format..."
        />
      )}
    </div>
  );
};

export default PropertyOverview;
