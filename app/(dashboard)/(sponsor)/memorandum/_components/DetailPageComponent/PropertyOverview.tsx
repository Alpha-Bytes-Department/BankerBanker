"use client";

import React, { useState } from "react";
import {
  PropertyOverviewProps,
  PropertyOverviewData,
} from "@/types/memorandum-detail";
import { PiSparkle } from "react-icons/pi";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";

//========== Property Overview Component ===========

const PropertyOverview: React.FC<PropertyOverviewProps> = ({
  data,
  onEdit,
  onAiGenerate,
}) => {
  //========== State ===========
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<PropertyOverviewData>(data);

  //========== Handlers ===========
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Property Overview saved:", editedData);
    if (onEdit) onEdit();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(data);
  };

  const handleFieldChange = (
    field: keyof PropertyOverviewData,
    value: string | number | undefined
  ) => {
    setEditedData({ ...editedData, [field]: value });
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
              {onAiGenerate && (
                <button
                  onClick={onAiGenerate}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm px-3 py-1.5 rounded-full border ml-0 md:ml-4 border-blue-200"
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

      {/* ====== Property Details Grid ====== */}
      {!isEditing ? (
        <div className="space-y-3 bg-gray-100 p-4 rounded-lg text-sm md:text-base">
          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Property Name:</span>
            <span className="text-gray-700">{editedData.propertyName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Address:</span>
            <span className="text-gray-700">
              {editedData.address}, {editedData.zipCode}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Year Built/Renovated:</span>
            <span className="text-gray-700">
              {editedData.yearBuilt}
              {editedData.yearRenovated && `/${editedData.yearRenovated}`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Property Type:</span>
            <span className="text-gray-700">{editedData.propertyType}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Number of Units:</span>
            <span className="text-gray-700">{editedData.numberOfUnits}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Rentable Area:</span>
            <span className="text-gray-700">
              {editedData.rentableArea.toLocaleString()} SF
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Occupancy:</span>
            <span className="text-gray-700">{editedData.occupancy}%</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-gray-900">Parking Spaces:</span>
            <span className="text-gray-700">{editedData.parkingSpaces}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Property Name
              </label>
              <input
                type="text"
                value={editedData.propertyName}
                onChange={(e) =>
                  handleFieldChange("propertyName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Property Type
              </label>
              <input
                type="text"
                value={editedData.propertyType}
                onChange={(e) =>
                  handleFieldChange("propertyType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={editedData.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                value={editedData.zipCode}
                onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Year Built
              </label>
              <input
                type="number"
                value={editedData.yearBuilt}
                onChange={(e) =>
                  handleFieldChange("yearBuilt", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Year Renovated
              </label>
              <input
                type="number"
                value={editedData.yearRenovated || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "yearRenovated",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Number of Units
              </label>
              <input
                type="number"
                value={editedData.numberOfUnits}
                onChange={(e) =>
                  handleFieldChange("numberOfUnits", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Rentable Area (SF)
              </label>
              <input
                type="number"
                value={editedData.rentableArea}
                onChange={(e) =>
                  handleFieldChange("rentableArea", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Occupancy (%)
              </label>
              <input
                type="number"
                value={editedData.occupancy}
                onChange={(e) =>
                  handleFieldChange("occupancy", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Parking Spaces
              </label>
              <input
                type="number"
                value={editedData.parkingSpaces}
                onChange={(e) =>
                  handleFieldChange("parkingSpaces", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyOverview;
