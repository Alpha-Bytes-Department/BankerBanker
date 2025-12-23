"use client";

import React from "react";
import { PropertyMapData } from "@/types/loan-request";
import { FiMapPin } from "react-icons/fi";

//========== Property List Component ===========

interface PropertyListProps {
  properties: PropertyMapData[];
  selectedProperty: PropertyMapData | null;
  onPropertySelect: (property: PropertyMapData) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
}) => {
  //========== Format Currency ===========
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  //========== Marker Color Based on Urgency ===========
  const getMarkerColor = (urgency: PropertyMapData["urgencyLevel"]): string => {
    const colorMap = {
      high: "bg-red-500",
      medium: "bg-orange-500",
      standard: "bg-blue-500",
    };
    return colorMap[urgency];
  };

  //========== Property Type Colors ===========
  const getPropertyTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      Office: "bg-blue-100 text-blue-700",
      Multifamily: "bg-purple-100 text-purple-700",
      Retail: "bg-green-100 text-green-700",
      Industrial: "bg-orange-100 text-orange-700",
      "Mixed-Use": "bg-pink-100 text-pink-700",
    };
    return colorMap[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* ====== List Header ====== */}
      <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-200">
        <h3 className="text-sm md:text-base text-gray-900">
          All Properties ({properties.length})
        </h3>
      </div>

      {/* ====== Property Items ====== */}
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;

          return (
            <div
              key={property.id}
              onClick={() => onPropertySelect(property)}
              className={`px-3 md:px-4 py-2 md:py-3 cursor-pointer transition-colors hover:bg-gray-50 min-w-0 ${
                isSelected ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-2 md:gap-3 min-w-0">
                {/* ====== Urgency Indicator ====== */}
                <div className="flex items-center justify-center pt-1">
                  <div
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getMarkerColor(
                      property.urgencyLevel
                    )}`}
                  ></div>
                </div>

                {/* ====== Property Info ====== */}
                <div className="flex-1 min-w-0">
                  {/* ====== Property Name ====== */}
                  <h4 className="text-xs md:text-sm text-gray-900 mb-1 truncate">
                    {property.propertyName}
                  </h4>

                  {/* ====== Address ====== */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1 md:mb-2">
                    <FiMapPin className="w-2 h-2 md:w-3 md:h-3 shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>

                  {/* ====== Property Type Badge ====== */}
                  <div className="mb-1 md:mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 md:py-1 rounded ${getPropertyTypeColor(
                        property.propertyType
                      )}`}
                    >
                      {property.propertyType}
                    </span>
                  </div>

                  {/* ====== Details Grid ====== */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Amount:</span>{" "}
                      {formatCurrency(property.requestedAmount)}
                    </div>
                    <div>
                      <span className="font-medium">LTV:</span>{" "}
                      {property.targetLtv || property.ltv}%
                    </div>
                    <div>
                      <span className="font-medium">Term:</span>{" "}
                      {property.loanTerm}
                    </div>
                    <div>
                      <span className="font-medium">Occupancy:</span>{" "}
                      {property.occupancy}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyList;
